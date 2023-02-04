import GameState from "../modules/GameState"
import cursors from "../modules/cursors"
import checkUnitInCell, { checkPlayerTeam } from "./serviceBasesForGame"
import checkPotentialMove, { checkPotentialAttack } from "./serviceForMoveAndAttack"

export function selectedUnit(index, team) {
	if (team) {
		this.gamePlay.selectCell(index)
	} else {
		this.gamePlay.showError("Персонаж противника", index)
	}

	GameState.deleteCurrentUnit()
}

export function removeSelect() {
	this.unitsWithPosition.forEach(unit => this.gamePlay.deselectCell(unit.position))
}

export function deleteCursorNotification() {
	this.gamePlay.setCursor(cursors.auto)

	for (let index = 0; index < this.gamePlay.boardSize * this.gamePlay.boardSize; index += 1) {
		if (GameState.currentUnit && GameState.currentUnit.position !== index) {
			this.gamePlay.deselectCell(index)
		}
	}
}

export function setCursorNotification(index) {
	const coreCell = checkUnitInCell.call(this, index)

	deleteCursorNotification.call(this)

	if (coreCell.check) {
		if (checkPlayerTeam(this.unitsWithPosition[coreCell.index].character)) {
			this.gamePlay.setCursor(cursors.pointer)
		} else if (checkPotentialAttack.call(this, GameState.currentUnit, index)) {
			this.gamePlay.setCursor(cursors.crosshair)
			this.gamePlay.selectCell(index, "red")
		} else {
			this.gamePlay.setCursor(cursors.notallowed)
		}
	} else if (checkPotentialMove.call(this, GameState.currentUnit, index)) {
		this.gamePlay.setCursor(cursors.pointer)
		this.gamePlay.selectCell(index, "green")
	} else {
		this.gamePlay.setCursor(cursors.notallowed)
	}
}
