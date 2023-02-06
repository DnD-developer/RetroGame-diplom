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
import choiceOpponentUnit from "../services/serviceComputerMove"

export default class GameController {
	constructor(gamePlay, stateService) {
		this.gamePlay = gamePlay
		this.stateService = stateService
	}

	init() {
		GameState.currentLevel = 1

		this.unitsWithPosition = []

		this.playerTeamCharacters = ["bowman", "swordsman", "magician"]
		this.opponentTeamCharacters = ["vampire", "undead", "daemon"]

		this.playerTeamStartsPositions = generateCollectionsStartPositions(0, this.gamePlay.boardSize)
		this.opponentTeamStartsPositions = generateCollectionsStartPositions(this.gamePlay.boardSize - 2, this.gamePlay.boardSize)

		this.playerTeam = generateTeam(this.playerTeamCharacters, 1, 4)
		this.opponentTeam = generateTeam(this.opponentTeamCharacters, 1, 1)

		const positionLock = []
		this.initNewGame(positionLock)
		this.createBoardMatrix()
	}

	initNewGame(lock) {
		this.gamePlay.drawUi(GameState.currentMap)

		GameState.setPlayerMove()

		renderUnitsOnBoard.call(this, this.playerTeam.characters, lock, this.playerTeamStartsPositions)
		renderUnitsOnBoard.call(this, this.opponentTeam.characters, lock, this.opponentTeamStartsPositions)
		this.gamePlay.redrawPositions(this.unitsWithPosition)

		this.addEvents()
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
			this.processPlayer(index)
		}
	}

	processPlayer(index) {
		const coreCell = checkUnitInCell.call(this, index)
		if (coreCell.check) {
			const unitWithPositionInCell = this.unitsWithPosition[coreCell.index]

			if (checkPlayerTeam(unitWithPositionInCell.character)) {
				selectedUnit.call(this, index, true)
				GameState.setCurrentUnit(unitWithPositionInCell)
			} else if (GameState.currentUnit) {
				if (checkPotentialAttack.call(this, GameState.currentUnit, index)) {
					attackUnit.call(this, GameState.currentUnit, index)
					// GameState.upMove()
				}
				GameState.deleteCurrentUnit()
			} else {
				selectedUnit.call(this, index, false)
			}
		} else if (GameState.currentUnit) {
			if (checkPotentialMove.call(this, GameState.currentUnit, index)) {
				movingUnit.call(this, GameState.currentUnit, index)
				// GameState.upMove()
			}
			GameState.deleteCurrentUnit()
		}

		if (!GameState.current()) {
			this.processOpponent()
		}
	}

	processOpponent() {
		setTimeout(() => {
			if (!GameState.current()) {
				choiceOpponentUnit.call(this)
				GameState.upMove()
			}
		}, 1000)
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
