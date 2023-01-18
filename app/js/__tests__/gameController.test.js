import GameController from "../modules/GameController"
import Bowman from "../modules/characters/Bowman"
import GamePlay from "../modules/GamePlay"
import GameStateService from "../modules/GameStateService"

describe("Class GameController", () => {
	test("test message of unit options", () => {
		const unit = new Bowman(1)
		const result = new GameController(new GamePlay(), new GameStateService()).generateMessage(unit.level, unit.attack, unit.defence, unit.health)
		expect(result).toBe("\u{1F396} 1 \u{1F5E1} 25 \u{1F6E1} 25 \u{2764} 50")
	})
})
