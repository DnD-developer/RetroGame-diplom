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
import cursors from "./cursors"
import checkUnitInCell, { checkPlayerTeam, generateMessage } from "../services/serviceGameVontroller"

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

	createInformation(indexUnitOfArray, index) {
		const unit = this.unitsWithPosition[indexUnitOfArray].character
		const message = generateMessage(unit.level, unit.attack, unit.defence, unit.health)
		this.gamePlay.showCellTooltip(message, index)
	}

	selectedUnit(indexUnit, index) {
		GameState.setCurrentUnit(null)
		const unit = this.unitsWithPosition[indexUnit].character

		if (checkPlayerTeam(unit)) {
			this.gamePlay.deselectCell(index)
			this.gamePlay.selectCell(index)
		} else {
			this.gamePlay.showError("Персонаж противника", index)
		}
	}
	removeSelect() {
		this.unitsWithPosition.forEach(unit => this.gamePlay.deselectCell(unit.position))
	}

	deleteCursorNotification() {
		for (let index = 0; index < this.gamePlay.boardSize * this.gamePlay.boardSize; index += 1) {
			if (GameState.currentUnit.position !== index) {
				this.gamePlay.deselectCell(index)
			}
		}
	}

	setCursorNotification(index) {
		this.deleteCursorNotification()

		if (checkUnitInCell.call(this, index).check) {
			if (checkPlayerTeam(this.unitsWithPosition[checkUnitInCell.call(this, index).index].character)) {
				this.gamePlay.setCursor(cursors.pointer)
			} else {
				this.gamePlay.setCursor(cursors.crosshair)
				this.gamePlay.selectCell(index, "red")
			}
		} else {
			this.gamePlay.setCursor(cursors.pointer)
			this.gamePlay.selectCell(index, "green")
		}
	}

	onCellClick(index) {
		this.removeSelect()
		if (GameState.current()) {
			if (checkUnitInCell.call(this, index).check) {
				this.selectedUnit(checkUnitInCell.call(this, index).index, index)

				GameState.setCurrentUnit(this.unitsWithPosition[checkUnitInCell.call(this, index).index])
			} else if (GameState.currentUnit) {
				// GameState.upMove()
			}
		}
	}

	onCellEnter(index) {
		if (checkUnitInCell.call(this, index).check) {
			this.createInformation(checkUnitInCell.call(this, index).index, index)
		}

		if (GameState.currentUnit) {
			this.setCursorNotification(index)
		}
	}

	onCellLeave(index) {
		this.gamePlay.hideCellTooltip(index)
	}
}
