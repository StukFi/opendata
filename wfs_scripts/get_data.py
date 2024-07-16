from datetime import date
import argparse
import logging
import sys

from fmi_utils import fmi_request_datetime_format
from metadata import update_metadata
from time_series import generate_time_series
import process_data
import settings

def get_program_arguments():
    """
    Parses the program's arguments.

    :return: program arguments
    """
    parser = argparse.ArgumentParser(description="Gets data from FMI's open data API.")
    parser.add_argument("-s", "--timespan", nargs=2, metavar=('FROM', 'TO'),
                        help="define a timespan for which to get data, \
                              datetime format {}".format(fmi_request_datetime_format))
    parser.add_argument("-q", "--quiet", action="store_true",
                        help="suppress console output")
    parser.add_argument("-t", "--type", choices=['dose_rates', 'air_radionuclides', 'both'], 
                        default='dose_rates', help="Specify the type of data to fetch")
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
    if args.type == "dose_rates":
        process_data.get_data(args)
        generate_time_series(args)
        update_metadata()
        
    elif args.type == "air_radionuclides":
        process_data.get_data(args)
        generate_time_series(args)

    elif args.type == "both":
        args.type = "dose_rates"
        process_data.get_data(args)
        generate_time_series(args)
        update_metadata()
        args.type = "air_radionuclides"
        process_data.get_data(args)
        generate_time_series(args)


if __name__ == "__main__":
    args = get_program_arguments()
    initialize_logging(args)
    settings.load()
    get_data(args)
