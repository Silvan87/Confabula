// Istruzioni che valgono in tutte le scene
function istruzioniGenerali() {
	nomeStoria("La mia storia");
	messaggiRifiuto("Prova qualcos'altro...|Un tentativo vano...|Ricerca infruttuosa...");
	rispondi("quit|exit", "Per uscire chiudi la scheda del browser. Se desideri ricominciare daccapo puoi aggiornare la pagina del browser o scrivere 'restart'.");
	rispondi("restart", "Ricaricare tutto comporterà la perdita delle informazioni sulla partita in corso. Per confermare scrivi 'restart!' con il punto esclamativo.");
	rispondiVai("restart!", "Ok! Ricarico tutto...", 1);
	uscita("guardo", 0, "invisibile");
	rispondi("vocabolario|v", "Predicati ricorrenti: apro, chiudo, entro, esamino, esco, guardo, inventario, prendo.<br />Comandi speciali: istruzioni, vocabolario, direzioni, restart, save, load, quit.");
	contenitore("inventario", "");
	rispondi("inventario|i", "Hai con te: @inventario@.");
	rispondi("aiuto", "Scrivi 'istruzioni' per leggere le istruzioni e 'vocabolario' o 'v' per leggere i predicati con cui interagire con gli oggetti.");
	rispondi("nord|sud|ovest|est|su|giù", "Non è possibile procedere in quella direzione.");
	rispondi("istruzioni", "Scrivi in prima persona o usa l'imperativo. Puoi omettere gli articoli. Scrivi 'vocabolario' o 'v' per leggere i predicati disponibili. Il predicato 'esamino' è l'unico che può essere omesso. Raggiungi un luogo già visitato scrivendo 'direzione' o 'd' e 'nome luogo'. I luoghi raggiungibili sono consultabili scrivendo 'direzioni' o 'd'. I luoghi possono avere comportamenti speciali. Rileggi una scena scrivendo 'guardo' o 'g'. Scrivi 'inventario' o 'i' per consultarlo.");
	rispondi("esamino", "Cosa vorresti esaminare? Devono essere oggetti raggiungibili.");
	rispondi("prendo", "Cosa vorresti prendere?");
	rispondi("apro", "Cosa vorresti aprire?");
	rispondi("chiudo", "Cosa vorresti chiudere?");
	rispondi("entro", "Dove vorresti entrare?");
	rispondi("esco", "Da dove vorresti uscire?");
}
// Istruzioni specifiche per ciascuna scena
function istruzioniScena(n) {
	Vista.preparaScena(n);
	switch (n) {
	case 1:
		testo("Copertina della storia", "centrato");
		scegliVai("Inizia", 2, "centrato");
		scegliRispondi("Istruzioni", "", "centrato");
		scegliRispondi("Stile di gioco", "Lo stile di gioco è basato sui principi derivanti dalla <a href=\"http://ifarchive.smallwhitehouse.org/if-archive/info/Craft.Of.Adventure.pdf\" target=\"_blank\">Carta dei diritti del giocatore</a> di Graham Nelson ed ulteriormente rielaborati:</p><ol><li><b>Dichiarare i principi adottati.</b> Ogni storia interattiva dovrebbe dichiarare i principi che adotta affinché il giocatore sappia quale stile di gioco lo attende.</li><li><b>Fornire le istruzioni.</b> Le istruzioni complete vanno sempre offerte all'inizio del gioco.</li><li><b>Giocabilità prioritaria sul realismo.</b> Funzionalità e scorrevolezza della storia devono essere soddisfatte, anche con espedienti irreali o comandi scorciatoia, piuttosto che rispettare un rigido realismo che guasta la giocabilità con procedure pedanti o altrimenti fastidiose.</li><li><b>Tempo che scorre con le mosse.</b> Il tempo reale può condizionare messaggi scenici o effetti grafici, ma non deve far scorrere la storia. Questa avanza solo con le mosse del giocatore.</li><li><b>Mappa automatica o navigazione comoda.</b> La mappa dei luoghi non deve gravare sulla memoria del giocatore. Essa può essere generata automaticamente, o risultare superflua, od altri espedienti devono consentire una comoda navigazione tra i tanti luoghi.</li><li><b>Supporto dei comandi tradizionali.</b> Supporto degli imperativi e dei comandi tradizionali: esamina, x (examine); guarda, g, l (look); nord, n; sud, s; ovest, o, w (west); est, e; load; save; quit, exit. </li><li><b>Superamento del vocabolario.</b> Il gioco può offrire alcuni predicati d'esempio per stimolare i nuovi giocatori, ma deve comunque supportare molti sinonimi e gestire tutte le azioni ragionevoli ed interessanti che si possono compiere coerentemente con la storia.</li><li><b>Testi concisi e molto curati.</b> Una storia interattiva richiede che si ripercorra più volte uno stesso testo, fatta eccezione per l'introduzione, speciali fasi intermedie ed il finale, i testi devono essere brevi, e sempre stilisticamente molto curati.</li><li><b>Interazione con luoghi ed oggetti nominati.</b> I testi delle scene presentano luoghi ed oggetti. Se essi vengono nominati si devono poter almeno osservare o esaminare.</li><li><b>Minimizzare le risposte superflue.</b> Inutile gestire azioni banali per offrire risposte banali, tanto vale lasciare la risposta generica di rifiuto, oppure offrire una risposta ben curata che crei atmosfera.</li><li><b>Evitare morti improvvise.</b> Gli eventi pericolosi, in particolare una morte improvvisa, devono essere segnalati da un ragionevole indizio. In caso di morte od altra interruzione della storia, un sistema di caricamento comodo della partita deve minimizzare gli aspetti noiosi.</li><li><b>Evitare indizi incomprensibili.</b> Gli indizi non possono essere esageratamente indiretti e quindi incomprensibili, è apprezzabile discostarsi dall'ovvietà, ma occorre farlo nella giusta misura.</li><li><b>Dare tutte le informazioni.</b> Un ostacolo che si presenta per la prima volta deve essere accompagnato da tutte le informazioni necessarie al suo superamento. I fallimenti che interrompono la storia non possono far parte delle informazioni necessarie per la sua soluzione.</li><li><b>Mai rimaner bloccati senza saperlo.</b> Finché è possibile compiere azioni, si deve poter arrivare ad un finale apprezzabile. Non si può rimanere impossibilitati a proseguire (ora o in futuro) senza avvertimento. Se ciò accade, la storia deve terminare.</li><li><b>Non richiedere azioni improbabili.</b> Una combinazione accidentale ed improbabile di mosse non deve determinare l'ottenimento di qualcosa di necessario al proseguimento del gioco. Il rischio è rendere molto probabile una situazione di blocco di fatto.</li><li><b>Azioni coerenti con lo scopo della storia.</b> Azioni inutili o stupide o fuori luogo è impossibile gestirle tutte. Ci si deve attenere ad uno o massimo due approcci (serio, comico, realistico, fantastico, ecc.). Se il giocatore vede certe azioni rifiutate non deve insistere, ma deve agire in modo coerente o cambiare storia interattiva.</li><li><b>Offrire variazioni ed alternative.</b> Sono auspicabili, seppure non necessarie e a discrezione dell'autore, scelte di personaggi, biforcazioni della trama, alternative al superamento di ostacoli, messaggi variabili, eventi casuali, finali multipli, ecc.</li><li><b>Ricerche circoscritte o chiari obiettivi.</b> Un oggetto da trovare tra tantissimi luoghi visitabili diventa una lunga e noiosa ricerca. Il contesto deve essere ristretto, oppure un compito esplicito va comunicato al giocatore affinché abbia un chiaro obiettivo in un ampio contesto.</li><li><b>Evitare depistaggi senza chiarimenti.</b> Oggetti e luoghi sono scelti con un fine (scenico, funzionale, umoristico, ecc.). Oggetti inutili o depistanti vanno evitati, o comunque non possono essere troppo appariscenti o con varie possibilità di interazione, senza poter capire che sono depistaggi e infine abbandonarli.</li><li><b>Indicatori di completamento.</b> Almeno un indicatore di completamento deve segnalare quanto manca alla conclusione della storia interattiva.</li></ol>", "centrato");
		scegliRispondi("Licenza", "Specificare la licenza con cui si rilascia la storia.", "centrato");
		break;
	case 2:
		testo("Introduzione alla storia o inizio diretto...<br />Puoi vedere: una storia vuota.");
		rispondi("esamino la storia", "È tutta da scrivere...");
		break;
	}
	Vista.mostra();
}
