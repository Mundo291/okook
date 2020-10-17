var alarmsArray = new Array();

function alarmDel(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    var arrid = parseInt(target.id.substr(1, 1));
    chrome.alarms.clear(alarmsArray[arrid].name);
    localStorage.removeItem("MSG" + alarmsArray[arrid].name);
    alarmsArray.splice(arrid, 1);
    if (alarmsArray.length == 9) {
        document.getElementById("ButtonAlarm").disabled = false;
        document.getElementById("ButtonCountdown").disabled = false;
    }
    showAlarms(false);
}

function showAlarms(sorting) {
    if (alarmsArray.length > 0) {
        if (sorting) alarmsArray.sort(function (a, b) {
            return a.time - b.time;
        });
        //var div = document.getElementById("alarmList");
        var htmlstr = '<br><table>';
        for (var i = 0; i < alarmsArray.length; i++) {
            //var datum = new Date(alarmsArray[i].time);
            var zeit = new Date(alarmsArray[i].time).toLocaleTimeString();
            //var pos = zeit.indexOf(":", 3);
            htmlstr += '<tr><td class="aTime">' + zeit.substring(0, zeit.indexOf(":", 3)) +
                '</td><td style="width:100%"><input class="aText" type="text" value="' + alarmsArray[i].text +
                '" readonly></td><td class="redx" id="x' + i.toString() + '">&#x00D7;</td></tr>';
        }
        document.getElementById("alarmList").innerHTML = htmlstr + "</table>";
        var xarr = document.getElementsByClassName("redx");
        for (var i = 0; i < xarr.length; i++)
            xarr[i].addEventListener("click", alarmDel, false);

        //var zeitstr = alarmsArray[0].date.toLocaleTimeString();
        var zeitstr = new Date(alarmsArray[0].time).toLocaleTimeString();
        var pos = zeitstr.indexOf(":");
        //var showzeit = zeitstr.substring(0, pos) + zeitstr.substring(pos+1, pos+3);
        //if (pos == 1) showzeit = " " + showzeit;
        chrome.browserAction.setBadgeText({ text: zeitstr.substring(0, pos) + zeitstr.substring(pos + 1, pos + 3) });
    } else {
        document.getElementById("alarmList").innerHTML = "";
        chrome.browserAction.setBadgeText({ text: "" });
    }
}

function clickedAlarm() {
    var periode = document.getElementById("azeit").value;
    localStorage["lastAValue"] = periode;
    var ihour = parseInt(periode.substring(0, 2));
    var imins = parseInt(periode.substring(3));

    var alarmzeit = new Date();
    alarmzeit.setSeconds(0, 0);
    var ahour = alarmzeit.getHours();
    var amins = alarmzeit.getMinutes();

    if (ahour == ihour && amins > imins) { ihour = 24; imins = amins - imins; } else
    {
        if (ahour > ihour) ihour += 24 - ahour; else ihour -= ahour;
        if (amins > imins) { imins += 60 - amins; ihour--; } else imins -= amins;
    }
    //alarmzeit = new Date(alarmzeit.getTime() + ihour * 3600000 + imins * 60000);
    setAlarm(alarmzeit.getTime() + ihour * 3600000 + imins * 60000, document.getElementById("alarmMsg").value);
}

function clickedCountdown() {
    var imins = document.getElementById("czeit").value;
    if (imins < 1 || imins > 999) {
        alert("The countdown time must be a value between 1 and 999 minutes.");
    } else {
        localStorage["lastCValue"] = imins;
        //var alarmzeit = new Date(); //(alarmzeit.getTime() + ihour * 3600000 + imins * 60000)
        //setAlarm(alarmzeit, document.getElementById("alarmMsg").value);
        //alarmzeit = new Date(alarmzeit.getTime() + imins * 60000);
        setAlarm(Date.now() + imins * 60000, document.getElementById("alarmMsg").value);
    }
}

function setAlarm(alarmzeit, alarmmsg) {
    var aname = "alarm" + alarmsArray.length.toString();
    chrome.alarms.create(aname, { when: alarmzeit });
    alarmsArray.push({ name: aname, time: alarmzeit, text: alarmmsg });
    localStorage["MSG" + aname] = alarmmsg;
    if (alarmsArray.length == 30) {
        document.getElementById("ButtonAlarm").disabled = true;
        document.getElementById("ButtonCountdown").disabled = true;
    }
    showAlarms(true);
}

document.addEventListener("DOMContentLoaded", function () {
    /*
    alarmsArray.push({ name: "alarm2", date: new Date(99,5,24,13,33,0), text: "Ei kochen" });
    alarmsArray.push({ name: "alarm0", date: new Date(99,5,24,8,31,0), text: "August macht stark und hungrig" });
    alarmsArray.push({ name: "alarm1", date: new Date(99,5,24,12,32,0), text: "" });
    */
    chrome.browserAction.setBadgeBackgroundColor({ color: "#000" });
    chrome.alarms.getAll(function (alarms) {
        if (alarms.length > 0) {
            for (var i = 0; i < alarms.length; i++)
                alarmsArray.push({ name: alarms[i].name, time: alarms[i].scheduledTime, text: localStorage["MSG" + alarms[i].name] });
            if (alarmsArray.length == 10) {
                document.getElementById("ButtonAlarm").disabled = true;
                document.getElementById("ButtonCountdown").disabled = true;
            }
            showAlarms(true);
        }
    });
    var str = localStorage["lastAValue"];
    if (str) document.getElementById("azeit").value = str;
    str = localStorage["lastCValue"];
    if (str) document.getElementById("czeit").value = str;
    document.getElementById("ButtonAlarm").addEventListener("click", clickedAlarm);
    document.getElementById("ButtonCountdown").addEventListener("click", clickedCountdown);    
});

setInterval(()=>{
    const time = document.querySelector(".display #time");
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let day_night = "AM";
    if(hours > 12){
        day_night = "PM";
        hours = hours - 12;
    }
    if(seconds < 10){
        seconds = "0" + seconds;
    }
    if(minutes < 10){
        minutes = "0" + minutes;
    }
     if(hours < 10){
        hours = "0" + hours;
    }
    time.textContent = hours + ":" + minutes + ":" + seconds + " "+ day_night;
});
