import { calcTileType } from "../modules/utils"

describe("CalcTileType function:", () => {
	test.each([
		[1, 8, "top"],
		[9, 8, "center"],
		[13, 7, "right"],
		[14, 7, "left"],
		[42, 7, "bottom-left"],
		[8, 9, "top-right"],
		[0, 5, "top-left"],
		[80, 9, "bottom-right"],
		[79, 9, "bottom"]
	])("test correct index line %i for boardSize %i", (a, b, expected) => {
		const result = calcTileType(a, b)
		expect(result).toBe(expected)
	})
})
