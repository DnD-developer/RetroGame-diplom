import Bowman from "../modules/characters/Bowman"
import { generateMessage } from "../services/serviceGameVontroller"

describe("Class GameController", () => {
	test("test message of unit options", () => {
		const unit = new Bowman(1)
		const result = generateMessage(unit.level, unit.attack, unit.defence, unit.health)
		expect(result).toBe("\u{1F396} 1 \u{1F5E1} 25 \u{1F6E1} 25 \u{2764} 50")
	})
})
