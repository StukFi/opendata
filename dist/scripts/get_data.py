import argparse
import sys
from datetime import date
from dose_rates import *
from fmi_utils import *
from time_series import generate_time_series
from metadata import update_metadata
from progress import display_progress
from requests.exceptions import ReadTimeout
from samplers import *

def get_program_arguments():
    """
    Parses the program's arguments.

    :return: program arguments
    """
    parser = argparse.ArgumentParser(description="Gets data from FMI's open data API.")
    parser.add_argument("data_type", choices=["dose_rates", "samplers"],
                        help="type of data to get")
    parser.add_argument("-s", "--timespan", nargs=2, metavar=('FROM', 'TO'),
                        help="define timespan for which to get data [YYYY-MM-DDThh:mm:ss]")
    parser.add_argument("-a", "--auth", action="store_true",
                        help="use an API key to authenticate requests")
    return parser.parse_args()

def get_data(args):
    """
    Gets data based on the arguments provided to the program.

    :param args: program arguments
    """
    if args.data_type == "dose_rates":
        datasets = get_dose_rate_data(args)
        emptyDatasets = 0
        for i, dataset in enumerate(datasets, start=1):
            try:
                parsed_data = parse_dose_rate_data(dataset)
            except EmptyDatasetError:
                emptyDatasets += 1
                continue
            write_dose_rate_data(parsed_data)
            display_progress("Generating GeoJSON files", i - emptyDatasets, len(datasets))

        if emptyDatasets > 0:
            print("\n{0} empty datasets were skipped".format(emptyDatasets))

    elif args.data_type == "samplers":
        data = get_sampler_data(args)
        parsed_data = parse_sampler_data(data)
        write_sampler_data(parsed_data)

if __name__ == "__main__":
    args = get_program_arguments()
    get_data(args)
    update_metadata()
    generate_time_series(args)
