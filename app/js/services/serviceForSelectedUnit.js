import cursors from "../modules/cursors"
import checkPotentialMove, { checkPotentialAttack } from "./serviceForMoveAndAttack"

export function selectedUnit(index, own, gamePlay, gameState) {
	if (own) {
		gamePlay.selectCell(index)
	} else {
		gamePlay.showError("Персонаж противника", index)
	}

	gameState.deleteCurrentUnit()
}

export function removeSelect(unitsWithPosition, gamePlay) {
	unitsWithPosition.forEach(unit => gamePlay.deselectCell(unit.position))
}

export function deleteCursorNotification(gamePlay, currentUnit) {
	gamePlay.setCursor(cursors.auto)

	for (let index = 0; index < gamePlay.boardSize * gamePlay.boardSize; index += 1) {
		if (currentUnit && currentUnit.position !== index) {
			gamePlay.deselectCell(index)
		}
	}
}

export function setCursorNotification(index, infoCell, unitsWithPosition, gamePlay, currentUnit, cellsMatrix) {
	deleteCursorNotification(gamePlay, currentUnit)

	if (infoCell.check) {
		if (unitsWithPosition[infoCell.index].character.team === "player") {
			gamePlay.setCursor(cursors.pointer)
		} else if (checkPotentialAttack(currentUnit, cellsMatrix, index)) {
			gamePlay.setCursor(cursors.crosshair)
			gamePlay.selectCell(index, "red")
		} else {
			gamePlay.setCursor(cursors.notallowed)
		}
	} else if (checkPotentialMove(unitsWithPosition, currentUnit, cellsMatrix, index)) {
		gamePlay.setCursor(cursors.pointer)
		gamePlay.selectCell(index, "green")
	} else {
		gamePlay.setCursor(cursors.notallowed)
	}
}
