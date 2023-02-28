import themes from "./themes"

export default class GameState {
	constructor() {
		this.countMove = 0
		this.currentUnit = null
		this.currentLevel = 1
		this.currentMap = themes.prairie
		this.triggerNewGame = true
		this.enemyTeam = ["vampire", "undead", "daemon"]
		this.playerTeam = ["bowman", "swordsman", "magician"]
	}

	current() {
		if (this.countMove % 2 === 0) {
			return false
		}

		return true
	}

	upMove() {
		this.countMove += 1
	}

	changeMap() {
		const currentNumberMap = this.currentLevel % 4
		switch (currentNumberMap) {
			case 1:
				this.currentMap = themes.prairie
				break
			case 2:
				this.currentMap = themes.desert
				break
			case 3:
				this.currentMap = themes.arctic
				break
			default:
				this.currentMap = themes.mountain
				break
		}
	}

	setCurrentUnit(object) {
		this.currentUnit = object
	}

	deleteCurrentUnit() {
		this.currentUnit = null
	}
}
