import GameState from "./GameState"
import { generateTeam } from "./generators"
import Bowman from "./characters/Bowman"
import checkUnitInCell, {
	generateCollectionsStartPositions,
	givePositionForUnits,
	generateMessage,
	initUnitsOfTeamWithPosition,
	levelUp
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
		this.gameState = new GameState()

		this.unitsWithPosition = []
		this.playerTeam = []
		this.opponentTeam = []

		this.initNewGame()
	}

	initNewGame(load = null) {
		this.gameState.changeMap()

		this.gamePlay.drawUi(this.gameState.currentMap)

		this.createBoardMatrix()

		this.gameState.countMove = 1

		if (!load) {
			if (this.playerTeam.length === 0) {
				this.playerTeam = [
					...givePositionForUnits(
						generateTeam(this.gameState.playerTeam, this.gameState.currentLevel, 4),
						generateCollectionsStartPositions(1, this.cellsMatrix)
					)
				]
			}

			this.opponentTeam = [
				...givePositionForUnits(
					generateTeam(this.gameState.enemyTeam, this.gameState.currentLevel, 4),
					generateCollectionsStartPositions(this.gamePlay.boardSize - 1, this.cellsMatrix)
				)
			]
		}

		this.unitsWithPosition = [...this.playerTeam, ...this.opponentTeam]

		removeSelect(this.unitsWithPosition, this.gamePlay)
		deleteCursorNotification(this.gamePlay, this.gameState.currentUnit)

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

		document.querySelector("[data-id='action-restart']").addEventListener("click", this.init.bind(this))

		document.querySelector("[data-id='action-save']").addEventListener("click", () => {
			localStorage.setItem(
				"save-game",
				JSON.stringify({
					playerTeam: this.playerTeam,
					opponentTeam: this.opponentTeam,
					gameState: this.gameState
				})
			)
		})

		document.querySelector("[data-id='action-load']").addEventListener("click", () => {
			const load = JSON.parse(localStorage.getItem("save-game"))

			if (!load) {
				return
			}

			this.gameState = load.gameState || new GameState()
			this.playerTeam = load.playerTeam || []
			this.opponentTeam = load.opponentTeam || []

			const goalProto = new Bowman(1).__proto__.__proto__
			const goalStateProto = new GameState().__proto__

			if (this.playerTeam.length !== 0) {
				this.playerTeam = this.playerTeam.map(unit => {
					unit.character.__proto__ = goalProto
					return unit
				})
			}

			if (this.opponentTeam.length !== 0) {
				this.opponentTeam = this.opponentTeam.map(unit => {
					unit.character.__proto__ = goalProto
					return unit
				})
			}

			this.gameState.__proto__ = goalStateProto

			this.initNewGame(true)
		})
	}

	onCellClick(index) {
		removeSelect(this.unitsWithPosition, this.gamePlay)
		deleteCursorNotification(this.gamePlay, this.gameState.currentUnit)

		if (this.gameState.current()) {
			this.processPlayer(index)
		}
	}

	async processPlayer(index) {
		const infoCell = checkUnitInCell(this.unitsWithPosition, index)

		if (infoCell.check) {
			const unitWithPositionInCell = this.unitsWithPosition[infoCell.index]

			if (unitWithPositionInCell.character.team === "player") {
				selectedUnit(index, true, this.gamePlay, this.gameState)

				this.gameState.setCurrentUnit(unitWithPositionInCell)
			} else if (this.gameState.currentUnit) {
				if (checkPotentialAttack(this.gameState.currentUnit, this.cellsMatrix, index)) {
					await attackUnit(this.unitsWithPosition, this.gameState.currentUnit, this.gamePlay, index)

					const segmentedTeam = initUnitsOfTeamWithPosition(this.unitsWithPosition)

					this.playerTeam = segmentedTeam.playerTeam
					this.opponentTeam = segmentedTeam.opponentTeam

					if (this.opponentTeam.length === 0) {
						this.playerTeam = [
							...givePositionForUnits(levelUp(this.playerTeam, this.gameState), generateCollectionsStartPositions(1, this.cellsMatrix))
						]
						this.initNewGame()
						return
					}
					if (this.playerTeam.length === 0) {
						// gameOver()
						return
					}
					this.gameState.upMove()
				}

				this.gameState.deleteCurrentUnit()
			} else {
				selectedUnit(index, false, this.gamePlay, this.gameState)
			}
		} else if (this.gameState.currentUnit) {
			if (checkPotentialMove(this.unitsWithPosition, this.gameState.currentUnit, this.cellsMatrix, index)) {
				movingUnit(this.unitsWithPosition, this.gameState.currentUnit, this.gamePlay, index)

				const segmentedTeam = initUnitsOfTeamWithPosition(this.unitsWithPosition)

				this.playerTeam = segmentedTeam.playerTeam
				this.opponentTeam = segmentedTeam.opponentTeam
				this.gameState.upMove()
			}

			this.gameState.deleteCurrentUnit()
		}

		if (this.gameState.countMove % 2 === 0) {
			this.processOpponent()
		}
	}

	processOpponent() {
		choiceOpponentUnit(this.playerTeam, this.opponentTeam, this.cellsMatrix, this.unitsWithPosition, this.gamePlay)
		this.gameState.upMove()
	}

	onCellEnter(index) {
		const infoCell = checkUnitInCell(this.unitsWithPosition, index)

		if (infoCell.check) {
			const unit = this.unitsWithPosition[infoCell.index].character

			const message = generateMessage(unit.level, unit.attack, unit.defence, unit.health)

			this.gamePlay.showCellTooltip(message, index)
		}
		if (this.gameState.currentUnit) {
			setCursorNotification(index, infoCell, this.unitsWithPosition, this.gamePlay, this.gameState.currentUnit, this.cellsMatrix)
		}
	}

	onCellLeave(index) {
		this.gamePlay.hideCellTooltip(index)
	}
}
