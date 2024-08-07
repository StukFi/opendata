from urllib.error import URLError
from urllib.request import urlopen
import socket
import xml.etree.ElementTree as ET

gml_namespace = "http://www.opengis.net/gml/3.2"
gmlcov_namespace = "http://www.opengis.net/gmlcov/1.0"
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

def fetch_data(url):
    try:
        with urlopen(url, timeout=3) as connection:
            return connection.read()
    except (URLError, ConnectionError, socket.timeout) as e:
        print(f"Error fetching data: {e}")
        return None

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
    base_url = request_templates[results_type].format(t0, t1)
    
    if results_type == "air_radionuclides":
        general_url = base_url
        vantaa_url = base_url + "&place=Vantaa" # Make a separate request with vantaa parameter, as vantaa data is not returned from the normal request.

        general_response = fetch_data(general_url)
        vantaa_response = fetch_data(vantaa_url)

        if general_response and vantaa_response:
            merged_response = merge_responses(general_response, vantaa_response)
            return merged_response
        return general_response

    else:  # For dose_rates, only make the general request
        general_response = fetch_data(base_url)
        print(base_url)
        return general_response

def merge_responses(general_response, vantaa_response):
    # Merge the general response with the Vantaa response
    general_root = ET.fromstring(general_response)
    vantaa_root = ET.fromstring(vantaa_response)
    
    vantaa_features = vantaa_root.findall(".//{%s}member" % wfs_ns)
    
    for vantaa_feature in vantaa_features:
        general_root.append(vantaa_feature)
    return ET.tostring(general_root)