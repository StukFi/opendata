import argparse
import sys
from datetime import datetime, timedelta
from get_dose_rates import *
from fmi_utils import *
from requests.exceptions import ReadTimeout

def get_program_arguments():
    parser = argparse.ArgumentParser(description="Gets data from FMI's open data API.")
    parser.add_argument("data_type", choices=["dose_rates", "samplers"],
            help="type of data to get")
    parser.add_argument("-ts", "--timespan", nargs=2, metavar=('FROM', 'TO'),
            help="timespan for which to get data [YYYY-MM-DDThh:mm:ss]")
    return parser.parse_args();

def validate_timespan(timespan):
    datetimeFormat = "%Y-%m-%dT%H:%M:%S"
    try:
        start_time = datetime.strptime(timespan[0], datetimeFormat)
        end_time = datetime.strptime(timespan[1], datetimeFormat)
    except:
        sys.exit("[Error] Invalid datetime format.")

    if start_time >= end_time:
        sys.exit("[Error] Invalid timespan.")

    return [start_time, end_time]

def get_data(args):
    if args.data_type == "dose_rates":
        data = get_dose_rate_data(args)
        write_dose_rates(data, "../data/dose_rates")
    elif args.data_type == "samplers":
        return get_sampler_data(args)

def get_dose_rate_data(args):
    if args.timespan:
        start_time, end_time = validate_timespan(args.timespan)
    else:
        end_time = datetime.utcnow() - timedelta(seconds=1800)
        start_time = end_time - timedelta(seconds=559)

    result_dir = "../data/dose_rates"
    tries = 3
    while tries > 0:
        try:
            wfs_response = wfs_request(start_time, end_time)
            tries = 0
            return wfs_response
        except ReadTimeout:
            tries -= 1
            time.sleep(10)

def get_sampler_data(args):
    print("temp")

if __name__ == "__main__":
    args = get_program_arguments()
    data = get_data(args)
    # parsed_data = parse_data(data)
