import sys
from copy import deepcopy
from datetime import datetime, timedelta
from fmi_utils import *
from xml.etree import ElementTree

def get_dose_rate_data(args):
    """
    Performs a WFS request for dose rate data from the FMI open data API.
    If no timespan is provided when running the program, the function
    fetches the dataset of the most recent measurements.

    :param args: program arguments
    :return: HTTPResponse object
    """
    dose_rate_data = []

    if args.timespan:
        start_time, end_time = validate_timespan(args.timespan)
        time_between_measurements = timedelta(seconds=599)
        t1 = start_time
        t2 = t1 + time_between_measurements
        while t2 <= end_time:
            dose_rate_data.append(wfs_request(t1, t2, "dose_rates", args.auth))
            t1 = t2
            t2 += time_between_measurements

    else:
        end_time = datetime.utcnow() - timedelta(seconds=1800)
        start_time = end_time - timedelta(seconds=559)
        dose_rate_data.append(wfs_request(start_time, end_time, "dose_rates", args.auth))

    return dose_rate_data

def parse_dose_rate_data(data):
    """
    Parses the argument dose rate data into a GeoJSON string.

    :param data: raw dose rate data from the FMI open data API.
    :return: GeoJSON string of dose rate data
    """
    wfs_response = ElementTree.fromstring(data.read())
    gml_points = wfs_response.findall('.//{%s}Point' % gml_namespace)
    geojson_string = deepcopy(geojson_template)

    # Read locations.
    locations = {}
    for n, point in enumerate(gml_points):
        identifier = point.attrib['{%s}id' % gml_namespace].split("-")[-1]
        name = point.findall('{%s}name' % gml_namespace)[0].text
        position = point.findall('{%s}pos' % gml_namespace)[0].text.strip()
        longitude = float(position.split()[1])
        latitude = float(position.split()[0])
        locations[position] = {
            "site": name,
            "longitude": longitude,
            "latitude": latitude,
            "id": identifier
        }

    # Read values.
    values = []
    try:
        value_lines = wfs_response.findall('.//{%s}doubleOrNilReasonTupleList' \
                                            % gml_namespace)[0].text.split("\n")[1:-1]
    except IndexError:
        raise Exception("No features.")

    for line in value_lines:
        value = float(line.strip().split()[0])
        values.append(value)

    # Construct features.
    position_lines =  wfs_response.findall('.//{%s}positions' \
                                            % gmlcov_namespace)[0].text.split("\n")[1:-1]
    for i, line in enumerate(position_lines):
        line = line.split()
        coords = line[0] + " " + line[1]
        timestamp = datetime.utcfromtimestamp(int(line[2]))

        feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {"type": "Point"}
        }

        feature["properties"] = {
            "doseRate": values[i],
            "id": locations[coords]["id"],
            "site": locations[coords]["site"],
            "timestamp": datetime.strftime(timestamp,
                                           "%Y-%m-%dT%H:%M:%SZ")
        }

        feature["geometry"]["coordinates"] = [
            locations[coords]["longitude"],
            locations[coords]["latitude"]
        ]

        geojson_string["features"].append(feature)

    result = {
        "timestamp": timestamp,
        "data": geojson_string
    }

    return result

def write_dose_rate_data(data):
    """
    Writes the argument dose rate data into a file.

    :param data: GeoJSON string of dose rate data
    :return: path of the file that is written
    """
    directory = "../data/dose_rates/datasets"
    filepath = (directory + "/" +
        datetime.strftime(data["timestamp"], "%Y-%m-%dT%H%M%S") + ".json")

    with open(filepath, 'w', encoding="utf-8") as fp:
        json.dump(data["data"], fp, ensure_ascii=False, separators=(",", ":"), sort_keys=True)

    return filepath

def validate_timespan(timespan):
    """
    Validates the argument timespan.

    :param timespan: array containing two datetime strings
    :return: array containing two datetime objects
    """
    datetimeFormat = "%Y-%m-%dT%H:%M:%S"
    try:
        start_time = datetime.strptime(timespan[0], datetimeFormat)
        end_time = datetime.strptime(timespan[1], datetimeFormat)
    except:
        sys.exit("[Error] Invalid datetime format.")

    if start_time >= end_time:
        sys.exit("[Error] Invalid timespan.")

    return [start_time, end_time]
