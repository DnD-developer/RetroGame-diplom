import themes from "./themes"

export default class GameState {
	static countMove = 0
	static currentUnit = null
	static currentLevel = 1
	static currentMap = themes.prairie
	static triggerNewGame = true

	static current() {
		if (this.countMove % 2 === 0) {
			return false
		}

		return true
	}

	static upMove() {
		this.countMove += 1
	}

	static changeMap() {
		const currentNumberMap = this.level % 4

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

	static setPlayerMove() {
		this.countMove = 1
	}

	static setCurrentUnit(object) {
		this.currentUnit = object
	}

	static deleteCurrentUnit() {
		this.currentUnit = null
	}
}
