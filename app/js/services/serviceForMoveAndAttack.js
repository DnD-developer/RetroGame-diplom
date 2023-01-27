export default function checkPotentialMove(unitWithPosition, indexCursor) {
	const dffString = Math.abs(this.cellsMatrix[unitWithPosition.position].stringNumber - this.cellsMatrix[indexCursor].stringNumber)
	const dffCall = Math.abs(this.cellsMatrix[unitWithPosition.position].callNumber - this.cellsMatrix[indexCursor].callNumber)

	if (dffString === 0 || dffCall === 0 || dffString === dffCall) {
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

	this.gamePlay.redrawPositions(this.unitsWithPosition)
}

export async function attackUnit(unitWithPosition, indexCursor) {
	const unit = unitWithPosition.character
	const opponent = this.unitsWithPosition.find(elem => elem.position === indexCursor).character
	const damage = Math.max(unit.attack - opponent.defence, unit.attack * 0.1)

	await this.gamePlay.showDamage(indexCursor, unit.attack)

	opponent.health -= damage

	this.gamePlay.redrawPositions(this.unitsWithPosition)
}
