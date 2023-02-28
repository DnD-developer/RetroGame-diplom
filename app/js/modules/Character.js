export default class Character {
	constructor(level, team, type = "generic", attack = 0, defence = 0, move = 0, attackLength = 0) {
		if (new.target.name === "Character") {
			throw new Error("this class cannot be called")
		}

		this.level = level
		this.attack = attack
		this.defence = defence
		this.health = 50
		this.type = type
		this.team = team
		this.move = move
		this.lengthAttack = attackLength

		for (let l = 2; l <= this.level; l += 1) {
			this.upAttack()
			this.upHealth()
		}
	}

	upAttack() {
		this.attack = Math.floor(Math.max(this.attack, (this.attack * (80 + this.health)) / 100))
	}

	upHealth() {
		this.health += 80
		this.health = this.health > 100 ? 100 : this.health
	}
}
