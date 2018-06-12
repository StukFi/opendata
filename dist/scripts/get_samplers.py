from datetime import datetime, timedelta
from fmi_utils import *
from xml.etree import ElementTree

sampler_geojson_template = geojson_template
sampler_geojson_template["name"] = "stuk_open_data_air_concentrations"

def write_samplers(response,directory=".",geojson_file="auto"):
    wfs_response = ElementTree.fromstring(response.read())
    wfs_members = wfs_response.findall('.//{%s}member' % wfs_ns)
    geojson_str = sampler_geojson_template
    for member in wfs_members:
        point = member.findall('.//{%s}Point' % gml_namespace)[0]
        point_id = point.attrib['{%s}id' % gml_namespace].split("-")[-1]
        name = point.findall('{%s}name' % gml_namespace)[0].text
        pos = point.findall('{%s}pos' % gml_namespace)[0].text
        longitude = float(pos.split()[1])
        latitude = float(pos.split()[0])
        values = member.findall('.//{%s}doubleOrNilReasonTupleList'\
                                % gml_namespace)[0].text.split()
        values = list(map(float,values))
        from_time = member.findall('.//{%s}beginPosition' % gml_namespace)[0].text
        to_time = member.findall('.//{%s}endPosition' % gml_namespace)[0].text
        feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {"type": "Point"}
        }
        feature["properties"] = {
            "site_id": point_id,
            "site_name": name,
            "timestamp_begin": from_time,
            "timestamp_end": to_time,
        }
        feature["geometry"]["coordinates"] = [
            longitude,
            latitude
        ]
        fields = member.findall( './/{%s}field' % swe_ns)
        meas = {}
        for N,f in enumerate(fields):
            name = f.attrib["name"]
            label = f.findall( './/{%s}label' % swe_ns)[0].text
            unit = f.findall( './/{%s}uom' % swe_ns)[0].attrib["code"]
            if "uBq" in unit:
                unit = unit.replace("u",u"\u00B5")
            if "m3" in unit:
                unit = unit.replace("3",u"\u00B3")
            if (name=="air-volume" or "uncert" in name):
                value = int(values[N])
            else:
                value = values[N]
            if ("uncertainty") in name:
                # append existing feature
                n = name.split("-unc")[0]
                feature["properties"][n] += u" (" + u"\u00B1 " + \
                    str(value) + u" " + str(unit) + u")"
            else:
                feature["properties"][name] = str(value) + \
                    u" " + str(unit)
        geojson_str["features"].append(feature)
    # refactor values

    outfile = result_dir + "/stuk_open_data_samplers.json"
    # write output
    with open(outfile, 'w') as fp:
        json.dump(geojson_str,
                  fp,
                  ensure_ascii=False,
                  indent=4,
                  sort_keys=True)
    return outfile

if __name__=="__main__":
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=10)
    result_dir = "../data/samplers"
    tries = 3
    while tries!=0:
        try:
            wfs_response = wfs_request( start_time, end_time, "samplers" )
            tries = 0
        except ReadTimeout:
            tries +- 1
            time.sleep ( 10 )
    geojson = write_samplers(wfs_response, result_dir)
