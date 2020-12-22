# opendata [![Build](https://github.com/StukFi/opendata/workflows/Build/badge.svg?branch=master)](https://github.com/StukFi/opendata/actions)

Opendata is an independent web application for viewing external radiation results from STUK's monitoring network. The application gets its data from the Finnish Meteorological Institute's open data API. The included Python scripts can also be used stand-alone to get the data in GeoJSON format for other purposes. A demo of the application is available at [stukfi.github.io](https://stukfi.github.io/).

For more information on STUK's and FMI's open data, see the following resources:
- https://www.stuk.fi/avoin-data
- https://en.ilmatieteenlaitos.fi/open-data

### Building

1. Install [Node.js](https://nodejs.org) which includes npm (node package manager).

2. Run `npm install` in the project's root directory to install dependencies.

3. Build the application: `npm run build` for production or `npm run serve` for development.

### Data

To get data you need to:

1. Install Python 3.

2. Create a copy of the file `settings.example.json` in the `scripts` directory and name it `settings.json`. In the file change the value of `data_directory` to the path of the directory where you want data to be stored. The name of the directory must be `data`. For example, `/var/www/html/opendata/data`. During development the data directory must be in the `public` directory.

3. Run `python get_data.py` in the scripts directory. This gets the latest measurement data set. To download past or multiple data sets, use the `-s` option with a start and an end time. Use the `--help` option for more details.

The `get_data.py` script also generates time series files and a metadata file. To generate these files manually run the `time_series.py` and `metadata.py` scripts.

### Hosting

Build the application for production and point a web server to the `dist` directory.

To keep the application up-to-date with data schedule the `get_data.py` script.

### Development tools

Recommended development tools:

1. Visual Studio Code and the following extensions:
    - Vetur
    - ESLint
    - Jest
    - EditorConfig for VS Code
    - Debugger for Chrome
    - Python

2. Vue-devtools browser extension: https://github.com/vuejs/vue-devtools#vue-devtools

### Browser support

The application is usable on modern web browsers such as Google Chrome, Firefox, and Microsoft Edge.
