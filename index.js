// ==UserScript==
// @name        [Pokeclicker] Time Offset
// @namespace   Pokeclicker Scripts
// @match       https://www.pokeclicker.com/
// @grant       none
// @version     1.1
// @author      Lucky
// @description Adjusts time with an optionnal offset
// ==/UserScript==


var timeAdjuster;
var time = 0;
Date.prototype.basicGetHours = Date.prototype.getHours;

function initChangeTime(){
    var d = new Date();

    var timeChangerHTML = document.createElement("div");
    timeChangerHTML.id = "timeSelector";
    timeChangerHTML.className = "card sortable border-secondary mb-3";
    timeChangerHTML.setAttribute("data-toggle","collapse");

    timeChangerHTML.innerHTML = `
    <div class="card-header p-0" data-toggle="collapse" href="#timeSelectorBody">
        <span>Change time offset</span>
    </div>
    <div id="timeSelectorBody" class="card-body p-0 show table-responsive">
    <label for="time-adjust">Offset <input id="time-adjust" type="checkbox" style="position: relative;top: 2px;"></label>
    <input id="timeToChange" class="outline-dark form-control form-control-number" type="number" value="`+parseInt(time)+`" min="0" max="24" /></div>`;
    document.getElementById("pokeballSelector").after(timeChangerHTML);
    document.getElementById('time-adjust').addEventListener('click', event => changeAdjust(event.target));
    document.getElementById('timeToChange').addEventListener('change', event => changeTime(event.target));

    if (timeAdjuster == "true") {
        document.getElementById('time-adjust').checked = true;
        adjustTime();
    }

    function changeAdjust(ele) {
        if (timeAdjuster == "true") {
            timeAdjuster = "false"
        } else {
            timeAdjuster = "true"
        }
        localStorage.setItem("timeAdjuster", timeAdjuster);
        adjustTime();
    }

    function changeTime(ele){
        time = parseInt(ele.value);
        localStorage.setItem("TimeToChange", ele.value);
        adjustTime();
    }

    function adjustTime() {
        if(timeAdjuster == "true"){
            Date.prototype.getHours = function(){
                console.log(new Date().basicGetHours() + time);
                return (new Date().basicGetHours() + time) % 24;
            };
        } else {
            Date.prototype.getHours = Date.prototype.basicGetHours;
        }
    }
}

if (localStorage.getItem('timeAdjuster') == null) {
    localStorage.setItem("timeAdjuster", "false");
}
timeAdjuster = localStorage.getItem('timeAdjuster');
if (localStorage.getItem('TimeToChange') == null) {
    localStorage.setItem("TimeToChange", "0");
}
time = parseInt(localStorage.getItem('TimeToChange'));

function loadScript(){
    var oldInit = Preload.hideSplashScreen

    Preload.hideSplashScreen = function(){
        var result = oldInit.apply(this, arguments);
        initChangeTime();
        return result;
    }
}

var scriptName = 'changeTime';

if (document.getElementById('scriptHandler') != undefined){
    var scriptElement = document.createElement('div')
    scriptElement.id = scriptName
    document.getElementById('scriptHandler').appendChild(scriptElement)
    if (localStorage.getItem(scriptName) != null){
        if (localStorage.getItem(scriptName) == 'true'){
            loadScript()
        }
    }
    else{
        localStorage.setItem(scriptName, 'true')
        loadScript()
    }
}
else{
    loadScript();
}
