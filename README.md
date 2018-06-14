# STUK Open Data Website

A web application for viewing FMI's open data radiation dose rate results.

## Setup

1. Clone the repository.

2. Install node.js which includes npm (node package manager).

3. Run 'npm install' to install the project's dependencies.

4. Run 'npm run build' to build the project for production.
   Run 'npm run dev' to build the project during development.
   The project is built in the 'dist' directory.

5. Create a copy of the file 'settings.example.json' and name it 'settings.json'.
   In the settings file, replace the FMI API key with your own.

6. Manually run or schedule the scripts in the 'dist/scripts' directory to get data.
