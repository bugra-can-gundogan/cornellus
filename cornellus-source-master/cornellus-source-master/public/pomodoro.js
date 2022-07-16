const countdownElement = document.getElementById("countdown");
const slogan = document.getElementById("pomodoroslogan");
const sandwatch = document.getElementById("pomo-image-id");
var startingminutes = 25;
var time = startingminutes * 60;
var timerX;

var studyCount = 0;
var breakCount = 0;


function clockplay(){
    var audio = new Audio("audio/clock2s.mp3");
    audio.play();
}

function changeSlogan(text){
    slogan.innerText = text;
}

function changeSandwatchClass(active){
    if(active){
        sandwatch.className = "pomo-image-active";
    }else{
        sandwatch.className = "pomo-image";
    }
}

function fullpomodoro() {
    clockplay();
    stopTimer();
    studyCount++;
    var today = new Date();
    var timexxx = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(timexxx);
    twentyfstudyforfull();
}

function twentyfstudy() {
    stopTimer();
    startingminutes = 25;
    time = startingminutes * 60;
    timerX = setInterval(updateCountdown, 1000);
    changeSlogan("STUDY TIME!");
    changeSandwatchClass(true);
}

function thirtyminbreak() {
    stopTimer();
    startingminutes = 30;
    time = startingminutes * 60;
    timerX = setInterval(updateCountdown, 1000);
    changeSlogan("REST...");
    changeSandwatchClass(true);
}

function fivebreak() {
    stopTimer();
    startingminutes = 5;
    time = startingminutes * 60;
    timerX = setInterval(updateCountdown, 1000);
    changeSlogan("REST...");
    changeSandwatchClass(true);
}

function onebreak() {
    stopTimer();
    startingminutes = 1;
    time = startingminutes * 60;
    timerX = setInterval(updateCountdown, 1000);
    changeSlogan("REST...");
    changeSandwatchClass(true);
}

function updateForFull() {
    if (time <= 0) {
        clockplay();
        stopForFull();
    }
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    countdownElement.innerHTML = `${minutes}:${seconds}`;
    time--;
}

function updateCountdown() {
    if (time <= 0) {
        stopTimer();
        clockplay();
    }
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    countdownElement.innerHTML = `${minutes}:${seconds}`;
    time--;
}

function clearTimer() {
    stopTimer();
}

function stopForFull() {
    if (timerX != null) {
        if (studyCount == breakCount && studyCount == 4) {
            var today = new Date();
            var timexxx = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            console.log(timexxx);
            console.log("study: " + studyCount + " || " + "break : " + breakCount);
            stopTimer();
            clockplay();
            return;
        }
        if (studyCount > breakCount) {
            if (breakCount == 3) {
                breakCount++;
                thirtyminbreakforfull();
            } else {
                breakCount++;
                fivebreakforfull();
            }
        }
        else {
            studyCount++
            twentyfstudyforfull();
        }
    }
}



function twentyfstudyforfull() {
    stopTimer();
    startingminutes = 25;
    time = startingminutes * 60;
    timerX = setInterval(updateForFull, 1000);
    changeSlogan("STUDY TIME!");
    changeSandwatchClass(true);
}

function fivebreakforfull() {
    stopTimer();
    startingminutes = 5;
    time = startingminutes * 60;
    timerX = setInterval(updateForFull, 1000);
    changeSlogan("REST...");
    changeSandwatchClass(true);
}


function thirtyminbreakforfull() {
    stopTimer();
    startingminutes = 30;
    time = startingminutes * 60;
    timerX = setInterval(updateForFull, 1000);
    changeSlogan("REST...");
    changeSandwatchClass(true);
}

function stopTimer() {
    if (timerX != null) {
        clearInterval(timerX);
        changeSandwatchClass(false);
    }
}

function addnewtaskitem() {
    const taskli = document.getElementById("taskli");
    const input = document.getElementById("new-li-input").value;
    if (input.length == 0) {
        alert("You didn't write anything.");
    }

    var newd = document.createElement("div");
    newd.className = "list-item";

    var newp = document.createElement("p");
    newp.innerText = input;

    var newi = document.createElement("i");
    newi.className = "far fa-check-square";
    newi.addEventListener('click', event => {
        if (newi.className.includes("fas")) {
            parent = newi.parentElement;
            elemp = parent.firstElementChild;
            elemp.style.textDecoration = "none";
            newi.className = "far fa-check-square";
            newi.style.color = "black";
        } else {
            parent = newi.parentElement;
            elemp = parent.firstElementChild;
            elemp.style.textDecoration = "line-through";
            newi.className = "fas fa-check-square";
            newi.style.color = "green";
        }
    });

    newd.appendChild(newp);
    newd.appendChild(newi);
    taskli.appendChild(newd);
}

document.querySelectorAll('.fa-check-square').forEach(item => {
    item.addEventListener('click', event => {
        if (item.className.includes("fas")) {
            parent = item.parentElement;
            elemp = parent.firstElementChild;
            elemp.style.textDecoration = "none";
            item.className = "far fa-check-square";
            item.style.color = "black";
        } else {
            parent = item.parentElement;
            elemp = parent.firstElementChild;
            elemp.style.textDecoration = "line-through";
            item.className = "fas fa-check-square";
            item.style.color = "green";
        }
    });
});
