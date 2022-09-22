'use strict'

function renderBoard(mat, selector) {
    var strHTML = `<table border="0"><tbody>`
    for (var i = 0; i < mat.length; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < mat[0].length; j++) {

            var className = `cell cell${i}-${j}`

            strHTML += `<td class="${className}" onclick="clickedCell(this,${i},${j})" oncontextmenu='cellMarked(this,${i},${j}); return false'></td>`

        }
        strHTML += `<tr>`
    }
    strHTML += `</tbody></table>`
    var elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
}



