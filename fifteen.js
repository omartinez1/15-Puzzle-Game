/*
TEAM AEIOU PROJECT 3 - Fifteen Puzzle
by Austin Farmer, Zexi Guo, Oscar Martinez, and Ugonma Nnakwe
WEB PROGRAMMING FALL 2020

Extra Features Implemented:
1. Ability to slide multiple squares at once
2. Multiple backgrounds (with drag and drop image functionality)
3. End of game notification/Extra animation
4. Extra animation
*/

var rowSize = 4;
var colSize = 4;
var shuffleCount = 100;

var state;
var hollowPiece;
var board;

function setupBoard() {
	state = "setup";
	hollowPiece = { row: 3, col: 3 };
	board = document.getElementById("board");
	numberPieces();
	state = "gameplay";
}

function changeImage(file) {
	// document.documentElement.style.setProperty("--image-file", "url(images/test.png)");
	document.documentElement.style.setProperty("--image-file", "url(" + file + ")")
}

function dropImage(event) {
	event.preventDefault();

	let file = event.dataTransfer.items[0].getAsFile();
	let reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onloadend = function () {
		document.documentElement.style.setProperty("--image-file", "url(" + reader.result + ")");
	}
	document.getElementById("file-drop").style.zIndex = -1;
}

function dragEnter(event) {
	event.preventDefault();
	document.getElementById("file-drop").style.zIndex = 1;
}

function dragLeave(event) {
	event.preventDefault();
	document.getElementById("file-drop").style.zIndex = -1;
}

function dragOver(event) {
	event.preventDefault();
}

function checkWin() {

	for (let a = 0; a < rowSize; a++) {
		for (let b = 0; b < colSize; b++) {
			if (board.children[a].children[b].id != "piece-" + (a * rowSize + b)) {
				return false;
			}
		}
	}

	return true;

}

function shuffleButton() {
	state = "setup";
	shuffleBoard(shuffleCount);
	state = "gameplay";
}

function shuffleBoard(n) {

	for (let a = 0; a < n; a++) {

		let row = hollowPiece["row"];
		let col = hollowPiece["col"];

		if (Math.random() < 0.5) {
			let offset = Math.floor(Math.random() * (rowSize - 1) + 1);
			clickPiece((row + offset) % rowSize, col);
		} else {
			let offset = Math.floor(Math.random() * (colSize - 1) + 1);
			clickPiece(row, (col + offset) % colSize);
		}

	}

	if (checkWin()) {
		shuffleBoard(n);
	}

}

function clickPiece(row, col) {

	let direction, count;

	if (row == hollowPiece["row"] && col != hollowPiece["col"]) {

		direction = (col > hollowPiece["col"]) ? "left" : "right";
		count = Math.abs(col - hollowPiece["col"]);

	} else if (col == hollowPiece["col"] && row != hollowPiece["row"]) {

		direction = (row > hollowPiece["row"]) ? "up" : "down";
		count = Math.abs(row - hollowPiece["row"]);

	} else {
		console.log("You shouldn't be able to click on this piece. ://");
		return;
	}

	disableBoard();
	movePiece(row, col, direction, count);
	hollowPiece = { row: row, col: col };
	numberPieces();
	enablePieces(row, col);

	if (checkWin() && state == "gameplay") {
		console.log("You have won the game!");
		//add some visual display of congratulations
		winScreenOn();
	}


}

function movePiece(row, col, direction, count) {

	let targetRow, targetCol;

	switch (direction) {
		case "up":
			targetRow = row - 1;
			targetCol = col;
			break;

		case "down":
			targetRow = row + 1;
			targetCol = col;
			break;

		case "left":
			targetRow = row;
			targetCol = col - 1;
			break;

		case "right":
			targetRow = row;
			targetCol = col + 1;
			break;

		default:
			console.log("You forgot to give a proper direction ://");
	}

	if (count != 1) {
		movePiece(targetRow, targetCol, direction, count - 1);
	}

	let targetPiece = board.children[targetRow].children[targetCol];
	let currentPiece = board.children[row].children[col];
	let temp = targetPiece.id;
	targetPiece.id = currentPiece.id;
	currentPiece.id = temp;

}

function disableBoard() {

	for (let a = 0; a < rowSize; a++) {
		for (let b = 0; b < colSize; b++) {
			board.children[a].children[b].children[0].disabled = true;
		}
	}

}

function enablePieces(row, col) {

	for (let a = 0; a < rowSize; a++) {
		board.children[a].children[col].children[0].disabled = false;
	}

	for (let b = 0; b < colSize; b++) {
		board.children[row].children[b].children[0].disabled = false;
	}

	board.children[row].children[col].children[0].disabled = true;

}

function numberPieces() {
	for (let a = 0; a < rowSize; a++) {
		for (let b = 0; b < colSize; b++) {
			let pieceID = board.children[a].children[b].id;
			if (pieceID == "piece-15") {
				pieceID = "";
			} else {
				pieceID = parseInt(pieceID.replace("piece-", "")) + 1;
			}
			board.children[a].children[b].children[0].innerHTML = pieceID;
		}
	}
}


//for end game notification
/* start code referenced from w3schools
https://www.w3schools.com/howto/howto_css_overlay.asp
*/
function winScreenOn() {
	document.getElementById("win-overlay").style.display = "block";
}

function winScreenOff() {
	document.getElementById("win-overlay").style.display = "none";
	state = "setup";
	shuffleBoard(shuffleCount);
	state = "gameplay";
}
/* end code referenced from w3schools
https://www.w3schools.com/howto/howto_css_overlay.asp
*/