# KJSCOMMAND

Librairie simpliste pour la création de commandes CLI.

## Exemple


```js


import {GCommand, Command, CommandParameters} from "kjscommand/build/index.js";

const param1 = new CommandParameters("param", "p", "Description ici", "defaut");
const param2 = new CommandParameters("superparam", "sp", "Autre description");

const command = new Command("command", "Description de la commande", [param1, param2], function(arg = {param, superparam})
{
	console.log("Param1 :" + arg.param + " Param 2 :" + arg.superparam);
}

const gCommand = new GCommand("test", "Description de l'application", [command]);
gCommand.getArguments(process.argv.slice(2));


```

La commande se décompose comme ceci : ``test command --param="autre" -sp 12``
- **test** correspond à ``GCommand`` (le nom attribué doit être le même que celui du fichier de préférence)
- **command** correspond à ``Command`` qui est une sous commande de la commande globale
- les **paramètres** peuvent être donné de deux facons sous la forme complète ``--param=[VALEUR]` ou alors sous la forme raccourci ``-p 12``


Pour **récupérer** les **paramètres** il faut simplement définir dans la fonction de **callback** un premier paramètres qui contiendra tous les paramètres de la commande sous la forme suivante : arg.<NAME> (<NAME> correspond au nom entier du paramètre)

**getArguments()** prend en paramètre un tableau d'arguments.