import Character from "../Character"

export default class Magician extends Character {
	constructor(level) {
		super(level, "player", "magician", 10, 40, 1, 4)
	}
}
