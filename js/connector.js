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
    $.each(JSONdata, function (index, row) {
        dataTags = "data-starttime='" + row.Start + "' ";
        dataTags += "data-endtime='" + row.Slut + "' ";
        dataTags += "data-description='" + row.Beskrivning + "' ";
        dataTags += "data-location='" + row.Plats + "'";
        row.Start = addMinutesClass(row.Start);
        row.Slut = addMinutesClass(row.Slut);
        meetingrow = "<li class='meeting'" + dataTags + " id='" + row.Hash + "'><div><span class='time'>" + row.Start + " - " + row.Slut + "</span>";
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

function formatListItem(row) {
    var formatedLI = "";
    var dataTags = "data-starttime='" + row.Start + "' ";
    dataTags += "data-endtime='" + row.Slut + "' ";
    dataTags += "data-description='" + row.Beskrivning + "' ";
    dataTags += "data-location='" + row.Plats + "'";
    row.Start = addMinutesClass(row.Start);
    row.Slut = addMinutesClass(row.Slut);
    formatedLI = "<li class='meeting'" + dataTags + " id='" + row.Hash + "'><div><span class='time'>" + row.Start + " - " + row.Slut + "</span>";
    formatedLI += "<span class='desc'>" + row.Beskrivning + "</span>" + "<span class='location'>" + row.Plats + "</span></div></li>";
    return formatedLI;
}

function insertMeeting(row) {
    var allMeetings = $(".meeting").toArray();
    var i = 0;
    var insertBefore = 0;
    if (allMeetings.length === 0) {
        $(".meetingsList").append(formatListItem(row));
    } else {
        for (i = 0; i < allMeetings.length; i += 1) {
            // console.log("This should be ordered: " + allMeetings[i].dataset.starttime + ", " + row.Start);
            if (Number(allMeetings[i].dataset.starttime) > Number(row.Start) && insertBefore === 0) {
                console.log("This was later than that: " + allMeetings[i].dataset.starttime + " " + row.Start);
                insertBefore = i;
            }
        }
        // console.log("Index: " + insertBefore);
        if (insertBefore !== 0) {
            $(formatListItem(row)).insertBefore("#" + allMeetings[insertBefore].id);
        } else {
            $(".meetingsList").append(formatListItem(row));
        }
    }
}

function updatePage(refreshTimer) {
    renderStatus(config.messageloading);
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
            result = removeOldMeeting(result);
        }

                $.each(result, function (index, row) {
            id = row.Start + row.Slut + row.Beskrivning + row.Lokal;
            id = id.hashCode();
            hashArrayOfNewData.push(id);
        });
        console.log(hashArrayOfNewData);
        // Check if any meeting in the page no longer exist in the source data and should be removed
        $.each($(".meeting"), function (index, obj) {
            console.log(obj.id);
            if (hashArrayOfNewData.indexOf(obj.id) !== -1) {
                console.log(obj.id + " exists in hash array ang gets to stay");
            } else {
                $("#" + obj.id).remove();
                console.log("Meeting removed");
            }
        });


        // Check all fetched meetings to see if any new should be added
        $.each(result, function (index, row) {
            hash = row.Start + row.Slut + row.Beskrivning + row.Plats;
            row.Hash = hash.hashCode();
            // If the hash-id of a meeting doesn't exist: create the meeting
            if (!$("#" + row.Hash).length) {
                // $(".meetingsList").append(formatListItem(row));
                //console.log("This row is not yet in dataset: " + row.Start + row.Slut + row.Beskrivning);
                insertMeeting(row);
            }
        });

        //renderMeetings(createMeetingsHTML(result));

        renderStatus(time.getHours() + ":" + minutes);
        // Running the script sorts the google sheet in place - annoying when adding new meetings so don't after 15 o clock
        if (time.getHours() > 17) {
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