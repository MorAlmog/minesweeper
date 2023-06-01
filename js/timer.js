var gStartTime
var gTimerInterval

function stopTimer() {
    clearInterval(gTimerInterval)
}

function startTimer() {
    gStartTime = Date.now()
    gTimerInterval = setInterval(updateTimer, 1)
}

function updateTimer() {
    var currentTime = Date.now()
    var elapsedTime = currentTime - gStartTime
    gGame.secPassed = Math.floor((elapsedTime / 1000))
    document.getElementById('timer').innerText = gGame.secPassed
}

function clearTimer() {
    document.getElementById('timer').innerText = 0
    gGame.secPassed = 0
}