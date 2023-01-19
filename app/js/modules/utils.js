export function calcTileType(index, boardSize) {
	const result = {
		topLeft: "top-left",
		topRight: "top-right",
		top: "top",
		bottomLeft: "bottom-left",
		bottomRight: "bottom-right",
		bottom: "bottom",
		right: "right",
		left: "left",
		center: "center"
	}

	switch (true) {
		case index === 0:
			return result.topLeft
		case index >= boardSize * boardSize - 1:
			return result.bottomRight
		case index === boardSize - 1:
			return result.topRight
		case index === boardSize * (boardSize - 1):
			return result.bottomLeft
		case index <= boardSize - 1:
			return result.top
		case index % boardSize === 0:
			return result.left
		case index % boardSize === boardSize - 1:
			return result.right
		case index > boardSize * (boardSize - 1):
			return result.bottom
		default:
			return result.center
	}
}

export function calcHealthLevel(health) {
	if (health < 15) {
		return "critical"
	}

	if (health < 50) {
		return "normal"
	}

	return "high"
}
