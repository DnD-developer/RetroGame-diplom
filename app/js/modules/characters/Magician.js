import Character from "../Character"

export default class Magician extends Character {
	constructor(level) {
		super(level, "player", "magician", 150, 40, 1, 4)
	}
}
