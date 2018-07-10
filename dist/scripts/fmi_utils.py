import json
from urllib.request import urlopen

settings = json.load(open('../../settings.json'))
fmi_api_key = settings["settings"]["fmi_api_key"]

gml_namespace = "http://www.opengis.net/gml/3.2"
gmlcov_namespace ="http://www.opengis.net/gmlcov/1.0"
swe_ns = "http://www.opengis.net/swe/2.0"
wfs_ns = "http://www.opengis.net/wfs/2.0"

request_templates = {
        "authenticated": {
            "dose_rate": ("http://data.stuk.fi/fmi-apikey/{}/wfs/eng?"
            "request=GetFeature&storedquery_id=stuk::observations::"
            "external-radiation::multipointcoverage&starttime={}&endtime={}&"),
            "samplers": ("http://data.stuk.fi/fmi-apikey/{}/wfs/eng?"
                         "request=GetFeature&storedquery_id=stuk::observations"
                         "::air::radionuclide-activity-concentration::"
                         "multipointcoverage&starttime={}&endtime={}&")
        },
        "unauthenticated": {
            "dose_rate": ("http://opendata.fmi.fi/wfs/eng?"
            "request=GetFeature&storedquery_id=stuk::observations::"
            "external-radiation::multipointcoverage&starttime={}&endtime={}&"),
            "samplers": ("http://opendata.fmi.fi/wfs/eng?"
                         "request=GetFeature&storedquery_id=stuk::observations"
                         "::air::radionuclide-activity-concentration::"
                         "multipointcoverage&starttime={}&endtime={}&")
        }
}

geojson_template = {
    "type": "FeatureCollection",
    "name": "stuk_open_data_dose_rates",
    "crs": { "type": "name", "properties":
            { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": []
}

def wfs_request(start_time, end_time, results_type="dose_rate", authenticated=True):
    """
    Performs a WFS request to FMI Open Data Portal.

    :param start_time: datetime object
    :param end_time: datetime object
    :param results_type: 'dose_rates' or 'samplers'
    :param authenticated: indicates whether an API key is used
    :return: HTTPResponse object
    """
    if (end_time - start_time).total_seconds() > 559:
        if results_type == "dose_rate":
            raise Exception("Max timespan is 559. Generate multiple requests to avoid this.")

    timeFormat = "%Y-%m-%dT%H:%M:00Z"
    t0 = start_time.strftime(timeFormat)
    t1 = end_time.strftime(timeFormat)

    if authenticated:
        url = request_templates["authenticated"][results_type].format(fmi_api_key, t0, t1)
    else:
        url = request_templates["unauthenticated"][results_type].format(t0, t1)

    response = urlopen(url)
    return response
