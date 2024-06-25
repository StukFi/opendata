import json
from urllib.error import URLError
from urllib.parse import urlencode
from urllib.request import urlopen
import socket
from datetime import datetime
import logging

fmi_request_datetime_format = "YYYY-MM-DDThh:mm:ss"

# Request URLs
request = {
    "dose_rates": "https://opendata.fmi.fi/edr/collections/external_radiation/area?",
}

# GeoJSON template
geojson_template = {
    "type": "FeatureCollection",
    "name": "stuk_open_data_dose_rates",
    "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
    "features": []
}

def edr_request(start_time, end_time, results_type):
    """
    Performs an EDR request to the FMI open data API.

    :param start_time: start of the timespan for which to get data
    :param end_time: end of the timespan for which to get data
    :param results_type: type of data to get
    :return: dataset as a dictionary
    """
    time_format = "%Y-%m-%dT%H:%M:00Z"
    t0 = start_time.strftime(time_format)
    t1 = end_time.strftime(time_format)
    
    params = {
        'coords': 'POLYGON((16.578 70.564,17.017 58.191,33.852 58.720,32.621 70.535,16.578 70.564))',
        'datetime': f'{t0}/{t1}',
        'parameter-name': 'dr_pt10m_avg',
        'crs': 'CRS:84',
        'f': 'GeoJSON'
    }
    
    url = request[results_type] + urlencode(params)
    
    response = None
    try:
        with urlopen(url, timeout=10) as connection:
            response = connection.read().decode('utf-8')
            response = json.loads(response)
            logging.info(response)
    except (URLError, ConnectionError, socket.timeout) as e:
        print(f"Error occurred: {e}")
        response = None

    return response
