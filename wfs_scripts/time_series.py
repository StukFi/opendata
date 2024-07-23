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
    Generates time series file for air radionuclide data and writes available radionuclides and filenames to separate files.

    :param source_dir: source directory path
    :param target_dir: target directory path
    :param source_files: source file paths
    """
    measurements = defaultdict(list)
    radionuclides = defaultdict(set)
    filenames_per_nuclide = defaultdict(lambda: defaultdict(list))
    sites = []

    sites_file_path = os.path.join(target_dir, "sites.json")
    
    # Load existing sites if sites.json already exists
    if os.path.exists(sites_file_path):
        with open(sites_file_path, "r") as sites_file:
            sites = json.load(sites_file)

    existing_site_ids = {site["id"] for site in sites}

    for json_file in source_files:
        with open(os.path.join(source_dir, json_file), encoding="utf-8") as f:
            results = json.load(f)

        features = results["features"]
        for feature in features:
            properties = feature["properties"]
            geometry = feature["geometry"]
            station_id = properties["id"]

            if station_id not in existing_site_ids:
                site_info = {
                    "id": station_id,
                    "site": properties["site"],
                    "coordinates": geometry["coordinates"]
                }
                sites.append(site_info)
                existing_site_ids.add(station_id)

            for key, value in properties.items():
                if key.startswith("concentration_"):
                    nuclide = key.split("_")[1]
                    radionuclides[station_id].add(nuclide)

                    from_timestamp = datetime.strptime(properties["from_timestamp"], "%Y-%m-%dT%H:%M:%SZ")
                    to_timestamp = datetime.strptime(properties["to_timestamp"], "%Y-%m-%dT%H:%M:%SZ")

                    start = int(calendar.timegm(from_timestamp.utctimetuple())) * 1000
                    end = int(calendar.timegm(to_timestamp.utctimetuple())) * 1000
                    measurements[(station_id, nuclide)].append({
                        "s": start,
                        "e": end,
                        "from_timestamp": from_timestamp,
                        "to_timestamp": to_timestamp,
                        "station": station_id,
                        "c": value,
                        "u": properties.get(f"uncertainty_{nuclide}-uncertainty", None),
                        "nuclide": nuclide
                    })

    # Write available radionuclides and time series data
    for station_id, nuclides in radionuclides.items():
        station_path = os.path.join(target_dir, station_id)
        os.makedirs(station_path, exist_ok=True)

        # Write available radionuclides
        with open(os.path.join(station_path, "available_radionuclides.json"), "w") as radionuclides_file:
            json.dump(list(nuclides), radionuclides_file, separators=(",", ":"))

        for nuclide in nuclides:
            data = measurements[(station_id, nuclide)]
            result = defaultdict(lambda: defaultdict(list))
            for measurement in data:
                from_date_string = measurement["from_timestamp"].strftime("%Y-%m-%d")+"TO"+measurement["to_timestamp"].strftime("%Y-%m-%d")
                result[station_id][from_date_string].append({
                    "s": measurement["s"],
                    "e": measurement["e"],
                    "c": measurement["c"],
                    "u": measurement["u"],
                    "nuclide": measurement["nuclide"]
                })

            for date_string, measurements_data in result[station_id].items():
                file_path = os.path.join(station_path, nuclide, date_string + ".json")
                os.makedirs(os.path.dirname(file_path), exist_ok=True)

                data_to_write = {"data": measurements_data}
                with open(file_path, "w") as f:
                    json.dump(data_to_write, f, separators=(",", ":"))

                # Track the filenames for each nuclide
                filenames_per_nuclide[station_id][nuclide].append(date_string + ".json")

    # Write available filenames
    for station_id, nuclides in filenames_per_nuclide.items():
        for nuclide, filenames in nuclides.items():
            nuclide_path = os.path.join(target_dir, station_id, nuclide)
            os.makedirs(nuclide_path, exist_ok=True)

            with open(os.path.join(nuclide_path, "available_filenames.json"), "w") as filenames_file:
                json.dump(filenames, filenames_file, separators=(",", ":"))

    # Write the sites.json file
    with open(sites_file_path, "w") as sites_file:
        json.dump(sites, sites_file, separators=(",", ":"))


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
