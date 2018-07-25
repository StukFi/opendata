# STUK Open Data Website

A web application for viewing STUK's open data radiation dose
rate results. The data is fetched from FMI's open data API.

## Setup

1. Clone the repository.

2. Install node.js which includes npm (node package manager).

3. Run 'npm install' to install the project's dependencies.

4. Run 'npm run build' to build the project for production.
   Run 'npm run dev' to build the project during development.
   The project is built in the 'dist' directory.

5. Manually run or schedule the scripts in the 'dist/scripts'
   directory to get data.

## Fetching data

The application does not contain any data by default. Data
must be fetched and processed by manually running or
scheduling scripts in the 'dist/scripts' directory. 

The 'get_data.py' script is used to fetch data. Run 'python
get_data.py --help' for specific usage instructions. The type
of data currently relevant to the application is 'dose_rates'.
The timespan argument is not yet implemented.

The 'generate_time_series.py' script generates time series
files from the fetched dose rate datasets. Previously
generated time series files must currently be manually
removed before running the script.




### *Optional: Authenticated FMI API requests*

If you wish to use authenticated API requests when 
data from FMI's open data portal, an API key must be used.
Follow the instructions at 
http://en.ilmatieteenlaitos.fi/open-data-manual to register
for an API key.

Once you have an API key, create a copy of the file
'settings.example.json' and name it 'settings.json'. In the
settings file, replace the FMI API key with your own. When
fetching data with the 'get_data.py' script, use the '-a' or
'--auth' argument to enable authentication.

## Usage

The web application's date and time selection widgets only
allow the selection of dates and times for which data has been
fetched using the application's backend scripts. The map
displays a dose rate dataset for the selected date and time.

Hovering the mouse cursor over a map feature opens a popup
displaying the name and dose rate of the associated
measurement site for the selected date and time. Clicking a
map feature opens a larger popup that additionally displays a
graph showing time series data for the selected measurement
site. Panning the graph causes it to automatically load in
more data for the visible dates if available. The graph
supports multiple ways of interaction, including panning
zooming, and range selection.

The map legend, located at the bottom of the application,
displays the application's dose rate ranges and their colors.
Individual dose rate ranges can be enabled or disabled to
filter the map features visible on the map. This is achieved
by clicking a dose rate range block on the map legend.

## Technical details

Browsers that are known to *not* work: Internet Explorer.

Python version 3.

NodeJS version 8 or newer.