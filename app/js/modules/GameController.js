import themes from "./themes"
import GameState from "./GameState"
import PositionedCharacter from "./PositionedCharacter"
import { generateTeam } from "./generators"
import Daemon from "./characters/Daemon"
import Swordsman from "./characters/Swordsman"
import Magician from "./characters/Magician"
import Vampire from "./characters/Vampire"
import Undead from "./characters/Undead"
import Bowman from "./characters/Bowman"

export default class GameController {
	constructor(gamePlay, stateService) {
		this.gamePlay = gamePlay
		this.stateService = stateService
	}

	init() {
		this.gamePlay.drawUi(themes.prairie)
		GameState.upMove()
		this.unitsWithPosition = []
		const playerTeamCharacters = [Bowman, Swordsman, Magician]
		const opponentTeamCharacters = [Vampire, Undead, Daemon]
		const positionLock = []

		const playerTeamStartsPositions = this.generateCollectionsStartPositions(0)
		const opponentTeamStartsPositions = this.generateCollectionsStartPositions(this.gamePlay.boardSize - 2)

		const playerTeam = generateTeam(playerTeamCharacters, 1, 4)
		const opponentTeam = generateTeam(opponentTeamCharacters, 1, 4)

		this.renderUnitsOnBoard(playerTeam.characters, positionLock, playerTeamStartsPositions)
		this.renderUnitsOnBoard(opponentTeam.characters, positionLock, opponentTeamStartsPositions)
		this.gamePlay.redrawPositions(this.unitsWithPosition)
		this.addEvents()
	}

	addEvents() {
		this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this))
		this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this))
		this.gamePlay.addCellClickListener(this.onCellClick.bind(this))
	}

	generateCollectionsStartPositions(start) {
		const k = start
		let stringNumber = 0
		let position = 0
		const positions = []

		for (let index = 0; index < this.gamePlay.boardSize * 2; index += 1) {
			if (index % 2 === 0) {
				stringNumber += 1
				position = (stringNumber - 1) * this.gamePlay.boardSize + k
			} else {
				position = (stringNumber - 1) * this.gamePlay.boardSize + 1 + k
			}

			positions.push(position)
		}

		return positions
	}

	renderUnitsOnBoard(team, lock, startPositions) {
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

	generateMessage(level, attack, defence, health) {
		return `\u{1F396} ${level} \u{1F5E1} ${attack} \u{1F6E1} ${defence} \u{2764} ${health}`
	}

	onCellClick(index) {
		this.removeSelect()
		const indexUnitofArray = this.unitsWithPosition.findIndex(unit => unit.position === index)
		if (indexUnitofArray !== -1) {
			const unit = this.unitsWithPosition[indexUnitofArray].character
			if (unit.type === "bowman" || unit.type === "swordsman" || unit.type === "magician") {
				this.gamePlay.deselectCell(index)
				this.gamePlay.selectCell(index)
			} else {
				this.gamePlay.showError("Персонаж противника", index)
			}
		}
	}

	removeSelect() {
		this.unitsWithPosition.forEach(unitPos => {
			this.gamePlay.deselectCell(unitPos.position)
		})
	}

	onCellEnter(index) {
		const indexUnitofArray = this.unitsWithPosition.findIndex(unit => unit.position === index)
		if (indexUnitofArray !== -1) {
			const unit = this.unitsWithPosition[indexUnitofArray].character
			const message = this.generateMessage(unit.level, unit.attack, unit.defence, unit.health)
			this.gamePlay.showCellTooltip(message, index)
		}
	}

	onCellLeave(index) {
		this.gamePlay.hideCellTooltip(index)
	}
}
