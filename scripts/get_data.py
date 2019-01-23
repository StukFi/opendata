from datetime import date
from time_series import generate_time_series
from metadata import update_metadata
from requests.exceptions import ReadTimeout
import argparse
import logging
import sys

from fmi_utils import fmi_request_datetime_format
import dose_rates
import samplers
import settings

def get_program_arguments():
    """
    Parses the program's arguments.

    :return: program arguments
    """
    parser = argparse.ArgumentParser(description="Gets data from FMI's open data API.")
    parser.add_argument("data_type", choices=["dose_rates", "samplers"],
                        help="type of data to get")
    parser.add_argument("-s", "--timespan", nargs=2, metavar=('FROM', 'TO'),
                        help="define a timespan for which to get data, \
                              datetime format {}".format(fmi_request_datetime_format))
    parser.add_argument("-a", "--auth", action="store_true",
                        help="use an API key to authenticate requests")
    parser.add_argument("-q", "--quiet", action="store_true",
                        help="suppress console output")
    return parser.parse_args()

def initialize_logging(args):
    """
    Initializes logging facilities.

    :param args: program arguments
    """
    if args.quiet:
        logger = logging.getLogger()
        logger.disabled = True
    else:
        logging.basicConfig(level=logging.DEBUG, format="%(levelname)s:%(message)s")

def get_data(args):
    """
    Gets data based on the arguments provided to the program.

    :param args: program arguments
    """
    if args.data_type == "dose_rates":
        datasets = dose_rates.get_data(args)
        invalidDatasets = 0
        logging.info("Generating GeoJSON files")
        for dataset in datasets:
            try:
                parsed_data = dose_rates.parse_data(dataset)
            except dose_rates.InvalidDatasetError:
                invalidDatasets += 1
            else:
                dose_rates.write_data(parsed_data)

        if invalidDatasets > 0:
            logging.info("{0} invalid datasets were skipped".format(invalidDatasets))

        update_metadata()
        generate_time_series(args)

    elif args.data_type == "samplers":
        data = samplers.get_data(args)
        parsed_data = samplers.parse_data(data)
        samplers.write_data(parsed_data)

if __name__ == "__main__":
    args = get_program_arguments()
    initialize_logging(args)
    settings.load()
    get_data(args)