import {COLORS} from './colors.js';

export class GCommand {
	commands: Command[];
	name: string;
	description: string;

	constructor(name: string, desc: string, commands: Array<Command>) 
	{
		this.commands = commands;
		this.name = name;
		this.description = desc;
	}

	getArguments(args: Array<string>)
	{
		if(args.length == 0)
		{
			console.log(this.toHelp());
			return;
		}
		if(args.length >= 1)
		{
			let command = this.getCommandWithName(args[0]);
			let paramApplication : any = {};

			command.commandParameters.forEach(param => {	
				let shortValue = args.indexOf(param.shortName) != -1 ? args[args.indexOf(param.shortName)+1] : param.getValue();
				let nameValue = args
				.filter((el) => { 
					return el.includes("=") && (el.split("=")[0] == param.name);
				}).map(el => el.split("=")[1])[0];
				paramApplication[param.name.slice(2)] = (nameValue == undefined) ? shortValue : nameValue;
			})
			command.launch(paramApplication);
		}
	}

	private getCommandWithName(name: string)
	{
		let command = this.commands.filter((el) => {return el.name == name});
		if(command.length > 1){ throw new Error("La commande existe en double...")}
		if(command.length == 0){ throw new Error("La commande n'existe pas!")}
		return command[0];
	
	}

	toHelp()
	{
		let message : string  = `$ ${COLORS.fg.Red}${this.name}${COLORS.font.Reset} <COMMAND> [PARAM] - ${this.description}\n${COLORS.font.Bright}Usage${COLORS.font.Reset} :`;
		this.commands.forEach(command => {
			message += command.toHelp();

		});
		return message;
	}
}

export class Command {
	commandParameters: CommandParameters[];
	name: string;
	description: string;
	callback: Function;

	constructor(name: string, desc: string, commandParameters: Array<CommandParameters>, callback: Function)
	{
		this.commandParameters = commandParameters;
		this.name = name;
		this.description = desc;
		this.callback = callback;
	}

	/**
	 * Launch command
	 */
	public launch(arg: unknown)
	{
		return this.callback(arg);
	}

	public toHelp()
	{
		let message : string  = `\n\t${this.name} - ${this.description}\n\t${COLORS.font.Bright}Usage${COLORS.font.Reset} :`;
		this.commandParameters.forEach(param => {
			message += param.toHelp();
		});
		return message;
	}

	public toString()
	{
		return `${this.name} - ${this.description}`;
	}

}

export class CommandParameters {
	shortName: string;
	name: string;
	description: string;
	value: string|number|unknown;

	constructor(name: string, shortName: string, description: string, defaultValue?: string|number)
	{
		this.name = "--" + name;
		this.shortName = "-" + shortName;
		this.description = description;
		this.value = defaultValue;
	}

	public setValue(v: string|number)
	{
		this.value = v;
	}

	public getValue() : string|number|unknown
	{
		return this.value
	}

	public toHelp()
	{
		return (`\n\t\t${this.shortName}, ${this.name} (${this.description})` + ((this.value) ? ` (Default:${this.value}))` : ''));
	}
	
}