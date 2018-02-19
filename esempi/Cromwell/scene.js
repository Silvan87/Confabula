// Istruzioni che valgono in tutte le scene
function istruzioniGenerali() {
	nomeStoria("Cromwell");
	messaggiRifiuto("Prova qualcos'altro...|Un tentativo vano...|Ricerca infruttuosa...");
	istruzioni("Per interagire inizia sempre con un predicato. Puoi usare la prima persona o l'imperativo. Puoi omettere gli articoli ed i predicati 'esamino' ed 'osservo'. Tutti gli oggetti e i luoghi possono essere esaminati od osservati. Se non si specifica il predicato, prima viene provato 'esamino' poi 'osservo'. Scrivi 'guardo' o 'g' per ripresentare una scena; 'inventario' o 'i' per consultarlo; 'istruzioni' per rileggerle. Raggiungi un luogo già visitato scrivendo 'direzione' o 'd' e 'nome luogo'. I luoghi raggiungibili sono consultabili scrivendo 'direzioni' o 'd'. I luoghi possono avere comportamenti speciali. È possibile salvare una partita con 'save' o caricarla con 'load'. I comandi speciali: istruzioni, save (salva), load (carica), restart (riavvia), quit (exit), non sono contati come mosse del giocatore, dunque non fanno scorrere il tempo e ciò è segnalato dal diverso colore della risposta. Le scelte selezionabili si possono cliccare con il mouse oppure raggiungere con TAB e poi premere invio o spazio.");
	uscita("guardo", 0, "invisibile");
	rispondi("vocabolario|v", "apro, bevo, chiudo, entro, esamino, esco, guardo, infilo, introduco, inventario, leggo, osservo, prendo, strappo");
	contenitore("i", "un|il pugnale");
	rispondi("inventario|i", "Hai con te: @i@.");
	rispondi("aiuto", "Scrivi 'istruzioni' per leggere le istruzioni e 'vocabolario' o 'v' per leggere i predicati con cui interagire con gli oggetti.");
	rispondi("nord|sud|ovest|est|su|giù", "Non è possibile procedere in quella direzione.");
	condizioni("il pugnale@i");
		rispondi("esamino il pugnale", "È un affilato coltello da caccia, lo hai portato con te pensando sarebbe stato utile.");
	condizioni("il bastone@i", per => {
		rispondi("esamino il bastone", "È un bastone di prestigio con intarsi metallici che formano rune, forse apparteneva al cadavere da cui hai recuperato la chiave.");
		rispondi("[leggo|esamino] le rune sul bastone", "Non comprendi le rune...");
	});
	condizioni("l'ampolla@i", per => {
		condizioni("no!ampolla bevuta", per => {
			rispondi("esamino l'ampolla", "L'ampolla di vetro, ricoperta di polvere, risulta essere ben chiusa da un tappo di sughero. All'interno vi è uno strano liquido di colore azzurro.");
			rispondi("apro il [ampolla|tappo|tappo di sughero]", "Togli il tappo dell'ampolla. Da questa fuoriescono dei vapori azzurrognoli e un tanfo pestilenziale pervade l'aria.");
			rispondi("bevo [|l'ampolla|dall'ampolla|il liquido|il liquido azzurrognolo|il liquido azzurro|lo strano liquido]", "Porti alle labbra la piccola bottiglia e ne bevi il contenuto. Dopo pochi istanti ti senti strano... provi un senso di nausea, ma passa presto. Senti rinsaldarsi in te un legame con un potere sovrannaturale. Le parole che pensi e pronunci è come se avessero una carica prima sconosciuta...");
			__variabili("ampolla bevuta");
		});
		condizioni("ampolla bevuta");
			rispondi("esamino l'ampolla", "L'ampolla di vetro, ben richiusa con il suo tappo di sughero, è ora vuota.");
		rispondi("esamino il tappo|esamino il tappo di sughero", "Il tappo sigilla perfettamente l'ampolla.");
	});
	rispondi("prendo un ramo", "Puoi trovare ramoscelli flessibili e contorti, non pensi siano di alcuna utilità e non li prendi.");
	condizioni("la chiave@i");
		rispondi("esamino la chiave", "È una chiave di bronzo con qualche semplice ricamo.");
	condizioni("la gamba di sedia@i");
		rispondi("esamino la gamba [|di sedia]", "È legno fragile e un po' scheggiato.");
	condizioni("no!drago morto", per => {
		condizioni("drekann3");
			nMosseVai(2, 23);
		condizioni("drekann2");
			nMosseRispondi(2, "Il rumore si avvicina, distingui dei colpi ritmici, come ali che sbattono...");
			__variabili("no!drekann2  drekann3");
		condizioni("drekann");
			nMosseRispondi(2, "Avverti un boato cupo e lontano.");
			__variabili("no!drekann  drekann2");
	});
	condizioni("il cuore di cromwell@i", per => {
		rispondi("esamino il cuore [|di Cromwell|dell'abate]", "Il cuore dell'abate risulta fatto essiccare, è rigido e probabilmente è servito per un rituale.");
		rispondi("strappo il cuore|strappo il cuore dell'abate|strappo il cuore di Cromwell", "Inizi a strappare il cuore da un lato, ma ti fermi prima di raggiungere la metà. Nulla accade e preferisci conservarlo in un unico pezzo.");
		condizioni("il pugnale@i");
			rispondi("infilo il pugnale nel cuore [|dell'abate|di Cromwell]", "Trafiggi il cuore con il pugnale e lo ritrai lasciandoci un buco, ma non accade nulla.");
	});
	rispondi("osservo", "Cosa vorresti osservare? Puoi farlo anche da lontano.");
	rispondi("esamino", "Cosa vorresti esaminare? Devono essere oggetti raggiungibili.");
	rispondi("entro", "Dove vorresti entrare?");
	rispondi("esco", "Da dove vorresti uscire?");
	rispondi("leggo", "Cosa vorresti leggere?");
	rispondi("infilo", "Cosa vorresti infilare e dove?");
	rispondi("introduco", "Cosa vorresti introdurre e dove?");
	rispondi("prendo", "Cosa vorresti prendere?");
	rispondi("apro", "Cosa vorresti aprire?");
	rispondi("chiudo", "Cosa vorresti chiudere?");
	rispondi("bevo", "Cosa vorresti bere?");
	rispondi("strappo", "Cosa vorresti strappare?");
}
// Istruzioni specifiche per ciascuna scena
function istruzioniScena(n) {
	Vista.preparaScena(n);
	switch (n) {
	case 1:
		testo("<br /><span style=\"color:#d7d7d7;font-size:22px;\">CROMWELL © MMXVI</span><br />", "centrato");
		immagine("drago.png");
		testo("<span style=\"color:#0a0;\">L'abate e il drago della palude</span><br /><br />", "centrato");
		scegliVai("Inizia", 2, "centrato");
		scegliRispondi("Istruzioni", "", "centrato");
		scegliRispondi("Principi guida", "Quest'opera cerca di rispettare i seguenti principi guida derivanti dalla <a href=\"http://ifarchive.smallwhitehouse.org/if-archive/info/Craft.Of.Adventure.pdf\" target=\"_blank\">Carta dei diritti del giocatore</a> di Graham Nelson ed ulteriormente rielaborati:</p><ol><li><b>Dichiarare i principi guida.</b> Ogni storia interattiva dovrebbe dichiarare i principi guida che adotta affinché il giocatore sappia quale trattamento attendersi.</li><li><b>Dichiarare i destinatari.</b> Affinché il giocatore possa valutare quanto gli interessi tale storia interattiva, si deve chiarire a chi è rivolta e per quali motivi.</li><li><b>Fornire le istruzioni.</b> Le istruzioni complete vanno sempre offerte all'inizio del gioco.</li><li><b>Comunicare obiettivi e ricompensare.</b> Il giocatore non deve mai ritrovarsi spaesato e senza obiettivi. Questi possono essere molteplici, non lineari, opzionali, ma vanno comunicati. Ogni obiettivo compiuto deve ricompensare il giocatore con un testo poetico o una riflessione o un nuovo elemento per la trama o altra gratificazione.</li><li><b>Ricerche circoscritte o compiti precisi.</b> Un oggetto da trovare tra tantissimi luoghi visitabili diventa una lunga e noiosa ricerca. Il contesto deve essere ristretto oppure, in un ampio contesto, devono esserci compiti precisi.</li><li><b>Offrire variazioni ed alternative.</b> Sono auspicabili, seppure non necessarie e a discrezione dell'autore, scelte di personaggi, biforcazioni della trama, alternative al superamento di ostacoli, messaggi variabili, eventi casuali, finali multipli, ecc.</li><li><b>Dare tutte le informazioni.</b> Un ostacolo che si presenta per la prima volta deve essere accompagnato da tutte le informazioni necessarie al suo superamento. I fallimenti che interrompono la storia non possono far parte delle informazioni necessarie per la sua soluzione.</li><li><b>Azioni coerenti con lo scopo della storia.</b> Azioni inutili o stupide o fuori luogo è impossibile gestirle tutte. Ci si deve attenere ad uno o massimo due approcci (serio, comico, realistico, fantastico, ecc.). Se il giocatore vede certe azioni rifiutate non deve insistere, ma deve agire in modo coerente o cambiare storia interattiva.</li><li><b>Tempo che scorre con le mosse.</b> Il tempo reale può condizionare messaggi scenici o effetti grafici, ma non deve far scorrere la storia. Questa deve avanzare solo con le mosse del giocatore.</li><li><b>Testi concisi e molto curati.</b> Una storia interattiva richiede che si ripercorra più volte uno stesso testo, fatta eccezione per l'introduzione, speciali fasi intermedie ed il finale, i testi devono essere brevi, e sempre stilisticamente molto curati.</li><li><b>Interazione con luoghi ed oggetti nominati.</b> I testi delle scene presentano luoghi ed oggetti. Se essi vengono nominati si devono poter almeno osservare o esaminare.</li><li><b>Superamento del vocabolario.</b> Il gioco può offrire alcuni predicati d'esempio per stimolare i nuovi giocatori, ma deve comunque supportare molti sinonimi e gestire tutte le azioni ragionevoli ed interessanti che si possono compiere coerentemente con la storia.</li><li><b>Minimizzare le risposte superflue.</b> Inutile gestire azioni banali per offrire risposte banali, tanto vale lasciare la risposta generica di rifiuto, oppure offrire una risposta ben curata che crei atmosfera.</li><li><b>Evitare depistaggi senza chiarimenti.</b> Oggetti e luoghi sono scelti con un fine (scenico, funzionale, umoristico, ecc.). Oggetti inutili o depistanti vanno evitati, o comunque non possono essere troppo appariscenti o con varie possibilità di interazione, senza poter capire che sono depistaggi e infine abbandonarli.</li><li><b>Non richiedere azioni improbabili.</b> Una combinazione accidentale ed improbabile di mosse non deve determinare l'ottenimento di qualcosa di necessario al proseguimento del gioco. Il rischio è rendere molto probabile una situazione di blocco di fatto.</li><li><b>Mai rimaner bloccati senza saperlo.</b> Finché è possibile compiere azioni, si deve poter arrivare ad un finale apprezzabile. Non si può rimanere impossibilitati a proseguire (ora o in futuro) senza avvertimento. Se ciò accade, la storia deve terminare.</li><li><b>Evitare indizi incomprensibili.</b> Gli indizi non possono essere esageratamente indiretti e quindi incomprensibili, è apprezzabile discostarsi dall'ovvietà, ma occorre farlo nella giusta misura.</li><li><b>Evitare morti improvvise.</b> Gli eventi pericolosi, in particolare una morte improvvisa, devono essere segnalati da un ragionevole indizio. In caso di morte od altra interruzione della storia, un sistema di caricamento comodo della partita deve minimizzare gli aspetti noiosi.</li><li><b>Giocabilità prioritaria sul realismo.</b> Funzionalità e scorrevolezza della storia devono essere soddisfatte, anche con espedienti irreali o comandi scorciatoia, piuttosto che rispettare un rigido realismo che guasta la giocabilità con procedure pedanti o altrimenti fastidiose.</li><li><b>Mappa automatica o navigazione comoda.</b> La mappa dei luoghi non deve gravare sulla memoria del giocatore. Essa può essere generata automaticamente, o risultare superflua, od altri espedienti devono consentire una comoda navigazione tra i tanti luoghi.</li><li><b>Supporto dei comandi tradizionali.</b> Supporto degli imperativi e dei comandi tradizionali: esamina, x (examine); guarda, g, l (look); nord, n; sud, s; ovest, o, w (west); est, e; load; save; quit.</li><li><b>Indicatori di completamento.</b> Almeno un indicatore di completamento deve segnalare quanto manca alla conclusione della storia interattiva.</li></ol>", "centrato");
		scegliRispondi("Licenza", "CROMWELL © MMXVI è una rivisitazione dell'avventura testuale EXCALIBUR © MCMLXXXVIII pubblicata sulla rivista Amiga Byte n.8 come opera di pubblico dominio, liberamente copiabile e distribuibile senza scopo di lucro. <a href=\"https://github.com/Druido87/Confabula\" target=\"_blank\">Confabula</a> è l'interprete JavaScript per creare ed eseguire avventure testuali, rilasciato da <a href=\"https://github.com/Druido87\" target=\"_blank\">Druido87</a> con licenza <a href=\"https://github.com/Druido87/Confabula/blob/master/LICENSE\" target=\"_blank\">GNU L-GPL</a>. La storia rivisitata è un esempio di utilizzo di Confabula.", "centrato");
		break;
	case 2:
		immagine("bosco.png");
		testo("Secoli trascorsi nell'oblio e la regione di Pietranera è stata inghiottita da una folta vegetazione. Si racconta che Cromwell, un abate di origini britanniche, avesse eredidato antiche conoscenze celtiche e se ne fosse servito per sfuggire alla morte. Visse a lungo nell'abbazia eppure venne il giorno della sua sepoltura. In seguito, queste terre divennero lentamente piú silenziose, molte creature morivano o si spostavano altrove. La gente abbandonò del tutto il reggimento, un terribile potere crebbe, rafforzato dalla paura. Pochi audaci avventurieri hanno esplorato questi luoghi senza far ritorno. Un nuovo esploratore è giunto...");
		__variabili("inizio");
		scegliVai("Esplora", 3, "centrato");
		break;
	case 3:
		nomeLuogo("inizio bosco|inizio del bosco");
		immagine("bosco.png");
		testo("Sei nel bosco di Pietranera. Una fitta vegetazione ti circonda.<br />Puoi vedere: alti fusti e fitti cespugli.");
		condizioni("inizio", per => {
			testo("Hai portato con te un pugnale.");
			__variabili("no!inizio");
		});
		condizioni("no!dentro cespugli", per => {
			uscita("ovest", 7);
			uscita("nord", 4);
			condizioni("sentiero visto");
				uscita("est", 10, 'esplorabile');
			rispondi("entro nei cespugli", "Intimorito ti acquatti in mezzo a due grandi cespugli. Hai la sensazione di essere osservato, ma forse è solo la tua immaginazione.");
			__variabili("dentro cespugli");
		});
		condizioni("dentro cespugli", per => {
			rispondi("ovest|nord|est|sud|giú|su", "Devi uscire dai cespugli se vuoi proseguire.");
			rispondi("esco [|dai cespugli]", "Sei venuto qui per sconfiggere l'oscurità, non è il caso di nasconderti. Esci dai cespugli e riprendi la tua ricerca.");
			__variabili("no!dentro cespugli");
		});
		rispondi("[esamino|osservo] i [|alti] fusti", "Sono alberi secolari molto alti.");
		rispondi("esamino i [|fitti] cespugli", "Tra essi intravvedi un sentiero che va verso est.");
		__variabili("sentiero visto");
		condizioni("sentiero visto");
			rispondi("esamino il sentiero", "Per conoscere un sentiero devi percorrerlo...");
		rispondi("strappo i cespugli", "Ci vorrebbe una giornata intera per strappare tutti i cespugli che vedi... Non è il caso di farlo.");
		break;
	case 4:
		nomeLuogo("rovine|abbazia|antica abbazia|rovine dell'abbazia|rovine di Pietranera|abbazia di Pietranera");
		immagine("rovine.png");
		testo("Ti trovi tra le rovine sulle colline di Pietranera. Il luogo è avvolto da una strana luce crepuscolare.<br />Puoi vedere: le rovine dell'abbazia di Pietranera");
		condizioni("no!abate morto");
			uscita("nord", 5);
		condizioni("abate morto");
			rispondi("nord", "È il luogo dove l'abate Cromwell si è dissolto in una nube di zolfo, meglio non tornarci.");
		uscita("sud", 3);
		rispondi("osservo la luce [|crepuscolare]", "Ti sembra di veder qualche luce tremolante, ma appena fissi meglio lo sguardo l'effetto svanisce.");
		rispondi("esamino le rovine [|dell'abbazia]", "Sulla collina, le rovine dell'antico maniero sembrano celare arcani misteri. Tra le pietre noti un enorme monolite con delle iscrizioni in caratteri runici.");
		rispondi("esamino il monolite", "Il blocco di pietra è alto circa tre metri e ha uno spessore di quasi due. Sotto l'iscrizione vi è inciso un cerchio con al centro una croce. Lateralmente vi è un foro di piccole dimensioni. Sulla sommità sembrano esservi degli altri simboli.");
		rispondi("[esamino|leggo] la [iscrizione|iscrizioni|rune|caratteri|caratteri runici]", "Non riesci a comprendere i caratteri runici...");
		rispondi("esamino le pietre", "Sono pietre molto dure e compatte.");
		rispondi("prendo le pietre", "Sono pietre grandi e imponenti, non puoi portarle con te.");
		rispondi("esamino la [croce|cerchio]", "È un simbolo celtico, una larga croce dentro un cerchio.");
		rispondi("[esamino|leggo] i [|altri] simboli|[esamino|leggo] la sommità", "Pur collocati in alto, riconosci che si tratta di lettere latine. Una sola parola è scritta e sembra essere la trascrizione di una parola celtica: 'YGGWYRD'.");
		condizioni("no!monolite aperto", per => {
			rispondi("esamino il [|piccolo] foro|infilo il dito nel [|piccolo] foro", "È un foro realizzato con precisione, comprendi che deve avere un senso. Infili lentamente un dito nel foro... ma non accade nulla, deve essere piuttosto profondo.");
			condizioni("la gamba di sedia@i");
				rispondi("infilo la gamba [|di sedia|di legno] nel [|piccolo] foro", "Non succede nulla e dopo poco sfili la gamba della sedia.");
			condizioni("il bastone@i");
				rispondi("infilo il bastone nel [|piccolo] foro", "Azioni un elementare meccanismo che scopre una cavità all'interno del monolite dentro la quale trovi una ampolla di vetro.");
				__variabili("monolite aperto");
		});
		condizioni("monolite aperto", per => {
			rispondi("esamino il [|piccolo] foro|infilo il dito nel [|piccolo] foro", "È un foro realizzato con precisione, dopo averci infilato il bastone di un druido, si è aperta una piccola cavità.");
			condizioni("no!l'ampolla@i", per => {
				rispondi("esamino la cavità", "È una piccola cavità che contiene unicamente un'ampolla.");
				rispondi("bevo [|l'ampolla|dall'ampolla|il liquido|il liquido azzurrognolo|il liquido azzurro|lo strano liquido]", "Prima devi prendere l'ampolla.");
				rispondi("prendo l'ampolla [|di vetro]", "Hai preso la bottiglietta.");
				__oggetti("l'ampolla@i");
				rispondi("esamino l'ampolla", "L'ampolla di vetro, ricoperta di polvere, risulta essere ben chiusa da un tappo di sughero. All'interno vi è uno strano liquido di colore azzurro.");
				rispondi("esamino il tappo [|di sughero]", "Il tappo sigilla perfettamente l'ampolla.");
			});
			condizioni("l'ampolla@i", per => {
				rispondi("esamino la cavità", "È una piccola cavità che non contiene piú nulla.");
			});
		});
		break;
	case 5:
		immagine("abate.png");
		testo("D'un tratto, tra i ruderi, appare Cromwell, l'abate di Pietranera.<br />Puoi vedere: l'abate.");
		bloccaDirezioni();
		condizioni("ampolla bevuta");
			rispondiVai("yggwyrd", "La parola sospende gli arcani poteri dell'abate, che tra disumane urla di dolore esclama: \"Drekann!!\" e si dissolve in una nube sulfurea...", 4);
			__variabili("parole magiche  abate morto  drekann");
		condizioni("no!ampolla bevuta");
			rispondiVai("yggwyrd", "L'espressione dell'abate è tesa e si paralizza qualche istante...", 6);
		condizioni("no!abate morto");
			nMosseVai(1, 6);
		break;
	case 6:
		immagine("abate.png");
		testo("\"Stolto! Non oserai mai piú sfidare il mio potere con le tue parole!\" esclama l'abate mentre dalle sue mani, protese verso di te, un fascio di luce ti investe e ti folgora all'istante!");
		scegliVai("Risorgi", 4);
		break;
	case 7:
		nomeLuogo("palude confine bosco|palude dal bosco");
		immagine("palude.png");
		testo("Sei nella palude di Verdefango. Dalle acque palustri si levano densi vapori.<br />Puoi vedere: tetri alberi privi di foglie.");
		uscita("est", 3);
		uscita("sud", 8);
		rispondi("esamino gli [|tetri] alberi", "Le piante dai rami contorti ispirano inquietanti immagini.");
		rispondi("osservo le immagini", "Lasci libera la mente di fronte a queste immagini e ti sembra di vedere sguardi minacciosi e gelosi.");
		rispondi("osservo le acque", "Qualcosa di innaturale ha sconvolto questo luogo...");
		rispondi("osservo i vapori", "I vapori fuoriescono come sbuffi irregolari, da varie parti della palude.");
		break;
	case 8:
		immagine("palude.png");
		testo("Sei nella zona palustre. Uno strano gorgoglio proviene dall'acqua.<br />Puoi vedere: piante inquietanti, l'acqua che gorgoglia.");
		rispondi("esamino le piante", "Alcuni grandi rami sono stati spezzati, come se qualcosa di gigante li avesse travolti e strappati.");
		rispondi("esamino l'acqua", "L'acqua emana un odore nauseabondo.");
		condizioni("abate morto", per => {
			uscita("nord", 7);
			uscita("sud", 21);
		});
		bloccaDirezioni();
		condizioni("no!abate morto");
			nMosseVai(2, 9);
		break;
	case 9:
		immagine("drago.png");
		testo("D'un tratto dalle acque palustri emerge un gigantesco drago. Il mostro ti si avventa contro con le fauci spalancate e le sue zanne ti dilaniano orribilmente.");
		scegliVai("Risorgi", -2);
		break;
	case 23:
		immagine("drago.png");
		testo("Improvvisamente ti raggiunge un enorme drago, furioso per la morte dell'abate, che ti si avventa contro digrignando le formidabili zanne. Hai pochi istanti per reagire.");
		__variabili("no!drekann3");
		bloccaDirezioni();
		condizioni("il cuore di cromwell@i");
			rispondiVai("[infilo|lancio] il cuore [|di Cromwell|dell'abate] [nelle fauci|nella bocca|nella bocca del drago]", "Lanci il cuore di Cromwell verso la faccia del drago...", 25);
			__variabili("drago morto");
		condizioni("no!drago morto");
			nMosseVai(1, 24);
		break;
	case 24:
		immagine("drago.png");
		testo("Le zanne del drago ti si avventano contro e ti dilaniano orribilmente.");
		__variabili("drekann");
		scegliVai("Risorgi", -2);
		break;
	case 25:
		intermezzo("Con un'imprevista ingordigia, il drago afferra quel cuore con le sue fauci e inizia a masticarlo. Sembra quasi che aspettasse da tempo questo pasto... dopo circa un minuto lo sguardo del drago si spegne, fissa l'orizzonte e crolla al suolo senza vita.");
		testo("L'abate è definitivamente sconfitto, aveva ingannato la morte rinunciando all'evoluzione verso nuove forme di esistenza. L'estrazione del suo cuore faceva parte del rituale in cui rinunciava alla sua evoluzione per conservare in eterno la forma terrena.");
		testo("Il drago era un servitore dell'abate, obbligato a difendere questo suo regno finché il rituale non fosse stato spezzato. Mangiando il cuore è come se la vita avesse ripreso il suo corso e il servitore è stato liberato anch'esso, morendo.");
		testo("Le terre di Pietranera conosceranno a poco a poco un destino migliore. Congratulazioni.");
		scegliVai("Ricomincia", 1);
		break;
	case 10:
		immagine("bosco2.png");
		testo("Ti trovi all'imbocco di uno stretto sentiero. Il camminamento si snoda tra la fitta vegetazione.<br />Puoi vedere: alte e vecchie conifere.");
		uscita("ovest", 3);
		condizioni("sentiero visto 2");
			uscita("est", 11, "esplorabile");
		rispondi("esamino le [|alte|vecchie] conifere", "Tra gli alberi vedi che il sentiero prosegue verso est.");
		__variabili("sentiero visto 2");
		break;
	case 11:
		nomeLuogo("radura");
		immagine("bosco2.png");
		testo("Sei in una radura, pochi alberi ti circondano e grandi pietre sono presenti in un angolo.<br />Puoi vedere: delle pietre e alcuni alberi.");
		uscita("ovest", 10);
		uscita("sud", 12);
		rispondi("esamino le [|grandi] pietre", "Le pietre sono ricoperte di muschio e sembrano molto antiche. Una di questre pietre è una statua.");
		rispondi("esamino la statua", "A prima vista era irriconoscibile, ma ora comprendi che è la statua di un guerriero ed è priva della testa e di un braccio.");
		rispondi("esamino [gli|alcuni] alberi", "Ai piedi di una quercia trovi il braccio di una statua.");
		rispondi("esamino il braccio [|della statua|di una statua]", "Il braccio è parzialmente coperto di muschio.");
		rispondi("prendo il braccio [|della statua]", "È pesante e non sarebbe comodo portarselo dietro. Lo lasci sul terreno.");
		rispondi("prendo la statua", "È impensabile spostarla da lí.");
		break;
	case 12:
		immagine("bosco2.png");
		testo("Stai seguendo un sentiero che si snoda tra le erbacce del sottobosco.<br />Puoi vedere: intricati cespugli di rovo.");
		uscita("ovest", 13);
		uscita("nord", 11);
		uscita("sud", 16);
		rispondi("esamino i [cespugli|rovi|cespugli di rovo]", "Scivoli e cadi tra i rovi, procurandoti delle abrasioni.");
		rispondi("entro nei [cespugli|rovi|cespugli di rovo]", "Scivoli e rotoli tra le spine procurandoti brutte ferite lacero-contuse. Non riesci a entrare nei rovi e non ha senso insistere.");
		rispondi("osservo i [cespugli|rovi|cespugli di rovo]", "I rovi sono molto contorti e pieni di spine, il terreno su cui si estendono è piuttosto irregolare, meglio starci lontani.");
		break;
	case 13:
		nomeLuogo("spiazzo con capanna|spiazzo|spiazzo bosco|spiazzo nel bosco");
		immagine("bosco.png");
		testo("Ti trovi in uno spiazzo del bosco. Poco distante vedi una capanna tra la boscaglia.<br />Puoi vedere: una capanna.");
		uscita("est", 12);
		uscita("sud", 15);
		condizioni("no!capanna aperta");
			rispondi("apro la [porta|capanna]|entro [|nella capanna]", "Inutilmente cerchi di aprire la robusta porta. Nonostante l'aspetto fatiscente della costruzione, la porta si rivela molto robusta ed è chiusa a chiave.");
		condizioni("capanna aperta", per => {
			uscita("ovest", 14, "esplorabile");
			rispondiVai("apro la [porta|capanna]|entro [|nella capanna]|ovest", "Entri nella capanna...", 14);
			rispondi("chiudo la porta [|della capanna]", "Per sicurezza eviti di richiudere la porta a chiave: dovesse non riaprirsi...");
		});
		rispondi("esamino la capanna", "Tra la rigogliosa vegetazione la capanna risulta quasi invisibile. La porta sembra chiusa e le erbacce, sul sentiero che concude ad essa, rivelano il suo stato di abbandono.");
		rispondi("esamino la porta", "È una porta massiccia e ben lavorata, anche volendo non avresti i mezzi per sfondarla.");
		condizioni("la chiave@i");
			rispondi("apro la [porta|capanna] con la chiave|introduco la chiave nella serratura", "Introduci la chiave nella serratura e la giri ripetutamente. Con due scatti metallici la porta si apre facendo cigolare i cardini.");
			__variabili("capanna aperta");
		condizioni("il pugnale@i");
			rispondi("apro la porta con il pugnale", "Potresti giusto arrecargli qualche graffio, ma non c'è modo di aprirla cosí...");
		break;
	case 14:
		nomeLuogo("capanna");
		immagine("capanna.png");
		testo("Ti trovi all'interno della cadente costruzione. Le pareti sono ricoperte di muffa.<br />Puoi vedere: un tavolo, un baule, una sedia e un giaciglio.");
		uscita("est|esco|esco dalla capanna", 13);
		rispondi("osservo le [pareti|muffa]", "Alcuni angoli sono piú ricoperti di muffa rispetto ad altri. L'interno è piuttosto umido.");
		rispondi("esamino il tavolo", "È un robusto e massiccio tavolo in rovere scuro. Su di esso vi sono una brocca di terracotta e una scodella di legno.");
		rispondi("esamino la [brocca|terracotta|brocca di terracotta]", "Dentro la brocca vi è un denso liquido rosso cupo.");
		rispondi("prendo la brocca", "La brocca ti renderebbe meno veloce nei movimenti, la lasci qui.");
		rispondi("esamino il liquido [|rosso]", "Difficile stabilire di che si tratta... è molto viscoso e non può essere sangue.");
		rispondi("bevo il liquido [|rosso]|bevo dalla [brocca|terracotta|brocca di terracotta]", "A causa della forte viscosità del liquido a stento cola lungo una parete. Con la lingua riesci giusto ad assaggiarlo: è dolciastro, ma lascia l'amaro dopo il dolce. Forse è stato fatto con delle bacche. Non sembra accaderti nulla.");
		condizioni("no!sedia rotta");
			rispondi("esamino la sedia", "Ti siedi e stramazzi a terra. La sedia stava in piedi per miracolo.");
			__variabili("sedia rotta");
		condizioni("sedia rotta", per => {
			rispondi("[esamino|osservo] la sedia", "La sedia è rotta in tre pezzi.");
			condizioni("no!gamba sedia presa");
				rispondi("esamino i [|tre] pezzi [|della sedia]", "Lo schienale ha una parte della seduta attaccata con sotto una gamba. La seduta è rotta poco oltre la metà e conserva le due gambe frontali. Infine, una gamba è rotolata via da tutto il resto...");
			condizioni("gamba sedia presa");
				rispondi("esamino i tre pezzi|esamino i pezzi|esamino i pezzi della sedia", "Lo schienale ha una parte della seduta attaccata con sotto una gamba. La seduta è rotta poco oltre la metà e conserva le due gambe frontali. La rimanente gamba è stata presa da te.");
			rispondi("prendo lo [schienale|seduta]", "Troppo ingombrante da portare con te...");
		});
		rispondi("osservo la sedia", "La sedia sembra molto fragile...");
		rispondi("esamino lo [schienale|seduta|gamba|gamba di sedia]", "È legno fragile e un po' scheggiato.");
		condizioni("no!gamba sedia presa");
			rispondi("prendo la gamba [|di sedia]", "Hai preso la gamba della sedia.");		
			__oggetti("la gamba di sedia@i");
			__variabili("gamba sedia presa");
		condizioni("il bastone@i");
			rispondi("esamino il giaciglio", "È un modesto giaciglio di paglia. Pare che non venga usato da molto tempo.");
		condizioni("no!il bastone@i", per => {
			rispondi("esamino il giaciglio", "È un modesto giaciglio di paglia. Pare che non venga usato da molto tempo. Lí vicino, adagiato ad una parete, trovi un bastone di ottima fattura con intarsi metallici che formano rune.");
			rispondi("esamino il bastone", "È un bastone di prestigio con intarsi metallici che formano rune, forse apparteneva al cadavere da cui hai recuperato la chiave.");
			rispondi("[esamino|leggo] le [rune|intarsi]", "Non riesci a comprendere le rune...");
			rispondi("prendo il bastone", "Hai preso il bastone.");
			__oggetti("il bastone@i");
		});
		rispondi("esamino la scodella [|di legno]", "La ciotola è vuota.");
		rispondi("prendo la scodella [|di legno]", "È solo una ciotola vuota... la lasci dov'è.");
		rispondi("esamino il baule", "Il robusto forziere è dotato di placche metalliche ed è chiuso con un vecchio lucchetto.");
		rispondi("apro il baule", "Non riesci ad aprire il baule. Un vecchio lucchetto lo tiene chiuso.");
		condizioni("il pugnale@i");
			rispondi("infilo il pugnale nel lucchetto|apro il lucchetto con il pugnale", "Non puoi tagliare il lucchetto in questo modo...");
		rispondi("esamino il lucchetto", "Il vecchio lucchetto risulta insolitamente robusto.");
		break;
	case 15:
		nomeLuogo("crocevia");
		immagine("bosco2.png");
		testo("Ti trovi ad un crocevia. Il tuo sentiero si interseca con altri e risultano percorribili tutte le direzioni.<br />Puoi vedere: un cartello.");
		uscita("ovest", 20);
		uscita("nord", 13);
		uscita("est", 16);
		uscita("sud", 17);
		rispondi("[esamino|leggo] il cartello", "Sul cartello di legno vi sono delle scritte. La prima dice: 'ovest palude del drago', la seconda 'nord abbazia', la terza 'est sentiero del bosco', la quarta è stata bruciata.");
		break;
	case 16:
		immagine("bosco2.png");
		testo("Stai percorrendo un sentiero che taglia l'intricata vegetazione.<br />Puoi vedere: alti pini e una staccionata.");
		rispondi("esamino i pini", "Tra i pini noti delle rudimentali croci infisse nel terreno. Si tratta di tombe.");
		rispondi("esamino le [tombe|croci]", "Ti avvicini ai tumuli e scopri che vicino ad alcuni di essi vi sono delle armi arrugginite. Sembra che lí vi sia stata una cruenta battaglia molti anni fa.");
		rispondi("esamino le armi", "Sono i resti di pesanti armature. Trovi un elmo, uno scudo, alcune spade, la lama di una lancia ed una alabarda. Tutte le armi sono solo degli inutili pezzi di ferro arrugginito.");
		rispondi("esamino le [armi|elmo|scudo|spada|spade|lama|lancia|alabarda]", "Non c'è nulla di rilevante in questo ferro arrugginito.");
		rispondi("prendo le [armi|elmo|scudo|spada|spade|lama|lancia|alabarda]", "Oltre all'ingombro, è tutto consumato dalla ruggine. Lasci questi pezzi di ferro dove sono.");
		rispondi("esamino la staccionata", "Poco dietro la staccionata trovi un altro cadavere, consumato dal tempo. Si direbbe sia morto successivamente agli altri sepolti.");
		condizioni("la chiave@i");
			rispondi("esamino il cadavere", "Tra le spoglie del cadavere non trovi altro, oltre la chiave che hai preso.");
		condizioni("no!la chiave@i", per => {
			rispondi("esamino il cadavere", "Tra le spoglie del cadavere trovi una chiave.");
			rispondi("prendo la chiave", "Hai preso la chiave.");
			__oggetti("la chiave@i");
			rispondi("esamino la chiave", "È una chiave di bronzo con qualche semplice ricamo.");
		});
		uscita("ovest", 15);
		uscita("nord", 12);
		break;
	case 17:
		immagine("bosco.png");
		testo("Stai seguendo una via tra gli alberi.<br />Puoi vedere: i resti di una costruzione.");
		rispondiVai("esamino i [resti|costruzione]", "Ti avvicini alla costruzione...", 19);
		rispondi("osservo i [resti|costruzione]", "Da lontano non riesci a capire di che si tratta... è il luogo che avrebbe indicato l'insegna bruciata del cartello nel crocevia.");
		uscita("ovest", 18);
		uscita("nord", 15);
		break;
	case 18:
		nomeLuogo("cimitero");
		immagine("cimitero.png");
		testo("In una piccola piú solida isola, nella palude di Verdefango, intravvedi alcune lapidi di pietra avvolte dai rampicanti.<br />Puoi vedere: alcuni alberi e delle lapidi.");
		uscita("nord", 20);
		uscita("est", 17);
		rispondi("esamino i rampicanti", "Non sono rampicanti robusti...");
		rispondi("prendo la lapide", "È impensabile portarsela via...");
		rispondi("esamino gli alberi", "Gli alberi, avvolti nella nebbia, incutono timore.");
		condizioni("no!rampicanti eliminati", per => {
			rispondi("esamino le lapidi", "Le lapidi, ricoperte di rampicanti, non si riescono a leggere.");
			rispondi("strappo i rampicanti", "Elimini le erbacce e leggi le iscrizioni sulle pietre. Su una di esse vi è scritto: 'Qui giace J. T. Cromwell'. La lapide è posta in terra sconsacrata.");
			__variabili("rampicanti eliminati");
		});
		condizioni("rampicanti eliminati", per => {
			rispondi("esamino le lapidi", "Tra le lapidi hai trovato la tomba dell'abate Cromwell.");
			condizioni("no!tomba aperta", per => {
				rispondi("esamino la tomba [|di Cromwell|dell'abate]", "La lapide è posta in terra sconsacrata e la sepoltura potrebbe essere stata la parte di un rito.");
				rispondi("apro la tomba [|di Cromwell|dell'abate]", "Una lastra orizzontale di pietra chiude la tomba, con un notevole sforzo fisico sollevi la lastra da un lato e la fai scorrere via. La tomba è aperta.");
				__variabili("tomba aperta");
			});
			condizioni("tomba aperta", per => {
				rispondi("chiudo la tomba [|di Cromwell|dell'abate]", "Ti senti un po' spossato per ripetere lo sforzo precedente. Lasci la tomba aperta.");
				condizioni("no!cuore preso", per => {
					rispondi("esamino la tomba [|di Cromwell|dell'abate]", "Dentro la tomba non trovi il corpo dell'abate, ma solo un cuore essiccato e rigido.");
					rispondi("prendo il cuore [|di Cromwell|dell'abate]", "Hai preso il cuore dell'abate.");
					__variabili("cuore preso");
					__oggetti("il cuore di Cromwell@i");
					rispondi("esamino il cuore [|di Cromwell|dell'abate]", "Il cuore risulta fatto essiccare, è rigido e probabilmente è servito per un rituale.");
				});
				condizioni("cuore preso");
					rispondi("esamino la tomba [|di Cromwell|dell'abate]", "La tomba dell'abate è vuota, vi hai trovato il suo cuore ed è stato preso da te.");
			});
		});
		break;
	case 19:
		testo("Improvvisamente una botola si apre sotto i tuoi piedi... Precipiti su dei pali acuminati piantati nel terreno. Non c'è via di scampo! Uno schianto secco e vieni trafitto mortalmente.<span class=\"ascii\">,-'\"\"`-.<br />;           :<br />:             :<br />: (_)  (_) ;<br />`    '`    '<br />:`++++';<br />``..''<\span>");
		scegliVai("Risorgi", 17);
		break;
	case 20:
		nomeLuogo("palude confine sentiero|palude da sentiero");
		immagine("palude.png");
		testo("Una vasta zona acquitrinosa è il luogo ove ti trovi. Odi rieccheggiare i richiami dei corvi.<br />Puoi vedere: scheletriche piante e alcuni corvi.");
		uscita("ovest", 21);
		uscita("est", 15);
		uscita("sud", 18);
		rispondi("[esamino|osservo] le piante", "Con stupore misto a raccapriccio ti accorgi che dai rami degli alberi pendono corpi umani.");
		rispondi("[esamino|osservo] i corpi [|umani]", "I corpi orrendamente mutilati risultano irriconoscibili. Probabilmente si tratta di guerrieri o esploratori uccisi dal perfido abate Cromwell.");
		rispondi("esamino i corvi", "Sono troppo lontani per poterli esaminare.");
		rispondi("osservo i corvi", "Gli uccellacci neri volano lenti sulle carogne in putrefazione. Sembrano quasi danzare per un sinistro banchetto.");
		break;
	case 21:
		immagine("palude.png");
		testo("Via via che procedi, affondi nel pantano. Una fitta nebbia avvolge la zona.<br />Puoi vedere: una barca capovolta e semiaffondata.");
		uscita("ovest", 22);
		uscita("nord", 8);
		uscita("est", 20);
		rispondi("esamino la barca", "L'imbarcazione semiaffondata è ricoperta quasi interamente da alghe. Il legno marcio è prova dei numerosi anni trascorsi nella palude.");
		break;
	case 22:
		immagine("palude.png");
		testo("Hai raggiunto una radura su un'isola nella palude. Intricati rampicanti avvinghiano i tronchi di alcuni alberi.<br />Puoi vedere: cespugli e alte conifere.");
		uscita("est", 21);
		rispondi("esamino i cespugli", "I cespugli celano i resti mortali di tre cavalieri uccisi probabilmente in un'imboscata.");
		rispondi("entro nei cespugli", "Ci sono già tre cadaveri, meglio restarne fuori...");
		rispondi("[esamino|osservo] le conifere", "Tra gli alberi vedi uno strano bagliore, ma presto svanisce...");
		break;
	}
	Vista.mostra();
}
