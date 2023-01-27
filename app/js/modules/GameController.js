import themes from "./themes"
import GameState from "./GameState"
import { generateTeam } from "./generators"
import checkUnitInCell, {
	createInformation,
	generateCollectionsStartPositions,
	renderUnitsOnBoard,
	checkPlayerTeam
} from "../services/serviceBasesForGame"
import { selectedUnit, removeSelect, setCursorNotification, deleteCursorNotification } from "../services/serviceForSelectedUnit"
import checkPotentialMove, { checkPotentialAttack, movingUnit, attackUnit } from "../services/serviceForMoveAndAttack"

export default class GameController {
	constructor(gamePlay, stateService) {
		this.gamePlay = gamePlay
		this.stateService = stateService
	}

	init() {
		this.gamePlay.drawUi(themes.prairie)
		GameState.upMove()

		this.unitsWithPosition = []

		const playerTeamCharacters = ["bowman", "swordsman", "magician"]
		const opponentTeamCharacters = ["vampire", "undead", "daemon"]
		const positionLock = []

		const playerTeamStartsPositions = generateCollectionsStartPositions(0, this.gamePlay.boardSize)
		const opponentTeamStartsPositions = generateCollectionsStartPositions(this.gamePlay.boardSize - 2, this.gamePlay.boardSize)

		const playerTeam = generateTeam(playerTeamCharacters, 1, 4)
		const opponentTeam = generateTeam(opponentTeamCharacters, 1, 4)

		renderUnitsOnBoard.call(this, playerTeam.characters, positionLock, playerTeamStartsPositions)
		renderUnitsOnBoard.call(this, opponentTeam.characters, positionLock, opponentTeamStartsPositions)
		this.gamePlay.redrawPositions(this.unitsWithPosition)
		this.addEvents()
		this.createBoardMatrix()
	}

	createBoardMatrix() {
		this.cellsMatrix = []

		this.gamePlay.cells.forEach((cell, id) => {
			const stringNumber = Math.trunc(id / this.gamePlay.boardSize) + 1
			const callNumber = id - this.gamePlay.boardSize * (stringNumber - 1) + 1
			this.cellsMatrix.push({ stringNumber, callNumber })
		})
	}

	addEvents() {
		this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this))
		this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this))
		this.gamePlay.addCellClickListener(this.onCellClick.bind(this))
	}

	onCellClick(index) {
		removeSelect.call(this)
		deleteCursorNotification.call(this)

		if (GameState.current()) {
			const coreCell = checkUnitInCell.call(this, index)

			if (coreCell.check) {
				const unitWithPositionInCell = this.unitsWithPosition[coreCell.index]

				if (checkPlayerTeam(unitWithPositionInCell.character)) {
					selectedUnit.call(this, index, true)
					GameState.setCurrentUnit(unitWithPositionInCell)
				} else if (GameState.currentUnit) {
					if (checkPotentialAttack.call(this, GameState.currentUnit, index)) {
						attackUnit.call(this, GameState.currentUnit, index)
					}
					GameState.deleteCurrentUnit()
				} else {
					selectedUnit.call(this, index, false)
				}
			} else if (GameState.currentUnit) {
				if (checkPotentialMove.call(this, GameState.currentUnit, index)) {
					movingUnit.call(this, GameState.currentUnit, index)
				}
				GameState.deleteCurrentUnit()

				// GameState.upMove()
			}
		}
	}

	onCellEnter(index) {
		if (checkUnitInCell.call(this, index).check) {
			createInformation.call(this, checkUnitInCell.call(this, index).index, index)
		}

		if (GameState.currentUnit) {
			setCursorNotification.call(this, index)
		}
	}

	onCellLeave(index) {
		this.gamePlay.hideCellTooltip(index)
	}
}
