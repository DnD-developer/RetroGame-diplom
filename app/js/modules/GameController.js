import themes from "./themes"
import GameState from "./GameState"
import { generateTeam } from "./generators"
import checkUnitInCell, {
	checkPlayerTeam,
	createInformation,
	generateCollectionsStartPositions,
	renderUnitsOnBoard
} from "../services/serviceBasesForGame"
import { selectedUnit, removeSelect, setCursorNotification, deleteCursorNotification } from "../services/serviceForSelectedUnit"

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
			if (checkUnitInCell.call(this, index).check) {
				selectedUnit.call(this, checkUnitInCell.call(this, index).index, index, this.gamePlay, this.unitsWithPosition)
				if (checkPlayerTeam(this.unitsWithPosition[checkUnitInCell.call(this, index).index].character)) {
					GameState.setCurrentUnit(this.unitsWithPosition[checkUnitInCell.call(this, index).index])
				}
			} else if (GameState.currentUnit) {
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
