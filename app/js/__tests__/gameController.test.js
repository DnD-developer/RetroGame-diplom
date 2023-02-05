import Bowman from "../modules/characters/Bowman"
import Daemon from "../modules/characters/Daemon"
import Magician from "../modules/characters/Magician"
import Swordsman from "../modules/characters/Swordsman"
import Undead from "../modules/characters/Undead"
import Vampire from "../modules/characters/Vampire"
import { generateMessage } from "../services/serviceBasesForGame"
import checkPotentialMove, { checkPotentialAttack } from "../services/serviceForMoveAndAttack"

describe("Bases Logic", () => {
	test("test message of unit options", () => {
		const unit = new Bowman(1)
		const result = generateMessage(unit.level, unit.attack, unit.defence, unit.health)
		expect(result).toBe("\u{1F396} 1 \u{1F5E1} 25 \u{1F6E1} 25 \u{2764} 50")
	})
})

const cellsObjectMatrix = {
	unitsWithPosition: [],
	cellsMatrix: [
		{ stringNumber: 1, callNumber: 1 },
		{ stringNumber: 1, callNumber: 2 },
		{ stringNumber: 1, callNumber: 3 },
		{ stringNumber: 1, callNumber: 4 },
		{ stringNumber: 1, callNumber: 5 },
		{ stringNumber: 1, callNumber: 6 },
		{ stringNumber: 1, callNumber: 7 },
		{ stringNumber: 1, callNumber: 8 },
		{ stringNumber: 2, callNumber: 1 },
		{ stringNumber: 2, callNumber: 2 },
		{ stringNumber: 2, callNumber: 3 },
		{ stringNumber: 2, callNumber: 4 },
		{ stringNumber: 2, callNumber: 5 },
		{ stringNumber: 2, callNumber: 6 },
		{ stringNumber: 2, callNumber: 7 },
		{ stringNumber: 2, callNumber: 8 },
		{ stringNumber: 3, callNumber: 1 },
		{ stringNumber: 3, callNumber: 2 },
		{ stringNumber: 3, callNumber: 3 },
		{ stringNumber: 3, callNumber: 4 },
		{ stringNumber: 3, callNumber: 5 },
		{ stringNumber: 3, callNumber: 6 },
		{ stringNumber: 3, callNumber: 7 },
		{ stringNumber: 3, callNumber: 8 },
		{ stringNumber: 4, callNumber: 1 },
		{ stringNumber: 4, callNumber: 2 },
		{ stringNumber: 4, callNumber: 3 },
		{ stringNumber: 4, callNumber: 4 },
		{ stringNumber: 4, callNumber: 5 },
		{ stringNumber: 4, callNumber: 6 },
		{ stringNumber: 4, callNumber: 7 },
		{ stringNumber: 4, callNumber: 8 },
		{ stringNumber: 5, callNumber: 1 },
		{ stringNumber: 5, callNumber: 2 },
		{ stringNumber: 5, callNumber: 3 },
		{ stringNumber: 5, callNumber: 4 },
		{ stringNumber: 5, callNumber: 5 },
		{ stringNumber: 5, callNumber: 6 },
		{ stringNumber: 5, callNumber: 7 },
		{ stringNumber: 5, callNumber: 8 },
		{ stringNumber: 6, callNumber: 1 },
		{ stringNumber: 6, callNumber: 2 },
		{ stringNumber: 6, callNumber: 3 },
		{ stringNumber: 6, callNumber: 4 },
		{ stringNumber: 6, callNumber: 5 },
		{ stringNumber: 6, callNumber: 6 },
		{ stringNumber: 6, callNumber: 7 },
		{ stringNumber: 6, callNumber: 8 },
		{ stringNumber: 7, callNumber: 1 },
		{ stringNumber: 7, callNumber: 2 },
		{ stringNumber: 7, callNumber: 3 },
		{ stringNumber: 7, callNumber: 4 },
		{ stringNumber: 7, callNumber: 5 },
		{ stringNumber: 7, callNumber: 6 },
		{ stringNumber: 7, callNumber: 7 },
		{ stringNumber: 7, callNumber: 8 },
		{ stringNumber: 8, callNumber: 1 },
		{ stringNumber: 8, callNumber: 2 },
		{ stringNumber: 8, callNumber: 3 },
		{ stringNumber: 8, callNumber: 4 },
		{ stringNumber: 8, callNumber: 5 },
		{ stringNumber: 8, callNumber: 6 },
		{ stringNumber: 8, callNumber: 7 },
		{ stringNumber: 8, callNumber: 8 }
	]
}

const start = 28

describe("Moving", () => {
	test.each([
		{
			unit: "swordsman",
			className: new Swordsman(1),
			result: [20, 12, 4, 36, 44, 52, 60, 27, 26, 25, 24, 29, 30, 31, 21, 14, 7, 19, 10, 1, 35, 42, 49, 56, 37, 46, 55]
		},
		{
			unit: "bowman",
			className: new Bowman(1),
			result: [20, 12, 36, 44, 27, 26, 29, 30, 21, 14, 19, 10, 35, 42, 37, 46]
		},
		{
			unit: "magician",
			className: new Magician(1),
			result: [20, 36, 27, 29, 21, 19, 35, 37]
		},
		{ unit: "daemon", className: new Daemon(1), result: [20, 36, 27, 29, 21, 19, 35, 37] },
		{
			unit: "undead",
			className: new Undead(1),
			result: [20, 12, 4, 36, 44, 52, 60, 27, 26, 25, 24, 29, 30, 31, 21, 14, 7, 19, 10, 1, 35, 42, 49, 56, 37, 46, 55]
		},
		{
			unit: "vampire",
			className: new Vampire(1),
			result: [20, 12, 36, 44, 27, 26, 29, 30, 21, 14, 19, 10, 35, 42, 37, 46]
		}
	])("test potential move for $unit", ({ className, result }) => {
		const boardMove = []
		for (let i = 0; i < 64; i += 1) {
			if (checkPotentialMove.call(cellsObjectMatrix, { position: start, character: className }, i) && i !== start) {
				boardMove.push(i)
			}
		}
		result.sort((a, b) => a - b)
		expect(boardMove).toEqual(result)
	})
})

describe("Attack", () => {
	function pushResult(index, result) {
		if (index !== -1 && result.findIndex(cell => cell === index) === -1) {
			result.push(index)
		}
	}

	function calculateResult(lengthAttack) {
		const result = []
		const stringNumber = 4
		const callNumber = 5

		for (let i = 0; i <= lengthAttack; i += 1) {
			for (let j = 0; j <= lengthAttack; j += 1) {
				const diffStringPlus = i
				const diffStringMinus = -i
				const diffCallPlus = j
				const diffCallMinus = -j

				const index1 = cellsObjectMatrix.cellsMatrix.findIndex(
					cell => cell.stringNumber === stringNumber + diffStringPlus && cell.callNumber === callNumber + diffCallPlus
				)
				const index2 = cellsObjectMatrix.cellsMatrix.findIndex(
					cell => cell.stringNumber === stringNumber + diffStringPlus && cell.callNumber === callNumber + diffCallMinus
				)
				const index3 = cellsObjectMatrix.cellsMatrix.findIndex(
					cell => cell.stringNumber === stringNumber + diffStringMinus && cell.callNumber === callNumber + diffCallPlus
				)
				const index4 = cellsObjectMatrix.cellsMatrix.findIndex(
					cell => cell.stringNumber === stringNumber + diffStringMinus && cell.callNumber === callNumber + diffCallMinus
				)

				pushResult(index1, result)
				pushResult(index2, result)
				pushResult(index3, result)
				pushResult(index4, result)
			}
		}
		return result
	}

	test.each([
		{
			unit: "swordsman",
			className: new Swordsman(1),
			result: calculateResult(1)
		},
		{
			unit: "bowman",
			className: new Bowman(1),
			result: calculateResult(2)
		},
		{
			unit: "magician",
			className: new Magician(1),
			result: calculateResult(4)
		},
		{ unit: "daemon", className: new Daemon(1), result: calculateResult(4) },
		{
			unit: "undead",
			className: new Undead(1),
			result: calculateResult(1)
		},
		{
			unit: "vampire",
			className: new Vampire(1),
			result: calculateResult(2)
		}
	])("test potential attack for $unit", ({ className, result }) => {
		const boardMove = []
		for (let i = 0; i < 64; i += 1) {
			if (checkPotentialAttack.call(cellsObjectMatrix, { position: start, character: className }, i)) {
				boardMove.push(i)
			}
		}
		result.sort((a, b) => a - b)
		expect(boardMove).toEqual(result)
	})
})
