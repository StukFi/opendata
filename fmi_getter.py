import json
from xml.etree import ElementTree
gml_namespace = "http://www.opengis.net/gml/3.2"
gmlcov_namespace ="http://www.opengis.net/gmlcov/1.0"
from datetime import datetime
from datetime import timedelta
import time
from requests.exceptions import ReadTimeout
try: # python3
    from urllib.request import urlopen
except ImportError: # python2
    from urllib import urlopen

# read settings in
settings = json.load(open('settings.json'))
fmi_api_key = settings["settings"]["fmi_api_key"]

request_templates = {
    "dose_rate": ("http://data.stuk.fi/fmi-apikey/{}/wfs/eng?"
    "request=GetFeature&storedquery_id=stuk::observations::"
    "external-radiation::multipointcoverage&starttime={}&endtime={}&"),
    "samplers": ("http://data.stuk.fi/fmi-apikey/{}/wfs/eng?"
                 "request=GetFeature&storedquery_id=stuk::observations"
                 "::air::radionuclide-activity-concentration::"
                 "multipointcoverage&starttime={}&endtime={}&")
}

geojson_template = {
    "type": "FeatureCollection",
    "name": "stuk_open_data_dose_rates",
    "crs": { "type": "name", "properties":
            { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": []
}

# TODO: add latest results request
# WFS request from FMI
def wfs_request(start_time,end_time,results_type="dose_rate"):
    """
    WFS request to FMI Open Data Portal
    :start_time datetime object
    :end_time datetime object
    :results_type 'dose_rates' or 'samplers'
    """
    if (end_time-start_time).total_seconds()>559:
        if results_type=="dose_rate":
            raise Exception ( "Max timespan is 559. Generate multiple requests"
                              "to avoid this")
    t1 = end_time.strftime( "%Y-%m-%dT%H:%M:00Z" )
    t0 = start_time.strftime( "%Y-%m-%dT%H:%M:00Z" )
    url = request_templates[results_type].format(fmi_api_key,t0,t1)
    response = urlopen( url )
    return response

def write_geojson(response,directory=".",geojson_file="auto"):
    """
    Write GeoJSON files of dose rate measurements.
    """
    wfs_response = ElementTree.fromstring(response.read())
    gml_points = wfs_response.findall('.//{%s}Point' % gml_namespace)
    # read location names
    locations = {}
    geojson_str = geojson_template
    for n, point in enumerate(gml_points):
        point_id = point.attrib['{%s}id' % gml_namespace].split("-")[-1]
        name = point.findall('{%s}name' % gml_namespace)[0].text
        pos = point.findall('{%s}pos' % gml_namespace)[0].text
        longitude = float(pos.split()[1])
        latitude = float(pos.split()[0])
        locations[pos.strip()] = {"site": name,
                                  "longitude": longitude,
                                  "latitude": latitude,
                                  "id": point_id
                                  }
    # store values
    values = []
    try:
        values_lines = wfs_response.findall('.//{%s}doubleOrNilReasonTupleList'\
                                            % gml_namespace)[0].text.split("\n")[1:-1]
    except IndexError:
        raise Exception ( "No features" )
    for line in values_lines:
        l = line.strip()
        l = l.split()
        values.append( float(l[0]) )
    # iterate over the measurements
    N = 0
    for line in wfs_response.findall('.//{%s}positions'\
                                     % gmlcov_namespace)[0].text.split("\n")[1:-1]:
        l = line.strip()
        l = l.split()
        coords = line.split("  ")[-2]
        timestamp = datetime.utcfromtimestamp(int(l[-1]))
        feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {"type": "Point"}
        }
        feature["properties"] = {
            "doseRate": values[N],
            "id": locations[coords]["id"],
            "site": locations[coords]["site"],
            "timestamp": datetime.strftime(timestamp,
                                           "%Y-%m-%dT%H:%M:%SZ")
        }
        feature["geometry"]["coordinates"] = [
            locations[coords]["longitude"],
            locations[coords]["latitude"]
        ]
        geojson_str["features"].append(feature)
        N += 1
    if geojson_file=="auto":
        outfile = directory + "/" + datetime.strftime(
            timestamp,"%Y-%m-%dT%H%M%S") + ".json"
    else:
        outfile = result_dir + "/stuk_open_data_doserates.json"
    # write output
    with open(outfile, 'w') as fp:
        json.dump(geojson_str,
                  fp,
                  ensure_ascii=False,
                  indent=4,
                  sort_keys=True)
    return outfile

if __name__=="__main__":
    # TODO: read from command line
    end_time = datetime.utcnow() - timedelta (seconds=1800)
    start_time = end_time - timedelta(seconds=559)
    result_dir = "results"
    tries = 3
    while tries!=0:
        try:
            wfs_response = wfs_request( start_time, end_time )
            tries = 0
        except ReadTimeout:
            tries +- 1
            time.sleep ( 10 )
    geojson = write_geojson ( wfs_response, result_dir )
