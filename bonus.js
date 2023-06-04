const BULB = "src/bulb.png", BULB_OFF = "src/bulb-off.png"
const MEGA_BULB = "src/mega-bulb.gif", MEGA_BULB_OFF = "src/mega-bulb-off.png"
const SAFE_CLICK = "src/safe-click.png", SAFE_CLICK_OFF = "src/safe-click-off.png"
const SEC = 1000
const DALEK_OFF = "src/exterminate-off.png"

var gQuad = []
var gBlinkInterval

// const MINE_IM = '<a href="#"><img class="mine-img" src="src/mine3.png"></a>'

// added features: hints, mega hint, safe click, dalek
// TODO - best score, manually positioned mines, undo, dark mode, win+lose animation 

// possible bug - onHint doesn't always show MINE_IMG - no idea why

function initBonuses() {
    // initialise hints
    var strHTML = '<h class="hints">Hints:</h>'
    const elBulbs = document.querySelectorAll('.img-hint:not(.mega-hint)')
    console.log(elBulbs);
    for (let i = 0 ; i < elBulbs.length ; i++) {
        elBulbs[i].src = BULB
        elBulbs[i].style.cursor = 'pointer'
        strHTML += '<img class="img-hint" onclick="onUseHint(this)" src="src/bulb.png">'
    }
    document.querySelector('.hints-container').innerHTML = strHTML
    // initialise mega-hint
    const elMegaBulb = document.querySelector('.mega-hint')
    // console.log(elMegaBulb);
    elMegaBulb.src = MEGA_BULB
    elMegaBulb.style.cursor = 'pointer'
    strHTML = '<h>Mega-Hint:</h><img class="mega-hint" class="img-hint" onclick="onUseMegaHint(this)"" src="src/mega-bulb.gif">'
    document.querySelector('.mega-hint-container').innerHTML = strHTML

    // initialise gQuad
    gQuad = []

    // initialise safe clicks
    strHTML = `<h>Safe-Clicks</h>
                <img class="safe-click" onclick="onUseSafeClick(this)" src="src/safe-click.png">
                <img class="safe-click" onclick="onUseSafeClick(this)" src="src/safe-click.png">
                <img class="safe-click" onclick="onUseSafeClick(this)" src="src/safe-click.png">`
    document.querySelector('.safe-clicks-container').innerHTML = strHTML

    // initialise dalek
    strHTML = '<h>Exterminator:</h><img class="exter-click" onclick="onExterminator()" src="src/exterminate.png">'
    document.querySelector('.exter-container').innerHTML = strHTML
    const dalek = document.querySelector('.exter-click')
    dalek.style.cursor = 'cursor'
}

// show menu popup. hide menu button
function openMenuModal() {
    document.querySelector('.menu').style.visibility = "visible"
    document.querySelector('.menu-button').style.visibility = "hidden"
}

// hide menu popup, show menu button
function hideMenuDetails() {
    document.querySelector('.menu').style.visibility = "hidden"
    document.querySelector('.menu-button').style.visibility = "visible"
}

//////////// HINT ///////////////

// when using hint, turn bulb off and make show hint after click on cell
function onUseHint(elHint) {
    // console.log('on use hint (bulb)');
    if (!gIsFirstClick) return
    // change bulb to used-hint
    elHint.src = BULB_OFF
    elHint.style.cursor = 'default'
    elHint.onclick = null
    // get all cells from board
    const elCells = document.querySelectorAll('td')
    // change onclick function
    changeOnClick(elCells, `onShowNegs(this)`)
    // add cursor:pointer to element with isShown
    togglePointer(elCells, gBoard)
}

// when clicking a cell after enabeling a hint, show neighbours for 1 second
function onShowNegs(elCell) {
    const rowIdx = +elCell.dataset.i
    const colIdx = +elCell.dataset.j
    // var elNegCells = []
    // console.log(rowIdx);
    // console.log('showNegs cell:', elCell);
    showNegs(rowIdx-1, colIdx-1, rowIdx+1, colIdx+1, 1)
}

// show cell element's content
function showCell(elCell, board, i, j) {
    // console.log('showCell', board[i][j]);
    // console.log(elCell);
    elCell.classList.remove('mega-hint-chosen')
    // console.log(i, j);
    // console.log(board[0][0]);
    if (board[i][j].isShown) return
    if (board[i][j].isMine) {
        elCell.innerText = MINE_EMOJI
        // console.log(elCell.innerHTML);
    }
    if (board[i][j].minesAroundCount) {
        elCell.classList.add(`num${board[i][j].minesAroundCount}`)
        elCell.innerText = board[i][j].minesAroundCount
    }
    if (!board[i][j].minesAroundCount) elCell.innerText = ''
    elCell.classList.add('shown')
}

// if cell isShown, after enabling a hint add cursor:pointer
// after using a hint toggle cursor back to default
function togglePointer(elCells, board, isBeforeHint = true) {
    var rowIdx, colIdx
    for (let i  = 0 ; i < elCells.length ; i++) {
        rowIdx = +elCells[i].dataset.i
        colIdx = +elCells[i].dataset.j
        if (!board[rowIdx][colIdx].isShown) continue
        elCells[i].style.cursor = isBeforeHint ? 'pointer' : 'default'
    }
}

// hide the cells which were exposed
function hideCells(elCells, board) {
    var rowIdx, colIdx
    for (let i = 0 ; i < elCells.length ; i++) {
        rowIdx = +elCells[i].dataset.i
        colIdx = +elCells[i].dataset.j
        if (board[rowIdx][colIdx].isShown) continue
        if (board[rowIdx][colIdx].isMine) elCells[i].innerHTML = ''
        if (board[rowIdx][colIdx].minesAroundCount) {
            elCells[i].innerText = ''
            elCells[i].classList.remove(`num${board[rowIdx][colIdx].minesAroundCount}`)
        }
        elCells[i].classList.remove('shown')
        if (board[rowIdx][colIdx].isMarked) elCells[i].innerText = FLAG_EMOJI
    }
    togglePointer(elCells, board, false)
}

// change onclick functionality
function changeOnClick(elCells, onclickFunc) {
    for (let i = 0 ; i < elCells.length ; i++) {
        // elCells[i].onclick = onclickFunc
        elCells[i].setAttribute('onclick', onclickFunc)
        // console.log(elCells[i])
    }
}

//////// MEGA HINT ///////////

function onUseMegaHint(elMegaHint) {
    if (!gIsFirstClick) return
    // console.log('beep bup boop')
    elMegaHint.src = MEGA_BULB_OFF

    const elCells = document.querySelectorAll('td')
    togglePointer(elCells, gBoard)
    changeOnClick(elCells, 'onGetQuad(this)')
}

function onGetQuad(elCell) {
    console.log('on get quad');
    elCell.onclick = null
    elCell.style.cursor = 'default'
    gQuad.push({
        i: +elCell.dataset.i,
        j: +elCell.dataset.j
    })
    elCell.classList.add('mega-hint-chosen')
    if (gQuad.length === 2) calcQuad(gQuad[0], gQuad[1])
    else return
}

function calcQuad(coord1, coord2) {
    console.log('calc quad');
    // calculate position of quad
    if (coord1.i <= coord2.i && coord1.j <= coord2.j) 
        showNegs(coord1.i, coord1.j, coord2.i, coord2.j)
    if (coord1.i <= coord2.i && coord2.j < coord1.j)
        showNegs(coord1.i, coord2.j, coord2.i, coord1.j)
    
}

function showNegs(rowLo, colLo, rowHi, colHi, secFactor = 2) {
    console.log('show negs');
    var elNegCells = []
    for (let i = rowLo ; i <= rowHi ; i++) {
        if (i < 0 || i >= gLvl.SIZE) continue
        for (let j = colLo ; j <= colHi ; j++) {
            if (j < 0 || j >= gLvl.SIZE) continue
            var currCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            elNegCells.push(currCell)
            showCell(currCell, gBoard, i, j)
        }
    }
    setTimeout(hideCells, secFactor*SEC, elNegCells, gBoard)
    const elCells = document.querySelectorAll('td');
    changeOnClick(elCells, 'onCellClicked(this)')
}

/////////////// SAFE CLICK //////////////////

function onUseSafeClick(elClk) {
    if (!gIsFirstClick) return
    // console.log('on use safe click');
    var coord = getEmptyPos()
    if (coord === null) return
    elClk.src = SAFE_CLICK_OFF
    elClk.style.cursor = 'default'
    elClk.onclick = null
    // elClk.removeEventListener('click', () => {onUseSafeClick(elClk)})
    var elCell = document.querySelector(`[data-i="${coord.i}"][data-j="${coord.j}"]`)
    gBlinkInterval = setInterval(blink, 0.2*SEC, elCell)
    setTimeout(function() {clearInterval(gBlinkInterval)}, 2*SEC)
    elCell.classList.remove('safe-to-click')
}

function getEmptyPos(numOfPos = 1) {
	var emptyPositions = []

    for (var i = 0 ; i < gBoard.length ; i++) {
        for (var j = 0 ; j < gBoard.length ; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                var pos = {
                    i: i,
                    j: j
                }
                // console.log(pos);
                emptyPositions.push(pos)
            }
        }
    }
    if (emptyPositions.length === 0) return null

	return emptyPositions[getRandomInt(0, emptyPositions.length)]
}

function blink(elCell) {
    console.log('blink');
    elCell.classList.toggle('safe-to-click')
}

//////////////////// MINE EXTERMINATOR //////////////////////

function onExterminator() {
    if (!gIsFirstClick) return
    const audio = new Audio("../src/exterminate.mp3")
    audio.play()
    const dalek = document.querySelector('.exter-click')
    dalek.src = DALEK_OFF
    dalek.style.cursor = 'default'
    const mineCoords = getMinePos(3)
    // gGame.markedCount -= mineCoords.length
    document.querySelector('.mines-guess').innerText = gGame.markedCount
    // console.log('onExter', mineCoords);
    for (const coord of mineCoords) {
        gBoard[coord.i][coord.j].isMine = false
    }
    for (const coord of mineCoords) {
        renderNegs(coord)
    }

}

function renderNegs(coord) {
    // console.log('renderneg', coord);
    // console.log(typeof(coord.j));
    // debugger
    for (let i = (coord.i - 1) ; i <= (coord.i + 1) ; i++) {
        if (i < 0 || i >= gLvl.SIZE) continue
        for (let j = (coord.j - 1) ; j <= (coord.j + 1) ; j++) {
            if (j < 0 || j >= gLvl.SIZE) continue
            gBoard[i][j].minesAroundCount = calcNegs(i,j)
            // console.log('i:', i, 'j:', j);
            // console.log(gBoard[i][j]);
            var currCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            if (gBoard[i][j].isShown) {
                if (gBoard[i][j].minesAroundCount) {
                    currCell.classList.add(`num${gBoard[i][j].minesAroundCount}`)
                    currCell.innerText = gBoard[i][j].minesAroundCount
                }
                else currCell.innerText = ''
            }
        }
    }
}

function getMinePos(numOfMines = 1) {
	var allMines = [], randomMines = []
    // var minesFound = 0

    if (numOfMines <= 0) {
        console.log('numOfPos should be at least 1');
        return null
    }
    if (gLvl.MINES < numOfMines) numOfMines = gLvl.MINES

    for (var i = 0; i < gBoard.length ; i++) {
        for (var j = 0; j < gBoard.length ; j++) {
            if (gBoard[i][j].isMine && !gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
                var pos = {
                    i: i,
                    j: j
                }
                // minesFound++
                // console.log(pos);
                allMines.push(pos)
            }
        }
    }

    if (allMines.length < 3) return allMines
    if (allMines.length === 0) return null
    if (numOfMines === 1) {
        return allMines[getRandomInt(0, allMines.length)]
    }

    for (let i = 0 ; i < numOfMines ; i++) {
        var index = getRandomInt(0, allMines.length)
        randomMines.push(allMines.splice(index, 1)[0])
    }
    return randomMines
}