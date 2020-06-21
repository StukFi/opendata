# opendata

Opendata is an independent web application for viewing external radiation results from STUK's monitoring network. The application gets its data from the Finnish Meteorological Institute's open data API.  The included Python scripts can also be used stand-alone to get the data in GeoJSON format for other purposes. A demo of the application is available at [stukfi.github.io](https://stukfi.github.io/).

For more information on STUK's and FMI's open data, see the following resources:
- https://www.stuk.fi/avoin-data
- https://en.ilmatieteenlaitos.fi/open-data

## Contents
- [Using the application](#using-the-application)
- [Building the application](#building-the-application)
- [Hosting the application](#hosting-the-application)
- [Getting data](#getting-data)
- [Development Tools](#development-tools)
- [Dependencies](#dependencies)
- [Browser and Device Support](#browser-and-device-support)

## Using the application

The following image shows an overview of the application:

![](docs/overview.PNG)

Results are available in increments of 10 minutes. The application uses data local to its hosting server, which means that only data already fetched by the host is available. The available results may thus be incomplete.

Each point on the map represents a single measurement site. A point's color corresponds to the measured dose rate. Hovering a cursor over a point opens a popover showing the site's name and dose rate. Clicking a point opens a popup which also includes a time series graph. The time series graph by default displays data for the selected date. Panning the graph causes it to load in and display data for more dates. The graph supports various operations such as per-axis scrolling and selection of sections by shift-clicking and dragging.

At the bottom of the screen is a map legend. It shows dose rate ranges, their colors, and the unit of measurement (e.g. microsievert). Clicking a dose rate range toggles the visibility of results that fall within that range.

The map displays results for a certain date and time. Controls for changing the date and time are at the top of the screen. Clicking the date opens a calendar, and clicking the time opens a time selection list. The application only allows the selection of dates and times for which data is available. The arrow buttons change the date and time in steps. The application is in UTC time.

A search bar allows sites to be located by name. Clicking the search bar displays a list of all sites in alphabetical order. Typing a search term filters the list. A valid search centers the map on the site and opens a popup showing the site's status.

The application also comes with a set of basic media controls located at the bottom of the screen. They increment the selected date or time with a set interval. Note that playback cannot be started if the selected date or time is the most recent one.

The application is configurable via a settings page. You can open the settings page by clicking the cog icon. The settings page includes options for e.g. locale, date format, and dose rate thresholds. Settings are stored in the web browser's local storage.


## Building the application

1. Clone the repository.

2. Install [Node.js](https://nodejs.org) which includes npm (node package manager).

3. Install the project's JavaScript dependencies by running `npm install` in the project's root directory.

4. Build the project for production by running `npm run build` in the project's root directory. To build the project for development run `npm run serve`. The application then rebuilds if any files change.

## Hosting the application

Build the application and point a web server to the "dist" directory. For local testing use for example the "Web Server for Chrome" -plugin or the "http-server" command-line http server from npm. For public hosting refer to your web server of choice's documentation.

The application by default gets its map tiles from OpenStreetMap's public servers. For public hosting you should configure the application to use local tiles or some other service. The map tile source URL is configured in the map's Vue component file.

## Getting data

The application does not contain any data by default. Python scripts for fetching and processing data are in the "scripts" directory.

Create a copy of the file "settings.example.json" in the "scripts" directory and rename it "settings.json". Change the value of the "data_directory" key to the path of the directory where you want data to be stored. The name of the directory must be "data". For example, "/var/www/html/opendata/data". Note that the path does not end in a forward slash. The data directory should be located next to the "index.html" file at the root of the opendata web hosting directory. You can alternatively create a symlink that points to another location.

"get_data.py" is the main script. It takes one required argument for the type of data to get. This is currently always "dose_rates". Running the script without other arguments fetches the most recent results. Use the "--span" option and datetime arguments to fetch many results. Use the "--help" option for detailed technical instructions.

To keep the application up-to-date schedule the "get_data.py" script. The following crontab configuration runs the script every 10 minutes. The configuration changes directory to the scripts directory. This is due to relative paths in the scripts. Task Scheduler provides similar functionality on Windows.

`*/10 * * * * cd /home/lma/opendata/scripts/; /bin/python3 /home/lma/opendata/scripts/get_data.py dose_rates`

The "get_data.py" script also generates time series data and updates a metadata file. It performs these tasks when it fetches new results. To regenerate all time series data run the "time_series.py" script. To update the metadata file run the "metadata.py" script. You do not need to run these scripts under normal operation.

## Development Tools

Recommended development tools:

1. Visual Studio Code and the following extensions:
    - Vetur
    - ESLint
    - Jest
    - EditorConfig for VS Code
    - Debugger for Chrome
    - Python

2. Vue-devtools browser extension: https://github.com/vuejs/vue-devtools#vue-devtools

## Dependencies

- See the `package.json` file for a list of JavaScript dependencies
- npm
- Python 3

## Browser and Device Support

The application is usable on both mobile devices and desktop computers. Some features such as the media controller are not available on small displays. Automatic scaling is not implemented for large high resolution displays. To improve usability on such displays manually zoom the web page.

Known unsupported browsers include all versions of Internet Explorer.
