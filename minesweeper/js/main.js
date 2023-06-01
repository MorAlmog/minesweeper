'use strict'
// 4, 2 -- 8, 14 -- 12, 32
var gBoard = []
var gLvl = {
    SIZE: 4,
    MINES: 2
}
var  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secPassed: 0
}

const MINE_IMG = '<img src="src/mine.jpg">'
const FLAG_IMG = '<img src="src/flag.png">'

function onInit() {
    buildBoard()
    renderBoard()
}

function renderBoard() {
    var strHTML = ''
    for (var i = 0 ; i < gLvl.SIZE ; i++) {
		strHTML += '<tr>'
        for (var j = 0 ; j < gLvl.SIZE ; j++) {
            strHTML += `<td 
                        data-i="${i}" data-j="${j}"
                        onclick="onCellClicked(this, ${i}, ${j}, event)">
                        </td>`
        }
        strHTML += '</tr>'
    }
    document.querySelector('.board').innerHTML = strHTML
}

function buildBoard() {
    var row = []
    var cell
    // build the board, completely initialised
    for (let i = 0 ; i < gLvl.SIZE ; i ++) {
        for (let j = 0 ; j < gLvl.SIZE ; j++) {
            cell = buildCell()
            row.push(cell)
            // console.log(cell)
        }
        gBoard.push(row)
        row = []
    }
    addMines()
    setMinesNegsCount()
    // TODO - isShown??? isMarked???
    console.log(gBoard)
}

function buildCell() {
    return {
        minesAroundCount: NaN,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}

// calculate how many mines around each cell
function setMinesNegsCount() {
    console.log('setMinesnegscount', gBoard)
    for (let i = 0 ; i< gLvl.SIZE ; i++) {
        for (let j = 0 ; j < gLvl.SIZE ; j++) {
            gBoard[i][j].minesAroundCount = calcNegs(i, j)
        }
    }
}

// calculate how many mines around a single cell
function calcNegs(rowIdx, colIdx) {
    var mineNegs = 0
    if (gBoard[rowIdx][colIdx].isMine) return NaN
    for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
        // console.log('i', i);
        if (i < 0 || i >= gLvl.SIZE) continue
        for (let j = colIdx - 1; j <= colIdx + 1; j++) {
            // console.log('j', j);
            if (j < 0 || j >= gLvl.SIZE || (i === rowIdx && j === colIdx)) continue
            if (gBoard[i][j].isMine) mineNegs++
        }
    }
    return mineNegs
}

// add mines to the board
function addMines() {
    var mines = getRandomCoord(gLvl.MINES)
    // console.log(mines)
    for (let k = 0 ; k < mines.length ; k++) {
        var coord = mines[k]
        gBoard[coord.i][coord.j].isMine = true
    }
    console.log(gBoard);
}

function getRandomCoord(numOfPos = 1) {
	var rowIdx, colIdx
	var emptyPositions = []

	if (numOfPos <= 0) {
        console.log('numOfPos should be at least 1');
        return null
    }

	for (let i = 0 ; i < numOfPos ; i++) {
		rowIdx = getRandomInt(0, gLvl.SIZE)
		colIdx = getRandomInt(0, gLvl.SIZE)
		emptyPositions.push({i: rowIdx, j: colIdx})
		if (numOfPos === 1) return emptyPositions[0]
		// return as an obj
	}
	return emptyPositions
	// return as an array of obj
}

function onCellClicked(elCell, i, j, ev) {
    i = +i
    j = +j
    window.addEventListener('contextmenu', (event) => {

        console.log('mouse right-clicked');
        
    })

    switch (ev.button) {
        case 0:     // left click
            gBoard[i][j].isShown = true
            showCell(elCell, i, j)
            break;
        case 1:
            elCell.classList.toggle('.marked')
            break;
    }

    // gBoard[i][j].isShown = true
    // renderCell(elCell)


    // if (gBoard[i][j].isMine) {
    //     gBoard[i][j].isShown = true
    //     renderCell(elCell)
    //     GameOver()
    // }

}

function showCell(elCell) {
    if (gBoard[i][j].isMine) {
        // checkGameOver() // TODO suggestion - add default isOver = false, and call func with true

    }
}

