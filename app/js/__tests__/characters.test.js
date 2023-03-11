import Character from "../modules/Character"
import Bowman from "../modules/characters/Bowman"
import Vampire from "../modules/characters/Vampire"
import Daemon from "../modules/characters/Daemon"
import Magician from "../modules/characters/Magician"
import Swordsman from "../modules/characters/Swordsman"
import Undead from "../modules/characters/Undead"

describe("Class Character", () => {
	test("test error of call new Character ", () => {
		expect(() => new Character(1)).toThrow("this class cannot be called")
	})
})

describe("Scion of Character", () => {
	test.each([
		[Bowman, { level: 1, team: "player", type: "bowman", health: 50, attack: 150, defence: 25, move: 2, lengthAttack: 2 }],
		[Swordsman, { level: 1, team: "player", type: "swordsman", health: 50, attack: 150, defence: 10, move: 4, lengthAttack: 1 }],
		[Magician, { level: 1, team: "player", type: "magician", health: 50, attack: 150, defence: 40, move: 1, lengthAttack: 4 }],
		[Vampire, { level: 1, team: "enemy", type: "vampire", health: 50, attack: 25, defence: 25, move: 2, lengthAttack: 2 }],
		[Undead, { level: 1, team: "enemy", type: "undead", health: 50, attack: 40, defence: 10, move: 4, lengthAttack: 1 }],
		[Daemon, { level: 1, team: "enemy", type: "daemon", health: 50, attack: 10, defence: 10, move: 1, lengthAttack: 4 }]
	])("test correct create class %i", (TestClass, expected) => {
		const result = new TestClass(1)

		expect(result).toEqual(expected)
	})
})
