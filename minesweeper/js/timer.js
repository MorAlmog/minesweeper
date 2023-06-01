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
    var formattedTime = (elapsedTime / 1000).toFixed(3)
    document.getElementById('timer').textContent = formattedTime
}

function clearTimer() {
    document.getElementById('timer').textContent = (0 / 1000).toFixed(3)
}