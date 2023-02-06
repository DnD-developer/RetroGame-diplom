import GameState from "../modules/GameState"
import PositionedCharacter from "../modules/PositionedCharacter"
import { generateTeam } from "../modules/generators"

export default function checkUnitInCell(index) {
	const indexUnitOfArray = this.unitsWithPosition.findIndex(unit => unit.position === index)
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

export function checkPlayerTeam(unit) {
	if (unit.type === "bowman" || unit.type === "swordsman" || unit.type === "magician") {
		return true
	}
	return false
}

export function generateMessage(level, attack, defence, health) {
	return `\u{1F396} ${level} \u{1F5E1} ${attack} \u{1F6E1} ${defence} \u{2764} ${health}`
}

export function createInformation(indexUnitOfArray, index) {
	const unit = this.unitsWithPosition[indexUnitOfArray].character
	const message = generateMessage(unit.level, unit.attack, unit.defence, unit.health)
	this.gamePlay.showCellTooltip(message, index)
}

export function generateCollectionsStartPositions(start, boardSize) {
	const k = start
	let stringNumber = 0
	let position = 0
	const positions = []

	for (let index = 0; index < boardSize * 2; index += 1) {
		if (index % 2 === 0) {
			stringNumber += 1
			position = (stringNumber - 1) * boardSize + k
		} else {
			position = (stringNumber - 1) * boardSize + 1 + k
		}

		positions.push(position)
	}

	return positions
}

export function initUnitsOfTeamWithPosition() {
	this.unitsWithPositionPlayer = []
	this.unitsWithPositionOpponent = []

	this.unitsWithPosition.forEach(unit => {
		if (this.playerTeamCharacters.includes(unit.character.type)) {
			this.unitsWithPositionPlayer.push(unit)
		}
	})

	this.unitsWithPosition.forEach(unit => {
		if (this.opponentTeamCharacters.includes(unit.character.type)) {
			this.unitsWithPositionOpponent.push(unit)
		}
	})
}

export function levelUp() {
	this.playerTeam = []
	GameState.currentLevel += 1

	this.unitsWithPositionPlayer.forEach(unit => {
		unit.character.level = GameState.currentLevel
		unit.character.upAttack()
		unit.character.upHealth()
		this.playerTeam.push(unit.character)
	})

	this.opponentTeam = generateTeam(this.opponentTeamCharacters, GameState.currentLevel, 4)
	const positionLock = []

	this.initNewGame(positionLock)

	GameState.triggerNewGame = false
}

export function renderUnitsOnBoard(team, lock, startPositions) {
	let countRendered = 0
	while (countRendered < team.length) {
		const positionIndex = Math.floor(Math.random() * startPositions.length)
		if (lock.findIndex(lk => lk === startPositions[positionIndex]) === -1) {
			lock.push(startPositions[positionIndex])
			this.unitsWithPosition.push(new PositionedCharacter(team[countRendered], startPositions[positionIndex]))
			countRendered += 1
		}
	}
}
