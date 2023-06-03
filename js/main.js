'use strict'
// not done yet!
// TODO - clean img inside td and make it fill the div (shron's lec)

var  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secPassed: 0
}

var gLives = 0
const MAX_LIVES = 3
var gIsFirstClick = false



const   SMILE = '😊', AWAITING_DOOM = '😮',
        DEAD = '😵', WON_GAME = '😎'
const   FULL_HEART = '❤️', EMPTY_HEART = '🤍'
// const MINE_IMG = '<img class="mine-img" src="src/mine3.png">'
// HELLO THERE DEAR TUTOR - for some reason mines aren't always shown when using regular hints. no idea why.
// I will forever owe you if you can find out why
const MINE_EMOJI = '☠️'

function onInit(size = gLvl.SIZE, mines = gLvl.MINES) {
    initParameters(size, mines)
    buildEmptyBoard()
    renderBoard()
    initBonuses()
}

function initParameters(size, mines) {
    gLvl.SIZE = size
    gLvl.MINES = mines
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secPassed: 0
    }
    gIsFirstClick = false
    gBoard = []
    stopTimer()
    document.getElementById('timer').innerText = gGame.secPassed
    
    document.querySelector('.game-emoji').innerText = SMILE
    document.querySelector('.mines-guess').innerText = mines
    document.querySelector('.tiles-exposed').innerText = '0'
    document.querySelector('.restart-container').innerHTML = ''

    for (gLives = 0 ; gLives < MAX_LIVES ; gLives++) {
        document.querySelector(`#life${gLives}`).innerText = FULL_HEART
    }
    gLives = 0
}

function onCellClicked(elCell) {
    var i = +elCell.dataset.i
    var j = +elCell.dataset.j

    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMarked) return
    // if user want to show a tile, they should first unmark (safety in case of missclicks)

    // console.log('on Cell click');

    // set timer on if isFirstClick
    if (!gIsFirstClick) {
        gIsFirstClick = true
        buildBoard({i, j})
        startTimer()
    }

    exposeCell(gBoard, elCell, i, j)
    // i, j of type number
}

// render a single cell
function renderCell(elCell, i, j) {

    if (gBoard[i][j].isMine) {
        // debugger
        // showCell(gBoard, elCell, i, j, true)
        checkGameOver()
        return
    }
    if (gBoard[i][j].minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j)
        return
    }
    elCell.classList.add(`num${gBoard[i][j].minesAroundCount}`)
    elCell.innerText = gBoard[i][j].minesAroundCount
    checkGameOver()
}

// a recursive function meant to check all negs
function expandShown(board, elCell, rowIdx, colIdx) {
    
    for (let i = rowIdx - 1 ; i <= rowIdx + 1 ; i++) {

        if (i < 0 || i >= gLvl.SIZE) continue
        // if is out of range

        for (let j = colIdx - 1 ; j <= colIdx + 1 ; j++) {

            if (j < 0 || j >= gLvl.SIZE) continue
            // if is out of range
            if (i === rowIdx && j === colIdx) continue
            // if currCell is root cell
            if (board[i][j].isShown || board[i][j].isMarked) continue
            // if currcell is already shown

            var currElCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            exposeCell(board, currElCell, i, j)

            if (board[i][j].minesAroundCount === 0) {
                expandShown(board, currElCell, i, j)
            }
            else renderCell(currElCell, i, j)
        }
    }

}

function onCellMarked(ev) {
    var elCell = ev.target
    // catch element
    ev.preventDefault()
    // cancel default menu
    var i = +elCell.dataset.i
    var j = +elCell.dataset.j
    // change to type number

    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return

    // if (!gIsFirstClick) {
    // // set timer on if isFirstClick
    //     gIsFirstClick = true
    //     startTimer()
    // }
    
    // toggle isMarked
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked

    if (gBoard[i][j].isMarked) {
        gGame.markedCount++
        // console.log('(gLvl - gGame.markedCount)', (gLvl - gGame.markedCount))
        document.querySelector('.mines-guess').innerText = (gLvl.MINES - gGame.markedCount).toString()
        elCell.innerText = FLAG_EMOJI
    }
    else {
        gGame.markedCount--
        // console.log('(gLvl - gGame.markedCount)', (gLvl - gGame.markedCount))
        document.querySelector('.mines-guess').innerText = (gLvl.MINES - gGame.markedCount).toString()
        elCell.innerHTML = EMPTY
    }
    checkGameOver()   
}

function checkGameOver() {
    // debugger
    // var allShownNum = gLvl.SIZE*gLvl.SIZE - gLvl.MINES
    if (((gGame.markedCount + gGame.shownCount - gLives) === gLvl.SIZE*gLvl.SIZE) && gGame.isOn && gLvl.MINES - gGame.markedCount >= 0) {
        document.querySelector('.game-emoji').innerText = WON_GAME
        gameOver()
        // TODO add winning annimation
    }
    else if (gLives === 3) {
        document.querySelector('.game-emoji').innerText = DEAD
        gameOver()
    }
}

function gameOver() {
    gGame.isOn = false
    stopTimer()
    var elBtn = document.querySelector('.restart-container')
    elBtn.innerHTML = `</br><button onclick="onInit(${gLvl.SIZE}, ${gLvl.MINES})">restart</button>`
}

function exposeCell(board, elCell, i, j) {
    if (board[i][j].isMine) {
        gGame.markedCount++
        elCell.innerText = MINE_EMOJI
        document.querySelector(`#life${gLives}`).innerText = EMPTY_HEART
        gLives++
        document.querySelector('.mines-guess').innerText = (gLvl.MINES - gGame.markedCount).toString()
    }
    elCell.classList.add('shown')
    board[+i][+j].isShown = true
    document.querySelector('.tiles-exposed').innerText = ++gGame.shownCount
    renderCell(elCell, i, j)
}

// works for chrome, couldn't find how to check for other browsers mdn shows it works for all
function replaceFace(ev, i, j) {
    // console.log(ev)
    if (gBoard[+i][+j].isShown || !gGame.isOn) return
    if (ev.button === 0 && ev.buttons === 1 && ev.which === 1) {
        document.querySelector('.game-emoji').innerText = AWAITING_DOOM
    }
}
function returnFace(ev, i, j) {
    // console.log(ev)
    if (gBoard[+i][+j].isShown || !gGame.isOn) return
    if (ev.button === 0 && ev.buttons === 0 && ev.which === 1) {
        document.querySelector('.game-emoji').innerText = SMILE
    }
}