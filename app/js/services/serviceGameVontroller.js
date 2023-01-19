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

function calculateAcceptMove(index, countCell) {
	const topMove = []
	const rightMove = []
	const bottomMove = []
	const leftMove = []
	const topLeftMove = []
	const topRightMove = []
	const bottomLeftMove = []
	const bottomRightMove = []

	for (let i = 1; i <= countCell; i += 1) {
		const cellAcceptTop = index - this.gamePlay.boardSize * i
		if (this.gamePlay.cells.findIndex(indexCell => cellAcceptTop === indexCell)) {
			topMove.push(cellAcceptTop)
		}

		const cellAcceptBottom = index + this.gamePlay.boardSize * i
		if (this.gamePlay.cells.findIndex(indexCell => cellAcceptBottom === indexCell)) {
			bottomMove.push(cellAcceptBottom)
		}

		const cellAcceptRight = index + i
		if (this.gamePlay.cells.findIndex(indexCell => cellAcceptRight === indexCell)) {
			rightMove.push(cellAcceptRight)
		}
	}

	return {
		topMove,
		rightMove,
		bottomMove,
		leftMove,
		topLeftMove,
		topRightMove,
		bottomLeftMove,
		bottomRightMove
	}
}

export function switchAcceptMove(index, currentUnit) {
	switch (currentUnit.character.type) {
		case "swordsman":
		case "undead":
			return calculateAcceptMove(index, 4)

		default:
			return false
	}
}
