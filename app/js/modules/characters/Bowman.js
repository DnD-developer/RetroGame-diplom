import Character from "../Character"

export default class Bowman extends Character {
	constructor(level) {
		super(level, "player", "bowman", 150, 25, 2, 2)
	}
}
