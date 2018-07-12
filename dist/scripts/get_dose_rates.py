import json
import time
from datetime import datetime, timedelta
from fmi_utils import *
from requests.exceptions import ReadTimeout
from xml.etree import ElementTree

def write_dose_rates(response, directory=".", geojson_file="auto"):
    """
    Writes GeoJSON files of dose rate measurements.

    :param response: HTTPResponse object
    :param directory: Directory to which files are written
    :param geojson_file: Indicates whether the filename should be generated
    :return: Path of the file that was written
    """
    wfs_response = ElementTree.fromstring(response.read())
    gml_points = wfs_response.findall('.//{%s}Point' % gml_namespace)
    geojson_str = geojson_template

    # Read locations.
    locations = {}
    for n, point in enumerate(gml_points):
        identifier = point.attrib['{%s}id' % gml_namespace].split("-")[-1]
        name = point.findall('{%s}name' % gml_namespace)[0].text
        position = point.findall('{%s}pos' % gml_namespace)[0].text.strip()
        longitude = float(position.split()[1])
        latitude = float(position.split()[0])
        locations[position] = {
            "site": name,
            "longitude": longitude,
            "latitude": latitude,
            "id": identifier
        }

    # Read values.
    values = []
    try:
        value_lines = wfs_response.findall('.//{%s}doubleOrNilReasonTupleList' \
                                            % gml_namespace)[0].text.split("\n")[1:-1]
    except IndexError:
        raise Exception("No features.")

    for line in value_lines:
        value = float(line.strip().split()[0])
        values.append(value)

    # Construct features.
    position_lines =  wfs_response.findall('.//{%s}positions' \
                                            % gmlcov_namespace)[0].text.split("\n")[1:-1]
    for i, line in enumerate(position_lines):
        line = line.split()
        coords = line[0] + " " + line[1]
        timestamp = datetime.utcfromtimestamp(int(line[2]))

        feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {"type": "Point"}
        }

        feature["properties"] = {
            "doseRate": values[i],
            "id": locations[coords]["id"],
            "site": locations[coords]["site"],
            "timestamp": datetime.strftime(timestamp,
                                           "%Y-%m-%dT%H:%M:%SZ")
        }

        feature["geometry"]["coordinates"] = [
            locations[coords]["longitude"],
            locations[coords]["latitude"]
        ]

        geojson_str["features"].append(feature)

    # Determine filename.
    if geojson_file=="auto":
        outfile = directory + "/" + datetime.strftime(
            timestamp,"%Y-%m-%dT%H%M%S") + ".json"
    else:
        outfile = result_dir + "/stuk_open_data_doserates.json"

    # Write output.
    with open(outfile, 'w', encoding="utf-8") as fp:
        json.dump(geojson_str,
                  fp,
                  ensure_ascii=False,
                  indent=4,
                  sort_keys=True)
    return outfile

if __name__ == "__main__":
    end_time = datetime.utcnow() - timedelta(seconds=1800)
    start_time = end_time - timedelta(seconds=559)
    result_dir = "../data/dose_rates"
    tries = 3
    while tries != 0:
        try:
            wfs_response = wfs_request(start_time, end_time)
            tries = 0
        except ReadTimeout:
            tries -= 1
            time.sleep(10)

    geojson = write_dose_rates(wfs_response, result_dir)
