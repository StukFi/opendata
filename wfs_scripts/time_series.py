import os
import json
import logging
from datetime import datetime, timedelta
import calendar
from collections import defaultdict

import settings

def generate_time_series(args=None, regenerate=None):
    """
    Generates time series files from GeoJSON dataset files.

    :param args: program arguments
    :param regenerate: indicates whether to regenerate all time series files
    """
    if args is not None:
        logging.info(f"[{args.type}] Generating time series files")
        source_dir = settings.get("path_" + args.type + "_datasets")
        target_dir = settings.get("path_" + args.type + "_time_series")
        target_dates = get_target_dates(args)
        source_files = os.listdir(source_dir)
        source_files = filter_source_files(source_files, target_dates)

        if args.type == "dose_rates":
            generate_dose_rates_time_series(source_dir, target_dir, source_files)
        elif args.type == "air_radionuclides":
            generate_air_radionuclides_time_series(source_dir, target_dir, source_files)

    if regenerate:
        print(f"[{regenerate}] Regenerating time series files")
        source_dir = settings.get("path_" + regenerate + "_datasets")
        target_dir = settings.get("path_" + regenerate + "_time_series")
        source_files = os.listdir(source_dir)
        source_files.sort()

        if regenerate == "dose_rates":
            generate_dose_rates_time_series(source_dir, target_dir, source_files)
        elif regenerate == "air_radionuclides":
            generate_air_radionuclides_time_series(source_dir, target_dir, source_files)

def generate_dose_rates_time_series(source_dir, target_dir, source_files):
    """
    Generates time series file for dose rates data

    :param source_dir: source directory path
    :param target_dir: target directory path
    :param source_files: source file path
    """
    measurements = []
    for json_file in source_files:
        results = json.loads(open(os.path.join(source_dir, json_file), encoding="utf-8").read())
        features = results["features"]
        file_timestamp = datetime.strptime(json_file.split(".")[0], "%Y-%m-%dT%H%M%S")

        for feature in features:
            start = file_timestamp - timedelta(seconds=600)
            start = int(calendar.timegm(start.utctimetuple())) * 1000
            end = int(calendar.timegm(file_timestamp.utctimetuple())) * 1000
            measurements.append({
                "s": start,
                "e": end,
                "timestamp": file_timestamp,
                "station": feature["properties"]["id"],
                "r": feature["properties"]["doseRate"]
            })

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

    for station in result:
        path = os.path.join(target_dir, station)
        if not os.path.isdir(path):
            os.makedirs(path)
        for date in result[station]:
            data = {"data": result[station][date]}
            with open(os.path.join(path, date + ".json"), "w") as f:
                json.dump(data, f, separators=(",", ":"))

def generate_air_radionuclides_time_series(source_dir, target_dir, source_files):
    """
    Generates time series file for air radionuclide data

    :param source_dir: source directory path
    :param target_dir: target directory path
    :param source_files: source file path
    """
    measurements = defaultdict(list)
    for json_file in source_files:
        with open(os.path.join(source_dir, json_file), encoding="utf-8") as f:
            results = json.load(f)

        features = results["features"]
        for feature in features:
            properties = feature["properties"]
            from_timestamp = datetime.strptime(properties["from_timestamp"], "%Y-%m-%dT%H:%M:%SZ")
            to_timestamp = datetime.strptime(properties["to_timestamp"], "%Y-%m-%dT%H:%M:%SZ")

                           # Here are all the nuclides that will get a timeserie generated
            for nuclide in ["Be-7", "Na-22", "Cs-137", "Pb-210", "Co-60", "Cs-134", "Mn-54", "Nb-95", "Ru-103", "Ce-141", "Co-58", "Fe-59", "Sc-46", "Zr-95"]:
                if f"concentration_{nuclide}" in properties:
                    start = int(calendar.timegm(from_timestamp.utctimetuple())) * 1000
                    end = int(calendar.timegm(to_timestamp.utctimetuple())) * 1000
                    measurements[nuclide].append({
                        "s": start,
                        "e": end,
                        "timestamp": from_timestamp,
                        "station": properties["id"],
                        "c": properties[f"concentration_{nuclide}"],
                        "u": properties[f"uncertainty_{nuclide}-uncertainty"],
                        "nuclide": nuclide
                    })

    result = {}
    for nuclide, data in measurements.items():
        result[nuclide] = defaultdict(lambda: defaultdict(list))
        for measurement in data:
            station = measurement["station"]
            from_date_string = measurement["timestamp"].strftime("%Y-%m-%dT%H%M%S")
            result[nuclide][station][from_date_string].append({
                "s": measurement["s"],
                "e": measurement["e"],
                "c": measurement["c"],
                "u": measurement["u"],
                "nuclide": measurement["nuclide"]
            })

    for nuclide, stations in result.items():
        for station, dates in stations.items():
            station_path = os.path.join(target_dir, station)
            if not os.path.exists(station_path):
                os.makedirs(station_path)
            nuclide_path = os.path.join(station_path, nuclide)
            if not os.path.exists(nuclide_path):
                os.makedirs(nuclide_path)
            for from_date_string, data in dates.items():
                file_path = os.path.join(nuclide_path, from_date_string + ".json")
                if not os.path.exists(file_path):
                    data = {"data": data}
                    with open(file_path, "w") as f:
                        json.dump(data, f, separators=(",", ":"))

def get_target_dates(args):
    """
    Gets the dates for which datasets were fetched from the arguments
    provided to the program.

    :param args: program arguments
    :return: list of dates for which datasets were fetched
    """
    if args.timespan:
        datetimeFormat = "%Y-%m-%dT%H:%M:%S"
        start_time = datetime.strptime(args.timespan[0], datetimeFormat)
        end_time = datetime.strptime(args.timespan[1], datetimeFormat)
    else:
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(days=1)

    dates = []
    dateFormat = "%Y-%m-%d"
    while start_time <= end_time:
        dates.append(start_time.strftime(dateFormat))
        start_time += timedelta(days=1)

    dates.append(end_time.strftime(dateFormat))

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
    answer = input("What time series do you want to regenerate? [dose_rates (1), air_radionuclides (2), all (3)]: ")
    if answer == "1":
        generate_time_series(None, "dose_rates")
    elif answer == "2":
        generate_time_series(None, "air_radionuclides")
    elif answer == "3":
        generate_time_series(None, "dose_rates")
        generate_time_series(None, "air_radionuclides")
    else:
        logging.error("Invalid input. Please enter 1, 2, or 3.")
