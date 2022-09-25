//Minesweeper Game!

'use strict'
const WIN = '😛'
const LOST = '😔'
const MINE = '💣'
const CELLMARKED = '🚩'
const EMPTY = ''
const boardEl = document.querySelector(".board-container")


var gGame
var gLevel
var gBoard
var life = 3
gLevel = { SIZE: 7, MINES: 3 }

function initGame() {
    gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard, '.board-container')
}

function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    board = setMinesOnBoard(board)
    board = setMinesNegsCount(board)

    // //on the conole!
    checkIfItsWork(board)
    return board
}

//set mines on the board 
function setMinesOnBoard(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var pos = randomLocationBombs(board)
        board[pos.i][pos.j].isMine = true
    }
    return board
}

//random location for the bombs
function randomLocationBombs(board) {
    var EmptyLocation = getEmptycell(board)
    if (!EmptyLocation.length) return
    var randomLocationOnTheBoard = getRandomInt(0, EmptyLocation.length - 1)
    var randPos = EmptyLocation[randomLocationOnTheBoard]
    return randPos
}

//Looking for an empty place
function getEmptycell(board) {
    var emptycell = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine) {
                emptycell.push({ i: i, j: j })
            }
        }
    }
    return emptycell
}

//put the number of mines
function setMinesNegsCount(board) {
    var countMines = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            countMines = countMineNegs(i, j, board)
            board[i][j].minesAroundCount = countMines
        }
    }
    return board
}

//Counting how many mines there are around each one
function countMineNegs(cellI, cellJ, board) {
    var minesAroundCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine) minesAroundCount++
        }
    }
    return minesAroundCount

}

function clickedCell(elCell, cellI, cellJ) {
    if (!gGame.isOn) {

        gGame.isOn = true
        startStopwatch()
    }

    elCell.minesAroundCount = countMineNegs(cellI, cellJ, gBoard)

    if (elCell.minesAroundCount === 0) {
        expandShown(gBoard, cellI, cellJ)
        elCell.style.backgroundColor = '#b8aeae'

    }
    if (gBoard[cellI][cellJ].isMine && !gBoard[cellI][cellJ].isShown) {
        elCell.innerHTML = MINE
        gBoard[cellI][cellJ].isShown = true
        life--;
        var ellife = document.querySelector('h5')
        ellife.innerHTML = `lifes ${life}`
        if (!life) {
            stop()
            gameOver(elCell)

        }
    }
    else if (gBoard[cellI][cellJ].isMarked) return false
    else if (gBoard[cellI][cellJ].isShown) return false

    else {
        gBoard[cellI][cellJ].isMine = true
        gBoard[cellI][cellJ].isShown = true
        elCell.innerHTML = gBoard[cellI][cellJ].minesAroundCount
        checkWin()

    }
}
function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue

            var elCell = board[i][j]

            elCell.isShown = true
            gGame.shownCount++

        }
    }
}
//to click the right click in the mouse
function cellMarked(elCell, i, j) {
    if (gBoard[i][j].isShown) return false;

    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        // TODO - change innerHTML to default//
    }
    // elCell.stopPropagation()//
    else {
        gBoard[i][j].isMarked = true
        elCell.innerHTML = CELLMARKED
    }
}


function checkWin() {
    var counter = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown) {
                counter++
            }

        }
    }
    if (counter + gLevel.MINES === gLevel.SIZE ** 2) {
        //addEvent=>stop the game when we win
        boardEl.addEventListener("click", stopProp, { capture: true })
        boardEl.addEventListener("contectmenu", stopProp, { capture: true })
        var win = document.querySelector('.restartBtn')
        var win1 = document.querySelector('h1')
        var strHTML = WIN
        win.innerHTML = strHTML
        var strHTML1 = `you win!`
        win1.innerHTML = strHTML1
        win1.style.display = 'block'
        stop()
    }
}


function gameOver(elCell) {
    boardEl.addEventListener("click", stopProp, { capture: true })
    boardEl.addEventListener("contectmenu", stopProp, { capture: true })
    gGame.isOn = false;
    var gameOverr = document.querySelector('h1')
    var strHTML = `you lost!`
    gameOverr.innerHTML = strHTML
    gameOverr.style.display = 'block'

}

//to stop the game when we win or lost
function stopProp(e) {
    e.stopImmediatePropagation()
}

//check on the shift+f12
function checkIfItsWork(board) {
    var checkmyself = []
    for (var i = 0; i < board.length; i++) {
        checkmyself[i] = []
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j]
            var isMine = currCell.isMine ? true : false
            checkmyself[i][j] = isMine ? MINE : currCell.minesAroundCount
        }
    }
    console.table(checkmyself)
}

function rules() {
    var elhtml = document.querySelector('.rules')
    var htmlStr = `Minesweeper is a game where mines are hidden in a grid of squares. Safe squares have numbers telling you how
    many mines touch the square. You can use the number clues to solve the game by opening all of the safe squares. If
    you click on a mine you lose the game!`
    elhtml.innerHTML = htmlStr

}

//change levels
function changeFromEasyToHard(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    initGame()
}








//all the next code about the timer
const time = document.querySelector('.stopwatch')
const mainButton = document.querySelector('#main-button')
const clearButton = document.querySelector('#clear-button')
const stopwatch = { elapsedTime: 0 }
function startStopwatch() {
    //reset start time
    stopwatch.startTime = Date.now();
    //run `setInterval()` and save id
    stopwatch.intervalId = setInterval(() => {
        //calculate elapsed time
        const elapsedTime = Date.now() - stopwatch.startTime + stopwatch.elapsedTime
        //calculate different time measurements based on elapsed time
        const milliseconds = parseInt((elapsedTime % 1000) / 10)
        const seconds = parseInt((elapsedTime / 1000) % 60)
        const minutes = parseInt((elapsedTime / (1000 * 60)) % 60)
        const hour = parseInt((elapsedTime / (1000 * 60 * 60)) % 24);
        //display time
        displayTime(hour, minutes, seconds, milliseconds)
    }, 100);
}
// shows us that the clock is moving
function displayTime(hour, minutes, seconds, milliseconds) {
    const leadZeroTime = [hour, minutes, seconds, milliseconds].map(time => time < 10 ? `0${time}` : time)
    time.innerHTML = leadZeroTime.join(':')
}
//stop the watch
function stop() {
    stopwatch.elapsedTime += Date.now() - stopwatch.startTime
    clearInterval(stopwatch.intervalId)
}