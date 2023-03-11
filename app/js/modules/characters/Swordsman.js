import Character from "../Character"

export default class Swordsman extends Character {
	constructor(level) {
		super(level, "player", "swordsman", 40, 10, 4, 1)
	}
}
