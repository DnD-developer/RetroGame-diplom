import { characterGenerator, generateTeam } from "../modules/generators"

describe("Function characterGenerator:", () => {
	test.each([
		[["bowman", "swordsman"], 1, 3, ["bowman", "swordsman"]],
		[["magician", "vampire", "swordsman"], 10, 5, ["magician", "swordsman", "vampire"]],
		[["undead", "daemon", "vampire"], 100, 1, ["undead", "daemon", "vampire"]]
	])("test using AllowTypes %i, count %i", (data, count, level, expected) => {
		const testCall = characterGenerator(data, level)
		const testArray = []
		for (let index = 0; index < count; index += 1) {
			testArray.push(testCall.next().value)
		}
		expect(testArray).toHaveLength(count)

		testArray.forEach(item => expect(expected).toContain(item.unit))
	})
})

describe("Function generateTeam:", () => {
	test.each([
		{ data: ["bowman", "swordsman"], count: 1, level: 3 },
		{ data: ["magician", "vampire", "swordsman"], count: 10, level: 5 },
		{ data: ["undead", "daemon", "vampire"], count: 100, level: 1 }
	])("test count Called $count and maxLevel $level", ({ data, count, level }) => {
		const testTeam = generateTeam(data, level, count)

		expect(testTeam.characters).toHaveLength(count)

		testTeam.characters.forEach(item => expect(item.level).toBeLessThanOrEqual(level))
	})
})
