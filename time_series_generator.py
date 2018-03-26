# -*- coding: UTF-8 -*-
import datetime
import json
import os

def output_results(directory):
    "extract station specific data from geojsons"
    files = os.listdir(directory)
    files.sort()
    meas = []
    for json_file in files:
        if not ".json" in json_file:
            continue
        # read json data to dict
        results = json.loads( open( directory + "/" + json_file).read() )
        features = results["features"]
        # parse time
        timestamp = datetime.datetime.strptime(
            json_file.split(".")[0],
            "%Y-%m-%dT%H:%M:%S" )
        for f in features:
            # do not write old results
            feature_timestamp = datetime.datetime.strptime(f["properties"]["timestamp"],
                                                           "%Y-%m-%dT%H:%M:%SZ")
            if feature_timestamp!=timestamp:
                continue
            s = int( (timestamp-datetime.timedelta(seconds=600)).strftime("%s")) * 1000 
            e = int( timestamp.strftime("%s") ) * 1000 
            meas.append( {"s": s, 
                          "e": e, 
                          "timestamp": timestamp,
                          "station": f["properties"]["id"], 
                           "r": f["properties"]["doseRate"] })
    # reformat measurements to match json structure
    dr = {}
    for m in meas:
        if not m["station"] in dr.keys():
            dr[m["station"]] = {}
        day_str = m["timestamp"].strftime( "%Y-%m-%d" )
        if not day_str in dr[m["station"]].keys():
            dr[m["station"]][day_str] = []
        dr[m["station"]][day_str].append( { "s": m["s"], "e": m["e"], "r": m["r"] } )

    for station in dr.keys():
        os.makedirs( directory +  "/stations/" + station )
        for day in dr[station].keys():
            data = {"data": dr[station][day] }
            f = open( directory + "/stations/" + station + "/" + day + ".json", "w" )
            f.write ( json.dumps (data ) )
            f.close()

if __name__=="__main__":
    results = output_results("results")
