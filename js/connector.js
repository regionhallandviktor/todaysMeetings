"use strict";

function removeFinishedMeetingsFrom(JSONdata) {
    var result = [];
    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    var time = "";
    var minutes = "";
    var hours = "";
    $.each(JSONdata, function (index, row) {
        time = row.Slut.toString();
        minutes = time.substring(time.length - 2);
        hours = time.substring(0, time.length - 2);
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

function addMinutesClassToString(time) {
    time = time.toString();
    var minutes = time.substring(time.length - 2);
    var hours = time.substring(0, time.length - 2);
    return hours + "<span class='minutes'>" + minutes + "</span>";
}

function createMeetingsHTML(JSONdata) {
    var snippet = "<ul>";
    var meetingrow = "";
    var dataTags = "";
    $.each(JSONdata, function (index, row) {
        dataTags = "data-starttime='" + row.Start + "' ";
        dataTags += "data-endtime='" + row.Slut + "' ";
        dataTags += "data-description='" + row.Beskrivning + "' ";
        dataTags += "data-location='" + row.Plats + "'";
        row.Start = addMinutesClassToString(row.Start);
        row.Slut = addMinutesClassToString(row.Slut);
        meetingrow = "<li class='meeting'" + dataTags + " id='" + row.Hash + "'><div><span class='time'>" + row.Start + " - " + row.Slut + "</span>";
        meetingrow += "<span class='desc'>" + row.Beskrivning + "</span>" + "<span class='location'>" + row.Plats + "</span></div></li>";
        snippet += meetingrow;
        meetingrow = "";
    });
    snippet += "</ul>";
    return snippet;
}

function renderToMeetingsContainer(htmlSnippet) {
    $("#meetingsContainer").html(htmlSnippet);
}

function renderToStatusField(htmlSnippet) {
    $("#statusfield").html(htmlSnippet);
}

function createListItemForMeeting(row) {
    var formatedLI = "";
    var dataTags = "data-starttime='" + row.Start + "' ";
    dataTags += "data-endtime='" + row.Slut + "' ";
    dataTags += "data-description='" + row.Beskrivning + "' ";
    dataTags += "data-location='" + row.Plats + "'";
    row.Start = addMinutesClassToString(row.Start);
    row.Slut = addMinutesClassToString(row.Slut);
    formatedLI = "<li class='meeting'" + dataTags + " id='" + row.Hash + "'><div><span class='time'>" + row.Start + " - " + row.Slut + "</span>";
    formatedLI += "<span class='desc'>" + row.Beskrivning + "</span>" + "<span class='location'>" + row.Plats + "</span></div></li>";
    return formatedLI;
}

function insertMeeting(jsonItem) {
    var allMeetings = $(".meeting").toArray();
    var i = 0;
    var insertBefore = 0;
    if (allMeetings.length === 0) {
        $(".meetingsList").append(createListItemForMeeting(jsonItem));
    } else {
        for (i = 0; i < allMeetings.length; i += 1) {
            if (Number(allMeetings[i].dataset.starttime) > Number(jsonItem.Start) && insertBefore === 0) {
                insertBefore = i;
            }
        }
        if (insertBefore !== 0) {
            $(createListItemForMeeting(jsonItem)).insertBefore("#" + allMeetings[insertBefore].id);
        } else {
            $(".meetingsList").append(createListItemForMeeting(jsonItem));
        }
    }
}

function update() {
    renderToStatusField(config.messageloading);
    $.getJSON(config.reportUrl, function (result) {
        var time = new Date();
        var minutes = time.getMinutes();
        var hash = "";
        var hashArrayOfNewData = [];
        var id = "";
        minutes = minutes > 9
            ? minutes
            : "0" + minutes;
        if (helpers.getParameterByName("hidePreviousMeetings") === "true") {
            result = removeFinishedMeetingsFrom(result);
        }

        $.each(result, function (index, row) {
            id = row.Start + row.Slut + row.Beskrivning + row.Lokal;
            id = id.hashCode();
            hashArrayOfNewData.push(id);
        });

        // Remove meeting on page no longer present in source data
        $.each($(".meeting"), function (index, obj) {
            if (hashArrayOfNewData.indexOf(obj.id) === -1) {
                $("#" + obj.id).remove();
            }
        });

        // Each fetch sorts google sheet. Stop so staff can add tomorrow meetings.
        if (time.getHours() < config.hourToStopUpdates) {
            $.each(result, function (index, row) {
                hash = row.Start + row.Slut + row.Beskrivning + row.Plats;
                row.Hash = hash.hashCode();
                if (!$("#" + row.Hash).length && row.Hash !== 0) {
                    insertMeeting(row);
                }
            });
        } else {
            renderToStatusField(config.messageUpdatesPaused);
        }

        renderToStatusField(time.getHours() + ":" + minutes);
    })
        .fail(function () {
            var errorMessage = "<ul><li class='meeting'>" + config.messageLoadError + "</li></ul>";
            renderToMeetingsContainer(errorMessage);
            renderToStatusField(config.messageStatusLoadError);
        });
}

$(document).ready(function () {
    update();
    setInterval(update, config.refreshInterval);
});