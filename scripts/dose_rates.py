import json
import logging
import os
import sys
from datetime import datetime, timedelta
from copy import deepcopy
from site_mapping import get_site_info_by_coordinates
import settings
from fmi_utils import edr_request, geojson_template

def get_data(args):
    """
    Downloads, parses, and writes dose rate data.

    :param args: program arguments
    """
    data = download_data(args)

    logging.info("Generating GeoJSON files")
    invalid_datasets = 0
    for dataset in data:
        try:
            parsed_data = parse_data(dataset)
        except InvalidDatasetError:
            invalid_datasets += 1
        else:
            write_data(parsed_data)

    if invalid_datasets > 0:
        logging.info(f"{invalid_datasets} invalid datasets were skipped")

def download_data(args):
    """
    Performs an EDR request for dose rate data from the FMI open data API.
    If no timespan is provided when running the program, the function
    fetches the most recent measurements.

    :param args: program arguments
    :return: list of GeoJSON objects (as dictionaries)
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
            dataset = edr_request(t1, t2, "dose_rates")
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
        logging.info(f" from {start_time} to {end_time}")
        dataset = edr_request(start_time, end_time, "dose_rates")
        if dataset:
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
    if not data:
        raise InvalidDatasetError("No data provided")

    features = data.get("features", [])
    geojson_string = deepcopy(geojson_template)

    site_data = {}

    for feature in features:
        geometry = feature.get("geometry", {})
        properties = feature.get("properties", {})
        coordinates = geometry.get("coordinates", [])
        timestamps = properties.get("time", [])
        dose_rates = properties.get("dr_pt10m_avg", [])

        lat, lon = coordinates[1], coordinates[0]
        site_key = (lat, lon)

        if site_key not in site_data:
            site_data[site_key] = []

        for i, ts in enumerate(timestamps):
            site_data[site_key].append((ts, dose_rates[i]))

    dataset_timestamp = None
    for site_key, data_points in site_data.items():
        lat, lon = site_key
        site_info = get_site_info_by_coordinates(lon, lat)

        feature_data = []

        # Some sites update more frequently than 10min, so it ignores all other timestamps than each 10min
        for ts, dose_rate in data_points:
            current_timestamp = datetime.strptime(ts, "%Y-%m-%dT%H:%M:%SZ")
            if current_timestamp.minute % 10 != 0:
                continue

            if dataset_timestamp is None:
                dataset_timestamp = current_timestamp

            feature_data.append({
                "type": "Feature",
                "properties": {
                    "id": site_info["id"],
                    "site": site_info["site"],
                    "doseRate": dose_rate,
                    "timestamp": ts
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]
                }
            })

        if feature_data:
            geojson_string["features"].extend(feature_data)

    if not geojson_string["features"]:
        raise InvalidDatasetError("Dataset contains no features")

    return {
        "timestamp": dataset_timestamp,
        "geojson_string": geojson_string
    }

def write_data(data):
    """
    Writes the argument GeoJSON dose rate data into a file.

    :param data: GeoJSON string of dose rate data and a timestamp
    """
    directory = settings.get("path_dose_rates_datasets")
    timestamp = data['timestamp']

    if isinstance(timestamp, str):
        timestamp = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")

    filepath = os.path.join(directory, f"{timestamp.strftime('%Y-%m-%dT%H%M%S')}.json")

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
    datetime_format = "%Y-%m-%dT%H:%M:%S"
    try:
        start_time = datetime.strptime(timespan[0], datetime_format)
        end_time = datetime.strptime(timespan[1], datetime_format)
    except ValueError:
        sys.exit("[Error] Invalid datetime format, should be {}.".format(datetime_format))

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
    FMI's API is considered invalid (e.g., it contains no features).
    """
    pass
