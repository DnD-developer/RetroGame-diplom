import { initUnitsOfTeamWithPosition, levelUp } from "./serviceBasesForGame"

export default function checkPotentialMove(unitWithPosition, indexCursor) {
	const dffString = Math.abs(this.cellsMatrix[unitWithPosition.position].stringNumber - this.cellsMatrix[indexCursor].stringNumber)
	const dffCall = Math.abs(this.cellsMatrix[unitWithPosition.position].callNumber - this.cellsMatrix[indexCursor].callNumber)
	const checkLocking = this.unitsWithPosition.findIndex(cell => cell.position === indexCursor)

	if (checkLocking === -1 && (dffString === 0 || dffCall === 0 || dffString === dffCall)) {
		if (dffString <= unitWithPosition.character.move && dffCall <= unitWithPosition.character.move) {
			return true
		}
	}
	return false
}

export function checkPotentialAttack(unitWithPosition, indexCursor) {
	const dffString = Math.abs(this.cellsMatrix[unitWithPosition.position].stringNumber - this.cellsMatrix[indexCursor].stringNumber)
	const dffCall = Math.abs(this.cellsMatrix[unitWithPosition.position].callNumber - this.cellsMatrix[indexCursor].callNumber)

	if (dffString <= unitWithPosition.character.lengthAttack && dffCall <= unitWithPosition.character.lengthAttack) {
		return true
	}

	return false
}

export function movingUnit(unitWithPosition, indexCursor) {
	unitWithPosition.position = indexCursor

	initUnitsOfTeamWithPosition.call(this)

	this.gamePlay.redrawPositions(this.unitsWithPosition)
}

export async function attackUnit(unitWithPosition, indexCursor) {
	const unit = unitWithPosition.character
	const opponentIndex = this.unitsWithPosition.findIndex(elem => elem.position === indexCursor)
	const damage = Math.max(unit.attack - this.unitsWithPosition[opponentIndex].character.defence, unit.attack * 0.1)
	await this.gamePlay.showDamage(indexCursor, unit.attack)

	this.unitsWithPosition[opponentIndex].character.health -= damage

	if (this.unitsWithPosition[opponentIndex].character.health <= 0) {
		this.unitsWithPosition.splice(opponentIndex, 1)

		initUnitsOfTeamWithPosition.call(this)

		if (this.unitsWithPositionOpponent.length === 0) {
			levelUp.call(this)
			return
		}
	}

	if (this.unitsWithPositionPlayer.length === 0) {
		// gameOver()
	}

	this.gamePlay.redrawPositions(this.unitsWithPosition)
}
