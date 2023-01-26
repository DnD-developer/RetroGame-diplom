export default class Character {
	constructor(level, type = "generic", attack = 0, defence = 0, move = 0, attackLength = 0) {
		if (new.target.name === "Character") {
			throw new Error("this class cannot be called")
		}

		this.level = level
		this.attack = attack
		this.defence = defence
		this.health = 50
		this.type = type
		this.move = move
		this.lengthAttack = attackLength
	}
}
