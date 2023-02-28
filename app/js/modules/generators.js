import Team from "./Team"

export function* characterGenerator(allowedTypes, maxLevel) {
	while (true) {
		const randomTypesIndex = Math.floor(Math.random() * allowedTypes.length)
		const randomLevel = Math.floor(Math.random() * maxLevel) + 1
		yield { unit: allowedTypes[randomTypesIndex], level: randomLevel }
	}
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
	const playerGenerator = characterGenerator(allowedTypes, maxLevel)
	const team = []

	for (let index = 0; index < characterCount; index += 1) {
		team.push(playerGenerator.next().value)
	}
	return new Team().playerTeamCharacters(team)
}
