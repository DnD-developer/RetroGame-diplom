import PositionedCharacter from "../modules/PositionedCharacter"

export default function checkUnitInCell(unitsWithPosition, index) {
	const indexUnitOfArray = unitsWithPosition.findIndex(unit => unit.position === index)
	if (indexUnitOfArray !== -1) {
		return {
			check: true,
			index: indexUnitOfArray
		}
	}

	return {
		check: false,
		index: -1
	}
}

export function generateCollectionsStartPositions(start, cellsMatrix) {
	const positions = cellsMatrix
		.map((cell, id) => {
			if (cell.callNumber === start || cell.callNumber === start + 1) {
				return id
			}
			return false
		})
		.filter(id => id || id === 0)

	return positions
}

export function givePositionForUnits(team, startPositions) {
	let countRendered = 0
	const positionLock = []
	const unitsWithPosition = []

	while (countRendered < team.length) {
		const positionIndex = Math.floor(Math.random() * startPositions.length)

		if (positionLock.findIndex(lk => lk === startPositions[positionIndex]) === -1) {
			positionLock.push(startPositions[positionIndex])

			unitsWithPosition.push(new PositionedCharacter(team[countRendered], startPositions[positionIndex]))

			countRendered += 1
		}
	}

	return unitsWithPosition
}

export function generateMessage(level, attack, defence, health) {
	return `\u{1F396} ${level} \u{1F5E1} ${attack} \u{1F6E1} ${defence} \u{2764} ${health}`
}

export function initUnitsOfTeamWithPosition(unitsWithPosition) {
	const playerTeam = unitsWithPosition.filter(unit => unit.character.team === "player")
	const opponentTeam = unitsWithPosition.filter(unit => unit.character.team === "enemy")

	return { playerTeam, opponentTeam }
}

export function levelUp(playerTeam, gameState) {
	gameState.currentLevel += 1

	return playerTeam.map(unit => {
		unit.character.level = gameState.currentLevel
		unit.character.upAttack()
		unit.character.upHealth()

		return unit.character
	})
}
