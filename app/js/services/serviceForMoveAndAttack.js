function checkCellsforAttack(mark, countCell, position, indexCursor, translate) {
	for (let index = 1; index <= countCell; index += 1) {
		let checkCellDirect
		let checkCellDiag

		if (translate === 0) {
			checkCellDirect = position + index * mark
		} else {
			checkCellDirect = position + index * this.gamePlay.boardSize * mark
			checkCellDiag = position + index * this.gamePlay.boardSize * mark + index * translate
		}

		if (checkCellDirect === indexCursor || checkCellDiag === indexCursor) {
			return true
		}
	}
	return false
}

function checkCellsforMove(mark, countCell, position, indexCursor, translate) {
	let checkCellDirect
	let checkCellDiag

	if (translate === 0) {
		checkCellDirect = position + countCell * mark
	} else {
		checkCellDirect = position + countCell * this.gamePlay.boardSize * mark
		checkCellDiag = position + countCell * this.gamePlay.boardSize * mark + countCell * translate
	}

	if (checkCellDirect === indexCursor || checkCellDiag === indexCursor) {
		return true
	}
	return false
}

export default function checkPotentialMove(unitWithPosition, indexCursor) {
	const stringCursor = Math.trunc(indexCursor / this.gamePlay.boardSize) + 1
	const stringUnit = Math.trunc(unitWithPosition.position / this.gamePlay.boardSize) + 1
	let countCell = Math.abs(stringCursor - stringUnit)
	let mark
	let translate

	if (countCell === 0) {
		countCell = Math.abs(indexCursor - unitWithPosition.position)

		if (countCell <= unitWithPosition.character.move) {
			if (indexCursor > unitWithPosition.position) {
				mark = 1
			} else {
				mark = -1
			}

			return checkCellsforMove.call(this, mark, countCell, unitWithPosition.position, indexCursor, 0)
		}

		return false
	}

	if (countCell <= unitWithPosition.character.move) {
		console.log(1)
		if (indexCursor > unitWithPosition.position) {
			mark = 1

			if (indexCursor - unitWithPosition.position > this.gamePlay.boardSize * countCell) {
				translate = 1
			} else {
				translate = -1
			}

			return checkCellsforMove.call(this, mark, countCell, unitWithPosition.position, indexCursor, translate)
		}

		if (indexCursor < unitWithPosition.position) {
			mark = -1

			if (unitWithPosition.position - indexCursor < this.gamePlay.boardSize * countCell) {
				translate = 1
			} else {
				translate = -1
			}

			return checkCellsforMove.call(this, mark, countCell, unitWithPosition.position, indexCursor, translate)
		}
	}

	return false
}
