"use strict";

function addMinutesClass(time) {
    time = time.toString();
    return time.substring(0, 2) + "<span class='minutes'>" + time.substring(2, 4) + "</span>";
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

$(document).ready(function () {
    var reportUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=sLZ5_UXKWkknzBykaAwONIVZftR6ab-COCbYHdoGmdHbgNVq-JETbhytClvm_Ia0uAioLpk1EenYdsLc3lmOFcdOwHi1gy8Em5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnPkmXcN78X7GNaRmWHhfpJJZ9UDB9jR0TZHzQmGtMoqSG5FSnj2YaWegAcovC2ObEWqreFRoDX_5&lib=MQv25UDfSmrECOrn40GdUGXfCTEkP8scq";
    $.getJSON(reportUrl, function (result) {
        var snippet = createMeetingsHTML(result);
        renderMeetings(snippet);
        setInterval(function () {
            $.getJSON(reportUrl, function (result) {
                snippet = createMeetingsHTML(result);
                renderMeetings(snippet);
            });
        }, 60000);
    });
});