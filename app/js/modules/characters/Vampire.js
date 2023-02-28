import Character from "../Character"

export default class Vampire extends Character {
	constructor(level) {
		super(level, "enemy", "vampire", 25, 25, 2, 2)
	}
}
