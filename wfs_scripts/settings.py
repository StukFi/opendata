import json

settings = None

def load():
    """
    Loads settings from a configuration file.

    """
    global settings
    settings = json.load(open("settings.json"))

    # Construct specific directory paths based on the root data directory path.
    data_directory = settings["data_directory"]
    settings["path_dose_rates"] = data_directory + "/dose_rates"
    settings["path_dose_rates_datasets"] = data_directory + "/dose_rates/datasets"
    settings["path_dose_rates_time_series"] = data_directory + "/dose_rates/time_series"

    settings["path_air_radionuclides"] = data_directory + "/air_radionuclides"
    settings["path_air_radionuclides_datasets"] = data_directory + "/air_radionuclides/datasets"
    settings["path_air_radionuclides_time_series"] = data_directory + "/air_radionuclides/time_series"

def get(setting):
    """
    Returns the value of the argument setting.

    :param setting: string
    :return: string
    """
    global settings
    if settings is None:
        load()

    return settings[setting]
