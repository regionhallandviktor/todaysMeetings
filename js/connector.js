"use strict";

function removeOldMeeting(indata) {
    var result = [];
    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
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

function addMinutesClass(time) {
    time = time.toString();
    var minutes = time.substring(time.length - 2);
    var hours = time.substring(0, time.length - 2);
    return hours + "<span class='minutes'>" + minutes + "</span>";
}

function createMeetingsHTML(JSONdata) {
    var snippet = "<ul>";
    var meetingrow = "";
    var dataTags = "";
    var hash = "";
    $.each(JSONdata, function (index, row) {
        hash = row.Start + row.Slut + row.Beskrivning + row.Plats;
        hash = hash.hashCode();
        dataTags = "data-starttime='" + row.Start + "' ";
        dataTags += "data-endtime='" + row.Slut + "' ";
        dataTags += "data-description='" + row.Beskrivning + "' ";
        dataTags += "data-location='" + row.Plats + "'";
        row.Start = addMinutesClass(row.Start);
        row.Slut = addMinutesClass(row.Slut);
        meetingrow = "<li class='meeting'" + dataTags + " id='" + hash + "'><div><span class='time'>" + row.Start + " - " + row.Slut + "</span>";
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

function renderStatus(message) {
    $("#statusfield").html(message);
}

function updatePage(refreshTimer) {
    renderStatus(config.messageloading);
    $.getJSON(config.reportUrl, function (result) {
        var time = new Date();
        var minutes = time.getMinutes();
        minutes = minutes > 9
            ? minutes
            : "0" + minutes;
        if (helpers.getParameterByName("hidePreviousMeetings") === "true") {
            result = removeOldMeeting(result);
        }
        renderMeetings(createMeetingsHTML(result));
        renderStatus(time.getHours() + ":" + minutes);
        // Running the script sorts the google sheet in place - annoying when adding new meetings so don't after 15 o clock
        if (time.getHours() > 15) {
            clearInterval(refreshTimer);
            renderStatus(config.messageUpdatesPaused);
        }
    })
        .fail(function () {
            var errorMessage = "<ul><li class='meeting'>" + config.messageLoadError + "</li></ul>";
            renderMeetings(errorMessage);
            renderStatus(config.messageStatusLoadError);
        });
}

$(document).ready(function () {
    updatePage();
    var refreshTimer = setInterval(function () {
        updatePage(refreshTimer);
    }, config.refreshInterval);
});