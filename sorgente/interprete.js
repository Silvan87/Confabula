// Aggiunge meccanismo di selezione link con Tab da tastiera
document.addEventListener('keydown', function(event) {

	// Se viene premuto Shift + Tab torna alla casella input del giocatore
	if (event.shiftKey && event.keyCode === 9) {
		event.preventDefault();
		Vista.annullaTabLink();
		G.pronto();

	// Se viene premuto Tab seleziona ciclicamente tutti i link
    } else if (event.keyCode === 9) {
		event.preventDefault();
		var list = document.querySelectorAll('a, .scelta');
        for (var i = 0; i < list.length; i++) {
			if (list[i].classList.contains('tabLink')) {
				list[i].classList.remove('tabLink');
				if (i + 1 < list.length) {
					list[i + 1].classList.add('tabLink');
					document.getElementById('input').blur();
				} else {
					G.pronto();
				}
				return;
			}
		}
		list[0].classList.add('tabLink');
		document.getElementById('input').blur();

	// Se viene premuto Invio o Spazio, clicca sul link
    } else if (event.keyCode === 13 || event.keyCode === 32) {
		var list = document.getElementsByClassName('tabLink');
		if (list.length !== 0) {
			event.preventDefault();
			list[0].click();
		}
	}
});

var Lingua = {

	equivalenzeOrd: {}, // equivalenze ordinate
	imperativiIrregolari: /* Elenco di tutti gli imperativi che si trasformano in indicativo 1a persona in modo irregolare */ {'abbi':'ho','accogli':'accolgo','addivieni':'addivengo','adempi':'adempio','anteponi':'antepongo','appari':'appaio','appartieni':'appartengo','apponi':'appongo','assali':'assalgo','astieni':'astengo','astrai':'astraggo','attieni':'attengo','attrai':'attraggo','avvali':'avvalgo','avvieni':'avvengo','circonvieni':'circonvengo','cogli':'colgo','compari':'compaio','compi':'compio','compiaci':'compiaccio','componi':'compongo','conduoli':'condolgo','confa':'confaccio','confai':'confaccio','contieni':'contengo','contraffai':'contraffaccio','contrai':'contraggo','contrapponi':'contrappongo','contravvieni':'contravvengo','convieni':'convengo','cuci':'cucio','cuoci':'cuocio','da':'do','dai':'do','decomponi':'decompongo','deponi':'depongo','detieni':'detengo','detrai':'detraggo','di':'dico','disassuefai':'disassuefaccio','disciogli':'disciolgo','discomponi':'discompongo','disconvieni':'disconvengo','disfa':'disfaccio','disfà':'disfaccio','dispari':'dispaio','dispiaci':'dispiaccio','disponi':'dispongo','distogli':'distolgo','distrai':'distraggo','disvogli':'disvoglio','divieni':'divengo','duoli':'dolgo','empi':'empio','equivali':'equivalgo','esponi':'espongo','estrai':'estraggo','fa':'faccio','fai':'faccio','frapponi':'frappongo','giaci':'giaccio','giustapponi':'giustappongo','imponi':'impongo','incogli':'incolgo','indi':'indico','indisponi':'indispongo','interdi':'interdico','interponi':'interpongo','intervieni':'intervengo','intrattieni':'intrattengo','invali':'invalgo','liquefa':'liquefaccio','liquefai':'liquefaccio','malfa':'malfaccio','malfai':'malfaccio','mantieni':'mantengo','molci':'molcio','muori':'muoio','nuoci':'nuoccio','opponi':'oppongo','ottieni':'ottengo','pari':'paio','permani':'permango','pervieni':'pervengo','piaci':'piaccio','poni':'pongo','posponi':'pospongo','predi':'predico','predisponi':'predispongo','premuori':'premuoio','preponi':'prepongo','prescegli':'prescelgo','presupponi':'presuppongo','prevali':'prevalgo','previeni':'prevengo','proponi':'propongo','prosciogli':'prosciolgo','protrai':'protraggo','provieni':'provengo','puoi':'posso','putrefai':'putrefaccio','raccogli':'raccolgo','rarefai':'rarefaccio','rattieni':'rattengo','reci':'recio','redi':'redico','retrai':'retraggo','riabbi':'riò','riabbia':'riò','riai':'riò','riappari':'riappaio','riassali':'riassalgo','ricogli':'ricolgo','ricompari':'ricompaio','ricomponi':'ricompongo','riconvieni':'riconvengo','ricuci':'ricucio','ricuoci':'ricuocio','rida':'ridò','ridà':'ridò','ridai':'ridò','ridi':'ridico','ridisponi':'ridispongo','riempi':'riempio','rifa':'rifaccio','rifai':'rifaccio','rimani':'rimango','rinvieni':'rinvengo','riponi':'ripongo','riproponi':'ripropongo','risali':'risalgo','risappi':'riso','riscegli':'riscelgo','risciogli':'risciolgo','risii':'risono','risostieni':'risostengo','risovvieni':'risovvengo','rista':'ristò','ristà':'ristò','ristai':'ristò','ritieni':'ritengo','ritogli':'ritolgo','ritrai':'ritraggo','riva':'rivado','rivai':'rivado','rivali':'rivalgo','rivuoi':'rivoglio','sali':'salgo','sappi':'so','scegli':'scelgo','sciogli':'sciolgo','scompari':'scompaio','scompiaci':'scompiaccio','scomponi':'scompongo','sconvieni':'sconvengo','scuci':'scucio','scuoci':'scuocio','sfa':'sfaccio','sfai':'sfaccio','sii':'sono','soggiaci':'soggiaccio','sopraffa':'sopraffaccio','sopraffai':'sopraffaccio','sopravvieni':'sopravvengo','sostieni':'sostengo','sottaci':'sottaccio','sottoesponi':'sottoespongo','sottoponi':'sottopongo','sottosta':'sottostò','sottostà':'sottostò','sottostai':'sottostò','sottrai':'sottraggo','sovraesponi':'sovraespongo','sovrapponi':'sovrappongo','sovresponi':'sovrespongo','sovvieni':'sovvengo','spegni':'spengo','spiaci':'spiaccio','sta':'sto','stai':'sto','stracuoci':'stracuocio','strafa':'strafaccio','strafai':'strafaccio','stupefa':'stupefaccio','stupefai':'stupefaccio','suoli':'soglio','supponi':'suppongo','svieni':'svengo','taci':'taccio','tieni':'tengo','togli':'tolgo','torrefa':'torrefaccio','torrefai':'torrefaccio','trai':'traggo','trascegli':'trascelgo','traspari':'traspaio','trasponi':'traspongo','trattieni':'trattengo','tumefa':'tumefaccio','tumefai':'tumefaccio','va':'vado','vai':'vado','vali':'valgo','vieni':'vengo','vogli':'voglio','vuoi':'voglio'},
	mappaDiacritici: [ // Mappa diacritici per le vocali italiane minuscole
		{'base':'à', 'letters':/[\u00e0\u00e1]/g},
		{'base':'è', 'letters':/[\u00e8\u00e9]/g},
		{'base':'i', 'letters':/[\u00eC\u00ed\u00ee]/g},
		{'base':'ò', 'letters':/[\u00f2\u00f3]/g},
		{'base':'u','letters':/[\u00f9\u00fa]/g}
		// La i e la u non presentano in italiano parole abbastanza importanti che cambiano di significato in relazione all'accento. Quindi è preferibile avere l'equivalenza di giu e giù, mentre si deve distinguere papa e papà, o e ed è, anche pero e però.
	],

	equivalenze: function(espressioniEq) { // argomento: espressioni equivalenti
		// Per velocizzare l'elaborazione nel ridurre un input alla forma normalizzata, occorre usare la struttura del dizionario (basata sulla veloce hashtable). Il risultato è che a ciascuna parola dovrà essere associata la parola normalizzata. Dato un insieme di parole tra loro equivalenti (sinonime), nell'ordine posto dallo scrittore, si prende la prima che sarà quella normalizzata. La parola può far parte di più insiemi di parole sinonime ed un insieme di sinonimi mira ad un significato abbastanza preciso. Non si devono unificare questi insiemi, quindi avremo più parole normalizzate associate ad una parola da normalizzare.

		// Se è presente il cifrario Vigenère, decifra le espressioni
		if (typeof(V) !== 'undefined') {
			for (var e = 0; e < espressioniEq.length; e++) {
				espressioniEq[e] = [V.decifra(espressioniEq[e])];
			}
		}

		// Recupera tutte le parole che avranno almeno un sinonimo e prepara le chiavi dell'array equivalenzeOrd
		for (var g = 0; g < espressioniEq.length; g++) { // g: indice gruppo
			// Le parole sinonime sono definite con la barra '|' che va rimossa mentre si recuperano le parole
			espressioniEq[g] = espressioniEq[g][0].split('|');
			for (var p = 0; p < espressioniEq[g].length; p++) { // p: indice parola
				if (!(espressioniEq[g][p] in Lingua.equivalenzeOrd)) {
					// I caratteri che fanno da separatori tralasciabili, vanno tralasciati ['‛‘’`´] (lo spazio è già gestito)
					// La stringa vuota va tralasciata perché non verrà mai chiamata, non essendo una parola
					if (!espressioniEq[g][p].match(/['‛‘’`´]+/) && espressioniEq[g][p] != '') {
						Lingua.equivalenzeOrd[espressioniEq[g][p]] = []; // prepara l'array che si riempirà dei sinonimi
					}
				}
			}
		}

		// Cerca la presenza di ogni parola nei gruppi (può essere presente in più di un gruppo). Raccoglie tutti i suoi sinonimi tenendo separati i gruppi con diverso significato. Poi verrà presa la prima parola, ma non in questo passaggio.
		for (var po in Lingua.equivalenzeOrd) { // po: parola ordinata
			for (var g = 0; g < espressioniEq.length; g++) { // g: indice gruppo
				if (espressioniEq[g].indexOf(po) !== -1) {
					// Ogni volta che la parola compare in un gruppo di parole (array), questo gruppo viene aggiunto all'array vuoto preparato. In questo modo i gruppi non si mescolano tra di loro, ma si forma un array di array.
					Lingua.equivalenzeOrd[po].push(espressioniEq[g]);
				}
			}
		}

		// Ora, dei gruppi di sinonimi raccolti, si conserva solo il primo sinonimo, trasformando ciascun array, associato alle parole ordinate, in una parola. Essendoci potenzialmente più di una parola, dato che più gruppi di sinonimi sono possibili, vanno tutte contenute in un array. Se la prima parola in un gruppo è una stringa vuota, va presa sia la stringa vuota che il secondo termine. Infatti, se una frase da verificare è formata da più parole, questa parola si potrà omettere (stringa vuota), ma se la frase è composta da 1 sola parola omettibile, questa non si può omettere.
		for (var po in Lingua.equivalenzeOrd) { // po: parola ordinata

			// Prende il primo termine di ogni gruppo per costruire un unico array di termini che sovrascriverà l'array di gruppi
			// In caso di stringhe vuote al primo posto, che rendono un termine omettibile, bisogna poter gestire anche i casi in cui non si potranno omettere. La soluzione adottata è conservare il primo termine dopo la stringa vuota, ma facendolo iniziare con due underscore '__'
			var paroleSemantiche = [];
			for (var g = 0; g < Lingua.equivalenzeOrd[po].length; g++) { // g: indice gruppo
				if (Lingua.equivalenzeOrd[po][g][0] === '') {
					paroleSemantiche.push('__'+Lingua.equivalenzeOrd[po][g][1]);
				} else {
					paroleSemantiche.push(Lingua.equivalenzeOrd[po][g][0]);
				}
			}
			Lingua.equivalenzeOrd[po] = paroleSemantiche;

			// Può capitare che la parola "sintattica" sia uguale a quella "semantica", in tal caso va rimossa per ottimizzare lo spazio
			if (Lingua.equivalenzeOrd[po].length === 1 && po === Lingua.equivalenzeOrd[po][0]) delete Lingua.equivalenzeOrd[po];
		}
	},

	normalizzaImperativo: function(str) {
		// Considerando che la prima parola dell'input del giocatore può essere un predicato, si deve chiamare questa funzione per eventualmente normalizzarla da imperativo a indicativo 1a persona.

		// Se il predicato non termina con -a o -i, allora non è un imperativo da trasformare
		// Rifiuta anche le parole costituite da una sola lettera
		if (str.length === 1 || (str.substr(-1, 1) !== 'a' && str.substr(-1, 1) !== 'i')) return str;

		if (Lingua.imperativiIrregolari[str] !== undefined) {
			return Lingua.imperativiIrregolari[str];
		} else {
			return str.substr(0, str.length - 1)+'o';
		}
	},

	normalizzaDiacritici: function(str) {
		for (var i = 0; i < Lingua.mappaDiacritici.length; i++) {
			str = str.replace(Lingua.mappaDiacritici[i].letters, Lingua.mappaDiacritici[i].base);
		}
		return str;
	},

	articolaFrasi: function(parti) {
		var frasi = []; var nf = 0; // nf: numero frasi
		var nsp = []; // nsp: numeri (indici) per le sotto parti
		var tsp = []; // tsp: totale sotto parti
		var np = 0; // numero parte (per muoversi tra le parti di frasi e tra i nsp)

		for (np = 0; np < parti.length; np++) { // np: numero parte
			parti[np] = parti[np].split('|');
			tsp.push(parti[np].length);
			nsp.push(0);
		}
		do {
			frasi.push('');
			for (np = 0; np < parti.length; np++) {
				if (np === 0) {
					frasi[nf] += parti[np][nsp[np]];
				} else {
					frasi[nf] += ' ' + parti[np][nsp[np]];
				}
			}
			nf++; // Siccome parte da 0, aggiunge la frase, ci lavora e poi incrementa
			np = 0;
			var a; // a: avanza le combinazioni di parti di frasi
			do {
				a = 0;
				nsp[np]++;
				if (nsp[np] === tsp[np]) {
					nsp[np] = 0;
					np++;
					if (np === nsp.length) return frasi;
					a = 1;
				}
			} while (a === 1);
		} while (true);
	},

	disarticolaEspressioniEq: function(str, utente) {
		// str: è una stringa di soli caratteri minuscoli e senza diacritici
		// utente: 1 è il giocatore, 2 è lo scrittore

		// Questa funzione rende utilizzabile la sintassi di Confabula per scrivere varie frasi alternative servendosi di caratteri speciali:
		// | questo significa 'oppure'. Es. "apro la porta con la chiave|introduco la chiave nella serratura"
		// [] queste definiscono un gruppo, utile per indicare parti facoltative. Es. "osservo le [|alte] conifere" - Notare che senza | non sarebbe cambiato nulla, ma mettere un'alternativa vuota all'aggettivo 'alte' significa che 'alte' può esserci o meno. Altro es. "parlo a [mago|Cromwell|stregone|abate]" - In questo modo almeno un termine è richiesto. Inoltre, le espressioni equivalenti definite nel vocabolario realizzano implicitamente l'equivalenza tra, per esempio, "a|al|allo| ecc."
		var frasi = [];

		if (utente === 1) { // input inviato dal giocatore
			// momentaneamente la frase viene inserita in un array per coerenza con il successivo processo
			frasi = [str];

		} else { // input previsti dallo scrittore (insieme di frasi da disarticolare)
			// Ricava l'insieme di frasi alternative (attualmente è implementato | e [] non annidate)
			var s = [0]; // s: segnaposti (il primo è già inserito: l'inizio)
			var ns = 0; // ns: numero segnaposto
			var ss = [0, 0]; // ss: segnaposti speciali (servono per verificare se si incontra prima | o [
			var parti = []; // parti che articolano le varie frasi

			do {
				ss[0] = str.indexOf('[', s[ns]);
				ss[1] = str.indexOf('|', s[ns]);
				if (ss[0] !== -1 && (ss[1] === -1 || ss[0] < ss[1])) {
					s.push(ss[0]); ns++;
					// Aggiunge una parte (se non è vuota) dal segnaposto precedente fino alla trovata [
					if (s[ns - 1] !== s[ns]) parti.push(str.substr(s[ns - 1], s[ns] - s[ns - 1]));
					s[ns]++; // Anche se la stringa è vuota deve collocarsi appena dopo la trovata [
					s.push(str.indexOf(']', s[ns])); ns++;
					parti.push(str.substr(s[ns - 1], s[ns] - s[ns - 1]));
					s[ns]++; // Si deve collocare appena dopo la trovata ]
				} else if (ss[1] !== -1 && (ss[0] === -1 || ss[1] < ss[0])) {
					s.push(ss[1]); ns++;
					// Aggiunge ultimo pezzo (se non è vuoto) dal segnaposto precedente fino alla trovata |
					if (s[ns - 1] !== s[ns]) parti.push(str.substr(s[ns - 1], s[ns] - s[ns - 1]));
					s[ns]++; // Si deve collocare appena dopo la trovata |
					// Usa le parti per articolare una o più frasi, poi svuota le parti
					if (parti.length > 0) frasi = frasi.concat(Lingua.articolaFrasi(parti));
					parti = [];
				} else {
					s.push(str.length); ns++;
					if (s[ns - 1] !== s[ns]) {
						parti.push(str.substr(s[ns - 1], s[ns] - s[ns - 1]));
					}
					// Usa le parti per articolare una o più frasi, poi svuota le parti ed esce dal ciclo
					if (parti.length > 0) frasi = frasi.concat(Lingua.articolaFrasi(parti));
					parti = [];
					break;
				}
			} while (true);
		}

		// Trasforma l'insieme di frasi in un insieme di insiemi di insiemi di parole semantiche
		for (var f = 0; f < frasi.length; f++) { // f: indice frase
			// Scompone una frase in un array di parole gestendo anche i caratteri separatori
			// regex: i separatori dentro (?: ) vengono scartati, quelli dentro ( ) vengono conservati
			// .filter(Boolean) elimina tutti gli elementi vuoti da un array
			frasi[f] = frasi[f].split(/(?:[ '‛‘’`´]+)|([,?!]+)/).filter(Boolean);
		}

		// Restituisce 1 frase o un insieme di frasi (anche se 1 sola è contenuta) in relazione all'input giocatore o scrittore
		// Le frasi disarticolate sono ancora frasi sintattiche
		if (utente === 1) { return frasi[0]; } else { return frasi; }
	},

	normalizzaInput: function(inputGrezzo, utente) {
		// L'input grezzo è una sequenza di caratteri, facilmente convertito in una frase sintattica, ovvero un insieme di parole. Normalizzare una frase sintattica significa che, siccome più frasi sintattiche varianti possono avere lo stesso significato (e portare alla stessa azione), ne viene scelta 1 unica che le rappresenta tutta, quella che qui viene chiamata "forma normale". Ciò permette di passare dal piano sintattico a quello semantico lavorando sempre con parole.
		// È possibile che una frase sintattica ambigua porti a più frasi semantiche, la disambiguazione avviene nel tentativo di usare le frasi semantiche, quelle che non prevedono un evento in base a quanto previsto dallo scrittore, verranno semplicemente scartate. Nel contesto delle avventure testuali quasi tutti i casi si risolveranno in questo semplice modo, altrimenti verrà eseguito il primo senso riconosciuto.
		// utente: 1 è il giocatore (che invia solo 1 frase); 2 è lo scrittore (che può preparare più frasi)

		// Porta i caratteri in minuscolo e normalizza i diacritici
		inputGrezzo = Lingua.normalizzaDiacritici(inputGrezzo.toLowerCase());

		// Disarticola le frasi e restituisce un insieme di parole (frase) o più insiemi di parole (frasi) tenendo conto se provengono dal giocatore o dallo scrittore (con la variabile 'utente').
		var frasiSintattiche = Lingua.disarticolaEspressioniEq(inputGrezzo, utente);
		var frasiSemantiche = []; var ps = 0; // ps: indice parola semantica

		if (utente === 1) { // input del giocatore
			// La frase viene inserita in un array per coerenza con il processo seguente
			frasiSintattiche = [frasiSintattiche];
		}

		// Trasforma l'insieme di frasi sintattiche in un insieme di frasi semantiche
		// La frase semantica non necessariamente sarà unica, ma può conservare delle ambiguità, solo nel momento del confronto tra input giocatore e scrittore si potranno risolvere.
		for (var f = 0; f < frasiSintattiche.length; f++) { // f: indice frase
			// Prepara un array vuoto che potrà contenere più frasi semantiche
			frasiSemantiche[f] = [];

			// Per ottenere una frase semantica devo prendere ciascun termine della frase sintattica e sostituirlo con i termini associati dentro equivalenzeOrd (ordinate). Le parole precedute da '__' indicano che va inserita una stringa nulla, cioè un segnaposto per una parola omettibile, eccetto se quella è l'unica parola che compone la frase. Può capitare che ci siano più parole semantiche possibili (ambiguità), vanno tutte conservate.
			for (var p = 0; p < frasiSintattiche[f].length; p++) { // p: indice parola
				// Prepara un array vuoto che potrà contenere più parole semantiche alternative
				frasiSemantiche[f][p] = [];
				// Il termine va comunque conservato così com'è
				frasiSemantiche[f][p].push(frasiSintattiche[f][p]);
				// Il termine va anche cercato nelle equivalenze e queste aggiunte in forma normalizzata
				if (Lingua.equivalenzeOrd[frasiSintattiche[f][p]] !== undefined) {
					var sn = 0; // sn: stringa nulla
					for (var psa = 0; psa < Lingua.equivalenzeOrd[frasiSintattiche[f][p]].length; psa++) { // psa: parola semantica alternativa
						// Copio il sinonimo normalizzato per ridurre i calcoli
						var sinonimoNorm = Lingua.equivalenzeOrd[frasiSintattiche[f][p]][psa];
						// Le parole omettibili '__' devono inserire la relativa parola ed una stringa nulla, eccetto quando la frase è composta da 1 sola parola: niente stringa nulla.
						if (sinonimoNorm.substring(0, 2) === '__') {
							// Il termine omettibile va comunque inserito, perché potrebbe essere anche inteso come una parola semantica senza sinonimi, ma con un concetto diverso rispetto a quello che le equivalenzeOrd considerano omettibile
							frasiSemantiche[f][p].push(sinonimoNorm.substring(2, sinonimoNorm.length));
							// Se siamo in presenza di più di una parola e il termine è omettibile, va segnalato con una stringa nulla
							if (sn === 0 && frasiSintattiche[f].length > 1) {
								// La stringa nulla va aggiunta una sola volta ed in prima posizione
								frasiSemantiche[f][p] = [''].concat(frasiSemantiche[f][p]);
								sn = 1; // Stringa nulla aggiunta 1 volta
							}
						} else {
							frasiSemantiche[f][p].push(sinonimoNorm);
						}
					}
				}
				// Se il termine è potenzialmente un imperativo va conservato (perché potremmo avere un "falso positivo"), ma anche va aggiunta la normalizzazione all'indicativo 1a persona. Operazione da effettuare solo sulla prima parola e solo sull'input del giocatore, lo scrittore è tenuto a non usare l'imperativo (ciò riduce ambiguità ed elaborazioni).
				if (utente === 1 && p === 0) {
					// Recupera il potenziale imperativo, scartando l'iniziale stringa vuota se presente
					var potenzialeImp = '';
					if (frasiSemantiche[f][0][0] === '') { potenzialeImp = frasiSemantiche[f][0][1] } else { potenzialeImp = frasiSemantiche[f][0][0] }
					// Trasforma da imperativo a indicativo e aggiungi il nuovo termine solo se è effettivamente cambiato
					var indicativo1aP = '';
					indicativo1aP = Lingua.normalizzaImperativo(potenzialeImp);
					if (indicativo1aP !== potenzialeImp) {
						// Il nuovo termine va aggiunto, però se esiste una forma normalizzata del nuovo termine, va aggiunta quella
						// (Questa parte di codice è di fatto duplicata e si potrebbe ottimizzare!)
						if (Lingua.equivalenzeOrd[indicativo1aP] === undefined) {
							frasiSemantiche[f][0].push(indicativo1aP);
						} else {
							var sn = 0; // sn: stringa nulla
							for (var psa = 0; psa < Lingua.equivalenzeOrd[indicativo1aP].length; psa++) { // psa: parola semantica alternativa
								// Copio il sinonimo normalizzato per ridurre i calcoli
								var sinonimoNorm = Lingua.equivalenzeOrd[indicativo1aP][psa];
								// Le parole omettibili '__' devono inserire la relativa parola ed una stringa nulla, eccetto quando la frase è composta da 1 sola parola: niente stringa nulla.
								if (sinonimoNorm.substring(0, 2) === '__') {
									// Il termine omettibile va comunque inserito, perché potrebbe essere anche inteso come una parola semantica senza sinonimi, ma con un concetto diverso rispetto a quello che le equivalenzeOrd considerano omettibile
									frasiSemantiche[f][p].push(sinonimoNorm.substring(2, sinonimoNorm.length));
									// Se siamo in presenza di più di una parola e il termine è omettibile, va segnalato con una stringa nulla
									if (sn === 0 && frasiSintattiche[f].length > 1 && frasiSemantiche[f][p][0] !== '') {
										// La stringa nulla va aggiunta una sola volta ed in prima posizione
										frasiSemantiche[f][p] = [''].concat(frasiSemantiche[f][p]);
										sn = 1; // Stringa nulla aggiunta 1 volta
									}
								} else {
									frasiSemantiche[f][p].push(sinonimoNorm);
								}
							}
						}
					}
				}
			}
		}
		// Restituisce 1 frase o un insieme di frasi (anche se 1 sola è contenuta) in relazione all'input giocatore o scrittore
		if (utente === 1) { return frasiSemantiche[0]; } else { return frasiSemantiche; }
	},

	fraseInFrasiSemantiche: function(frase, frasi) {
		// Il contesto è interamente semantico, perché tutti gli input sono normalizzati. Si tratta di verificare se una frase è presente in un dato insieme di frasi. La logica dell'algoritmo è verificare se la frase passata (con parole alternative) corrisponde ad almeno una nell'insieme di frasi, appena la trova la frase è nell'insieme, se arriva in fondo e non ha trovato nulla, la frase nell'insieme non c'è.
		// frase: input normalizzato del giocatore
		// frasi: insieme di input normalizzati previsti dallo scrittore

		// Cicla le frasi dello scrittore
		for (var f = 0; f < frasi.length; f++) { // f: indice frase scrittore

			// Seguirà un ciclo con meno parole, capace di soffermarsi se una parola, mentre, in relazione alle parole omesse, avanza il confronto se una frase potenzialmente più lunga
			var ps_slit = 0; // slittamento parola semantica dello scrittore
			var slit = 0; // slittamento avvenuto o meno mentre si valuta un gruppo di parole semantiche alternative

			// Cicla le parole semantiche nella frase del giocatore (slittando può confrontarsi con quelle più numerose dello scrittore)
			for (var ps = 0; ps < frase.length; ps++) { // ps: indice parola semantica

				var ps_ok = 0; // indica una corrispondenza trovata tra una parola semantica del giocatore e dello scrittore
				slit = 0; // lo slittamento per questa parola corrente non è ancora avvenuto

				// Se è stato raggiunto lo slittamento massimo possibile, deve uscire dal ciclo
				if (frasi[f][ps + ps_slit] === undefined) break;

				// Cicla le parole semantiche alternative nella frase del giocatore
				for (var psa = 0; psa < frase[ps].length; psa++) { // psa: indice parola semantica alternativa

					// Cicla le parole semantiche alternative nella frase dello scrittore
					for (var psa2 = 0; psa2 < frasi[f][ps + ps_slit].length; psa2++) { // psa2: parole semantiche alternative in una frase dello scrittore

						// Se c'è corrispondenza, esce dal ciclo di parole alternative e passa alla prossima parola
						if (frase[ps][psa] === frasi[f][ps + ps_slit][psa2]) {
							ps_ok = 1; slit = 0; break;
						// Se c'è una parola omettibile, deve avviare uno slittamento che farà confrontare la parola del giocatore corrente con la parola successiva della frase corrente dello scrittore. Lo slittamento va contato 1 sola volta, però deve essere incrementabile se il prossimo gruppo di psa contiene un altro termine omettibile.
						} else if (slit === 0 && frasi[f][ps + ps_slit][0] === '') {
							 slit = 1;
						}
					}
					// Se corrispondenza trovata, esce dal ciclo di parole
					if (ps_ok === 1) break;
				}
				// Se corrispondenza non trovata e non c'erano parole omettibili, deve provare altre frasi
				if (ps_ok === 0 && slit === 0) break;
				// Se c'è stato uno slittamento incrementa ora, non prima, perché serve solo dopo e prima guasterebbe i conti dei cicli correnti, inoltre deve rimanere sulla parola corrente del giocatore e fare confronti slittati
				if (slit === 1) { ps_slit++; ps--; }
			}

			// Se arriva in fondo ad una frase e l'ultima parola risulta trovata, allora una frase "scrittore" corrisponde alla frase "giocatore", a meno che, la frase dello scrittore ha altre parole ancora, ma quella del giocatore è conclusa. In tal caso, non c'è corrispondenza.
			if (ps_ok === 1 && frasi[f][frase.length + ps_slit] === undefined) return true;
		}
		return false;
	}
}

var Vista = {

	cronoInput: [], // Cronologia degli input del giocatore
	nCronoInput: 0, // Numero dell'input su cui ci si trova attualmente
	caricamento: 0, // Indica se la vista è in preparazione ed il caricamento è concluso o meno
	intermezzo: [], // Array di istruzioni "intermezzo" da eseguire prima della scena
	istroInizioScena: [], // Array di istruzioni non condizionate da eseguire ad inizio scena
	attesaImmagini: 0, // Indica se si è in attesa delle immagini o meno
	timerImmagini: 0, // ID dell'evento che controlla se le immagini sono state caricate
	hTestoP: 0, // Conserva l'altezza del testo precedente
	testo: '', // Testo, anche html, che descrive la scena
	uscite: '', // Elenco di uscite (link), separate da virgola e spazio
	scelte: '', // Elenco di scelte (link), separate con un ritorno a capo o altri metodi
	messaggiRifiuto: [], // Array di messaggi di rifiuto da mostrare casualmente
	timerFineRifiuto: 0, // ID dell'evento temporizzato che fa scomparire la scritta "Rifiuto input"
	stile: {}, // Array che contiene proprietà e valori inerenti lo stile grafico
	coloreTestoP: '', // Colore testo precedente
	effetti: [], // Array che contiene oggetti e parametri degli effetti
	nEffetti: 0, // Numeratore degli ID degli effetti
	timerEffetto: null, // ID dell'evento temporizzato che fa avanzare un effetto
	timerPremiTasto: 0, // ID dell'evento temporizzato che fa comparire la scritta "Premi un tasto"

	preparaScena: function(n) {

		// Segna che è in fase di caricamento della scena
		if (Vista.caricamento === 0) Vista.caricamento = 1;

		// L'avvio della scena 1 deve resettare la storia
		if (n === 1) {
			S.nuovaPartita();
			Vista.caricamento = 0;
			G.nScena = 0; // La scena 0 indica che le istruzioni chiamate sono all'interno del blocco istruzioniGenerali
			istruzioniGenerali(); // (funzione nel file 'scene.js')
			G.nScena = 1; G.nScenaP = 1; G.nScenaPP = 1; // Reimposta la scena 1 che è quella appena chiamata
		};

		// Segna i passaggi di scena
		G.nScenaPP = G.nScenaP; G.nScenaP = G.nScena; G.nScena = n;

		// In relazione alla scena di provenienza, segna il passaggio ad una scena che risulterà esplorata
		// Questo tracciamento andrebbe ignorato se il passaggio è dovuto al comando 'direzioni'
		if (G.passaggiScena[G.nScenaP] === undefined) G.passaggiScena[G.nScenaP] = [];
		if (G.nScena !== G.nScenaP && G.passaggiScena[G.nScenaP].indexOf(G.nScena) === -1) {
			G.passaggiScena[G.nScenaP].push(G.nScena);
			if (G.passaggiScena[G.nScena] === undefined) G.passaggiScena[G.nScena] = [];
			G.passaggiScena[G.nScena].push(G.nScenaP);
		}

		Vista.svuotaScena();
		Vista.attesaImmagini = 1;
	},
	svuotaScena: function() {

		// Annulla tutti gli effetti in corso
		clearTimeout(Vista.timerEffetto);
		Vista.timerEffetto = null;
		Vista.effetti = [];
		Vista.nEffetti = 0;

		// Svuota i contenuti e nasconde gli elementi della scena
		G.luoghiRagg.bloccati = 0;
		Vista.intermezzo = undefined;
		Vista.testo = '';
		Vista.uscite = '';
		Vista.scelte = '';
		document.getElementById('audio').innerHTML = '';
		document.getElementById('scelte').style.visibility = 'hidden';
		document.getElementById('scelte').innerHTML = '';
		document.getElementById('input').style.display = 'none';
		document.getElementById('input').value = '? ';
		document.getElementById('testo').style.visibility = 'hidden';
		document.getElementById('testo').innerHTML = '';

		// Rimuove gli stili personalizzati della scena precedente
		Vista.stile = {};
		var e_cor = document.getElementById('corpo');
		var e_inp = document.getElementById('input');
		e_cor.style.backgroundColor = null;
		e_inp.style.backgroundColor = null;
		e_cor.style.color = null;
		e_inp.style.color = null;
		document.getElementById('scelte').style.color = null;
		e_cor.style.fontFamily = null;
		e_inp.style.fontFamily = null;
		e_cor.style.fontSize = null;
		e_inp.style.fontSize = null;
		e_cor.style.textAlign = null;
		e_inp.style.textAlign = null;

		// Svuota le istruzioni e l'input grezzo della scena precedente
		S.Istruzioni.scena = [];
		I.inputGrezzo = '';
	},
	mostra: function() {
		var e_txt = document.getElementById('testo');

		// Prepara le istruzioni di inizio scena con trattamento speciale per gli intermezzi
		if (Vista.intermezzo === undefined) {
			Vista.intermezzo = [];
			Vista.istroInizioScena = [];
			var livello = ['generali', 'scena'];
			livello.forEach(function(L) { // L: Livello delle istruzioni
				for (var iI = 0; iI < S.Istruzioni[L].length; iI++) { // iI: indice istruzione
					if (S.Istruzioni[L][iI].soloInizioScena === 1) {
						if (S.Istruzioni[L][iI].azione === 'intermezzo') {
							if (I.controllaCondizioni(L, iI)) Vista.intermezzo.push(S.Istruzioni[L][iI]);
						} else {
							if (I.controllaCondizioni(L, iI)) Vista.istroInizioScena.push(S.Istruzioni[L][iI]);
						}
						// Una volta eseguita un'istro inizio scena, non servirà più
						// Se è specificato autoElimina, l'istruzione va eliminata
						if (L === 'scena' || S.Istruzioni[L][iI].autoElimina) {
							S.Istruzioni[L].splice(iI, 1); iI--;
						}
					}
				}
			});
		}

		// Prima di mostrare la scena si devono mostrare tutti gli intermezzi preparati
		if (Vista.intermezzo.length > 0) {
			// Ripulisce il testo da precedenti intermezzi
			e_txt.innerHTML = '';
			I.eseguiIstruzione(Vista.intermezzo[0]);
			// Elimina il primo intermezzo inserito dall'autore, pop() darebbe un effetto inverso non desiderato
			Vista.intermezzo.shift();
			// Interrompe mostra() che sarà richiamato da passaIntermezzo()
			return;
		} else {
			e_txt.style.visibility = 'hidden';
		}

		// Esegue tutte le azioni inizio scena ed attende il caricamento delle immagini
		if (Vista.attesaImmagini === 1) {
			// Si segna il titolo perché potrebbe essere sovrascritto da un contatore per l'attesa
			Vista.stile.titolo = document.title;
			// Ripulisce il testo da precedenti intermezzi
			e_txt.innerHTML = '';
			// Esegue istruzioni ed aggiunge le immagini così inizia a caricarle, mantenendo e_txt invisibile
			for (var i = 0; i < Vista.istroInizioScena.length; i++) {
				I.eseguiIstruzione(Vista.istroInizioScena[i]);
			}
			e_txt.innerHTML = Vista.testo;
			// Passa alla fase 2 dell'attesa per le immagini
			Vista.attesaImmagini = 2;
			// Interrompe Vista.mostra che sarà richiamata ogni decimo di secondo
			Vista.timerImmagini = setTimeout(Vista.mostra, 100); return;

		// Controlla che le immagini siano caricate
		} else if (Vista.attesaImmagini > 1) {
			var ee_img = document.getElementsByTagName('img');
			for (var i = 0; i < ee_img.length; i++) {
				if (ee_img[i].naturalWidth === 0) {
					// Continua con la fase 2 attesa per le immagini
					Vista.timerImmagini = setTimeout(Vista.mostra, 100);
					// Ritenta solo entro un certo tempo (15 s)
					if (Vista.attesaImmagini > 31) {
						// Dopo 3 s mostra sulla scheda il tempo di attesa rimasto
						document.title = 'Attesa ' + (13 - Math.floor(Vista.attesaImmagini / 10));
					}
					if (Vista.attesaImmagini < 131) {
						Vista.attesaImmagini++;
						return;
					} else {
						// Rimuove l'immagine che non è stato possibile caricare
						ee_img[i].parentNode.removeChild(ee_img[i]);
					}
				}
			}
			// Se tutte le immagini risultano caricate, termina l'attesa per le immagini
			Vista.attesaImmagini = 0;
			clearTimeout(Vista.timerImmagini);
			// Ripristina il titolo della storia ed elimina il contatore per l'attesa
			document.title = Vista.stile.titolo;
			delete Vista.stile.titolo;
			Vista.testo = e_txt.innerHTML;
		}

		// Aggiunge le attuali uscite visibili in fondo al testo
		if (Vista.uscite !== '') {
			var all = ''; if (Vista.stile.testoAllineamento) all = Vista.cssAll(Vista.stile.testoAllineamento);
			Vista.testo += '<p'+ all +'>Uscite visibili:' + Vista.uscite.substr(1) + '.</p>';
		}

		// Per sicurezza, una volta che si prosegue con il caricamento finale, è bene reimpostare il testo
		e_txt.innerHTML = Vista.testo;
		document.getElementById('scelte').innerHTML = Vista.scelte;

		// Proseguendo mostrerà effettivamente la scena corrente //

		// Imposta lo stile personalizzato per la scena corrente
		var e_cor = document.getElementById('corpo');
		var e_inp = document.getElementById('input');

		if (Vista.stile.coloreSfondo) {
			e_cor.style.backgroundColor = Vista.stile.coloreSfondo;
			e_inp.style.backgroundColor = Vista.stile.coloreSfondo;
		}
		if (Vista.stile.coloreTesto) {
			e_cor.style.color = Vista.stile.coloreTesto;
			e_inp.style.color = Vista.stile.coloreTesto;
		}
		if (Vista.stile.testoCarattere) {
			e_cor.style.fontFamily = Vista.stile.testoCarattere;
			e_inp.style.fontFamily = Vista.stile.testoCarattere;
		}
		if (Vista.stile.testoGrandezza) {
			e_cor.style.fontSize = Vista.stile.testoGrandezza + 'px';
			e_inp.style.fontSize = Vista.stile.testoGrandezza + 'px';
		}
		if (Vista.stile.testoAllineamento) {
			var all;
			switch(Vista.stile.testoAllineamento) {
				case 'giustificato': all = 'justify'; break;
				case 'centrato': all = 'center'; break;
				case 'destra': all = 'right'; break;
				case 'sinistra': all = 'left'; break;
			}
			e_cor.style.textAlign = all;
			e_inp.style.textAlign = all;
		}
		if (Vista.stile.coloreScelta || Vista.stile.coloreSceltaSelez) {
			var ee_scelte = document.getElementsByClassName("scelta");
			if (Vista.stile.coloreScelta) {
				for (var i = 0; i < ee_scelte.length; i++) {
					ee_scelte[i].style.color = Vista.stile.coloreScelta;
				}
			}
			if (Vista.stile.coloreSceltaSelez) {
				for (var i = 0; i < ee_scelte.length; i++) {
					ee_scelte[i].addEventListener('mouseenter', function() { this.style.color = Vista.stile.coloreSceltaSelez });
					if (Vista.stile.coloreScelta) {
						ee_scelte[i].addEventListener('mouseout', function() { this.style.color = Vista.stile.coloreScelta });
					} else  {
						ee_scelte[i].addEventListener('mouseout', function() { this.style.color = null });
					}
				}
			}
		}

		// Gestione visibilità della scena
		e_txt.style.visibility = 'visible';
		if (Vista.stile.inputBox === 1) document.getElementById('input').style.display = 'block';
		if (Vista.scelte !== '') document.getElementById('scelte').style.visibility = 'visible';
		// Esegue il file audio se caricato
		var e_fileAudio = document.getElementById('fileAudio');
		if (e_fileAudio !== null) e_fileAudio.play();
		// Segna che è conclusa la fase di caricamento della scena
		Vista.caricamento = 0;
		// Passa il focus alla casella di input
		G.pronto();
	},
	misuraHTesto: function() {
		// Recupera l'altezza del testo (sono esclusi input e scelte)
		return document.getElementById('testo').offsetHeight + document.getElementById('testo').offsetTop;
	},
	misuraHContenuto: function() {
		// Recupera l'altezza del contenuto (testo, input e scelte)
		var hContenuto = Vista.misuraHTesto();
		if (document.getElementById('scelte').style.visibility === 'visible') {
			hContenuto = document.getElementById('scelte').offsetTop + document.getElementById('scelte').offsetHeight;
		} else if (document.getElementById('input').style.display === 'block') {
			hContenuto = document.getElementById('input').offsetTop + document.getElementById('input').offsetHeight;
		}
		return hContenuto;
	},
	fondoPagina: function() {
		// Misura l'altezza del testo
		var hTesto = Vista.misuraHTesto();
		// Misura l'altezza del contenuto (testo, input e scelte)
		var hContenuto = Vista.misuraHContenuto();
		// Scorre fino ad arrivare a fondo pagina, ma fermandosi prima per non saltare mai del contenuto non letto
		var ay = hContenuto - window.innerHeight; // ay: avanzo y assoluto
		if (ay > 0) {
			if (ay < window.innerHeight) {
				window.scroll(0, ay + 8);
			} else {
				window.scroll(0, Vista.hTestoP);
			}
		}
	},
	annullaTabLink: function() {
		var list = document.getElementsByClassName('tabLink');
		if (list.length !== 0) list[0].classList.remove('tabLink');
	},

	eseguiAudio: function(aud) {
		var e_aud = document.getElementById('audio');
		e_aud.innerHTML = '<audio src="' + Risorse[aud] + '" autoplay="autoplay"></audio>';
	},
	scorriCronoInput: function(n) {
		// L'evento keydown disabilita input box per non vedere il cursore del testo (spiacevole perché andando all'indietro con la cronologia input, il cursore si colloca prima all'inizio e poi alla fine). L'unica soluzione valida è disabilitare input box e farlo tornare pronto dopo pochissimo tempo
		setTimeout(G.pronto, 100);

		// Se la cronologia è vuota annulla il comando
		if (Vista.cronoInput.length === 0) return;

		// Scorre di n (-1 o +1) la cronologia degli input
		var e_inp = document.getElementById('input');
		Vista.nCronoInput = Vista.nCronoInput + n;
		if (Vista.nCronoInput < 0) Vista.nCronoInput = 0;
		if (Vista.nCronoInput > Vista.cronoInput.length - 1) {
			Vista.nCronoInput = Vista.cronoInput.length;
			e_inp.value = '? ';
		} else {
			e_inp.value = '? ' + Vista.cronoInput[Vista.nCronoInput];
		}
	},

	cssAll: function(all) {
		switch(all) {
			case 'giustificato': case 'justify': all = ' style="text-align:justify;"'; break;
			case 'centrato': case 'center': all = ' style="text-align:center;"'; break;
			case 'destra': case 'right': all = ' style="text-align:right;"'; break;
			case 'sinistra': case 'left': all = ' style="text-align:left;"'; break;
			default: return '';
		}
		return all;
	},
	testoSpeciale: function(str) {
		// str: stringa con testo speciale da riconoscere e risolvere
		var out = []; var p1 = 0, p2 = 0;

		// Verifica la randomizzazione di parti del testo
		p1 = str.indexOf('x(');
		if (p1 !== -1) {
			out.push(Vista.contenitori(str.substr(0, p1)));
			p2 = str.indexOf(')', p1 + 2);
			var str_x = str.substr(p1 + 2, p2 - p1 - 2).split('|');
			var n = Math.floor((Math.random() * str_x.length));
			out.push(Vista.contenitori(str_x[n]));
			out.push(Vista.contenitori(str.substr(p2 + 1, str.length - p2)));
		} else {
			out.push(Vista.contenitori(str));
		}

		// Compone il possibile risultato finale
		str = out.join('');
		out = [];

		// Verifica presenza di link rapidi nel testo
		p1 = 0, p2 = 0;
		do {
			p1 = str.indexOf('__', p2);
			if (p1 !== -1) {
				out.push(str.substr(p2, p1 - p2));
				p2 = str.indexOf('__', p1 + 2);
				if (p2 !== -1) {
					var str_lnk = str.substr(p1 + 2, p2 - p1 - 2).split('|');
					if (str_lnk.length < 3) {
						out.push('<a onclick=\"Vista.noTag(this);I.scriviInput(\'');
						out.push(str_lnk[str_lnk.length - 1]); // L'ultima stringa va usata come input del giocatore
						out.push('\');\">' + str_lnk[0] + '</a>');
					} else { p1 = null; }
				} else { p1 = null; }
				p2 = p2 + 2;
			} else {
				// se p1 è -1 e non è stato trovato alcun __ , allora ignora ricerca link rapidi
				// altrimenti, se precedenti __ sono stati trovati, deve inserire in out la parte finale della stringa
				if (out.length === 0) {
					p1 = undefined;
				} else {
					out.push(str.substr(p2, str.length - p2));
				}
			}
		} while (p1 !== undefined && p1 !== -1 && p1 !== null);

		if (p1 === -1) {
			// Se p1 risulta -1, allora i link rapidi sono stati trovati e processati
			str = out.join('');
		} else if (p1 === null) {
			// Se p1 risulta null, allora c'è stata un'anomalia e va comunicata
			alert('Nella scena '+G.nScena+' c\'è un uso anomalo della sintassi __link__. Controllare!');
		}

		// Restituisce il risultato finale
		return str;
	},
	contenitori: function(str) {
		// str: stringa di cui verificare la presenza di contenitori: @nome contenitore@
		var out = [];
		out = str.split('@');
		if (out.length < 3) return str;
		for (var i = 1; i < out.length; i++) {
			if (S.oggetti[out[i]] !== undefined) {
				out[i] = Vista.contenuto(out[i]); i++;
			} else {
				out[i] = '@' + out[i];
			}
		}
		// Restituisce il risultato finale
		return out.join('');
	},
	contenuto: function(nome) {
		// nome: del contenitore di cui visualizzare il contenuto
		if (S.oggetti[nome][0].length === 0) {
			return 'niente';
		} else {
			if (I.istroLivello === 'scena') {
				return S.oggetti[nome][1].join(', '); // Contenitore del giocatore
			} else {
				return S.oggetti[nome][0].join(', '); // Contenitore dell'ambiente
			}
		}
	},
	noTag: function(o) {
		// o: oggetto solitamente passato con 'this'
		o.outerHTML = o.innerHTML;
	},

	fineRifiuto: function(event) {
		document.removeEventListener('keydown', Vista.fineRifiuto);
		clearTimeout(Vista.timerFineRifiuto);
		if (Vista.timerFineRifiuto === undefined) return;
		Vista.timerFineRifiuto = undefined;
		var e_inp = document.getElementById('input');
		e_inp.value = '? ';
		e_inp.style.color = Vista.coloreTestoP;
		e_inp.className = 'coloreSfondo coloreTesto testoCarattere testoGrandezza larghezzaMaxStoria';
		e_inp.readOnly = false;
		if (event !== undefined && event.keyCode === 38) {
			e_inp.disabled = true;
			Vista.scorriCronoInput(-1);
		} else {
			setTimeout(G.pronto, 100);
		}
	},
	passaIntermezzo: function() {
		document.removeEventListener('keydown', Vista.passaIntermezzo);
		document.removeEventListener('click', Vista.passaIntermezzo);
		clearTimeout(Vista.timerPremiTasto);
		Vista.mostra();
	},
	premiUnTasto: function() {
		var e_txt = document.getElementById('testo');
		e_txt.innerHTML += '<p>[Premi un tasto per continuare]</p>';
	},
	prossimaScena: function() {
		document.removeEventListener('keydown', Vista.prossimaScena);
		document.removeEventListener('click', Vista.prossimaScena);
		clearTimeout(Vista.timerPremiTasto);
		istruzioniScena(G.nScenaPP);
	},
	avanzaEffetto: function() {

		// Se la scena è in corso di caricamento, rimanda inizio effetto
		if (Vista.caricamento === 1) return;

		// Recupera elemento su cui applicare l'effetto e se non esiste lo crea
		var e_eff = document.getElementById(Vista.effetti[0].IDelem);
		if (e_eff === null) {
			var e_txt = document.getElementById('testo');
			e_txt.innerHTML += '<p id="'+Vista.effetti[0].IDelem+'"'+Vista.effetti[0].stile+'>&nbsp;</p>';
			e_eff = document.getElementById(Vista.effetti[0].IDelem);
		}

		// Porta avanti l'effetto corrente
		switch (Vista.effetti[0].tipo) {
			case 'testo-caratteri':
			case 'testo-parole':
				if (Vista.effetti[0].contatore === 0) {
					e_eff.innerHTML = Vista.effetti[0].output[Vista.effetti[0].contatore];
				} else {
					e_eff.innerHTML += Vista.effetti[0].output[Vista.effetti[0].contatore];
				}
				Vista.effetti[0].contatore++;
				if (Vista.effetti[0].contatore >= Vista.effetti[0].output.length) {

					// Giunto alla fine dell'effetto disattiva il timer
					clearTimeout(Vista.timerEffetto);
					Vista.timerEffetto = null;

					// Elimina l'effetto concluso e prepara eventualmente il prossimo
					Vista.effetti.shift();
					if (Vista.effetti.length >= 1) {
						Vista.timerEffetto = setInterval(Vista.avanzaEffetto, Vista.effetti[0].intervallo);
					}
				}
			break;
		}
		Vista.fondoPagina();
	}
}

// Interprete (I)
var I = {

	inputGrezzo: '',
	inputNorm: [],
	istroLivello: '', // livello istruzioni attualmente processato (di scena, generali)

	leggiInput: function() {
		var e_inp = document.getElementById('input');

		// Salva l'input grezzo, così come inserito dall'utente, ma senza spazi in testa o in coda
		I.inputGrezzo = e_inp.value.trim();
		if (I.inputGrezzo.charAt(0) === '?') I.inputGrezzo = I.inputGrezzo.substr(1).trim();

		// Rifiuta un input vuoto e reimposta la casella di input
		if (I.inputGrezzo === '') { e_inp.value = '? '; G.pronto(); return; }

		// Salva l'input nella cronologia degli input con limite 20 elementi
		// Se l'input precedente è uguale a quello attuale, non lo aggiunge
		if (I.inputGrezzo !== Vista.cronoInput[Vista.cronoInput.length - 1]) Vista.cronoInput.push(I.inputGrezzo);
		if (Vista.cronoInput.length === 21) Vista.cronoInput.shift();
		Vista.nCronoInput = Vista.cronoInput.length;


		// Normalizza l'input grezzo del giocatore
		I.inputNorm = Lingua.normalizzaInput(I.inputGrezzo, 1);
		var istro; // istro: istruzione
		var inputEseguito = 0;
		var cambioScena = 0;

		// Deve controllare se l'input soddisfa qualche istruzione corrente ed eseguirla //
		// Leggere (e comprendere) qui significa stabilire quale azione eseguire dopo la lettura

		// Istruzioni speciali integrate in Confabula //

		// Comando 'chiudi' per uscire dall'applicazione
		istro = {};
		if (/^(quit|exit|esco|esci)$/.test(I.inputNorm[0][0])) {
			istro.frasi = Lingua.normalizzaInput("[quit|exit]|esco da [gioco|storia|partita|avventura|avventura testuale]", 2);
			if (Lingua.fraseInFrasiSemantiche(I.inputNorm, istro.frasi)) {
				istro.azione = 'rispondi';
				istro.input = I.inputGrezzo;
				istro.output = '<span class="coloreTestoInviato">Per uscire chiudi la scheda del navigatore Web. Se desideri ricominciare daccapo puoi aggiornare la pagina del navigatore o scrivere \'restart\'.</span>';
				I.eseguiIstruzione(istro);
				e_inp.value = '? ';
				return;
			}
		}

		// Comando 'riavvia' per riavviare la partita (solo avviso)
		istro = {};
		if (/^(restart|riavvio|riavvia|ricomincio|ricomincia)$/.test(I.inputNorm[0][0])) {
			istro.frasi = Lingua.normalizzaInput("restart|[riavvio|ricomincio] il [gioco|storia|partita|avventura|avventura testuale]", 2);
			if (Lingua.fraseInFrasiSemantiche(I.inputNorm, istro.frasi)) {
				istro.azione = 'rispondi';
				istro.input = I.inputGrezzo;
				istro.output = '<span class="coloreTestoInviato">Ricaricare tutto comporterà la perdita delle informazioni sulla partita in corso. Per confermare scrivi \'restart!\' o \'riavvia!\' o \'ricomincio!\' con il punto esclamativo.</span>';
				I.eseguiIstruzione(istro);
				e_inp.value = '? ';
				return;
			}
		}

		// Comando 'riavvia!' per riavviare la partita (azione effettiva)
		istro = {};
		if (I.inputNorm.length === 2 && /^(restart|riavvio|riavvia|ricomincio|ricomincia)$/.test(I.inputNorm[0][0]) && /^!$/.test(I.inputNorm[1][0])) {
			istro.azione = 'rispondiVai';
			istro.input = I.inputGrezzo;
			istro.output = '<span class="coloreTestoInviato">Ricarico tutto dall\'inizio...</span>';
			istro.scena = 1;
			I.eseguiIstruzione(istro);
			e_inp.value = '? ';
			return;
		}

		// Comando 'istruzioni' per poterle leggere ogni momento
		istro = {};
		if (I.inputNorm.length === 1 && /^istruzioni$/.test(I.inputNorm[0][0])) {
			istro.azione = 'rispondi';
			istro.input = I.inputGrezzo;
			istro.output = '<span class="coloreTestoInviato">' + G.istruzioni + '</span>';
			I.eseguiIstruzione(istro);
			e_inp.value = '? ';
			return;
		}

		// Comando 'salva' per salvare la partita in corso
		istro = {};
		if (I.inputNorm.length === 1 && /^(save|salva|salvo)$/.test(I.inputNorm[0][0])) {
			istro.azione = 'rispondi';
			istro.input = I.inputGrezzo;
			istro.output = '<span class="coloreTestoInviato">Specificare il numero della posizione da 0 a 9 in cui salvare. Esempio: \'save 2\'. I salvataggi saranno disponibili solo sul navigatore Web in cui sono stati registrati. Per eliminare tutti i salvataggi scrivere \'save reset\'.</span>';
			I.eseguiIstruzione(istro);
			e_inp.value = '? ';
			return;
		} else if (I.inputNorm.length === 2 && /^(save|salva|salvo)$/.test(I.inputNorm[0][0]) && /^[0-9]{1}$/.test(I.inputNorm[1][0])) {
			istro.azione = 'rispondi';
			istro.input = I.inputGrezzo;
			// Salva tutte le variabili della partita nell'HTML5 storage
			if (typeof(Storage) !== 'undefined') {
				try {
					// Archivia tutte le info sulla partita in corso in un'unica stringa da infilare nell'HTML5 storage
					localStorage.setItem(document.title+' '+I.inputNorm[1][0], [G.nScena, G.nScenaP, G.nScenaPP, JSON.stringify(G.passaggiScena), JSON.stringify(G.luoghiRagg), JSON.stringify(S.oggetti), JSON.stringify(S.variabili), JSON.stringify(S.Istruzioni.generali), JSON.stringify(S.Istruzioni.scena)].join('§§'));
					istro.output = '<span class="coloreTestoInviato">Partita salvata in posizione ' + I.inputNorm[1][0] + '</span>';
				} catch (err) {
					// Chrome o Chromium possono avere i permessi di scrittura nell'HTML5 storage disabilitati
					// Firefox ed Opera sono stati testati e risultano funzionanti (anche Chrome normalmente funziona)
					istro.output = '<span class="coloreRifiuto">Impossibile salvare la partita.</span> <span class="coloreTestoInviato">Questo navigatore Web nega l\'accesso all\'HTML5 storage da parte dei file locali. Se state usando Chrome o Chromium la soluzione è probabilmente questa: spostarsi in alto a destra e cliccare sul menu generale con l\'icona <strong>፧</strong> ; cliccare su Impostazioni (Settings); scorrere le sezioni fino in fondo e cliccare su Avanzate (Advanced); nella sezione Privacy e sicurezza (Privacy and Security), cliccare su Impostazioni contenuti (Content Settings); poi cliccare sulla prima voce Cookie; "Blocca cookie di terze parti" probabilmente è attivo, ma può rimanere così; aggiungere un\'eccezione per i file locali cliccando su Aggiungi (Add) alla voce Consenti (Allow); inserire nella casella di testo quanto segue: file:///* e cliccare sul pulsante Aggiungi (Add). D\'ora in avanti Chrome o Chromium permetteranno ai file html sul vostro PC di salvare qualche dato nell\'HTML5 storage. Ricaricate questa pagina html ed i salvataggi dovrebbero funzionare.</span>';
				}
			} else {
				// HTML5 storage non supportato dal navigatore Web
				istro.output = '<span class="coloreRifiuto">Impossibile salvare la partita.</span> <span class="coloreTestoInviato">Questo navigatore Web non supporta l\'HTML5 storage. Per salvare e caricare le partite si deve utilizzare un navigatore Web moderno che supporti questa funzionalità.</span>';
			}
			I.eseguiIstruzione(istro);
			e_inp.value = '? ';
			return;
		} else if (I.inputNorm.length === 2 && /^(save|salva|salvo)$/.test(I.inputNorm[0][0]) && /^reset$/.test(I.inputNorm[1][0])) {
			for (var s = 0; s < 10; s++) {
				localStorage.removeItem(document.title+' '+s);
			}
			istro.azione = 'rispondi';
			istro.input = I.inputGrezzo;
			istro.output = '<span class="coloreTestoInviato">Tutti i salvataggi per '+ document.title +' sono stati eliminati.</span>';
			I.eseguiIstruzione(istro);
			e_inp.value = '? ';
			return;
		}

		// Comando 'carica' per caricare una partita salvata
		istro = {};
		if (I.inputNorm.length === 1 && /^(load|carica|carico)$/.test(I.inputNorm[0][0])) {
			istro.azione = 'rispondi';
			istro.input = I.inputGrezzo;
			istro.output = '<span class="coloreTestoInviato">Specificare il numero della posizione da 0 a 9 da cui caricare. Esempio: \'load 2\'. Per eliminare tutti i salvataggi scrivere \'save reset\'.</span>';
			I.eseguiIstruzione(istro);
			e_inp.value = '? ';
			return;
		} else if (I.inputNorm.length === 2 && /^(load|carica|carico)$/.test(I.inputNorm[0][0]) && /^[0-9]{1}$/.test(I.inputNorm[1][0])) {
			var dati = localStorage.getItem(document.title+' '+I.inputNorm[1][0]);
			if (dati === null || dati === undefined) {
				istro.azione = 'rispondi';
				istro.input = I.inputGrezzo;
				istro.output = '<span class="coloreTestoInviato">Nella posizione '+I.inputNorm[1][0]+' non risulta alcun salvataggio.</span>';
				I.eseguiIstruzione(istro);
				e_inp.value = '? ';
			} else {
				dati = dati.split('§§');
				G.nScena = Number(dati[0]);
				G.passaggiScena = JSON.parse(dati[3]);
				G.luoghiRagg = JSON.parse(dati[4]);
				S.oggetti = JSON.parse(dati[5]);
				S.variabili = JSON.parse(dati[6]);
				istruzioniScena(G.nScena);
				// Dopo essersi collocato sulla giusta scena, sovrascrive le istruzioni con quelle salvate
				S.Istruzioni.generali = JSON.parse(dati[7]);
				S.Istruzioni.scena = JSON.parse(dati[8]);
				// Anche il numero di scena precedente (P e PP) va sovrascritto alla fine
				G.nScenaP = Number(dati[1]);
				G.nScenaPP = Number(dati[2]);
				e_inp.value = '? ';
			}
			return;
		}

		// Comando 'direzioni', per ricevere l'elenco dei luoghi visitabili
		istro = {};
		if (I.inputNorm.length === 1 && /^(direzioni|direzione|d)$/.test(I.inputNorm[0][0])) {
			if (I.inputGrezzo === 'd') I.inputGrezzo = 'direzioni';
			istro.azione = 'rispondi';
			istro.input = I.inputGrezzo;
			if (Vista.uscite === '' || G.luoghiRagg.bloccati === 1) {
				istro.output = 'Ora non puoi dirigerti velocemente in nessun luogo.';
			} else if (G.luoghiRagg.nomi.length === 0 || (G.luoghiRagg.nomi.length === 1 && G.luoghiRagg.coppie[G.nScena] !== undefined)) {
				istro.output = 'Ancora non puoi dirigerti velocemente in nessun luogo.';
			} else {
				istro.output = 'Luoghi raggiungibili: ' + G.luoghiRagg.nomi.join(', ') + '.';
			}
			I.eseguiIstruzione(istro);
			inputEseguito = 1;

		// Intercetta la prima parola del comando 'direzione', se i luoghi sono bloccati, lo annulla
		} else if (I.inputNorm.length > 1 && /^(direzione|d)$/.test(I.inputNorm[0][0]) && G.luoghiRagg.bloccati === 1) {
			istro.azione = 'rispondi';
			istro.input = I.inputGrezzo;
			istro.output = 'Ora non puoi dirigerti velocemente in nessun luogo.';
			I.eseguiIstruzione(istro);
			inputEseguito = 1;
		}

		// Prima controlla le istruzioni di scena, poi quelle generali
		var livello = ['scena', 'generali'];
		var A = []; // A: azioni, qui vengono raccolti gli indici delle istruzioni da eseguire, prima di eseguirle

		var tentativo = 1;
		do {
			if (tentativo === 2) {
				I.inputGrezzo = 'osserva '+ I.inputGrezzo;
				I.inputNorm = Lingua.normalizzaInput(I.inputGrezzo, 1);
			}
			livello.forEach(function(L) { // L: Livello delle istruzioni
				for (var iI = 0; iI < S.Istruzioni[L].length; iI++) { // iI: indice istruzione

					// Se è stata già eseguita un'azione (quelle integrate), verifica solo le istro senza inputG (es. nMosse deve avanzare)
					// Ricordarsi che 'save' e 'load' interrompono la funzione e quindi non sono contate come mosse
					if (inputEseguito === 1 && S.Istruzioni[L][iI].input !== undefined) continue;

					// Se è in atto un secondo tentativo di input, le nMosse non devono avanzare
					if (tentativo === 2 && S.Istruzioni[L][iI].mossa !== undefined) continue;

					// Se è in fase di caricamento della scena non deve partire subito il contatore delle istro "nMosse", perché il giocatore deve avere il tempo di fare delle mosse nella nuova scena. Inoltre, andare ad una nuova scena è già contata come mossa.
					if (Vista.caricamento === 1 && S.Istruzioni[L][iI].mossa !== undefined) continue;

					// Scarta le istruzioni generali eseguite solo ad inizio scena
					if (L === 'generali' && S.Istruzioni[L][iI].soloInizioScena === 1) continue;

					// Verifica tutte le condizioni affinché l'istruzione sia raccolta per essere eseguita
					// Il controllo si occupa di far avanzare anche il contatore nMosse
					if (I.controllaCondizioni(L, iI)) {
						// Se un'azione dovuta ad un inputG verrà eseguita, inutile cercarne altre
						if (S.Istruzioni[L][iI].input !== undefined) inputEseguito = 1;
						A.push([L, iI]);
					}
				}
			});
			tentativo++;

		// Se nessun input ha soddisfatto alcuna istruzione, solo per un secondo tentativo, provare ad aggiungere 'osserva' all'input grezzo
		} while (tentativo === 2 && inputEseguito === 0 && !/^(esamino|esamina|x|osservo|osserva)$/.test(I.inputNorm[0][1]));

		// Esegue le istruzioni raccolte, valutando l'ordine di esecuzione //

		var aE = []; // aE: indici dell'azione eseguita e da auto eliminare
		var aIG = 0; // aIG: un'azione input giocatore è stata eseguita (1) o no (0)

		for (var o = 0; o < 4; o++) { // o: ordine di esecuzione
			if (A.length === 0) break;
			for (var a = 0; a < A.length; a++) { // a: indice azione

				// Se c'è stato un cambio di scena e...
				if (cambioScena === 1) {
					// ...l'azione corrente è di scena, allora la ignora
					if (A[a][0] === 'scena') continue;
					// ...l'azione corrente è generale, ma non prevede un cambio di scena e non scatta dopo nMosse, allora la ignora
					if (A[a][0] === 'generali' && S.Istruzioni.generali[A[a][1]].azione !== 'vaiA' && S.Istruzioni.generali[A[a][1]].azione !== 'rispondiVai' && S.Istruzioni[A[a][0]][A[a][1]].mosse === undefined) continue;
				}

				// Le azioni vengono ciclate per ciascun criterio di esecuzione, secondo il seguente ordine
				switch (o) {
					case 0: // Esegue azioni che comportano cambi di scena (non dovuti a nMosse)
						if (S.Istruzioni[A[a][0]][A[a][1]].mosse === undefined && (S.Istruzioni[A[a][0]][A[a][1]].azione === 'vaiA' || S.Istruzioni[A[a][0]][A[a][1]].azione === 'rispondiVai')) {
							I.eseguiIstruzione(S.Istruzioni[A[a][0]][A[a][1]]);
							cambioScena = 1;
							// Ora le istro di scena sono state azzerate (se non è già avvenuto prima)
							// Dunque si deve controllare l'auto eliminazione solo per il livello generale
							if (A[a][0] === 'generali' && S.Istruzioni.generali[A[a][1]].autoElimina) aE = ['generali', A[a][1], a];
							// Rimuove l'azione eseguita dalla pila
							A.splice(a, 1); a--;
						}
					break;
					case 1: // Esegue azioni che comportano cambi di scena (dovuti a nMosse)
						if (S.Istruzioni[A[a][0]][A[a][1]].mosse !== undefined && (S.Istruzioni[A[a][0]][A[a][1]].azione === 'vaiA' || S.Istruzioni[A[a][0]][A[a][1]].azione === 'rispondiVai')) {
							// Occorre ricontrollare le condizioni per le istro, ma senza far avanzare nMosse
							if (I.controllaCondizioni(A[a][0], A[a][1], 'no!nMosse')) {
								I.eseguiIstruzione(S.Istruzioni[A[a][0]][A[a][1]]);
								cambioScena = 1;
								// Ora le istro di scena sono state azzerate (se non è già avvenuto prima)
								// Dunque si deve controllare l'auto eliminazione solo per il livello generale
								if (A[a][0] === 'generali' && S.Istruzioni.generali[A[a][1]].autoElimina) aE = ['generali', A[a][1], a];
								// Rimuove l'azione eseguita dalla pila
								A.splice(a, 1); a--;
							}
						}
					break;
					case 2: // Esegue azioni dovute all'input del giocatore e senza cambi di scena (solo la prima che incontra)
						if (aIG === 0 && S.Istruzioni[A[a][0]][A[a][1]].input !== undefined && S.Istruzioni[A[a][0]][A[a][1]].azione !== 'vaiA'&& S.Istruzioni[A[a][0]][A[a][1]].azione !== 'rispondiVai') {
							// Occorre ricontrollare le condizioni per le istro, ma senza far avanzare nMosse
							if (I.controllaCondizioni(A[a][0], A[a][1], 'no!nMosse')) {
								I.eseguiIstruzione(S.Istruzioni[A[a][0]][A[a][1]]);
								aIG = 1; // Indica che un'azione inputG è stata eseguita
								// Controlla l'auto eliminazione dell'azione
								// Se c'è stato un cambio di scena, le azioni di scena vengono scartate all'inizio
								if (S.Istruzioni[A[a][0]][A[a][1]].autoElimina) aE = [A[a][0], A[a][1], a];
								// Rimuove l'azione eseguita dalla pila
								A.splice(a, 1); a--;
							}
						}
					break;
					case 3: // Esegue azioni che scattano dopo nMosse e senza cambi di scena
						if (S.Istruzioni[A[a][0]][A[a][1]].mosse !== undefined && S.Istruzioni[A[a][0]][A[a][1]].azione !== 'vaiA'&& S.Istruzioni[A[a][0]][A[a][1]].azione !== 'rispondiVai') {
							// Occorre ricontrollare le condizioni per le istro, ma senza far avanzare nMosse
							if (I.controllaCondizioni(A[a][0], A[a][1], 'no!nMosse')) {
								I.eseguiIstruzione(S.Istruzioni[A[a][0]][A[a][1]]);
								// Controlla l'auto eliminazione dell'azione
								// Se c'è stato un cambio di scena, le azioni di scena vengono scartate all'inizio
								if (S.Istruzioni[A[a][0]][A[a][1]].autoElimina) aE = [A[a][0], A[a][1], a];
								// Rimuove l'azione eseguita dalla pila
								A.splice(a, 1); a--;
							}
						}
					break;
				}

				// Eventuale auto eliminazione di una istro, dopo la sua prima esecuzione
				// Le istro da auto eliminare sono contenute in aE
				if (aE.length > 0) {
					// aE[0]: livello generale o scena
					// aE[1]: indice istruzione
					// aE[2]: indice azione da eseguire raccolta

					// Se è avvenuto un cambio di scena elimina l'istro solo al livello generale
					// Dunque procede sia se non è avvenuto un cambio di scena, sia se il livello è generale
					if (cambioScena === 0 || aE[0] === 'generali') {
						S.Istruzioni[aE[0]].splice(aE[1], 1);
						// Eliminata un'istro, stando ad aE, si devono far scorrere gli indici memorizzati in A (indici azioni da eseguire), altrimenti risultano sfasati.
						for (var a2 = aE[2]; a2 < A.length; a2++) { if (aE[0] === A[a2][0]) A[a2][1]--; }
					}
					aE = [];
				}
			}
		}

		// Se è avvenuto un cambio di scena, dopo aver eseguito tutte le azioni necessarie, termina qui
		if (cambioScena === 1) return;

		// Svuota l'input grezzo che ormai non verrà più usato
		I.inputGrezzo = '';

		// Se ancora nessuna azione è stata eseguita, invita a provare altro
		if (inputEseguito === 0) {
			e_inp.readOnly = true;
			e_inp.className = 'coloreSfondo testoCarattere testoGrandezza larghezzaMaxStoria';
			if (e_inp.style.color) Vista.coloreTestoP = e_inp.style.color;
			if (Vista.stile.coloreRifiuto) { e_inp.style.color = Vista.stile.coloreRifiuto; } else { e_inp.className += ' coloreRifiuto'; }
			e_inp.value = Vista.messaggiRifiuto[Math.floor((Math.random() * Vista.messaggiRifiuto.length))];
			// Dopo 5 sec scompare il msg di rifiuto e torna l'ordinaria casella di inserimento degli input del giocatore
			clearTimeout(Vista.timerFineRifiuto);
			Vista.timerFineRifiuto = setTimeout(Vista.fineRifiuto, 5000);
			// Dopo 100 ms qualsiasi tasto risulta premuto conclude il msg di rifiuto e la lettera premuta farà parte del nuovo input
			setTimeout(function() {
				document.addEventListener('keydown', Vista.fineRifiuto);
				}, 100);
		} else {
			Vista.fineRifiuto();
			e_inp.value = '? ';
		}
		Vista.fondoPagina();
	},

	scriviInput: function(inp) {
		document.getElementById('input').value = '? ' + inp;
		I.leggiInput();
		G.pronto();
	},

	controllaCondizioni: function(L, iI, opz) {
		// L: livello dell'istruzione (generali, di scena)
		// iI: indice o ID dell'istruzione
		// opz: opzione aggiuntiva

		// Se non ci sono condizioni risponde subito vero, prima ancora di duplicare l'istruzione
		if (S.Istruzioni[L][iI].seVariabili === undefined && S.Istruzioni[L][iI].seOggetti === undefined && S.Istruzioni[L][iI].mosse === undefined && S.Istruzioni[L][iI].input === undefined) return true;
		var istro = S.Istruzioni[L][iI];

		// Si devono eseguire prima i controlli più semplici e poi i più complessi
		// All'inizio del controllo si lasciano le condizioni indefinite: valore scelto 2 (vero o falso)
		// Se diventa 0 significa "non soddisfatte", se diventa 1 "soddisfatte"
		var condSoddisfatte = 2;

		// Controlla le condizioni sulle variabili
		if (istro.seVariabili !== undefined) {
			for (var i = 0; i < istro.seVariabili.length; i++) {
				if (S.variabili[istro.seVariabili[i].nome] === undefined) { // Variabile non esiste
					// La variabile dovrebbe esistere
					if (istro.seVariabili[i].presenza === 1) condSoddisfatte = 0;
				} else { // Variabile esiste
					// La variabile non dovrebbe esistere
					if (istro.seVariabili[i].presenza === 0) condSoddisfatte = 0;
				}
			}
		}

		// Controlla le condizioni sugli oggetti
		if (condSoddisfatte !== 0 && istro.seOggetti !== undefined) {
			for (var i = 0; i < istro.seOggetti.length; i++) {
				if (S.oggetti[istro.seOggetti[i].contenitore] === undefined ||
					S.oggetti[istro.seOggetti[i].contenitore][0].indexOf(istro.seOggetti[i].nome) === -1) { // Oggetto assente
					// L'oggetto dovrebbe essere presente
					if (istro.seOggetti[i].presenza === 1) condSoddisfatte = 0;
				} else { // Oggetto presente
					// L'oggetto dovrebbe essere assente
					if (istro.seOggetti[i].presenza === 0) condSoddisfatte = 0;
				}
			}
		}

		// Controlla la condizione sul n. di mosse
		if (istro.mosse !== undefined && opz !== 'no!nMosse') {
			// Se il contatore è stato eliminato (undefined), considera l'istro non soddisfatta
			if (istro.mossa === undefined) {
				condSoddisfatte = 0;
			} else {
				// Se le condizioni non sono soddisfatte, azzera il contatore
				// Solo variabili od oggetti possono aver determinato una non soddisfazione a questo punto
				if (condSoddisfatte === 0) {
					S.Istruzioni[L][iI].mossa = 0;
				} else {
					// Verifica che ci sia un numero di mosse da raggiungere e che sia stato raggiunto
					if (istro.mossa >= istro.mosse) {
						// Azzera il contatore, se l'istro non verrà eliminata, si ripete di continuo
						S.Istruzioni[L][iI].mossa = 0;
					} else {
						S.Istruzioni[L][iI].mossa++;
						condSoddisfatte = 0;
					}
				}
			}
		}

		// Controlla la corrispondenza con l'input del giocatore
		if (condSoddisfatte !== 0 && istro.input !== undefined) {
			if (!Lingua.fraseInFrasiSemantiche(I.inputNorm, istro.input)) condSoddisfatte = 0;
		}

		// Se le condizioni risultano non soddisfatte a questo punto, interrompi e rispondi falso
		if (condSoddisfatte === 0) return false;
		// altrimenti rispondi vero
		return true;
	},

	impostaOggVar: function(elementi) {
		// Imposta, ovvero crea o distrugge, sia oggetti che variabili
		// elementi: stringa con caratteri speciali che riporta direttive sia su oggetti che su variabili
		//   il carattere + separa oggetti tra loro, o anche oggetti e variabili copresenti su str
		//   la presenza della @ indica che si tratta di un oggetto e deve seguire il nome di un contenitore
		//   iniziare la stringa con "no!" significa che quell'oggetto o variabile va eliminato

		elementi = elementi.split('  ');
		var presenza; var nome; var contenitore;
		for (var i = 0; i < elementi.length; i++) {
			// Se presente il "no!" l'oggetto o la variabile vanno cancellati
			if (elementi[i].substr(0, 3) === 'no!') {
				presenza = 0;
				elementi[i] = elementi[i].substr(3); // Viene rimosso il "no!"
			} else {
				presenza = 1;
			}
			if (elementi[i].indexOf('@') !== -1) { // Se contiene una chiocciola è un oggetto
				elementi[i] = elementi[i].split('@'); // Scomposizione oggetto@contenitore
				nome = elementi[i][0];
				contenitore = elementi[i][1];
				if (presenza === 1) {
					if (S.oggetti[contenitore] === undefined) {
						S.oggetti[contenitore] = [];
						S.oggetti[contenitore].push([]); // Elenco oggetti con articolo determinativo (id)
						S.oggetti[contenitore].push([]); // Elenco oggetti con articolo indeterminativo
					}
					if (S.oggetti[contenitore][0].indexOf(nome) === -1) {
						S.oggetti[contenitore][0].push(nome);
						S.oggetti[contenitore][1].push(nome);
					}
				} else if (S.oggetti[contenitore] !== undefined) { // Se non esiste il contenitore, inutile cercarci un oggetto dentro per distruggerlo
					var i_canc = S.oggetti[contenitore][0].indexOf(nome); // i_canc: indice oggetto da cancellare
					if (i_canc !== -1) {
						S.oggetti[contenitore][0].splice(i_canc, 1);
						S.oggetti[contenitore][1].splice(i_canc, 1);
					}
				}
			} else { // Se non contiene una chiocciola è una variabile
				if (presenza === 1) {
					if (S.variabili[elementi[i]] === undefined) S.variabili[elementi[i]] = 1;
				} else {
					if (S.variabili[elementi[i]] !== undefined) delete S.variabili[elementi[i]];
				}
			}
		}
	},

	eseguiIstruzione: function(istro) {
		// istro: istruzione da eseguire
		I.istroLivello = istro.livello; // Segnala globalmente se il livello è di scena o generale
		var e_txt = document.getElementById('testo');

		// Segna l'altezza del testo precedente (prima di eventualmente modificarlo)
		Vista.hTestoP = Vista.misuraHTesto();

		// Gestisci funzione immagine o l'agganciata __immagine
		if (istro.immagine) {
			if (istro.w === undefined) { istro.w = ''; } else { istro.w = ' width="'+istro.w+'"'; }
			if (istro.h === undefined) { istro.h = ''; } else { istro.h = ' height="'+istro.h+'"'; }
			if (istro.sostituisci === 1) {
				var ee_img = document.getElementsByTagName('img');
				ee_img[ee_img.length - 1].outerHTML = '<img style="display:block;" '+ istro.w + istro.h +' src="'+ Risorse[istro.immagine] +'" />';
				Vista.testo = e_txt.innerHTML;
			} else {
				Vista.testo += '<img style="display:block;" '+ istro.w + istro.h +' src="'+ Risorse[istro.immagine] +'" />';
			}
		}

		// Gestisci funzioni agganciate __oggetti e __variabili
		if (istro.oggetti) I.impostaOggVar(istro.oggetti);
		if (istro.variabili) I.impostaOggVar(istro.variabili);

		// Gestisci funzione agganciata __audio
		if (istro.audio) Vista.eseguiAudio(istro.audio);

		// Prepara alcuni aspetti dello stile
		var all = ''; if (istro.allineamento) all = Vista.cssAll(istro.allineamento);
		if (!all && Vista.stile.testoAllineamento) all = Vista.cssAll(Vista.stile.testoAllineamento);
		var classi = ''; var cssCol = ''; // Stile css in linea per il colore

		// Se l'azione non deriva da un inputGrezzo (es. scelta selezionabile), allora questo va impostato
		if (I.inputGrezzo === '' && istro.input !== undefined) I.inputGrezzo = istro.input;

		// Esegue l'azione principale
		switch (istro.azione) { // il tipo di azione dell'istruzione
			case 'coloreSfondo':
				Vista.stile.coloreSfondo = istro.colore;
			break;
			case 'coloreTesto':
				Vista.stile.coloreTesto = istro.colore1;
				if (istro.colore2) Vista.stile.coloreTestoInviato = istro.colore2;
			break;
			case 'coloreScelte':
				Vista.stile.coloreScelta = istro.colore1;
				if (istro.colore2) Vista.stile.coloreSceltaSelez = istro.colore2;
			break;
			case 'coloreRifiuto':
				Vista.stile.coloreRifiuto = istro.colore;
			break;
			case 'impostaMsgRifiuto':
				Vista.messaggiRifiuto = istro.messaggi.split('|');
			break;
			case 'carattereTesto':
				if (istro.font) Vista.stile.testoCarattere = istro.font;
				if (istro.size) Vista.stile.testoGrandezza = istro.size;
				if (istro.align) Vista.stile.testoAllineamento = istro.align;
			break;
			case 'bloccaDirezioni':
				G.luoghiRagg.bloccati = 1;
			break;
			case 'cancellaDirezione':
				if (S.luoghiRagg[istro.nome] !== undefined) delete S.luoghiRagg[istro.nome];
			break;
			case 'intermezzo':
				e_txt.innerHTML += '<p>'+Vista.testoSpeciale(istro.testo)+'</p>';
				e_txt.style.visibility = 'visible';
				// Dopo 100 ms qualsiasi tasto che risulta premuto chiama passaIntermezzo()
				setTimeout(function() {
					document.addEventListener('keydown', Vista.passaIntermezzo);
					document.addEventListener('click', Vista.passaIntermezzo);
				}, 100);
				// Dopo 5 sec compare la scritta "Premi un tasto" sotto il testo dell'intermezzo
				Vista.timerPremiTasto = setTimeout(Vista.premiUnTasto, 5000);
			break;
			case 'testo':
				if (istro.align === 'no!p') {
					Vista.testo += Vista.testoSpeciale(istro.testo);
				} else {
					if (istro.align) {
						istro.align = Vista.cssAll(istro.align);
					} else {
						if (Vista.stile.testoAllineamento) {
							istro.align = Vista.cssAll(Vista.stile.testoAllineamento);
						} else {
							istro.align = '';
						}
					}
					Vista.testo += '<p'+istro.align+'>'+Vista.testoSpeciale(istro.testo)+'</p>';
				}
			break;
			case 'creaContenitore':
				// L'istruzione è impostata affinché sia eseguita 1 volta sola
				S.oggetti[istro.nome] = [];
				// I contenitori sono array che contengono 2 array:
				// Primo array: oggetti con etichette art. det.; secondo array: oggetti con etichette art. indet.
				if (istro.ogg === '' || istro.ogg === undefined) {
					S.oggetti[istro.nome].push([]); // Etichette-ID con art. det.
					S.oggetti[istro.nome].push([]); // Etichette con art. indet.
				} else {
					var ogg_il = []; // Etichette-ID con art. det.
					var ogg_un = []; // Etichette con art. indet.
					istro.ogg = istro.ogg.split('  ');
					for (var o = 0; o < istro.ogg.length; o++) { // o: indice oggetto
						// Separa l'eventuale articolo indeterminativo dall'etichetta con art. det. (es. "un|l'amuleto")
						istro.ogg[o] = istro.ogg[o].split('|');
						switch (istro.ogg[o].length) {
							case 1:
								ogg_il.push(istro.ogg[o][0]);
								ogg_un.push(istro.ogg[o][0]);
								break;
							case 2:
								ogg_il.push(istro.ogg[o][1]); // Etichetta con art. det. già pronta
								// Etichetta con art. indet. va costruita controllando come iniziano le etichette con art. det.
								if (istro.ogg[o][1].startsWith('gli')) {
									ogg_un.push(istro.ogg[o][0]+istro.ogg[o][1].substring(3));
								} else if (istro.ogg[o][1].startsWith('gl\'')) {
									// Se finisce con un apostrofo, attacca l'articolo alla parola, altrimenti ci mette uno spazio
									if (istro.ogg[o][0].substring(istro.ogg[o][0].length - 1) === '\'') {
										ogg_un.push(istro.ogg[o][0]+istro.ogg[o][1].substring(3));
									} else {
										ogg_un.push(istro.ogg[o][0]+' '+istro.ogg[o][1].substring(3));
									}
								} else if (istro.ogg[o][1].match(/^il|lo|la|le/)) {
									ogg_un.push(istro.ogg[o][0]+istro.ogg[o][1].substring(2));
								} else if (istro.ogg[o][1].startsWith('l\'')) {
									// Se finisce con un apostrofo, attacca l'articolo alla parola, altrimenti ci mette uno spazio
									if (istro.ogg[o][0].substring(istro.ogg[o][0].length - 1) === '\'') {
										ogg_un.push(istro.ogg[o][0]+istro.ogg[o][1].substring(2));
									} else {
										ogg_un.push(istro.ogg[o][0]+' '+istro.ogg[o][1].substring(2));
									}
								} else if (istro.ogg[o][1].startsWith('i')) {
									ogg_un.push(istro.ogg[o][0]+istro.ogg[o][1].substring(1));
								}
								break;
							default:
								alert('Un\'etichetta presenta più di un separatore ammesso per l\'articolo indeterminativo. Correggere la scena n. '+ G.nScena);
								return;
						}
					}
					S.oggetti[istro.nome].push(ogg_il); // Etichette-ID con art. det.
					S.oggetti[istro.nome].push(ogg_un); // Etichette con art. indet.
				}
			break;
			case 'scegliRispondi':
				if (istro.al1 !== undefined) { istro.al1 = Vista.cssAll(istro.al1); } else { istro.al1 = ''; }
				if (istro.output !== undefined && istro.output !== '') {
					var iR = {}; // istruzione risposta
					iR['azione'] = 'rispondi';
					iR['input'] = istro.nome;
					iR['output'] = istro.output.replace(/'/g, '"');
					if (istro.al2 !== undefined) istro['allineamento'] = istro.al2;
					Vista.scelte += '<p class="scelta coloreScelta" '+ istro.al1 +' onclick="this.remove(); I.eseguiIstruzione('+JSON.stringify(iR).replace(/"/g, '\'')+'); Vista.fondoPagina();">'+ istro.nome +'</p>';
				} else {
					if (istro.al2 !== undefined) { istro.al2 = ', {\'outAli\':\''+istro.al2+'\'}'; } else { istro.al2 = ''; }
					istro.nome = istro.nome.replace(/'/g, '"').replace(/"/g, '\'');
					Vista.scelte += '<p class="scelta coloreScelta" '+ istro.al1 +' onclick="this.remove(); I.scriviInput(\''+istro.nome+'\''+istro.al2+');">'+ istro.nome +'</p>';
				}
			break;
			case 'scegliVai':
				if (istro.all !== undefined) { istro.all = Vista.cssAll(istro.all); } else { istro.all = ''; }
				Vista.scelte += '<p class="scelta coloreScelta" '+ istro.all +' onclick="S.vaiA('+istro.nS+')">'+ istro.nome +'</p>';
			break;
			case 'rispondi':
				if (istro.input !== undefined) {
					classi = ' class="inviato';
					if (Vista.stile.coloreTestoInviato) {
						cssCol = ' style="color:'+Vista.stile.coloreTestoInviato+';"';
					} else {
						classi += ' coloreTestoInviato';
					}
					classi += '"';
					e_txt.innerHTML += '<p'+ all + cssCol + classi +'>? '+ I.inputGrezzo +'</p>';
				}
				e_txt.innerHTML += '<p'+all+'>' + Vista.testoSpeciale(istro.output) + '</p>';
				// Una volta risposto, l'input grezzo non serve più ed è necessario svuotarlo
				I.inputGrezzo = '';
			break;
			case 'vaiA':
				// Passa immediatamente ad una nuova scena che svuoterà le istruzioni "in corso di verifica" su leggiInput().
				switch (istro.scena) {
					case 0: istruzioniScena(G.nScena); break;
					case -1: istruzioniScena(G.nScenaP); break;
					case -2: istruzioniScena(G.nScenaPP); break;
					default: istruzioniScena(istro.scena); break;
				}
			break;
			case 'rispondiVai':
				document.getElementById('input').style.display = 'none';
				if (istro.input !== undefined) {
					classi = ' class="inviato';
					if (Vista.stile.coloreTestoInviato) {
						cssCol = ' style="color:'+Vista.stile.coloreTestoInviato+';"';
					} else {
						classi += ' coloreTestoInviato';
					}
					classi += '"';
					e_txt.innerHTML += '<p'+ all + cssCol + classi +'>? ' + I.inputGrezzo + '</p>';
				}
				e_txt.innerHTML += '<p'+all+'>' + Vista.testoSpeciale(istro.output) + '</p>';
				// Per procedere serve ora premere un tasto
				// Siccome nScenaPP (precedente alla precedente) verrà sovrascritto da nScenaP, si può usare come valore temporaneo per il caricamento di scena che effettuerà la funzione prossimaScena()
				G.nScenaPP = istro.scena
				// Dopo 100 ms qualsiasi tasto che risulta premuto chiama prossimaScena()
				setTimeout(function() {
					document.addEventListener('keydown', Vista.prossimaScena);
					document.addEventListener('click', Vista.prossimaScena);
					}, 100);
				// Dopo 5 sec compare la scritta "Premi un tasto" sotto il testo dell'intermezzo
				Vista.timerPremiTasto = setTimeout(Vista.premiUnTasto, 5000);
			break;
			case 'effetto':
				if (istro.colore !== undefined) {
					cssCol = ' style="color:'+istro.colore+';"';
				}
				Vista.nEffetti++;
				Vista.effetti.push({'IDelem':'ef'+Vista.nEffetti});
				Vista.effetti[Vista.effetti.length - 1].stile = istro.all + cssCol;
				Vista.effetti[Vista.effetti.length - 1].tipo = istro.tipo;
				Vista.effetti[Vista.effetti.length - 1].contatore = 0;
				switch (istro.tipo) {
					case 'testo-caratteri':
						Vista.effetti[Vista.effetti.length - 1].output = istro.output;
					break;
					case 'testo-parole':
						var parole = [];
						parole = istro.output.split(/([^\s]+\s)/).filter(Boolean);
						Vista.effetti[Vista.effetti.length - 1].output = parole;
					break;
				}
				Vista.effetti[Vista.effetti.length - 1].intervallo = istro.intervallo;
				if (Vista.timerEffetto === null) Vista.timerEffetto = setInterval(Vista.avanzaEffetto, istro.intervallo);
			break;
		}
		Vista.fondoPagina();
	}
}

// Giocatore (G)
var G = {

	nScena: 1, // Numero scena corrente
	nScenaP: 1, // Numero scena precedente
	nScenaPP: 1, // Numero scena precedente alla precedente
	passaggiScena: {}, // Dizionario che dato un nScena restituisce un array di nScena verso cui si è transitati
	luoghiRagg: { // Luoghi raggiungibili
		bloccati: 0,
		nomi: [], // Nomi di luoghi verso cui dirigersi con il comando 'direzioni'
		coppie: {} // Sono coppie chiave-valore per avere il nScena di un luogo o il nome di un luogo dato un nScena
	},
	istruzioni: '', // Istruzioni per il giocatore

	nuovaPartita: function() {
		G.passaggiScena = {};
		G.luoghiRagg = {};
		G.luoghiRagg.bloccati = 0;
		G.luoghiRagg.nomi = [];
		G.luoghiRagg.coppie = {};
	},
	pronto: function() {
		var e_inp = document.getElementById('input');
		e_inp.disabled = false;
		e_inp.focus();
		// Posiziona il cursore in fondo
		e_inp.setSelectionRange(e_inp.value.length, e_inp.value.length);
	},

	uscitaEsplorata: function(nS) {
		if (G.passaggiScena[G.nScena] !== undefined && G.passaggiScena[G.nScena].indexOf(nS) !== -1) return true;
		return false;
	}
}

// Storia (S)
var S = {

	oggetti: {}, // Dizionario di contenitori che contengono oggetti (descritti da 2 array: oggetti articoli determinativi e indeterminativi)
	variabili: {}, // Dizionario di variabili che possono assumere un valore

	nuovaPartita: function() {

		// I predicati sono facoltativi, ma le equivalenze ordinate devono esserci sempre
		// Chiamare vocabolario crea sia i predicati ordinati che le equivalenze ordinate
		if (Lingua.equivalenzeOrd.length !== 0) {
			// Se è stato usato Vigenère, allora inizializzalo
			if (typeof(V) !== 'undefined') V.inizializza();
			vocabolario();
		}

		G.nuovaPartita();
		S.oggetti = {}; // Cancella tutti i contenitori con gli oggetti
		S.variabili = {}; // Cancella tutte le variabili
		S.Istruzioni.generali = []; // Svuota le istruzioni generali (non devono duplicarsi ed i contatori nMosse devono azzerarsi)
	},

	vaiA: function(nS) {
		switch (nS) {
			case 0: istruzioniScena(G.nScena); break;
			case -1: istruzioniScena(G.nScenaP); break;
			case -2: istruzioniScena(G.nScenaPP); break;
			default: istruzioniScena(nS); break;
		}
	},

	Istruzioni: {
		generali: [],
		scena: [],

		crea: function() {
			if (G.nScena === 0) { S.Istruzioni.generali.push({}); } else { S.Istruzioni.scena.push({}); }
		},
		valore: function(p, v) { // p: proprietà, v: valore
			if (G.nScena === 0) {
				S.Istruzioni.generali[S.Istruzioni.generali.length - 1][p] = v;
			} else {
				S.Istruzioni.scena[S.Istruzioni.scena.length - 1][p] = v;
			}
		},
		valoreArray: function(a, v) { // a: nome array, v: valore
			var ultima;
			if (G.nScena === 0) {
				ultima = S.Istruzioni.generali.length - 1;
				if (S.Istruzioni.generali[ultima][a] === undefined) S.Istruzioni.generali[ultima][a] = [];
				S.Istruzioni.generali[ultima][a].push(v);
			} else {
				ultima = S.Istruzioni.scena.length - 1;
				if (S.Istruzioni.scena[ultima][a] === undefined) S.Istruzioni.scena[ultima][a] = [];
				S.Istruzioni.scena[ultima][a].push(v);
			}
		},
		leggiValore: function(p) { // p: proprietà
			if (G.nScena === 0) {
				return S.Istruzioni.generali[S.Istruzioni.generali.length - 1][p];
			} else {
				return S.Istruzioni.scena[S.Istruzioni.scena.length - 1][p];
			}
		},
		aggiungiCondizioni: function() {
			var L; // Livello delle istruzioni (generali o di scena)
			if (G.nScena === 0) { L = 'generali'; } else { L = 'scena'; }
			// Aggiungi condizioni correnti
			var iUB = Condizioni.blocchi.length - 1; // iUB: indice ultimo blocco
			if (Condizioni.righeCoinvolte[iUB] > 0) {
				var iUA = S.Istruzioni[L].length - 1; // iUA: indice ultima azione
				S.Istruzioni[L][iUA]['seOggetti'] = Condizioni.somma.seOggetti;
				S.Istruzioni[L][iUA]['seVariabili'] = Condizioni.somma.seVariabili;
				if (Condizioni.righeCoinvolte[iUB] === 1) Condizioni.popBlocco();
			}
		},
		annullaCondizioni: function() {
			// Solo nel caso in cui le condizioni si applicano ad 1 riga e l'istruzione viene annullata, allora l'attuale blocco condizioni va rimosso (altrimenti si applicherebbe alla prossima istruzione non annullata)
			var iUB = Condizioni.blocchi.length - 1; // iUB: indice ultimo blocco
			if (Condizioni.righeCoinvolte[iUB] === 1) Condizioni.popBlocco();
		}
	}
}

// Pila delle Condizioni che si sommano quando si entra in blocchi annidati
var Condizioni = {

	blocchi: [], // Contiene blocchi di condizioni "seOggetti e seVariabili" che si applicano alle istruzioni condizionate
	somma: {}, // Somma dei blocchi di condizioni correnti
	righeCoinvolte: [], // 0: nessuna condizione; 1: solo la singola riga successiva; 2: una serie di righe di istruzioni (blocco)

	creaSomma: function() { // Aggiorna la somma delle condizioni derivanti da tutti i blocchi
		Condizioni.somma = {'seOggetti': [], 'seVariabili': []};
		for (var b = 0; b < Condizioni.blocchi.length; b++) { // b: blocco
			Condizioni.somma.seOggetti = Condizioni.somma.seOggetti.concat(Condizioni.blocchi[b].seOggetti);
			Condizioni.somma.seVariabili = Condizioni.somma.seVariabili.concat(Condizioni.blocchi[b].seVariabili);
		}
	},

	popBlocco: function() { // Rimuove l'ultimo blocco quando si esce da un annidamento
		Condizioni.righeCoinvolte.pop(); // Sono state gestite le righe di istruzioni per questo blocco e va rimosso il tracciamento
		Condizioni.blocchi.pop(); // Le istruzioni per il blocco sono state eseguite, quindi si svuotano le ultime condizioni
		Condizioni.creaSomma(); // Se un blocco di condizioni viene rimosso, va aggiornata la somma delle condizioni restanti
	}
}

// ============================== //
// Istruzioni per creare le scene //
// ============================== //

// Istruzioni eseguite ad inizio scena
// (non condizionabili e non estendibili) //

function nomeStoria(str) {
	// str: titolo della storia che comparirà sulla scheda della pagina Web

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') str = V.decifra(str);
	document.title = str;
}
function nomeLuogo(nome) {
	// nome: del luogo da visualizzare dopo i punti cardinali
	// Arbitrariamente un gruppo di scene può far parte di uno stesso luogo, però affinché il comando 'direzioni' possa essere usato per raggiungere rapidamente un luogo, occorre ricorrere ad un nome di luogo univoco. Di un insieme di scene, che possono far parte di uno stesso luogo, una deve essere scelta come preferita o idonea per "teletrasportarsi" (raggiungere subito) quel luogo e dunque solo quella riceverà un "nome luogo".
	if (G.nScena === 0) { alert('L\'istruzione "nomeLuogo()" nelle istruzioni generali non ha senso. Eliminarla.'); return; }

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') nome = V.decifra(nome);
	nome = nome.split('|');
	// Se la scena corrente non è stata già mappata, allora esegui questa istruzione
	if (!G.luoghiRagg.coppie[G.nScena] || !G.luoghiRagg.coppie[nome[0]]) {
		G.luoghiRagg.nomi.push(nome[0]);
		G.luoghiRagg.coppie[G.nScena] = nome[0];
		G.luoghiRagg.coppie[nome[0]] = G.nScena;
		// Aggiunge un'istruzione generale per raggiungere rapidamente il luogo
		var nS = G.nScena; var txt_in = '';
		G.nScena = 0;
		S.Istruzioni.crea();
		S.Istruzioni.valore('azione', 'vaiA');
		S.Istruzioni.valore('scena', nS);
		txt_in = 'direzione ' + nome.join('|direzione ');
		txt_in = Lingua.normalizzaInput(txt_in, 2);
		S.Istruzioni.valore('input', txt_in);
		G.nScena = nS;
	}
}
function istruzioni(txt) {
	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') txt = V.decifra(txt);
	G.istruzioni = txt;
}

// Istruzione speciale per porre condizioni su oggetti e variabili //
// (condizionabile, dunque nidificabile; non estendibile)

function condizioni(cond, istro) {
	// cond: stringa per specificare quali oggetti devono essere in certi contenitori e quali variabili si richiedono
	// formato stringa condizioni: [no!]l'oggetto@contenitore+[no!]nome variabile
	// istro(): è la funzione per eseguire tutte le istruzioni condizionate
	// Devo tener traccia di ciascun blocco di condizioni, alla fine del blocco vanno svuotate, senza svuotare blocchi ancora non terminati

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') cond = V.decifra(cond);

	var UB = Condizioni.blocchi.length; // Ultimo blocco
	Condizioni.blocchi.push({'seOggetti': [], 'seVariabili': []});

	var presenza;
	cond = cond.split('  '); // Elenco delle condizioni su oggetti e variabili
	for (var i = 0; i < cond.length; i++) {
		// Stabilire se si tratta di un oggetto o una variabile
		if (cond[i].indexOf('@') !== -1) { // Se contiene una chiocciola è un oggetto
			if (cond[i].substr(0, 3) === 'no!') {
				presenza = 0;
				cond[i] = cond[i].substr(3);
			} else {
				presenza = 1;
			}
			cond[i] = cond[i].split('@'); // Scomposizione oggetto@contenitore
			Condizioni.blocchi[UB].seOggetti.push({'presenza': presenza, 'nome': cond[i][0], 'contenitore': cond[i][1]});
		// Se non contiene una chiocciola è una variabile
		} else {
			if (cond[i].substr(0, 3) === 'no!') {
				presenza = 0;
				cond[i] = cond[i].substr(3);
			} else {
				presenza = 1;
			}
			Condizioni.blocchi[UB].seVariabili.push({'presenza': presenza, 'nome': cond[i]});
		}
	}
	// Ogni volta che vengono aggiunte condizioni a blocchi, aggiornare la somma delle condizioni
	Condizioni.creaSomma();
	// Se è stato definito un blocco di istruzioni condizionate, vanno eseguite, altrimenti è coinvolta solo la singola riga successiva
	if (istro !== undefined) {
		Condizioni.righeCoinvolte.push(2);
		istro();
		Condizioni.popBlocco();
	} else {
		// L'esecuzione dell'istruzione successiva dovrà svuotare le condizioni ed eliminare il tracciamento delle righe coinvolte
		Condizioni.righeCoinvolte.push(1);
	}
}

// Istruzioni eseguite ad inizio scena //
// (condizionabili ed estendibili)

function carattereTesto(fnt, siz, all) {
	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') {
		fnt = V.decifra(fnt);
		if (all !== undefined) all = V.decifra(all);
	}
	S.Istruzioni.crea(); S.Istruzioni.valore('soloInizioScena', 1);
	S.Istruzioni.valore('azione', 'carattereTesto');
	if (fnt) S.Istruzioni.valore('font', fnt);
	if (siz) S.Istruzioni.valore('size', siz);
	if (all) S.Istruzioni.valore('align', all);
	S.Istruzioni.aggiungiCondizioni();
}
function coloreSfondo(col) {
	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') col = V.decifra(col);

	S.Istruzioni.crea(); S.Istruzioni.valore('soloInizioScena', 1);
	S.Istruzioni.valore('azione', 'coloreSfondo');
	S.Istruzioni.valore('colore', col);
	S.Istruzioni.aggiungiCondizioni();
}
function coloreTesto(col1, col2) {
	// col1: colore testo
	// col2: colore testo inviato

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') {
		col1 = V.decifra(col1);
		if (col2 !== undefined) col2 = V.decifra(col2);
	}
	S.Istruzioni.crea(); S.Istruzioni.valore('soloInizioScena', 1);
	S.Istruzioni.valore('azione', 'coloreTesto');
	if (col1) S.Istruzioni.valore('colore1', col1);
	if (col2) S.Istruzioni.valore('colore2', col2);
	S.Istruzioni.aggiungiCondizioni();
}
function coloreScelte(col1, col2) {
	// col1: colore scelta
	// col2: colore scelta selezionata

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') {
		col1 = V.decifra(col1);
		if (col2 !== undefined) col2 = V.decifra(col2);
	}
	S.Istruzioni.crea(); S.Istruzioni.valore('soloInizioScena', 1);
	S.Istruzioni.valore('azione', 'coloreScelte');
	if (col1) S.Istruzioni.valore('colore1', col1);
	if (col2) S.Istruzioni.valore('colore2', col2);
	S.Istruzioni.aggiungiCondizioni();
}
function coloreRifiuto(col) {
	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') col = V.decifra(col);
	S.Istruzioni.crea(); S.Istruzioni.valore('soloInizioScena', 1);
	S.Istruzioni.valore('azione', 'coloreRifiuto');
	S.Istruzioni.valore('colore', col);
	S.Istruzioni.aggiungiCondizioni();
}
function messaggiRifiuto(msg) {
	// msg: messaggi di rifiuto separati da una barra |

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') msg = V.decifra(msg);
	S.Istruzioni.crea(); S.Istruzioni.valore('soloInizioScena', 1);
	S.Istruzioni.valore('azione', 'impostaMsgRifiuto');
	S.Istruzioni.valore('messaggi', msg);
	S.Istruzioni.aggiungiCondizioni();
}
function intermezzo(txt) {
	// txt: testo da visualizzare, anche html

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') txt = V.decifra(txt);
	S.Istruzioni.crea(); S.Istruzioni.valore('soloInizioScena', 1);
	S.Istruzioni.valore('azione', 'intermezzo');
	S.Istruzioni.valore('testo', txt);
	S.Istruzioni.aggiungiCondizioni();
}
function testo(txt, all) {
	// txt: testo da visualizzare, anche html
	// all: allineamento del testo (valori: "giustificato", "centrato", "destra", "sinistra")
	// all: può avere valore 'no!p' che annulla l'allineamento ed anche l'elemento <p></p>

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') {
		txt = V.decifra(txt);
		if (all !== undefined) all = V.decifra(all);
	}
	S.Istruzioni.crea(); S.Istruzioni.valore('soloInizioScena', 1);
	S.Istruzioni.valore('azione', 'testo');
	S.Istruzioni.valore('testo', txt);
	S.Istruzioni.valore('align', all);
	S.Istruzioni.aggiungiCondizioni();
}
function immagine(img, w, h) {
	// img: nome dell'immagine da posizionare nella stessa cartella di 'INIZIA.html'
	// w, h: larghezza e altezza da impostare forzatamente
	if (img === undefined || img === '') { S.Istruzioni.annullaCondizioni(); return; }
	S.Istruzioni.crea(); S.Istruzioni.valore('soloInizioScena', 1);
	S.Istruzioni.valore('azione', 'immagine');
	S.Istruzioni.valore('immagine', img);
	S.Istruzioni.valore('w', w);
	S.Istruzioni.valore('h', h);
	S.Istruzioni.aggiungiCondizioni();
}
function uscita(txt_in, nS, vis, nomeDest) {
	// txt_in: input dell'utente
	// nS: numero della scena verso cui andare (0 è la scena attuale, -1 la scena precedente, -2 quella precedente la precedente)
	// vis: opzioni di visibilità ed esplorabilità dell'uscita ('invisibile', 'visibile', 'esplorabile', 'esplorato'/'esplorata')
	//  invisibile: uscita sempre invisibile
	//  visibile: visibile (inoltre, se viene esplorata ed è specificato un nome destinazione, il nome comparirà)
	//  esplorabile: invisibile, ma se viene esplorata allora diventa visibile (comportamento nome come sopra)
	//  esplorato/a: visibile e già con il nome della destinazione se specificato, altrimenti comparirà '(esplorato)'
	// nomeDest: il nome della destinazione, serve se diamo un nome ai luoghi

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') {
		txt_in = V.decifra(txt_in);
		if (vis !== undefined) vis = V.decifra(vis);
		if (nomeDest !== undefined) nomeDest = V.decifra(nomeDest);
	}

	// Definisce l'azione da eseguire se soddisfatta l'istruzione
	S.Istruzioni.crea();
	S.Istruzioni.valore('azione', 'vaiA');
	S.Istruzioni.valore('scena', nS);

	// Visibile è l'opzione predefinita
	if (vis === undefined) vis = 'visibile';

	// Gestisce l'opzione di visibilità dell'uscita
	if (vis !== 'invisibile') {
		// La prima parola o termine inserito dallo scrittore (prima di '|', simbolo che permette di offrire nomi alternativi) è il nome dell'uscita (quasi sempre un punto cardinale: nord, sud, ...) che è diverso dal nome della destinazione o del luogo in cui ci si trova
		var nomeUscita = txt_in.split('|')[0];

		// nomeDest viene usato se l'uscita è stata esplorata, altrimenti non deve comparire
		if (['esplorato','esplorata'].indexOf(vis) !== -1 || G.uscitaEsplorata(nS)) {
			if (nomeDest) {
				txt_in += '|'+nomeDest+'|'+nomeUscita+' '+nomeDest;
				nomeDest = '&nbsp;('+nomeDest+')';
			} else if (G.luoghiRagg.coppie[nS] !== undefined) {
				nomeDest = '&nbsp;('+G.luoghiRagg.coppie[nS]+')';
				txt_in += '|'+G.luoghiRagg.coppie[nS];
				txt_in += '|'+nomeUscita+' '+G.luoghiRagg.coppie[nS];
			} else {
				nomeDest = '&nbsp;(esplorato)';
			}
		} else {
			nomeDest = '';
		}
		if (['visibile','esplorato','esplorata'].indexOf(vis) !== -1 || (vis === 'esplorabile' && nomeDest !== '')) {
			Vista.uscite += ', <a class="scelta coloreScelta" onclick="I.scriviInput(\''+nomeUscita+'\')">'+ nomeUscita +'</a>'+ nomeDest;
		}
	}

	// Trasforma le frasi articolate scritte dallo scrittore in frasi semantiche
	txt_in = Lingua.normalizzaInput(txt_in, 2);
	S.Istruzioni.valore('input', txt_in);
	S.Istruzioni.aggiungiCondizioni();
}
function contenitore(cont, ogg) {
	// cont: nome del contenitore che fa da chiave nell'array dei contenitori di oggetti: S.oggetti
	// ogg: oggetti contenuti separati dal doppio spazio '  ', scrivere sempre l'articolo determinativo, faranno da etichette e da ID
	//   è possibile indicare l'articolo indeterminativo prima dell'etichetta oggetto servendosi di una barra '|'
	//   Es. "un|l'amuleto  dello|lo zucchero  il Martello di Tor  un'|l'albicocca" - Notare che può non venir usata la barra, in tal caso viene sempre presentata l'etichetta con articolo determinativo (o comunque l'etichetta così come la scriviamo), utile per oggetti unici (es. "il Martello di Tor"). L'articolo viene considerato comprensivo di apostrofo quindi con l' (l apostrofo) viene tolto anche l'apostrofo. Se l'oggetto è maschile o femminile, è lo scrittore che deve specificare o meno l'apostrofo nell'articolo indeterminativo, si veda il confronto degli esempi "amuleto" e "albicocca". L'eventuale spazio dopo l'articolo è automaticamente gestito (quindi non va mai messo).

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') {
		cont = V.decifra(cont);
		ogg = V.decifra(ogg);
	}
	// Il contenitore va creato solo la prima volta che si incontra tale istruzione
	if (S.oggetti[cont] !== undefined) { S.Istruzioni.annullaCondizioni(); return; }
	S.Istruzioni.crea(); S.Istruzioni.valore('soloInizioScena', 1);
	S.Istruzioni.valore('autoElimina', 1);
	S.Istruzioni.valore('azione', 'creaContenitore');
	S.Istruzioni.valore('nome', cont);
	S.Istruzioni.valore('ogg', ogg);
	S.Istruzioni.aggiungiCondizioni();
}
function scegliRispondi(txt, txt_out, al1, al2) {
	// txt: testo della scelta selezionabile (se txt_out = "" allora txt verrà trattato come un input dell'utente)
	// txt_out: testo stampato dopo aver cliccato sulla scelta
	// al1: allineamento scelta selezionabile (valori: "giustificato", "centrato", "destra", "sinistra")
	// al2: allineamento risposta stampata

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') {
		txt = V.decifra(txt);
		if (txt_out !== '') txt_out = V.decifra(txt_out);
		if (al1 !== undefined) al1 = V.decifra(al1);
		if (al2 !== undefined) al2 = V.decifra(al2);
	}
	S.Istruzioni.crea(); S.Istruzioni.valore('soloInizioScena', 1);
	S.Istruzioni.valore('azione', 'scegliRispondi');
	S.Istruzioni.valore('nome', txt);
	S.Istruzioni.valore('output', txt_out);
	S.Istruzioni.valore('al1', al1);
	S.Istruzioni.valore('al2', al2);
	S.Istruzioni.aggiungiCondizioni();
}
function scegliVai(txt, nS, all) {
	// txt: testo della scelta selezionabile
	// nS: numero della scena verso cui andare
	// all: allineamento del testo della scelta selezionabile (valori: "giustificato", "centrato", "destra", "sinistra")

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') {
		txt = V.decifra(txt);
		if (all !== undefined) all = V.decifra(all);
	}
	S.Istruzioni.crea(); S.Istruzioni.valore('soloInizioScena', 1);
	S.Istruzioni.valore('azione', 'scegliVai');
	S.Istruzioni.valore('nome', txt);
	S.Istruzioni.valore('nS', nS);
	S.Istruzioni.valore('all', all);
	S.Istruzioni.aggiungiCondizioni();
}

// Istruzioni che permangono nel corso della scena
// (condizionabili ed estendibili)

function bloccaDirezioni() {
	// Indica che per questa scena le direzioni veloci sono bloccate
	S.Istruzioni.crea();
	S.Istruzioni.valore('azione', 'bloccaDirezioni');
	S.Istruzioni.aggiungiCondizioni();
}
function cancellaDirezione(nome) {
	// nome: del luogo raggiungibile da cancellare

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') nome = V.decifra(nome);
	S.Istruzioni.crea();
	S.Istruzioni.valore('azione', 'cancellaDirezione');
	S.Istruzioni.valore('nome', nome);
	S.Istruzioni.aggiungiCondizioni();
}
function rispondi(txt_in, txt_out) {
	// txt_in: input dell'utente
	// txt_out: risposta da ricevere

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') {
		// Se txt_in proviene dal comando rapido 'esamina', allora la parte iniziale non viene cifrata
		// Se la cifratura è attiva, va rimossa la stringa aggiunta, decriptato, e poi rimessa
		if (txt_in.startsWith('x ')) {
			var x = 1;
			txt_in = txt_in.substr(2, txt_in.length - 2);
		}
		txt_in = V.decifra(txt_in);
		txt_out = V.decifra(txt_out);
		if (x === 1) {
			txt_in = 'x ' + txt_in;
		}
	}
	// Trasforma le frasi articolate scritte dallo scrittore in frasi semantiche
	txt_in = Lingua.normalizzaInput(txt_in, 2);

	S.Istruzioni.crea();
	S.Istruzioni.valore('azione', 'rispondi');
	S.Istruzioni.valore('input', txt_in);
	S.Istruzioni.valore('output', txt_out);
	S.Istruzioni.aggiungiCondizioni();
	Vista.stile.inputBox = 1;
}
function esamina(txt_in, txt_out) {
	// txt_in: input dell'utente con l'aggiunta iniziale di "esamino "
	// txt_out: risposta da ricevere
	rispondi('x '+txt_in, txt_out);
}
function rispondiVai(txt_in, txt_out, nS) {
	// txt_in: input dell'utente
	// txt_out: risposta momentanea da lasciare
	// nS: numero della scena verso cui andare
	// rit: ritardo in millisecondi prima di andare ad una scena

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') {
		txt_in = V.decifra(txt_in);
		txt_out = V.decifra(txt_out);
	}
	// Trasforma le frasi articolate scritte dallo scrittore in frasi semantiche
	txt_in = Lingua.normalizzaInput(txt_in, 2);

	S.Istruzioni.crea();
	S.Istruzioni.valore('azione', 'rispondiVai');
	S.Istruzioni.valore('input', txt_in);
	S.Istruzioni.valore('output', txt_out);
	S.Istruzioni.valore('scena', nS);
	S.Istruzioni.aggiungiCondizioni();
	Vista.stile.inputBox = 1;
}
function nMosseRispondi(mosse, txt_out) {
	// mosse: numero mosse del giocatore per far scattare l'evento
	// txt_out: testo che deve comparire dopo n mosse

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') txt_out = V.decifra(txt_out);
	S.Istruzioni.crea();
	S.Istruzioni.valore('mosse', mosse - 1); // Conta anche lo zero
	S.Istruzioni.valore('mossa', 0);
	S.Istruzioni.valore('azione', 'rispondi');
	S.Istruzioni.valore('output', txt_out);
	S.Istruzioni.aggiungiCondizioni();
	Vista.stile.inputBox = 1;
}
function nMosseVai(mosse, nS, txt_out) {
	// mosse: numero mosse del giocatore per far scattare l'evento
	// nS: numero della scena verso cui andare
	// txt_out: testo facoltativo da mostrare prima di cambiare scena

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined' && txt_out !== undefined) txt_out = V.decifra(txt_out);
	S.Istruzioni.crea();
	S.Istruzioni.valore('mosse', mosse - 1); // Conta anche lo zero
	S.Istruzioni.valore('mossa', 0);
	if (txt_out === undefined) {
		S.Istruzioni.valore('azione', 'vaiA');
	} else {
		S.Istruzioni.valore('azione', 'rispondiVai');
		S.Istruzioni.valore('output', txt_out);
	}
	S.Istruzioni.valore('scena', nS);
	S.Istruzioni.aggiungiCondizioni();
	Vista.stile.inputBox = 1;
}
function effetto(tipo, op0, op1, op2, op3, op4, op5) {
	// Effetto è una funzione molto versatile, il primo argomento "tipo" determina come verranno interpretati gli altri argomenti. Se alcuni argomenti restano non compilati verranno semplicemente ignorati.

	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') {
		tipo = V.decifra(tipo);
		if (op0 !== undefined && typeof(op0) === 'string') op0 = V.decifra(op0);
		if (op1 !== undefined && typeof(op1) === 'string') op1 = V.decifra(op1);
		if (op2 !== undefined && typeof(op2) === 'string') op2 = V.decifra(op2);
		if (op3 !== undefined && typeof(op3) === 'string') op3 = V.decifra(op3);
		if (op4 !== undefined && typeof(op4) === 'string') op4 = V.decifra(op4);
		if (op5 !== undefined && typeof(op5) === 'string') op5 = V.decifra(op5);
	}
	var opz = [op0, op1, op2, op3, op4, op5];
	S.Istruzioni.crea();
	S.Istruzioni.valore('azione', 'effetto');
	S.Istruzioni.valore('tipo', tipo);
	switch (tipo) {
		case 'testo-caratteri':
		case 'testo-parole':
		// op0: testo semplice da visualizzare (no html)
		// op1: (facoltativo) allineamento testo (valori: "giustificato", "centrato", "destra", "sinistra")
		// op3: (facoltativo) colore testo
		// op4: intervallo di attesa per prossimo carattere o parola
		var i = 0; // indice opzioni
		S.Istruzioni.valore('output', opz[0]); i++;
		if (/^(giustificato|centrato|destra|sinistra|justify|center|right|left)$/.test(opz[i])) {
			S.Istruzioni.valore('all', opz[i]); i++; // allineamento se specificato
		}
		if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(opz[i])) {
			S.Istruzioni.valore('colore', opz[i]); i++; // colore se specificato
		}
		S.Istruzioni.valore('intervallo', Number(opz[i]));
		break;
	}
	S.Istruzioni.aggiungiCondizioni();
}
function nMosseEffetto(mosse, tipo, op0, op1, op2, op3, op4, op5) {
	// Effetto è una funzione molto versatile, il primo argomento "tipo" determina come verranno interpretati gli altri argomenti. Se alcuni argomenti restano non compilati verranno semplicemente ignorat
	// Questa funzione aggiunge la condizione del n. di mosse da aspettare alla funzione "effetto"
	effetto(tipo, op0, op1, op2, op3, op4, op5);
	S.Istruzioni.valore('mosse', mosse - 1); // Conta anche lo zero
	S.Istruzioni.valore('mossa', 0);
}

// Funzioni per estendere le istruzioni precedenti
// (condizionabili sono indirettamente; estensioni multiple ammesse) //

function __oggetti(oo) {
	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') oo = V.decifra(oo);
	S.Istruzioni.valore('oggetti', Lingua.normalizzaDiacritici(oo.toLowerCase()));
}
function __variabili(vv) {
	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') vv = V.decifra(vv);
	S.Istruzioni.valore('variabili', Lingua.normalizzaDiacritici(vv.toLowerCase()));
}
function __audio(aud) {
	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') aud = V.decifra(aud);
	S.Istruzioni.valore('audio', aud);
}
function __immagine(img, w, h, opz) {
	S.Istruzioni.valore('immagine', img);
	if (w !== undefined) S.Istruzioni.valore('w', w);
	if (h !== undefined) S.Istruzioni.valore('h', h);
	// Se c'è una sostituzione è doveroso specificare w ed h per evitare salti fastidiosi del testo
	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined' && opz !== undefined) opz = V.decifra(opz);
	if (opz === 'sostituisci') S.Istruzioni.valore('sostituisci', 1);
}
function __inizioScena(v) {
	// v: valore vero (predefinito) o falso
	if (v === 0 || v === false) {
		S.Istruzioni.valore('soloInizioScena', 0);
	} else {
		S.Istruzioni.valore('soloInizioScena', 1);
	}
}
function __autoElimina(v) {
	// v: valore vero (predefinito) o falso
	if (v === 0 || v === false) {
		S.Istruzioni.valore('autoElimina', 0);
	} else {
		S.Istruzioni.valore('autoElimina', 1);
	}
}
function x(str) {
	// Decifra con Vigenère se abilitato
	if (typeof(V) !== 'undefined') str = V.decifra(str);
	var ee = str.split('|');
	var n = Math.floor((Math.random() * ee.length));
	if (isNaN(ee[n])) { return ee[n]; } else { return Number(ee[n]); }
}
