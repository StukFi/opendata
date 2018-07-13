import datetime
import json
import os

def generate_time_series(source_dir, target_dir):
    """
    Extract station specific time series data from GeoJSON files.

    :param source_dir: directory from which to read GeoJSON files
    :param target_dir: directory to which the time series files are generated
    """
    files = os.listdir(source_dir)
    files.sort()

    measurements = []
    for json_file in files:
        results = json.loads(open(source_dir + "/" + json_file).read())
        features = results["features"]
        file_timestamp = datetime.datetime.strptime(json_file.split(".")[0], "%Y-%m-%dT%H%M%S")

        for feature in features:
            start = int((file_timestamp - datetime.timedelta(seconds=600)).timestamp()) * 1000
            end = int(file_timestamp.timestamp()) * 1000
            measurements.append({
                "s": start,
                "e": end,
                "timestamp": file_timestamp,
                "station": feature["properties"]["id"],
                "r": feature["properties"]["doseRate"]
            })

    # Reformat measurements to match JSON structure.
    result = {}
    for measurement in measurements:
        if not measurement["station"] in result.keys():
            result[measurement["station"]] = {}

        date_string = measurement["timestamp"].strftime( "%Y-%m-%d" )
        if not date_string in result[measurement["station"]].keys():
            result[measurement["station"]][date_string] = []

        result[measurement["station"]][date_string].append({
            "s": measurement["s"],
            "e": measurement["e"],
            "r": measurement["r"]
        })

    for station in result.keys():
        os.makedirs(target_dir + station)
        for date in result[station].keys():
            data = {"data": result[station][date] }
            f = open(target_dir + station + "/" + date + ".json", "w")
            f.write(json.dumps(data, separators=(",", ":")))
            f.close()

if __name__=="__main__":
    generate_time_series("../data/dose_rates/datasets/", "../data/dose_rates/time_series/")
