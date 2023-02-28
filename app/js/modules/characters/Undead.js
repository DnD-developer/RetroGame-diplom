import Character from "../Character"

export default class Undead extends Character {
	constructor(level) {
		super(level, "enemy", "undead", 40, 10, 4, 1)
	}
}
