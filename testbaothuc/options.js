var audio = null;
function saveSettings()
{
	localStorage["beep"] = document.getElementById("beep").checked?"1":"0";
	localStorage["notify"] = document.getElementById("notify").checked ? "1" : "0";
	localStorage["alarmSound"] = document.getElementById("alarmSound").value;
	document.getElementById("saveMsg").innerHTML = "Đã lưu.";
}

function playSound() {
    if (audio != null) audio.pause();
    audio = new Audio(document.getElementById("alarmSound").value);
    audio.play();
}

document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("beep").checked = localStorage["beep"]=="0"?false:true;
	document.getElementById("notify").checked = localStorage["notify"] == "0" ? false : true;
	var str = localStorage["alarmSound"];
	if (str) document.getElementById("alarmSound").value = str;
	document.getElementById("playImg").addEventListener("click", playSound);
    document.getElementById("saveButton").addEventListener("click", saveSettings);
});