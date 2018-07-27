import argparse
import sys
from dose_rates import *
from fmi_utils import *
from metadata import update_metadata
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

    :param args: program arguments.
    """
    if args.data_type == "dose_rates":
        data = get_dose_rate_data(args)
        for dataset in data:
            parsed_data = parse_dose_rate_data(dataset)
            write_dose_rate_data(parsed_data)

    elif args.data_type == "samplers":
        data = get_sampler_data(args)
        parsed_data = parse_sampler_data(data)
        write_sampler_data(parsed_data)

if __name__ == "__main__":
    args = get_program_arguments()
    get_data(args)
    update_metadata()
