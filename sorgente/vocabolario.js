function vocabolario() {
	Lingua.predicati("guardo|osservo|esamino|prendo|inventario|apro|chiudo|entro|esco|leggo");
	Lingua.equivalenze([
		["ovest|o"], ["nord|n"], ["est|e"], ["sud|s"],
		["|il|lo|la|i|gli|le|l|gl"], ["|un|uno|una"],
		["di|del|dello|della|dei|degli|delle|dell|d"],
		["a|al|allo|alla|ai|agli|alle|all"],
		["da|dal|dallo|dalla|dai|dagli|dalle|dall"],
		["in|nel|nello|nella|nei|negli|nelle|nell"],
		["con|col|collo|colla|coi|congli|colle|coll"],
		["su|sul|sullo|sulla|sui|sugli|sulle|sull"],
		["per|pel|perlo|perla|pei|pergli|perle|perl"],
		["tra|tral|trallo|tralla|trai|tragli|tralle|tral"],
		["fra|fral|frallo|fralla|frai|fragli|fralle|fral"],
		["|esamino|esamina"], ["guardo|guarda"], ["osservo|osserva"], ["prendo|prendi"], ["apro|apri"], ["chiudo|chiudi"], ["entro|entra"], ["esco|esci"], ["leggo|leggi"]
	]);
}