
chrome.alarms.onAlarm.addListener(function (alarm) { 
	var str = localStorage["MSG" + alarm.name];
	if (!str || str.length == 0) str = "Đã đến thời gian báo thức ";
	if (localStorage["notify"]!="0")
	{
		var notification = chrome.notifications.create("notifications", 
			{ type: "basic", iconUrl: "icon-128.png", title: "Neon Alams", 
			message: str, requireInteraction: true });		
	}
	if (localStorage["beep"]!="0")
	{
	    //var filename = localStorage["alarmSound"] || "cuckoo.ogg";
	    //if (!filename) filename = "cuckoo.ogg";
	    var audio = new Audio(localStorage["alarmSound"] || "cuckoo.ogg");
	    audio.play();
	}
	chrome.alarms.getAll(function (alarms) {
        if (alarms.length > 0) {
            var nextAlarm = Number.MAX_VALUE;
            for (var i = 0; i < alarms.length; i++)
                if (alarms[i].scheduledTime < nextAlarm) nextAlarm = alarms[i].scheduledTime;
            var zeitstr = new Date(nextAlarm).toLocaleTimeString();
            var pos = zeitstr.indexOf(":");
            chrome.browserAction.setBadgeText({ text: zeitstr.substring(0, pos) + zeitstr.substring(pos + 1, pos + 3) });
        } else chrome.browserAction.setBadgeText({ text: "" });
    });    
});