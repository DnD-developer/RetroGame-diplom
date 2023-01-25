import Character from "../Character"

export default class Daemon extends Character {
	constructor(level) {
		super(level, "daemon", 10, 10, 1, 4)
		this.attack = 10
		this.defence = 10
	}
}
