# todaysMeetings
A one off display of todays meetings

## Architecture
Meetings are added in a Google spreadsheet document
A Google apps script picks up the data from the spreadsheet and exposes it on the web as JSON
This master-branch of this repository is exposed as a github.io-page and creates the web frontend. Changes to the data is done by changing the spreadsheet, while changes to the frontend is made by comitting code to the master-branch. 

URL of JSON data: https://script.google.com/macros/s/AKfycbw1eigx4xwbPB6MeoKmr1Pt0AuEouiDC5nlvn7nKjGOpCaRVA8a/exec

