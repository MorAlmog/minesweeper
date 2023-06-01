function findEmptyPos() {

    var emptyPoss = []
    // var emptyPoss = [{i:0,j:0} , {i:0,j:1}]
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            // console.log('cell:', cell)
            if (!cell) {
                var pos = {i, j}
                // console.log('pos:', pos)
                emptyPoss.push(pos)
            }

        }
    }
    // console.log('emptyPoss:', emptyPoss)
    const randIdx = getRandomInt(0, emptyPoss.length)
    // console.log('randIdx:', randIdx)
    const randPos = emptyPoss[randIdx]
    return randPos
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}