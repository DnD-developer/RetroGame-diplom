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
