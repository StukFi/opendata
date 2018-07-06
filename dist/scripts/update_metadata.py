"""
Generates a JSON-based file containing the dates and times for which a server-side
data file exists. The web application's front-end code reads and parses the file
to determine which dates and times are selectable in the user interface's widgets.
"""

import json
import os

def list_directory(directory, extension):
    """
    Lists files in a directory filtered by extension.

    :param directory: directory name
    :param extension: file extension filter
    :return: list object
    """
    list_of_files = []

    directory = os.fsencode(directory)
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        if filename.endswith(extension):
            list_of_files.append(filename)

    return list_of_files

def generate_metadata(list_of_filenames):
    """
    Creates a JSON string from the argument list of filenames. The JSON
    string lists the available dates and times for which a data file exists.

    :param list_of_filenames: filenames from which to parse available data
    :return JSON string
    """
    base_key = "available_data"
    result = { base_key: [] }

    if "metadata.json" in list_of_filenames:
        list_of_filenames.remove("metadata.json")

    for filename in list_of_filenames:
        filename = os.path.splitext(filename)[0]
        date, time = filename.split("T")

        entry = next((entry for entry in result[base_key] if entry["date"] == date), None)
        if entry == None:
            entry = {"date": date, "times": [time]}
            result[base_key].append(entry)
        else:
            entry["times"].append(time)

    result["files"] = [];
    for filename in list_of_filenames:
        result["files"].append(filename)

    result = json.dumps(result, indent=4)
    return result

def writeFile(filename, data):
    """
    Writes the argument data to a file with the argument filename.
    The file is created if it does not exist. The file's contents
    are overwritten.

    :param filename: name of the file to write the data to
    :param data: string of data
    """
    if type(data) is not str:
        return

    file = open(filename, "w")
    file.write(data)
    file.close()

if __name__ == "__main__":
    directory = "../data/dose_rates/"
    list_of_filenames = list_directory(directory, ".json")
    metadata = generate_metadata(list_of_filenames)
    writeFile(directory + "metadata.json", metadata)