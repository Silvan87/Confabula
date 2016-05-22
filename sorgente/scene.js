function vocabolario() {
	Lingua.predicati = ["guardo", "osservo", "esamino", "prendo", "inventario", "apro", "chiudo", "entro", "esco", "leggo"];
	Lingua.equivalenze = [
		["ovest", "o"], ["nord", "n"], ["est", "e"], ["sud", "s"],
		["", "'"], ["", "il", "lo", "la", "i", "gli", "le", "l", "gl"], ["", "un", "uno", "una"],
		["", "di", "del", "dello", "della", "dei", "degli", "delle", "dell", "d"],
		["", "a", "al", "allo", "alla", "ai", "agli", "alle", "all"],
		["", "da", "dal", "dallo", "dalla", "dai", "dagli", "dalle", "dall"],
		["", "in", "nel", "nello", "nella", "nei", "negli", "nelle", "nell"],
		["", "su", "sul", "sullo", "sulla", "sui", "sugli", "sulle", "sull"],
		["inventario", "i"],
		["guardo", "guarda"], ["osservo", "osserva"], ["", "esamino", "esamina"], ["prendo", "prendi"], ["apro", "apri"], ["chiudo", "chiudi"], ["entro", "entra"], ["esco", "esci"], ["leggo", "leggi"]
	];
}
function istruzioniGenerali() {
	titolo("La mia storia");
	uscita("guardo|g", 0, 0);
	rispondi("vocabolario|v", Lingua.predicati.sort().join(', '));
	contenitore(1, "i", "", "");
	rispondi("inventario", "Hai con te: @i@.");
	rispondi("aiuto", "Scrivi 'istruzioni' per leggere le istruzioni e 'vocabolario' o 'v' per leggere i predicati con cui interagire con gli oggetti.");
	rispondi("nord|sud|ovest|est|giú|su", "Non è possibile procedere in quella direzione.");
	rispondi("istruzioni", "Scrivi in prima persona o usa l'imperativo. Puoi omettere gli articoli. Scrivi 'vocabolario' o 'v' per leggere i predicati disponibili. Il predicato 'esamino' è l'unico che può essere omesso. Raggiungi un luogo già visitato scrivendo 'direzione' o 'd' e 'nome luogo'. I luoghi raggiungibili sono consultabili scrivendo 'direzioni' o 'd'. Diversi luoghi hanno comportamenti speciali. Se non ci sono uscite visibili è vietato usare le direzioni. Rileggi una scena scrivendo 'guardo' o 'g'. Scrivi 'inventario' o 'i' per consultarlo. Scrivi 'istruzioni' se vuoi rileggerle ancora.");
	rispondi("osservo", "Cosa vorresti osservare? Puoi farlo anche da lontano.");
	rispondi("esamino", "Cosa vorresti esaminare? Devono essere oggetti raggiungibili.");
	rispondi("prendo", "Cosa vorresti prendere?");
	rispondi("apro", "Cosa vorresti aprire?");
	rispondi("chiudo", "Cosa vorresti chiudere?");
	rispondi("entro", "Dove vorresti entrare?");
	rispondi("esco", "Da dove vorresti uscire?");
	rispondi("leggo", "Cosa vorresti leggere?");
}
// Istruzioni specifiche per ciascuna scena
function scena(n) {
	Scena.avvia(n);
	switch (n) {
	case 1:
		testo("Copertina della storia", "centrato");
		scegliVai("Inizia", 2, "centrato");
		scegliRispondi("Istruzioni", "", "centrato");
		scegliRispondi("Licenza", "Specificate la licenza con cui rilasciate la storia.", "centrato");
		break;
	case 2:
		testo("Introduzione alla storia o inizio diretto...<br />Puoi vedere: una storia vuota.");
		rispondi("esamino la storia", "È tutta da scrivere...");
		break;
	}
	Scena.concludi();
}