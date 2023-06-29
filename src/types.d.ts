interface CommandParameters {
	param: string,
	value: string|number,
	description: string,
}

interface Command {
	name: string,
	parameters: Array<CommandParameters>,
	description: string
} 

interface GCommand {
	name: string,
	description: string,
	commands: Array<Command>
}

interface paramApplication {
	[key: string]: number|string
}