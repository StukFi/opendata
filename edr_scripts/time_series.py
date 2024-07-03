import calendar
import json
import logging
import os
import sys
from datetime import datetime, timedelta

import settings

def generate_time_series(args, regenerate_all=False):
    """
    Generates time series files from GeoJSON dataset files.

    :param args: program arguments
    :param regenerate_all: indicates whether to regenerate all time series files
    """
    logging.info("Generating time series files")

    source_dir = settings.get("path_dose_rates_datasets")
    target_dir = settings.get("path_dose_rates_time_series")

    source_files = os.listdir(source_dir)
    source_files.sort()

    if args and not regenerate_all:
        target_dates = get_target_dates(args)
        source_files = filter_source_files(source_files, target_dates)

    measurements = []
    for json_file in source_files:
        results = json.loads(open(source_dir + "/" + json_file, encoding="utf-8").read())
        features = results["features"]

        for feature in features:
            if "timestamp" in feature["properties"] and "doseRate" in feature["properties"]:
                timestamp = feature["properties"]["timestamp"]
                dose_rate = feature["properties"]["doseRate"]

                if dose_rate is not None:
                    start_time = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ") - timedelta(seconds=600)
                    end_time = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")
                    start = int(calendar.timegm(start_time.utctimetuple())) * 1000
                    end = int(calendar.timegm(end_time.utctimetuple())) * 1000
                    measurements.append({
                        "s": start,
                        "e": end,
                        "timestamp": end_time,
                        "station": feature["properties"]["id"],
                        "r": dose_rate
                    })

    # Reformat measurements to match JSON structure.
    result = {}
    for measurement in measurements:
        if measurement["station"] not in result:
            result[measurement["station"]] = {}

        date_string = measurement["timestamp"].strftime("%Y-%m-%d")
        if date_string not in result[measurement["station"]]:
            result[measurement["station"]][date_string] = []

        result[measurement["station"]][date_string].append({
            "s": measurement["s"],
            "e": measurement["e"],
            "r": measurement["r"]
        })

    for station in result.keys():
        path = target_dir + "/" + station
        if not os.path.isdir(path):
            os.makedirs(path)
        for date in result[station].keys():
            data = {"data": result[station][date]}
            f = open(path + "/" + date + ".json", "w")
            f.write(json.dumps(data, separators=(",", ":")))
            f.close()

def get_target_dates(args):
    """
    Gets the dates for which datasets were fetched from the arguments
    provided to the program.

    :param args: program arguments
    :return: list of dates for which datasets were fetched
    """
    if args.timespan:
        datetime_format = "%Y-%m-%dT%H:%M:%S"
        start_time = datetime.strptime(args.timespan[0], datetime_format)
        end_time = datetime.strptime(args.timespan[1], datetime_format)
    else:
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(days=1)

    dates = []
    date_format = "%Y-%m-%d"
    while start_time <= end_time:
        dates.append(start_time.strftime(date_format))
        start_time += timedelta(days=1)

    dates.append(end_time.strftime(date_format))

    return dates

def filter_source_files(source_files, target_dates):
    """
    Filters dataset files by date. This optimizes time series generation by only
    using files that belong to the dates for which new dataset files were fetched for.

    :param source_files: list of filenames to filter
    :param target_dates: list of dates to use as a filter
    :return: list of filenames from which to generate time series
    """
    filtered_files = []
    for filename in source_files:
        for date in target_dates:
            if date in filename:
                filtered_files.append(filename)
                break

    return filtered_files

if __name__ == "__main__":
    answer = input("This will regenerate time series for all datasets. Continue? (y/n): ")
    if answer == "y":
        generate_time_series(None, True)
