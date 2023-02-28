export default function checkPotentialMove(unitsWithPosition, currentUnit, cellsMatrix, indexCursor) {
	const diffString = Math.abs(cellsMatrix[currentUnit.position].stringNumber - cellsMatrix[indexCursor].stringNumber)
	const diffCall = Math.abs(cellsMatrix[currentUnit.position].callNumber - cellsMatrix[indexCursor].callNumber)
	const checkLocking = unitsWithPosition.findIndex(cell => cell.position === indexCursor)

	if (checkLocking === -1 && (diffString === 0 || diffCall === 0 || diffString === diffCall)) {
		if (diffString <= currentUnit.character.move && diffCall <= currentUnit.character.move) {
			return true
		}
	}
	return false
}

export function checkPotentialAttack(currentUnit, cellsMatrix, indexCursor) {
	const diffString = Math.abs(cellsMatrix[currentUnit.position].stringNumber - cellsMatrix[indexCursor].stringNumber)
	const diffCall = Math.abs(cellsMatrix[currentUnit.position].callNumber - cellsMatrix[indexCursor].callNumber)

	if (diffString <= currentUnit.character.lengthAttack && diffCall <= currentUnit.character.lengthAttack) {
		return true
	}

	return false
}

export function movingUnit(unitsWithPosition, currentUnit, gamePlay, indexCursor) {
	currentUnit.position = indexCursor

	gamePlay.redrawPositions(unitsWithPosition)
}

export async function attackUnit(unitsWithPosition, currentUnit, gamePlay, indexCursor) {
	const unit = currentUnit.character
	const opponentIndex = unitsWithPosition.findIndex(elem => elem.position === indexCursor)
	const damage = Math.max(unit.attack - unitsWithPosition[opponentIndex].character.defence, unit.attack * 0.1)
	await gamePlay.showDamage(indexCursor, damage)

	unitsWithPosition[opponentIndex].character.health -= damage

	if (unitsWithPosition[opponentIndex].character.health <= 0) {
		unitsWithPosition.splice(opponentIndex, 1)
	}

	gamePlay.redrawPositions(unitsWithPosition)
}
