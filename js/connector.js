"use strict";

function removeOldMeeting(indata) {
    var result = [];
    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    console.log(currentHours, currentMinutes);
    var time = "";
    $.each(indata, function (index, row) {
        time = row.Slut.toString();
        var minutes = time.substring(time.length - 2);
        var hours = time.substring(0, time.length - 2);
        if (Number(hours) > Number(currentHours)) {
            result.push(row);
        } else if (Number(hours) === Number(currentHours)) {
            if (Number(minutes) > Number(currentMinutes)) {
                result.push(row);
            }
        }
    });
    return result;
}

function getParameterByName(name, url) {
    if (!url) { 
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return "";
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function addMinutesClass(time) {
    time = time.toString();
    var minutes = time.substring(time.length - 2);
    var hours = time.substring(0, time.length - 2);
    return hours + "<span class='minutes'>" + minutes + "</span>";
}

function createMeetingsHTML(JSONdata) {
    var snippet = "<ul>";
    var meetingrow = "";
    $.each(JSONdata, function (index, row) {
        row.Start = addMinutesClass(row.Start);
        row.Slut = addMinutesClass(row.Slut);
        meetingrow = "<li class='meeting'><div><span class='time'>" + row.Start + " - " + row.Slut + "</span>";
        meetingrow += "<span class='desc'>" + row.Beskrivning + "</span>" + "<span class='location'>" + row.Plats + "</span></div></li>";
        snippet += meetingrow;
        meetingrow = "";
    });
    snippet += "</ul>";
    return snippet;
}

function renderMeetings(htmlSnippet) {
    $("#meetingsContainer").html(htmlSnippet);
}

function updatePage(refreshTimer) {
    var reportUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=sLZ5_UXKWkknzBykaAwONIVZftR6ab-COCbYHdoGmdHbgNVq-JETbhytClvm_Ia0uAioLpk1EenYdsLc3lmOFcdOwHi1gy8Em5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnPkmXcN78X7GNaRmWHhfpJJZ9UDB9jR0TZHzQmGtMoqSG5FSnj2YaWegAcovC2ObEWqreFRoDX_5&lib=MQv25UDfSmrECOrn40GdUGXfCTEkP8scq";
    var loadingMessage = "<ul><li class='meeting'>Möten laddas...</li></ul>";
    renderMeetings(loadingMessage);
    $.getJSON(reportUrl, function (result) {
        if (getParameterByName("hidePreviousMeetings") === "true") {
            result = removeOldMeeting(result);
        }
        var snippet = createMeetingsHTML(result);
        renderMeetings(snippet);
        var time = new Date();
        // Running the script sorts the google sheet in place - annoying when adding new meetings so don't after 15 o clock
        if (time.getHours() > 15) {
            clearInterval(refreshTimer);
        }
    })
        .fail(function () {
            var errorMessage = "<ul><li class='meeting'>Något gick fel - möten kunde inte laddas. Kontakta intranätservice om felet kvarstår.</li></ul>";
            renderMeetings(errorMessage);
        });
}

$(document).ready(function () {
    updatePage();
    var refreshTimer = setInterval(function () {
        updatePage(refreshTimer);
    }, 60000);
});