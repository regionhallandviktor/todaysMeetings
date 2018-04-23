$(document).ready(function () {
	var reportUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=sLZ5_UXKWkknzBykaAwONIVZftR6ab-COCbYHdoGmdHbgNVq-JETbhytClvm_Ia0uAioLpk1EenYdsLc3lmOFcdOwHi1gy8Em5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnPkmXcN78X7GNaRmWHhfpJJZ9UDB9jR0TZHzQmGtMoqSG5FSnj2YaWegAcovC2ObEWqreFRoDX_5&lib=MQv25UDfSmrECOrn40GdUGXfCTEkP8scq";
	$.getJSON(reportUrl, function (result) {
		console.log(result);
        var snippet = "<ul>";
        var meetingrow = "";
		$.each(result, function(index, row){
			meetingrow = "<li class='meeting'><div><span class='time'>" + row.Start + " - " + row.Slut + "</span>";
			meetingrow = meetingrow + "<span class='desc'>" + row.Beskrivning + "</span>"+ "<span class='location'>" + row.Plats + "</span></div></li>";
			snippet = snippet + meetingrow;
			meetingrow = "";
		});
		snippet = snippet + "</ul>"
		$("#meetingsContainer").append(snippet);
	});
});
