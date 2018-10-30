import calendar
import json
import os
import sys
from datetime import datetime, timedelta
from progress import display_progress

def generate_time_series(args, regenerate_all=False):
    """
    Generate time series files from GeoJSON dataset files.

    :param args: program arguments
    :param regenerate_all: indicates whether to regenerate all time series files
    """
    print("Generating time series files", flush=True)

    source_dir = "../data/dose_rates/datasets/"
    target_dir = "../data/dose_rates/time_series/"

    source_files = os.listdir(source_dir)
    source_files.sort()

    if args and not regenerate_all:
        target_dates = get_target_dates(args)
        source_files = filter_source_files(source_files, target_dates)

    measurements = []
    for json_file in source_files:
        results = json.loads(open(source_dir + "/" + json_file).read())
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

    # Reformat measurements to match JSON structure.
    result = {}
    for measurement in measurements:
        if not measurement["station"] in result.keys():
            result[measurement["station"]] = {}

        date_string = measurement["timestamp"].strftime("%Y-%m-%d")
        if not date_string in result[measurement["station"]].keys():
            result[measurement["station"]][date_string] = []

        result[measurement["station"]][date_string].append({
            "s": measurement["s"],
            "e": measurement["e"],
            "r": measurement["r"]
        })

    for station in result.keys():
        if not os.path.isdir(target_dir + station):
            os.makedirs(target_dir + station)
        for date in result[station].keys():
            data = {"data": result[station][date]}
            f = open(target_dir + station + "/" + date + ".json", "w")
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
        datetimeFormat = "%Y-%m-%dT%H:%M:%S"
        start_time = datetime.strptime(args.timespan[0], datetimeFormat)
        end_time = datetime.strptime(args.timespan[1], datetimeFormat)
    else:
        end_time = datetime.now()
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
    answer = input("This will regenerate time series for all datasets. Continue? (y/n): ")
    if answer == "y":
        generate_time_series(None, True)