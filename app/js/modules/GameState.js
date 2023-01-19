export default class GameState {
	static countMove = 0
	static currentUnit = null

	static current() {
		if (this.countMove % 2 === 0) {
			return false
		}

		return true
	}

	static upMove() {
		this.countMove += 1
	}

	static setCurrentUnit(object) {
		this.currentUnit = object
	}
}
