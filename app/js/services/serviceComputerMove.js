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

function diffLength(goal, start, cellsMatrix) {
	const diffString = (cellsMatrix[goal].stringNumber - cellsMatrix[start].stringNumber) ** 2
	const diffCall = (cellsMatrix[goal].callNumber - cellsMatrix[start].callNumber) ** 2
	return Math.sqrt(diffString + diffCall)
}

function choiseNearUnitForGoal({ goal = null, start = null, teamArray, cellsMatrix }) {
	let [minPlayer] = teamArray
	let [minOpponent] = teamArray

	if (goal) {
		minPlayer = goal
	}

	if (start) {
		minOpponent = start
	}

	let diffMin = diffLength(minPlayer.position, minOpponent.position, cellsMatrix)

	teamArray.forEach(unit => {
		let difLength

		if (goal) {
			difLength = diffLength(minPlayer.position, unit.position, cellsMatrix)
		}

		if (start) {
			difLength = diffLength(unit.position, minOpponent.position, cellsMatrix)
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

function selectMinNearUnit(playerTeam, opponentTeam, cellsMatrix) {
	let [minPlayer] = playerTeam
	let [minOpponent] = opponentTeam

	let diffMin = diffLength(minPlayer.position, minOpponent.position, cellsMatrix)
	opponentTeam.forEach(stU => {
		playerTeam.forEach(unit => {
			const difLength = diffLength(stU.position, unit.position, cellsMatrix)

			if (difLength < diffMin) {
				diffMin = difLength
				minPlayer = unit
				minOpponent = stU
			}
		})
	})
	return { minPlayer, minOpponent, diffMin }
}

function initArrayCellsforMove(trend, start, cellsMatrix, unitsWithPosition) {
	const arrayCellsforMove = []
	const startPosition = cellsMatrix[start.position]

	for (let string = 0; string <= start.character.move; string += 1) {
		for (let call = 0; call <= start.character.move; call += 1) {
			let goalIndex

			if (!(call === 0 && string === 0)) {
				goalIndex = cellsMatrix.findIndex(
					cell => cell.stringNumber === startPosition.stringNumber + string * trend && cell.callNumber === startPosition.callNumber + call * trend
				)
			}

			if (goalIndex && goalIndex !== -1) {
				if (checkPotentialMove(unitsWithPosition, start, cellsMatrix, goalIndex)) {
					arrayCellsforMove.push(goalIndex)
				}
			}
		}
	}

	return arrayCellsforMove
}

function calculateMoveForComputer(goal, start, cellsMatrix, gamePlay, unitsWithPosition) {
	const callTrend = cellsMatrix[goal.position].callNumber - cellsMatrix[start.position].callNumber
	let arrayCellsforMove = []
	if (callTrend <= 0 && cellsMatrix[start.position].callNumber !== 1) {
		arrayCellsforMove = [...initArrayCellsforMove(-1, start, cellsMatrix, unitsWithPosition)]
	}

	if (callTrend >= 0 && cellsMatrix[start.position].callNumber !== gamePlay.boardSize) {
		arrayCellsforMove = [...initArrayCellsforMove(1, start, cellsMatrix, unitsWithPosition)]
	}

	let [nearCell] = arrayCellsforMove
	if (nearCell) {
		let diffMin = diffLength(goal.position, nearCell, cellsMatrix)

		arrayCellsforMove.forEach(cell => {
			const difLength = diffLength(goal.position, cell, cellsMatrix)

			if (difLength < diffMin) {
				nearCell = cell
				diffMin = difLength
			}
		})
	}

	return nearCell
}

function definePotentialMove({ unitsWithPosition, cellsMatrix, minNearPlayerUnit, gamePlay }) {
	const nearPlayer = calculateMoveForComputer(minNearPlayerUnit.minPlayer, minNearPlayerUnit.minOpponent, cellsMatrix, gamePlay, unitsWithPosition)

	switch (true) {
		case nearPlayer && nearPlayer.length !== 0:
			movingUnit(unitsWithPosition, minNearPlayerUnit.minOpponent, gamePlay, nearPlayer)
			break
		default:
			break
	}
}

async function definePotentialAttack({ minHealthPlayerUnit, minNearPlayerUnit, cellsMatrix, unitsWithPosition, gamePlay }) {
	switch (true) {
		case checkPotentialAttack(minHealthPlayerUnit.minOpponent, cellsMatrix, minHealthPlayerUnit.minPlayer.position):
			await attackUnit(unitsWithPosition, minHealthPlayerUnit.minOpponent, gamePlay, minHealthPlayerUnit.minPlayer.position)
			break
		case checkPotentialAttack(minNearPlayerUnit.minOpponent, cellsMatrix, minNearPlayerUnit.minPlayer.position):
			await attackUnit(unitsWithPosition, minNearPlayerUnit.minOpponent, gamePlay, minNearPlayerUnit.minPlayer.position)
			break
		default:
			definePotentialMove({ unitsWithPosition, cellsMatrix, minNearPlayerUnit, gamePlay })
			break
	}
}

export default function choiceOpponentUnit(playerTeam, opponentTeam, cellsMatrix, unitsWithPosition, gamePlay) {
	const choiseGoal = {
		cellsMatrix,
		unitsWithPosition,
		gamePlay
	}

	choiseGoal.minHealthPlayerUnit = choiseNearUnitForGoal({
		goal: selectMinUnit(playerTeam, "health"),
		teamArray: opponentTeam,
		cellsMatrix
	})

	choiseGoal.minNearPlayerUnit = selectMinNearUnit(playerTeam, opponentTeam, cellsMatrix)

	definePotentialAttack(choiseGoal)
}
