var gBoard = []
var gLvl = {
    SIZE: 4,
    MINES: 2
}
const MINE_IMG = '<img src="src/mine3.png">'
const FLAG_EMOJI = '🏴‍☠️'
const EMPTY = ''

function buildEmptyBoard() {
    var row = []
    // build the board, completely initialised
    for (let i = 0 ; i < gLvl.SIZE ; i ++) {
        for (let j = 0 ; j < gLvl.SIZE ; j++) {
            // cell = buildCell()
            row.push(buildCell())
            // console.log(cell)
        }
        gBoard.push(row)
        row = []
    } 
}
function renderBoard() {
    var strHTML = ''
    for (var i = 0 ; i < gLvl.SIZE ; i++) {
        strHTML += '<tr>'
        for (var j = 0 ; j < gLvl.SIZE ; j++) {
            strHTML += `<td 
            data-i="${i}" data-j="${j}"
            onclick="onCellClicked(this, ${i}, ${j})"
            oncontextmenu="onCellMarked(event)"
            onmousedown="replaceFace(event, ${i}, ${j})"
            onmouseup="returnFace(event, ${i}, ${j})">
            </td>`
        }
        strHTML += '</tr>'
    }
    document.querySelector('.board').innerHTML = strHTML
}

function buildBoard(firstClickCoord) {

    addMines(firstClickCoord)
    setMinesNegsCount()
    // console.log(gBoard)
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
    // console.log('setMinesnegscount', gBoard)
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
function addMines(coord) {
    var mines = getRandomCoord(coord, gLvl.MINES)
    // debugger
    // console.log(mines)
    for (let k = 0 ; k < mines.length ; k++) {
        var coord = mines[k]
        gBoard[coord.i][coord.j].isMine = true
    }
}

function getRandomCoord(coord, numOfPos = 1) {
    // console.log('coord', coord)
	var rowIdx, colIdx
	var emptyPositions = []

	if (numOfPos <= 0) {
        console.log('numOfPos should be at least 1');
        return null
    }

	for (let k = 0 ; k < numOfPos ; k++) {
		rowIdx = getRandomInt(0, gLvl.SIZE)
		colIdx = getRandomInt(0, gLvl.SIZE)
        if (coord.i === rowIdx, coord.j === colIdx) {
            k--
            continue
        }
		emptyPositions.push({i: rowIdx, j: colIdx})
		if (numOfPos === 1) return emptyPositions[0]
		// return as an obj
	}
	return emptyPositions
	// return as an array of obj
}