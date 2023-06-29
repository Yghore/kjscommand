import { COLORS } from './colors.js';
export class GCommand {
    commands;
    name;
    description;
    constructor(name, desc, commands) {
        this.commands = commands;
        this.name = name;
        this.description = desc;
    }
    getArguments(args) {
        if (args.length == 0) {
            console.log(this.toHelp());
            return;
        }
        if (args.length >= 1) {
            let command = this.getCommandWithName(args[0]);
            let paramApplication = {};
            command.commandParameters.forEach(param => {
                let shortValue = args.indexOf(param.shortName) != -1 ? args[args.indexOf(param.shortName) + 1] : param.getValue();
                let nameValue = args
                    .filter((el) => {
                    return el.includes("=") && (el.split("=")[0] == param.name);
                }).map(el => el.split("=")[1])[0];
                paramApplication[param.name.slice(2)] = (nameValue == undefined) ? shortValue : nameValue;
            });
            command.launch(paramApplication);
        }
    }
    getCommandWithName(name) {
        let command = this.commands.filter((el) => { return el.name == name; });
        if (command.length > 1) {
            throw new Error("La commande existe en double...");
        }
        if (command.length == 0) {
            throw new Error("La commande n'existe pas!");
        }
        return command[0];
    }
    toHelp() {
        let message = `$ ${COLORS.fg.Red}${this.name}${COLORS.font.Reset} <COMMAND> [PARAM] - ${this.description}\n${COLORS.font.Bright}Usage${COLORS.font.Reset} :`;
        this.commands.forEach(command => {
            message += command.toHelp();
        });
        return message;
    }
}
export class Command {
    commandParameters;
    name;
    description;
    callback;
    constructor(name, desc, commandParameters, callback) {
        this.commandParameters = commandParameters;
        this.name = name;
        this.description = desc;
        this.callback = callback;
    }
    /**
     * Launch command
     */
    launch(arg) {
        return this.callback(arg);
    }
    toHelp() {
        let message = `\n\t${this.name} - ${this.description}\n\t${COLORS.font.Bright}Usage${COLORS.font.Reset} :`;
        this.commandParameters.forEach(param => {
            message += param.toHelp();
        });
        return message;
    }
    toString() {
        return `${this.name} - ${this.description}`;
    }
}
export class CommandParameters {
    shortName;
    name;
    description;
    value;
    constructor(name, shortName, description, defaultValue) {
        this.name = "--" + name;
        this.shortName = "-" + shortName;
        this.description = description;
        this.value = defaultValue;
    }
    setValue(v) {
        this.value = v;
    }
    getValue() {
        return this.value;
    }
    toHelp() {
        return (`\n\t\t${this.shortName}, ${this.name} (${this.description})` + ((this.value) ? ` (Default:${this.value}))` : ''));
    }
}
