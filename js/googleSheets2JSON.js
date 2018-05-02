"use strict";

function googleSheet2JSON(sheet, e) {

    var colStartIndex = 1;
    var lastRow = sheet.getLastRow();
    var values = [];
    var rowIndex = 2;
    var jsonArray = [];
    var i = 0;
    var j = 0;
    var line = [];
    var json = Object.create(null);
    var headerCellsRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    var firstRowValues = headerCellsRange.getValues();
    var titleColumns = firstRowValues[0];
    var mainDataRange = sheet.getRange(rowIndex, colStartIndex, lastRow - 1, sheet.getLastColumn());
    mainDataRange.sort(1);
    values = mainDataRange.getValues();
    // Create JSON data from the values array and header row
    for (i = 0; i < values.length; i += 1) {
        line = values[i];
        json = Object.create(null);
        for (j = 0; j < titleColumns.length; j += 1) {
            json[titleColumns[j]] = line[j];
        }
        jsonArray.push(json);
    }
    return jsonArray;
}

function doGet(e) {

    var sheetName = "Sheet1";
    var sheetId = "10kNXSw-fAqzLD_cttRcpX5bl6hiDJms3lP-SsfKnJB4";
    var book = SpreadsheetApp.openById(sheetId);
    var sheet = book.getSheetByName(sheetName);
    var json = googleSheet2JSON(sheet, e);

    return ContentService
        .createTextOutput(JSON.stringify(json))
        .setMimeType(ContentService.MimeType.JSON);
}