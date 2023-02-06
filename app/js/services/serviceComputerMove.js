import checkPotentialMove, { checkPotentialAttack, attackUnit, movingUnit } from "./serviceForMoveAndAttack"

function selectMinUnit(teamArray, property) {
	let [min] = teamArray

	teamArray.forEach(unit => {
		if (unit.character[property] < min.character[property]) {
			min = unit
		}
	})

	return min
}

function selectMaxUnit(teamArray, property) {
	let [max] = teamArray

	teamArray.forEach(unit => {
		if (unit.character[property] > max.character[property]) {
			max = unit
		}
	})

	return max
}
function diffLength(goal, start) {
	const diffString = (this.cellsMatrix[goal].stringNumber - this.cellsMatrix[start].stringNumber) ** 2
	const diffCall = (this.cellsMatrix[goal].callNumber - this.cellsMatrix[start].callNumber) ** 2
	return Math.sqrt(diffString + diffCall)
}

function choiseNearUnitForGoal({ goal = null, start = null, teamArray }) {
	let [minPlayer] = teamArray
	let [minOpponent] = teamArray

	if (goal) {
		minPlayer = goal
	}

	if (start) {
		minOpponent = start
	}

	let diffMin = diffLength.call(this, minPlayer.position, minOpponent.position)

	teamArray.forEach(unit => {
		let difLength

		if (goal) {
			difLength = diffLength.call(this, minPlayer.position, unit.position)
		}

		if (start) {
			difLength = diffLength.call(this, unit.position, minOpponent.position)
		}

		if (difLength < diffMin) {
			diffMin = difLength

			if (start) {
				minPlayer = unit
			} else {
				minOpponent = unit
			}
		}
	})

	return { minPlayer, minOpponent, diffMin }
}

function selectMinNearUnit() {
	let [minPlayer] = this.unitsWithPositionPlayer
	let [minOpponent] = this.unitsWithPositionOpponent

	let diffMin = diffLength.call(this, minPlayer.position, minOpponent.position)
	this.unitsWithPositionOpponent.forEach(stU => {
		this.unitsWithPositionPlayer.forEach(unit => {
			const difLength = diffLength.call(this, stU.position, unit.position)

			if (difLength < diffMin) {
				diffMin = difLength
				minPlayer = unit
				minOpponent = stU
			}
		})
	})
	return { minPlayer, minOpponent, diffMin }
}

function initArrayCellsforMove(trend, start) {
	const arrayCellsforMove = []
	const startPosition = this.cellsMatrix[start.position]

	for (let string = 0; string <= start.character.move; string += 1) {
		for (let call = 0; call <= start.character.move; call += 1) {
			let goalIndex

			if (!(call === 0 && string === 0)) {
				goalIndex = this.cellsMatrix.findIndex(
					cell => cell.stringNumber === startPosition.stringNumber + string * trend && cell.callNumber === startPosition.callNumber + call * trend
				)
			}

			if (goalIndex && goalIndex !== -1) {
				if (checkPotentialMove.call(this, start, goalIndex)) {
					arrayCellsforMove.push(goalIndex)
				}
			}
		}
	}

	return arrayCellsforMove
}

function calculateMoveForComputer(goal, start) {
	const callTrend = this.cellsMatrix[goal.position].callNumber - this.cellsMatrix[start.position].callNumber
	let arrayCellsforMove = []
	if (callTrend <= 0 && this.cellsMatrix[start.position].callNumber !== 1) {
		arrayCellsforMove = [...initArrayCellsforMove.call(this, -1, start)]
	}

	if (callTrend >= 0 && this.cellsMatrix[start.position].callNumber !== this.gamePlay.boardSize) {
		arrayCellsforMove = [...initArrayCellsforMove.call(this, 1, start)]
	}

	let [nearCell] = arrayCellsforMove
	if (nearCell) {
		let diffMin = diffLength.call(this, goal.position, nearCell)

		arrayCellsforMove.forEach(cell => {
			const difLength = diffLength.call(this, goal.position, cell)

			if (difLength < diffMin) {
				nearCell = cell
				diffMin = difLength
			}
		})
	}

	return nearCell
}

function definePotentialMove() {
	const nearPlayer = calculateMoveForComputer.call(this, this.minNearPlayerUnit.minPlayer, this.minNearPlayerUnit.minOpponent)
	const maxDangerPlayer = calculateMoveForComputer.call(this, this.maxDangerPlayerUnit.minPlayer, this.maxDangerOpponentUnit.minOpponent)

	switch (true) {
		case nearPlayer && nearPlayer.length !== 0:
			movingUnit.call(this, this.minNearPlayerUnit.minOpponent, nearPlayer)
			break
		case maxDangerPlayer && maxDangerPlayer.length !== 0:
			movingUnit.call(this, this.maxDangerOpponentUnit.minOpponent, maxDangerPlayer)
			break
		default:
			break
	}
}

function definePotentialAttack() {
	switch (true) {
		case checkPotentialAttack.call(this, this.minHealthPlayerUnit.minOpponent, this.minHealthPlayerUnit.minPlayer.position):
			attackUnit.call(this, this.minHealthPlayerUnit.minOpponent, this.minHealthPlayerUnit.minPlayer.position)
			break
		case checkPotentialAttack.call(this, this.maxDangerOpponentUnit.minOpponent, this.maxDangerPlayerUnit.minPlayer.position):
			attackUnit.call(this, this.maxDangerOpponentUnit.minOpponent, this.maxDangerPlayerUnit.minPlayer.position)
			break
		case checkPotentialAttack.call(this, this.maxDangerOpponentUnit.minOpponent, this.maxDangerOpponentUnit.minPlayer.position):
			attackUnit.call(this, this.maxDangerOpponentUnit.minOpponent, this.maxDangerOpponentUnit.minPlayer.position)
			break
		case checkPotentialAttack.call(this, this.maxHealthOpponentUnit.minOpponent, this.maxDangerPlayerUnit.minPlayer.position):
			attackUnit.call(this, this.maxHealthOpponentUnit.minOpponent, this.maxDangerPlayerUnit.minPlayer.position)
			break
		case checkPotentialAttack.call(this, this.maxHealthOpponentUnit.minOpponent, this.maxHealthOpponentUnit.minPlayer.position):
			attackUnit.call(this, this.maxHealthOpponentUnit.minOpponent, this.maxHealthOpponentUnit.minPlayer.position)
			break
		case checkPotentialAttack.call(this, this.minNearPlayerUnit.minOpponent, this.minNearPlayerUnit.minPlayer.position):
			attackUnit.call(this, this.minNearPlayerUnit.minOpponent, this.minNearPlayerUnit.minPlayer.position)
			break
		default:
			definePotentialMove.call(this)
			break
	}
}

export default function choiceOpponentUnit() {
	this.minHealthPlayerUnit = choiseNearUnitForGoal.call(this, {
		goal: selectMinUnit(this.unitsWithPositionPlayer, "health"),
		teamArray: this.unitsWithPositionOpponent
	})

	this.minNearPlayerUnit = selectMinNearUnit.call(this)

	this.maxDangerPlayerUnit = choiseNearUnitForGoal.call(this, {
		goal: selectMaxUnit(this.unitsWithPositionPlayer, "attack"),
		teamArray: this.unitsWithPositionOpponent
	})

	this.maxHealthOpponentUnit = choiseNearUnitForGoal.call(this, {
		start: selectMaxUnit(this.unitsWithPositionOpponent, "health"),
		teamArray: this.unitsWithPositionPlayer
	})

	this.maxDangerOpponentUnit = choiseNearUnitForGoal.call(this, {
		start: selectMaxUnit(this.unitsWithPositionOpponent, "attack"),
		teamArray: this.unitsWithPositionPlayer
	})

	definePotentialAttack.call(this)
}
