import json

settings = None

def load():
    """
    Loads server settings from a configuration file.

    :param args: program arguments
    :return: HTTPResponse object
    """
    global settings
    settings = json.load(open("settings.json"))

    # Construct specific directory paths based on the root data directory path.
    data_directory = settings["data_directory"]
    settings["path_dose_rates"] = data_directory + "/dose_rates"
    settings["path_dose_rates_datasets"] = data_directory + "/dose_rates/datasets"
    settings["path_dose_rates_time_series"] = data_directory + "/dose_rates/time_series"
    settings["path_samplers"] = data_directory + "/samplers"

def get(setting):
    """
    Returns the value of the argument setting.

    :param setting: string
    :return: string
    """
    return settings[setting]