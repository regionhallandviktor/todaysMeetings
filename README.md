# todaysMeetings
A one off display of todays meetings

## Architecture
Meetings are added in a Google spreadsheet document and the data is validated there.
A Google apps script picks up the data from the spreadsheet and exposes it on the web as JSON
The master branch of this repository is exposed as a github.io-page and creates the web frontend. Changes to the data is done by changing the spreadsheet, while changes to the frontend is made by comitting code to the master-branch.

URL of JSON data: https://script.google.com/macros/s/AKfycbw1eigx4xwbPB6MeoKmr1Pt0AuEouiDC5nlvn7nKjGOpCaRVA8a/exec

URL of current installation: https://regionhallandviktor.github.io/todaysMeetings/

## Installation
To run a screen of your own do the following: 
* Create a google sheet
* Create a Google Apps Script with the content of server/googleSheets2JSON.js
* Update this file with the relevant sheetId and sheetName info
* Publish the Google apps script as a web app 
* Put the html and connector.js files where you want them 
* Update connector.js with the URL of your web app. 