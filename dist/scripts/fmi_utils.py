import json
import socket
import time
from requests.exceptions import RequestException
from urllib.error import HTTPError
from urllib.request import urlopen

settings = json.load(open('../server-settings.json'))
fmi_api_key = settings["settings"]["fmi_api_key"]

gml_namespace = "http://www.opengis.net/gml/3.2"
gmlcov_namespace ="http://www.opengis.net/gmlcov/1.0"
swe_ns = "http://www.opengis.net/swe/2.0"
wfs_ns = "http://www.opengis.net/wfs/2.0"

fmi_request_datetime_format = "YYYY-MM-DDThh:mm:ss"

request_templates = {
        "base": {
            "authenticated": "http://data.stuk.fi/fmi-apikey/{}/wfs/eng?",
            "unauthenticated": "http://opendata.fmi.fi/wfs/eng?"
        },
        "dose_rates": ("request=GetFeature&storedquery_id=stuk::observations::"
                     "external-radiation::multipointcoverage&starttime={}&endtime={}"),
        "samplers": ("request=GetFeature&storedquery_id=stuk::observations"
                     "::air::radionuclide-activity-concentration::"
                     "multipointcoverage&starttime={}&endtime={}")
}

geojson_template = {
    "type": "FeatureCollection",
    "name": "stuk_open_data_dose_rates",
    "crs": { "type": "name", "properties":
            { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": []
}

def wfs_request(start_time, end_time, results_type, authenticated=False):
    """
    Performs a WFS request to the FMI open data API.

    :param start_time: start of the timespan for which to get data
    :param end_time: end of the timespan for which to get data
    :param results_type: type of data to get
    :param authenticated: indicates whether an API key is used
    :return: HTTPResponse object
    """
    timeFormat = "%Y-%m-%dT%H:%M:00Z"
    t0 = start_time.strftime(timeFormat)
    t1 = end_time.strftime(timeFormat)

    if authenticated:
        url = request_templates["base"]["authenticated"] + request_templates[results_type]
        url = url.format(fmi_api_key, t0, t1)

    else:
        url = request_templates["base"]["unauthenticated"] + request_templates[results_type]
        url = url.format(t0, t1)

    response = None
    tries = 3
    while tries > 0:
        try:
            response = urlopen(url, timeout=5)
            tries = 0
        except (RequestException, HTTPError, ConnectionError, socket.timeout):
            tries -= 1
            time.sleep(5)

    return response