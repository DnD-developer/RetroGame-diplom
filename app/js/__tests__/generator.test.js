import { characterGenerator, generateTeam } from "../modules/generators"
import Bowman from "../modules/characters/Bowman"
import Vampire from "../modules/characters/Vampire"
import Daemon from "../modules/characters/Daemon"
import Magician from "../modules/characters/Magician"
import Swordsman from "../modules/characters/Swordsman"
import Undead from "../modules/characters/Undead"

describe("Function characterGenerator:", () => {
	test.each([
		[[Bowman, Swordsman], 1, 3, ["bowman", "swordsman"]],
		[[Magician, Vampire, Swordsman], 10, 5, ["magician", "swordsman", "vampire"]],
		[[Undead, Daemon, Vampire], 100, 1, ["undead", "daemon", "vampire"]]
	])("test using AllowTypes %i, count %i", (data, count, level, expected) => {
		const testCall = characterGenerator(data, level)
		const testArray = []
		for (let index = 0; index < count; index += 1) {
			testArray.push(testCall.next().value)
		}
		expect(testArray).toHaveLength(count)

		testArray.forEach(item => expect(expected).toContain(item.type))
	})
})

describe("Function generateTeam:", () => {
	test.each([
		{ data: [Bowman, Swordsman], count: 1, level: 3 },
		{ data: [Magician, Vampire, Swordsman], count: 10, level: 5 },
		{ data: [Undead, Daemon, Vampire], count: 100, level: 1 }
	])("test count Called $count and maxLevel $level", ({ data, count, level }) => {
		const testTeam = generateTeam(data, level, count)

		expect(testTeam.characters).toHaveLength(count)

		testTeam.characters.forEach(item => expect(item.level).toBeLessThanOrEqual(level))
	})
})
