from copy import deepcopy
from datetime import datetime, timedelta
from xml.etree import ElementTree
import json
import logging
import math
import os
import sys
import time

import fmi_utils
import settings

def get_data(args):
    """
    Downloads, parses, and writes dose rate data.

    :param args: program arguments
    """
    data = download_data(args)

    logging.info("Generating GeoJSON files")
    invalidDatasets = 0
    for dataset in data:
        try:
            parsed_data = parse_data(dataset)
        except InvalidDatasetError:
            invalidDatasets += 1
        else:
            write_data(parsed_data)

    if invalidDatasets > 0:
        logging.info("{0} invalid datasets were skipped".format(invalidDatasets))

def download_data(args):
    """
    Performs a WFS request for dose rate data from the FMI open data API.
    If no timespan is provided when running the program, the function
    fetches the most recent measurements.

    :param args: program arguments
    :return: array of HTTPResponse objects
    """
    data = []

    if args.timespan:
        start_time, end_time = validate_timespan(args.timespan)
        measurement_interval = timedelta(seconds=599)
        dataset_count = get_dataset_count(start_time, end_time, measurement_interval)
        t1 = start_time
        t2 = t1 + measurement_interval
        dataset_number = 1
        while t2 <= end_time:
            logging.info("Downloading dataset {0}/{1}".format(dataset_number, dataset_count))
            dataset = fmi_utils.wfs_request(t1, t2, "dose_rates")
            if dataset is not None:
                data.append(dataset)
            else:
                logging.warning("Failed to download dataset {0}/{1} ({2})".format(dataset_number, dataset_count, t1))
            t1 = t2
            t2 += measurement_interval
            dataset_number += 1

    else:
        end_time = datetime.utcnow() - timedelta(seconds=2400)
        start_time = end_time - timedelta(seconds=559)
        logging.info("Downloading dataset")
        dataset = fmi_utils.wfs_request(start_time, end_time, "dose_rates")
        if dataset is not None:
            data.append(dataset)
        else:
            logging.warning("Failed to download dataset")
            sys.exit(1)

    return data

def parse_data(data):
    """
    Parses the argument dose rate data into a GeoJSON string.

    :param data: raw dose rate data from the FMI open data API.
    :return: GeoJSON string of dose rate data
    """
    if data is None:
        raise InvalidDatasetError

    wfs_response = ElementTree.fromstring(data)
    gml_points = wfs_response.findall('.//{%s}Point' % fmi_utils.gml_namespace)
    geojson_string = deepcopy(fmi_utils.geojson_template)

    # Read locations.
    locations = {}
    for n, point in enumerate(gml_points):
        identifier = point.attrib['{%s}id' % fmi_utils.gml_namespace].split("-")[-1]
        name = point.findall('{%s}name' % fmi_utils.gml_namespace)[0].text
        position = point.findall('{%s}pos' % fmi_utils.gml_namespace)[0].text.strip()
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
                                            % fmi_utils.gml_namespace)[0].text.split("\n")[1:-1]
    except IndexError:
        raise InvalidDatasetError("Dataset contains no features.")

    for line in value_lines:
        value = float(line.strip().split()[0])
        values.append(value)

    # check if all values are NaNs
    if all ( math.isnan(value) for value in values ):
        raise InvalidDatasetError("Dataset values are all NaN")

    # Construct features.
    position_lines =  wfs_response.findall('.//{%s}positions' \
                                            % fmi_utils.gmlcov_namespace)[0].text.split("\n")[1:-1]

    dataset_timestamp = None
    for i, line in enumerate(position_lines):
        if math.isnan(values[i]):
            continue

        line = line.split()
        coords = line[0] + " " + line[1]
        timestamp = datetime.utcfromtimestamp(int(line[2]))

        # Some datasets contain duplicate entries for sites where the timestamp
        # of one of the entries differs by e.g. a minute.
        # Entries that don't match the dataset's timestamp are skipped.
        # The dataset's timestamp is set to the timestamp of the first entry.
        if dataset_timestamp is None:
            dataset_timestamp = timestamp
        elif timestamp != dataset_timestamp:
            continue

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
        "timestamp": dataset_timestamp,
        "geojson_string": geojson_string
    }

    return result

def write_data(data):
    """
    Writes the argument GeoJSON dose rate data into a file.

    :param data: GeoJSON string of dose rate data and a timestamp
    """
    directory = settings.get("path_dose_rates_datasets")
    filepath = (directory + "/" +
        datetime.strftime(data["timestamp"], "%Y-%m-%dT%H%M%S") + ".json")

    if not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)

    with open(filepath, "w", encoding="utf-8") as fp:
        json.dump(data["geojson_string"], fp, ensure_ascii=False, separators=(",", ":"), sort_keys=True)

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
    except ValueError:
        sys.exit("[Error] Invalid datetime format, should be {}.".format(
            fmi_utils.fmi_request_datetime_format))

    if start_time >= end_time or end_time > datetime.utcnow():
        sys.exit("[Error] Invalid timespan.")

    return [start_time, end_time]

def get_dataset_count(start_time, end_time, measurement_interval):
    """
    Determines the number of datasets that will be loaded for
    a given timespan and measurement interval.

    :param start_time: start of a timespan
    :param end_time: end of a timespan
    :param measurement_interval: time between datasets
    :return: number of datasets to be loaded
    """
    dataset_count = 0
    end_time = end_time - measurement_interval
    while start_time <= end_time:
        dataset_count += 1
        start_time += measurement_interval

    return dataset_count

class InvalidDatasetError(Exception):
    """
    A custom exception type for when a dataset retrieved from
    FMI's API is considered invalid (e.g. it contains no features).
    """
    pass
