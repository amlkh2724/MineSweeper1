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
    //// check the function
    // board[2][2].isMine = true
    // board[3][3].isMine = true
    //// check the function
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

function clickedCell(elCell, i, j) {
    if (!gGame.isOn) {
        gGame.isOn = true
        startStopwatch()
    }
    // if (gBoard[i][j].minesAroundCount === 0) {

    //     expandShown(i,j)
        
    // }
    if (gBoard[i][j].isMine && !gBoard[i][j].isShown) {

        elCell.innerHTML = MINE
        gBoard[i][j].isShown = true
        life--;
        var ellife = document.querySelector('h5')
        ellife.innerHTML = `lifes ${life}`
        // console.log("life:", life);
        if (!life) {
            stop()
            gameOver(elCell)

        }


    }

    else if (gBoard[i][j].isMarked) return false
    else if (gBoard[i][j].isShown) return false
    else {

        gBoard[i][j].isMine = true
        gBoard[i][j].isShown = true
        elCell.innerHTML = gBoard[i][j].minesAroundCount
        checkWin()


    }
}
//to click the right click in the mouse
function cellMarked(elCell, i, j) {
    if (gBoard[i][j].  isShown) return false;

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
                counter ++
            }

        }
    }
    if (counter + gLevel.MINES === gLevel.SIZE ** 2) {
        //addEvent=>stop the game when we win
        boardEl.addEventListener("click", stopProp, { capture: true })
        boardEl.addEventListener("contectmenu", stopProp, { capture: true })
        var lost = document.querySelector('.restartBtn')
        var strHTML = WIN
        lost.innerHTML = strHTML
        stop()
    }
}


function gameOver(elCell) {
    boardEl.addEventListener("click", stopProp, { capture: true })
    boardEl.addEventListener("contectmenu", stopProp, { capture: true })
    gGame.isOn = false;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                elCell.innerHTML = MINE
            }

        }

    }


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



//change levels
function changeFromEasyToHard(size,mines) {
    gLevel.SIZE=size
    gLevel.MINES=mines
    initGame()
}



// function expandShown() To-do

  



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