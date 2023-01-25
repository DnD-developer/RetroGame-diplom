import Daemon from "./characters/Daemon"
import Swordsman from "./characters/Swordsman"
import Magician from "./characters/Magician"
import Vampire from "./characters/Vampire"
import Undead from "./characters/Undead"
import Bowman from "./characters/Bowman"

export default class Team {
	constructor(characters) {
		this.characters = []
		this.playerTeamCharacters(characters)
	}

	playerTeamCharacters(characters) {
		characters.forEach(char => {
			switch (char.unit) {
				case "swordsman":
					this.characters.push(new Swordsman(char.level))
					break
				case "magician":
					this.characters.push(new Magician(char.level))
					break
				case "bowman":
					this.characters.push(new Bowman(char.level))
					break
				case "daemon":
					this.characters.push(new Daemon(char.level))
					break
				case "vampire":
					this.characters.push(new Vampire(char.level))
					break
				case "undead":
					this.characters.push(new Undead(char.level))
					break
				default:
					break
			}
		})
	}
}
