import json
from owslib.wfs import WebFeatureService
from osgeo import ogr
from xml.etree import ElementTree
gml_namespace = "http://www.opengis.net/gml/3.2"
gmlcov_namespace ="http://www.opengis.net/gmlcov/1.0"

from datetime import datetime
from datetime import timedelta

# read settings in
settings = json.load(open('settings.json'))
fmi_api_key = settings["settings"]["fmi_api_key"]

doserates_template = "http://data.stuk.fi/fmi-apikey/{}/wfs/eng?request=GetFeature&storedquery_id=stuk::observations::external-radiation::multipointcoverage&starttime={}&endtime={}&"
# WFS reques from FMI

def wfs_request(start_time,end_time):
    if (end_time-start_time).total_seconds()>559:
        raise Exception ( "Max timespan is 559. Generate multiple requests to avoid this")
    t1 = end_time.strftime( "%Y-%m-%dT%H:%M:00Z" )
    t0 = start_time.strftime( "%Y-%m-%dT%H:%M:00Z" )
    doserates = doserates_template.format(fmi_api_key,t0,t1)
    wfs20 = WebFeatureService(url='http://data.stuk.fi/fmi-apikey/{}/wfs/eng'\
                              .format(fmi_api_key), version='2.0.0')
    response = wfs20.getfeature(storedQueryID="stuk::observations::external-radiation::multipointcoverage",
                                storedQueryParams={'starttime':'2018-03-22T11:55:00Z',
                                                   'endtime':'2018-03-22T12:05:00Z',
                                                   'crs': "EPSG:4326"
                                                   })
    # return also nearest 10 minute timestamp
    t = end_time
    m = int(str(t.minute)[0]) * 10
    timestamp = datetime(t.year,t.month,t.day,t.hour,m,0)
    return response,timestamp

def write_geojson(response,timestamp):
    wfs_response = ElementTree.fromstring(response.read())
    gml_points = wfs_response.findall('.//{%s}Point' % gml_namespace)
    # read location names 
    locations = {}
    for n, point in enumerate(gml_points):
        name = point.findall('{%s}name' % gml_namespace)[0].text
        pos = point.findall('{%s}pos' % gml_namespace)[0].text
        locations[pos.strip()] = {"site": name,
                                  "geometry":ogr.CreateGeometryFromGML( 
                                    ElementTree.tostring(point) )
                                  }
    # store values 
    values = []
    for line in wfs_response.findall('.//{%s}doubleOrNilReasonTupleList'\
                                     % gml_namespace)[0].text.split("\n")[1:-1]:
        l = line.strip()
        l = l.split()
        values.append( float(l[0]) )
    # iterate over the measurements
    for line in wfs_response.findall('.//{%s}positions'\
                                     % gmlcov_namespace)[0].text.split("\n")[1:-1]:
        l = line.strip()
        l = l.split()
        coords = line.split("  ")[-2]
        site = locations[coords]["site"]
        timestamp = datetime.fromtimestamp(int(l[-1]))
    # TODO: write geojson file using GDAL
    return geojson_string

if __name__=="__main__":
    # TODO: read from command line
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(seconds=559)
    wfs_response, timestamp = wfs_request( start_time, end_time )
    print timestamp
    geojson = write_geojson ( wfs_response, timestamp )

