from urllib.error import URLError
from urllib.request import urlopen
import socket
import time

import settings

gml_namespace = "http://www.opengis.net/gml/3.2"
gmlcov_namespace ="http://www.opengis.net/gmlcov/1.0"
swe_ns = "http://www.opengis.net/swe/2.0"
wfs_ns = "http://www.opengis.net/wfs/2.0"

fmi_request_datetime_format = "YYYY-MM-DDThh:mm:ss"

request_templates = {
    "dose_rates": ("https://opendata.fmi.fi/wfs/eng?"
                    "request=GetFeature&storedquery_id=stuk::observations::"
                    "external-radiation::multipointcoverage&starttime={}&endtime={}"),
    "air_radionuclides": ("https://opendata.fmi.fi/wfs?&request=getFeature&storedquery_id=stuk::observations::"
                          "air::radionuclide-activity-concentration::multipointcoverage&starttime={}&endtime={}")
}

geojson_template_dose_rates = {
    "type": "FeatureCollection",
    "name": "stuk_open_data_dose_rates",
    "crs": { "type": "name", "properties":
            { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": []
}
geojson_template_air_radionuclides = {
    "type": "FeatureCollection",
    "name": "stuk_open_data_air_radionuclides",
    "crs": { "type": "name", "properties":
            { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": []
}

def wfs_request(start_time, end_time, results_type):
    """
    Performs a WFS request to the FMI open data API.

    :param start_time: start of the timespan for which to get data
    :param end_time: end of the timespan for which to get data
    :param results_type: type of data to get
    :return: dataset as a string
    """
    timeFormat = "%Y-%m-%dT%H:%M:00Z"
    t0 = start_time.strftime(timeFormat)
    t1 = end_time.strftime(timeFormat)
    url = request_templates[results_type].format(t0, t1)
    response = None

    try:
        with urlopen(url, timeout=3) as connection:
            response = connection.read()
    except (URLError, ConnectionError, socket.timeout):
        pass

    return response
