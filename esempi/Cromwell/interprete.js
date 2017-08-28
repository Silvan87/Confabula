var Lingua = {

	predicatiOrdinati: [], // (il nome della funzione è tutto per esteso perché compare su 'scene.js' dove lo scrittore lavora)
	equivalenzeOrd: {}, // equivalenze ordinate
	mappaDiacritici: [ // Mappa diacritici per le vocali italiane minuscole
		{'base':'à', 'letters':/[\u00e0\u00e1]/g},
		{'base':'è', 'letters':/[\u00e8\u00e9]/g},
		{'base':'i', 'letters':/[\u00eC\u00ed\u00ee]/g},
		{'base':'ò', 'letters':/[\u00f2\u00f3]/g},
		{'base':'u','letters':/[\u00f9\u00fa]/g}
		// La i e la u non presentano in italiano parole abbastanza importanti che cambiano di significato in relazione all'accento. Quindi è preferibile avere l'equivalenza di giu e giù, mentre si deve distinguere papa e papà, o e ed è, anche toto e totò.
	],

	predicati: function(str) {
		// Mette i predicati in un array ed in ordine alfabetico, pronti all'uso
		Lingua.predicatiOrdinati = str.split('|').sort();
	},

	equivalenze: function(espressioniEq) { // argomento: espressioni equivalenti
		// Per velocizzare l'elaborazione nel ridurre un input alla forma normalizzata, occorre usare la struttura del dizionario (basata sulla veloce hashtable). Il risultato è che a ciascuna parola dovrà essere associata la parola normalizzata. Dato un insieme di parole tra loro equivalenti (sinonime), nell'ordine posto dallo scrittore, si prende la prima che sarà quella normalizzata. La parola può far parte di più insiemi di parole sinonime ed un insieme di sinonimi mira ad un significato abbastanza preciso. Non si devono unificare questi insiemi, quindi avremo più parole normalizzate associate ad una parola da normalizzare.

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
				if (Lingua.equivalenzeOrd[po][g][0] == '') {
					paroleSemantiche.push('__'+Lingua.equivalenzeOrd[po][g][1]);
				} else {
					paroleSemantiche.push(Lingua.equivalenzeOrd[po][g][0]);
				}
			}
			Lingua.equivalenzeOrd[po] = paroleSemantiche;

			// Può capitare che la parola "sintattica" sia uguale a quella "semantica", in tal caso va rimossa per ottimizzare lo spazio
			if (Lingua.equivalenzeOrd[po].length === 1 && po == Lingua.equivalenzeOrd[po][0]) delete Lingua.equivalenzeOrd[po];
		}
	},

	normalizzaImperativo: function(str) {
		// Considerando che la prima parola dell'input del giocatore può essere un predicato, si deve chiamare questa funzione per eventualmente normalizzarla da imperativo a indicativo 1a persona.

		// Se il predicato non termina con -a o -i, allora non è un imperativo da trasformare
		// Rifiuta anche le parole costituite da una sola lettera
		if (str.length === 1 || (str.substr(-1, 1) !== 'a' && str.substr(-1, 1) !== 'i')) return str;

		// Elenco di tutti gli imperativi che si trasformano in indicativo 1a persona in modo irregolare
		var imperativiIrregolari = {'abbi':'ho','accogli':'accolgo','addivieni':'addivengo','adempi':'adempio','anteponi':'antepongo','appari':'appaio','appartieni':'appartengo','apponi':'appongo','assali':'assalgo','astieni':'astengo','astrai':'astraggo','attieni':'attengo','attrai':'attraggo','avvali':'avvalgo','avvieni':'avvengo','circonvieni':'circonvengo','cogli':'colgo','compari':'compaio','compi':'compio','compiaci':'compiaccio','componi':'compongo','conduoli':'condolgo','confa':'confaccio','confai':'confaccio','contieni':'contengo','contraffai':'contraffaccio','contrai':'contraggo','contrapponi':'contrappongo','contravvieni':'contravvengo','convieni':'convengo','cuci':'cucio','cuoci':'cuocio','da':'do','dai':'do','decomponi':'decompongo','deponi':'depongo','detieni':'detengo','detrai':'detraggo','di':'dico','disassuefai':'disassuefaccio','disciogli':'disciolgo','discomponi':'discompongo','disconvieni':'disconvengo','disfa':'disfaccio','disfà':'disfaccio','dispari':'dispaio','dispiaci':'dispiaccio','disponi':'dispongo','distogli':'distolgo','distrai':'distraggo','disvogli':'disvoglio','divieni':'divengo','duoli':'dolgo','empi':'empio','equivali':'equivalgo','esponi':'espongo','estrai':'estraggo','fa':'faccio','fai':'faccio','frapponi':'frappongo','giaci':'giaccio','giustapponi':'giustappongo','imponi':'impongo','incogli':'incolgo','indi':'indico','indisponi':'indispongo','interdi':'interdico','interponi':'interpongo','intervieni':'intervengo','intrattieni':'intrattengo','invali':'invalgo','liquefa':'liquefaccio','liquefai':'liquefaccio','malfa':'malfaccio','malfai':'malfaccio','mantieni':'mantengo','molci':'molcio','muori':'muoio','nuoci':'nuoccio','opponi':'oppongo','ottieni':'ottengo','pari':'paio','permani':'permango','pervieni':'pervengo','piaci':'piaccio','poni':'pongo','posponi':'pospongo','predi':'predico','predisponi':'predispongo','premuori':'premuoio','preponi':'prepongo','prescegli':'prescelgo','presupponi':'presuppongo','prevali':'prevalgo','previeni':'prevengo','proponi':'propongo','prosciogli':'prosciolgo','protrai':'protraggo','provieni':'provengo','puoi':'posso','putrefai':'putrefaccio','raccogli':'raccolgo','rarefai':'rarefaccio','rattieni':'rattengo','reci':'recio','redi':'redico','retrai':'retraggo','riabbi':'riò','riabbia':'riò','riai':'riò','riappari':'riappaio','riassali':'riassalgo','ricogli':'ricolgo','ricompari':'ricompaio','ricomponi':'ricompongo','riconvieni':'riconvengo','ricuci':'ricucio','ricuoci':'ricuocio','rida':'ridò','ridà':'ridò','ridai':'ridò','ridi':'ridico','ridisponi':'ridispongo','riempi':'riempio','rifa':'rifaccio','rifai':'rifaccio','rimani':'rimango','rinvieni':'rinvengo','riponi':'ripongo','riproponi':'ripropongo','risali':'risalgo','risappi':'riso','riscegli':'riscelgo','risciogli':'risciolgo','risii':'risono','risostieni':'risostengo','risovvieni':'risovvengo','rista':'ristò','ristà':'ristò','ristai':'ristò','ritieni':'ritengo','ritogli':'ritolgo','ritrai':'ritraggo','riva':'rivado','rivai':'rivado','rivali':'rivalgo','rivuoi':'rivoglio','sali':'salgo','sappi':'so','scegli':'scelgo','sciogli':'sciolgo','scompari':'scompaio','scompiaci':'scompiaccio','scomponi':'scompongo','sconvieni':'sconvengo','scuci':'scucio','scuoci':'scuocio','sfa':'sfaccio','sfai':'sfaccio','sii':'sono','soggiaci':'soggiaccio','sopraffa':'sopraffaccio','sopraffai':'sopraffaccio','sopravvieni':'sopravvengo','sostieni':'sostengo','sottaci':'sottaccio','sottoesponi':'sottoespongo','sottoponi':'sottopongo','sottosta':'sottostò','sottostà':'sottostò','sottostai':'sottostò','sottrai':'sottraggo','sovraesponi':'sovraespongo','sovrapponi':'sovrappongo','sovresponi':'sovrespongo','sovvieni':'sovvengo','spegni':'spengo','spiaci':'spiaccio','sta':'sto','stai':'sto','stracuoci':'stracuocio','strafa':'strafaccio','strafai':'strafaccio','stupefa':'stupefaccio','stupefai':'stupefaccio','suoli':'soglio','supponi':'suppongo','svieni':'svengo','taci':'taccio','tieni':'tengo','togli':'tolgo','torrefa':'torrefaccio','torrefai':'torrefaccio','trai':'traggo','trascegli':'trascelgo','traspari':'traspaio','trasponi':'traspongo','trattieni':'trattengo','tumefa':'tumefaccio','tumefai':'tumefaccio','va':'vado','vai':'vado','vali':'valgo','vieni':'vengo','vogli':'voglio','vuoi':'voglio'};

		if (imperativiIrregolari[str] !== undefined) {
			return imperativiIrregolari[str];
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
	attesaImmagini: 0, // Indica se si è in attesa delle immagini o meno
	intermezzo: [], // Array di testi, anche html, presentati prima della scena
	testo: '', // Testo, anche html, che descrive la scena
	uscite: '', // Elenco di uscite (link), separate da una virgola e spazio
	scelte: '', // Elenco di scelte (link), separate con un ritorno a capo o altri metodi
	stile: {}, // Array che contiene proprietà e valori inerenti lo stile grafico
	coloreTestoP: '', // Colore testo precedente
	timerImmagini: 0, // ID dell'evento che controlla se le immagini sono state caricate
	timerPremiTasto: 0, // ID dell'evento temporizzato che fa comparire la scritta "Premi un tasto"
	timerPassaErrore: 0, // ID dell'evento temporizzato che fa scomparire la scritta "Prova altro"

	preparaScena: function(n) {

		// Segna che è in fase di caricamento della scena
		if (Vista.caricamento === 0) Vista.caricamento = 1;

		// L'avvio della scena 1 deve resettare la storia
		if (n == 1) {
			S.nuovaPartita();
			Vista.caricamento = 0;
			G.nScena = 0; // La scena 0 indica che le istruzioni chiamate sono all'interno del blocco istruzioniGenerali
			istruzioniGenerali(); // (funzione nel file 'scene.js')
			G.nScena = 1; G.nScenaP = 1; G.nScenaPP = 1; // Reimposto la scena 1 che è quella appena chiamata
		};

		// Segna i passaggi di scena
		G.nScenaPP = G.nScenaP; G.nScenaP = G.nScena; G.nScena = n;

		// In relazione alla scena di provenienza, segna il tipo di passaggio esplorato
		// Questo tracciamento andrebbe ignorato quando si usa il comando 'direzioni'
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

		// Svuota i contenuti e nasconde gli elementi della scena
		G.luoghiRagg.bloccati = 0;
		Vista.intermezzo = [];
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

		// Svuota le istruzioni della scena precedente
		S.Istruzioni.scena = [];
	},

	mostra: function() {
		var e_txt = document.getElementById('testo');

		// Prima di mostrare la scena si devono mostrare tutti gli intermezzi
		if (Vista.intermezzo.length > 0) {
			// Controlla se c'è un audio associato all'intermezzo
			var nCaratteriAudio; // Numero caratteri nome del file audio
			nCaratteriAudio = Vista.intermezzo[0].search('&&&');
			if (nCaratteriAudio !== -1) {
				Vista.eseguiAudio(Vista.intermezzo[0].substr(0, nCaratteriAudio));
				Vista.intermezzo[0] = Vista.intermezzo[0].substr(nCaratteriAudio + 3);
			}
			// Finché ci sono intermezzi vengono visualizzati al posto del testo
			e_txt.innerHTML = '<p>'+Vista.intermezzo[0]+'</p>';
			e_txt.style.visibility = 'visible';
			// Elimina il primo intermezzo inserito dall'autore, pop() darebbe un effetto inverso non desiderato
			Vista.intermezzo.splice(0, 1);
			// Dopo 100 ms qualsiasi tasto che risulta premuto chiama passaIntermezzo()
			setTimeout(function() {
				document.addEventListener('keydown', Vista.passaIntermezzo);
				document.addEventListener('click', Vista.passaIntermezzo);
				}, 100);
			// Dopo 5 sec compare la scritta "Premi un tasto" sotto il testo dell'intermezzo
			Vista.timerPremiTasto = setTimeout(Vista.premiUnTasto, 5000);
			// Interrompe mostra() che sarà richiamato da passaIntermezzo()
			return;
		} else {
			e_txt.style.visibility = 'hidden';
		}

		// Attende il caricamento delle immagini
		if (Vista.attesaImmagini === 1) {
			// Aggiunge il testo con le immagini. Deve farlo ora, non solo dopo, perché il caricamento immagini va affrontato ora
			e_txt.innerHTML = Vista.testo;
			// Considera che dopo tot. ms le immagini siano pronte
			Vista.timerImmagini = setTimeout(Vista.mostra, 200);
			// Interrompe Vista.mostra() che sarà richiamata appena passato il tempo necessario
			Vista.attesaImmagini = 0;
			return;
		} else {
			clearTimeout(Vista.timerImmagini);
		}

		// Aggiunge le attuali uscite visibili in fondo al testo
		if (Vista.uscite !== '') {
			var ali = ''; if (Vista.stile.testoAllineamento) ali = alignStyle(Vista.stile.testoAllineamento);
			Vista.testo += '<p'+ ali +'>Uscite visibili:' + Vista.uscite.substr(1) + '.</p>';
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
			var ali;
			switch(Vista.stile.testoAllineamento) {
				case 'giustificato': ali = 'justify'; break;
				case 'centrato': ali = 'center'; break;
				case 'destra': ali = 'right'; break;
				case 'sinistra': ali = 'left'; break;
			}
			e_cor.style.textAlign = ali;
			e_inp.style.textAlign = ali;
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

	eseguiAudio: function(aud) {
		var e_aud = document.getElementById('audio');
		e_aud.innerHTML = '<audio src="' + aud + '" autoplay="autoplay"></audio>';
	},

	aliStyle: function(ali) {
		switch(ali) {
			case 'giustificato': ali = ' style="text-align:justify;"'; break;
			case 'centrato': ali = ' style="text-align:center;"'; break;
			case 'destra': ali = ' style="text-align:right;"'; break;
			case 'sinistra': ali = ' style="text-align:left;"'; break;
			default: return '';
		}
		return ali;
	},

	contenuto: function(nome) {
		// nome: del contenitore di cui visualizzare il contenuto
		if (S.oggetti[nome][0].length === 0) {
			return 'niente';
		} else {
			if (I.istroLivello === 'scena') { // Contenitore del giocatore
				return S.oggetti[nome][1].join(', ');
			} else { // Contenitore dell'ambiente
				return S.oggetti[nome][0].join(', ');
			}
		}
	},

	testoSpeciale: function(str) {
		// str: stringa con testo speciale da riconoscere e risolvere
		// Attualmente verifica solo la presenza di contenitori: @nome contenitore@
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
		return out.join('');
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

	premiUnTasto: function() {
		var e_txt = document.getElementById('testo');
		e_txt.innerHTML += '<p>[Premi un tasto per continuare]</p>';
	},

	passaErrore: function(event) {
		document.removeEventListener('keydown', Vista.passaErrore);
		document.removeEventListener('click', Vista.passaErrore);
		clearTimeout(Vista.timerPassaErrore);
		if (Vista.timerPassaErrore === undefined) return;
		Vista.timerPassaErrore = undefined;
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

	prossimaScena: function() {
		document.removeEventListener('keydown', Vista.prossimaScena);
		document.removeEventListener('click', Vista.prossimaScena);
		clearTimeout(Vista.timerPremiTasto);
		istruzioniScena(G.nScenaPP);
	}
}

// Interprete (I)
var I = { 

	inputGrezzo: '',
	inputNorm: [],
	istroLivello: '', // livello istruzioni attualmente processato (di scena, generali)

	leggiInput: function() {

		// Salva l'input grezzo, così come inserito dall'utente, ma senza spazi in testa o in coda
		var e_inp = document.getElementById('input');
		I.inputGrezzo = e_inp.value.trim();
		if (I.inputGrezzo.charAt(0) == '?') I.inputGrezzo = I.inputGrezzo.substr(1).trim();

		// Rifiuta un input vuoto e reimposta la casella di input
		if (I.inputGrezzo === '') { e_inp.value = '? '; G.pronto(); return; }

		// Salva l'input nella cronologia degli input con limite 20 elementi
		// Se l'input precedente è uguale a quello attuale, non lo aggiunge
		if (I.inputGrezzo !== Vista.cronoInput[Vista.cronoInput.length - 1]) Vista.cronoInput.push(I.inputGrezzo);
		if (Vista.cronoInput.length === 21) Vista.cronoInput.splice(0, 1);
		Vista.nCronoInput = Vista.cronoInput.length;

		// Normalizza l'input grezzo del giocatore
		I.inputNorm = Lingua.normalizzaInput(I.inputGrezzo, 1);
		var istro; // istro: istruzione
		var condSoddisfatte; // condizioni soddisfatte
		var azioneEseguita = 0;
		var cambioScena = 0;

		// Deve controllare se l'input soddisfa qualche istruzione corrente ed eseguirla //
		// Leggere (e comprendere) qui significa stabilire quale azione eseguire dopo la lettura

		// Istruzioni speciali integrate in Confabula //

		// Comando 'salva' per salvare la partita in corso
		istro = {};
		if (I.inputNorm.length === 1 && /^(save|salva|salvo)$/.test(I.inputNorm[0][0])) {
			istro.azione = 'rispondi';
			istro.output = 'Specificare il numero della posizione da 0 a 9 in cui salvare. Esempio: \'save 2\'. I salvataggi saranno disponibili solo sul browser in cui sono stati eseguiti. Per eliminare tutti i salvataggi scrivere \'save reset\'.';
			I.eseguiIstruzione(istro);
			azioneEseguita = 1;
		} else if (I.inputNorm.length === 2 && /^(save|salva|salvo)$/.test(I.inputNorm[0][0]) && /^[0-9]{1}$/.test(I.inputNorm[1][0])) {
			istro.azione = 'rispondi';
			// Salva tutte le variabili della partita nell'HTML5 storage
			if (typeof(Storage) !== "undefined") {
				try {
					// Archivia tutte le info sulla partita in corso in un'unica stringa da infilare nell'HTML5 storage
					localStorage.setItem(document.title+' '+I.inputNorm[1][0], [G.nScena, G.nScenaP, G.nScenaPP, JSON.stringify(G.passaggiScena), JSON.stringify(G.luoghiRagg), JSON.stringify(S.oggetti), JSON.stringify(S.variabili), JSON.stringify(S.Istruzioni.generali), JSON.stringify(S.Istruzioni.scena)].join('§§'));
					// In ultima posizione viene salvato lo stato di tutte le istruzioni (generali e di scena), si potrebbe ottimizzare la memoria occupata salvando solo il n. di mosse trascorse e la presenza o meno delle azioni nMosse. Però, non è semplice gestire senza anomalie questa ottimizzazione. Ora che le istruzioni non vengono più eliminate è più semplice.
					istro.output = 'Partita salvata in posizione ' + I.inputNorm[1][0];
				} catch (err) {
					// Chrome o Chromium possono avere i permessi di scrittura nell'HTML5 storage disabilitati
					// Firefox ed Opera sono stati testati e risultano funzionanti (anche Chrome normalmente funziona)
					istro.output = '<span class="coloreErrore">Impossibile salvare la partita.</span> Questo browser nega l\'accesso all\'HTML5 storage da parte dei file locali. Se state usando Chrome o Chromium la soluzione è probabilmente questa: spostarsi in alto a destra e cliccare sul menu generale con l\'icona <strong>፧</strong> ; cliccare su Impostazioni (Settings); scorrere le sezioni fino in fondo e cliccare su Avanzate (Advanced); nella sezione Privacy e sicurezza (Privacy and Security), cliccare su Impostazioni contenuti (Content Settings); poi cliccare sulla prima voce Cookie; "Blocca cookie di terze parti" probabilmente è attivo, ma può rimanere così; aggiungere un\'eccezione per i file locali cliccando su Aggiungi (Add) alla voce Consenti (Allow); inserire nella casella di testo quanto segue: file:///* e cliccare sul pulsante Aggiungi (Add). D\'ora in avanti Chrome o Chromium permetteranno ai file html sul vostro PC di salvare qualche dato nell\'HTML5 storage. Ricaricate questa pagina html ed i salvataggi dovrebbero funzionare.';
				}
			} else {
				// HTML5 storage non supportato dal browser
				istro.output = '<span class="coloreErrore">Impossibile salvare la partita.</span> Questo browser non supporta l\'HTML5 storage. Per salvare e caricare le partite si deve utilizzare un browser moderno che supporti questa funzionalità.';
			}
			I.eseguiIstruzione(istro);
			azioneEseguita = 1;
		} else if (I.inputNorm.length === 2 && /^(save|salva|salvo)$/.test(I.inputNorm[0][0]) && /^reset$/.test(I.inputNorm[1][0])) {
			for (var s = 0; s < 10; s++) {
				localStorage.removeItem(document.title+' '+s);
			}
			istro.azione = 'rispondi';
			istro.output = 'Tutti i salvataggi per '+ document.title +' sono stati eliminati.';
			I.eseguiIstruzione(istro);
			azioneEseguita = 1;
		}

		// Comando 'carica' per caricare una partita salvata
		if (azioneEseguita === 0) {
			istro = {};
			if (I.inputNorm.length === 1 && /^(load|carica|carico)$/.test(I.inputNorm[0][0])) {
				istro.azione = 'rispondi';
				istro.output = 'Specificare il numero della posizione da 0 a 9 da cui caricare. Esempio: \'load 2\'. Per eliminare tutti i salvataggi scrivere \'save reset\'.';
				I.eseguiIstruzione(istro);
				azioneEseguita = 1;
			} else if (I.inputNorm.length === 2 && /^(load|carica|carico)$/.test(I.inputNorm[0][0]) && /^[0-9]{1}$/.test(I.inputNorm[1][0])) {
				var dati = localStorage.getItem(document.title+' '+I.inputNorm[1][0]);
				if (dati === null || dati === undefined) {
					istro.azione = 'rispondi';
					istro.output = 'Nella posizione '+I.inputNorm[1][0]+' non risulta alcun salvataggio.';
					I.eseguiIstruzione(istro);
					azioneEseguita = 1;
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
					return; // Inutile proseguire con altri controlli
				}
			}
		}

		// Comando 'direzioni', per ricevere l'elenco dei luoghi visitabili
		if (azioneEseguita === 0) {
			istro = {};
			if (I.inputNorm.length === 1 && /^(direzioni|direzione|d)$/.test(I.inputNorm[0][0])) {
				if (Vista.uscite === '' || G.luoghiRagg.bloccati === 1) {
					I.inputGrezzo = 'direzioni';
					istro.azione = 'rispondi';
					istro.output = 'Ora non puoi dirigerti velocemente in nessun luogo.';
				} else if (G.luoghiRagg.nomi.length === 0 || (G.luoghiRagg.nomi.length === 1 && G.luoghiRagg.coppie[G.nScena] !== undefined)) {
					I.inputGrezzo = 'direzioni';
					istro.azione = 'rispondi';
					istro.output = 'Ancora non puoi dirigerti velocemente in nessun luogo.';
				} else {
					I.inputGrezzo = 'direzioni';
					istro.azione = 'rispondi';
					istro.output = 'Luoghi raggiungibili: ' + G.luoghiRagg.nomi.join(', ') + '.';
				}
				I.eseguiIstruzione(istro);
				azioneEseguita = 1;

			// Intercetta la prima parola del comando 'direzione', se i luoghi sono bloccati, lo annulla
			} else if (I.inputNorm.length > 1 && /^(direzione|d)$/.test(I.inputNorm[0][0]) && G.luoghiRagg.bloccati === 1) {
				istro.azione = 'rispondi';
				istro.output = 'Ora non puoi dirigerti velocemente in nessun luogo.';
				I.eseguiIstruzione(istro);
				azioneEseguita = 1;
			}
		}

		// Prima controlla le istruzioni di scena, poi quelle generali
		var livello = ['scena', 'generali'];
		var azioni = []; // Deve raccogliere tutte le istruzioni da eseguire, prima di eseguirle

		livello.forEach(function(L) { // L: Livello delle istruzioni
			for (var ii = 0; ii < S.Istruzioni[L].length; ii++) { // i: indice istruzione

				// Se è stata già eseguita un'azione (quelle integrate), verifica solo le istro "nMosse" per farle avanzare
				if (azioneEseguita === 1 && S.Istruzioni[L][ii].mossa === undefined) continue;

				// Se è in fase di caricamento della scena non deve partire subito il contatore delle istro "nMosse", perché il giocatore deve avere il tempo di fare delle mosse nella nuova scena. Inoltre, andare ad una nuova scena è già contata come mossa.
				if (Vista.caricamento === 1 && S.Istruzioni[L][ii].mossa !== undefined) continue;

				// Copia l'istruzione, così si è liberi di rimuoverla qualora non servisse più
				istro = S.Istruzioni[L][ii];

				// Assume inizialmente che le condizioni siano soddisfatte
				condSoddisfatte = 1;

				// Se c'è un n. di mosse da raggiungere, ma il contatore è stato eliminato (undefined), considera l'istro non soddisfatta
				if (istro.mosse !== undefined && istro.mossa === undefined) condSoddisfatte = 0;

				// Verifica che le condizioni sugli oggetti e le variabili siano soddisfatte
				if (condSoddisfatte && I.controllaOggVar(istro) === false) condSoddisfatte = 0;

				// Se le condizioni non sono soddisfatte passa alla prossima istruzione ed eventualmente azzera nMosse
				if (!condSoddisfatte) {
					// La perdita delle condizioni idonee per un'istruzione nMosse fa azzerare le mosse
					if (istro.mossa !== undefined) S.Istruzioni[L][ii].mossa = 0;
					continue; // Prossima istruzione
				}

				// Verifica che ci sia un numero di mosse da raggiungere e che sia stato raggiunto
				// Le mosse vengono contate solo se e fintantoché le condizioni su ogg e var sono soddisfatte. Se il conteggio delle mosse è iniziato e le condizioni su ogg e var vengono meno prima che scatti un'azione, allora il contatore delle mosse viene resettato.
				if (condSoddisfatte && istro.mossa !== undefined) {
					if (istro.mossa >= istro.mosse) {
						// Valuta se reimpostare un nuovo n. di mosse da raggiungere in base alla ripetitività
						if (istro.ripeti === 1) {
							S.Istruzioni[L][ii].mossa = 0;
						} else {
							// Non si deve rimuovere un'istruzione nMosse, potrebbe tornare attiva per un caricamento di partita o altro
							delete S.Istruzioni[L][ii].mossa; delete istro.mossa;
						}
					} else {
						S.Istruzioni[L][ii].mossa++;
						continue; // Prossima istruzione
					}
				}

				// Verifica che l'input del giocatore (se richiesto) corrisponda a quello previsto dall'istruzione
				if (istro['input'] && !Lingua.fraseInFrasiSemantiche(I.inputNorm, istro['input'])) continue; // Prossima istruzione

				// Arrivato qui, tutte le condizioni sono soddisfatte, quindi l'istruzione che richiede un'azione va raccolta
				if (L === 'scena') { istro.livello = 'scena'; } else { istro.livello = 'generali'; }
				azioni.push(istro);
			}
		});

		// Esegue le istruzioni raccolte, valutando l'ordine di esecuzione //

		// Prima tutte quelle che non comportano un cambio di scena e non scattano dopo nMosse
		for (var a = 0; a < azioni.length; a++) {
			if (azioni[a].azione !== 'vaiA' && azioni[a].mosse === undefined) {
				I.eseguiIstruzione(azioni[a]);
				// Eventuali rispondiVai contano come cambi di scena ed hanno la priorità
				if (azioni[a].azione === 'rispondiVai') cambioScena = 1;
				azioni.splice(a, 1); a--;
				azioneEseguita = 1;
				break;
			}
		}
		// Poi quelle che comportano un cambio di scena legato a nMosseVai
		if (cambioScena === 0) {
			for (var a = 0; a < azioni.length; a++) {
				if (azioni[a].azione === 'vaiA' && azioni[a].mosse !== undefined) {
					// Deve ricontrollare le condizioni su oggetti e variabili, le azioni precedenti possono averle cambiate
					if (I.controllaOggVar(azioni[a]) === true) {
						I.eseguiIstruzione(azioni[a]);
						azioni.splice(a, 1); a--;
						cambioScena = 1;
						break;
					}
				}
			}
		}
		// Poi i cambi di scena ordinari, se non ne è già avvenuto uno
		if (cambioScena === 0) {
			for (var a = 0; a < azioni.length; a++) {
				if (azioni[a].azione === 'vaiA' && azioni[a].mosse === undefined) {
					// Deve ricontrollare le condizioni su oggetti e variabili, le azioni precedenti possono averle cambiate
					if (I.controllaOggVar(azioni[a]) === true) {
						I.eseguiIstruzione(azioni[a]);
						azioni.splice(a, 1); a--;
						cambioScena = 1;
						break;
					}
				}
			}
		}
		// Poi i messaggi dopo nMosse
		// Ci si assicura che non sia un "vaiA" perché non vengono scartati tutti, solo il primo incontrato
		for (var a = 0; a < azioni.length; a++) {
			if (azioni[a].azione !== 'vaiA' && azioni[a].mosse !== undefined) {
				// Deve ricontrollare le condizioni su oggetti e variabili, le azioni precedenti possono averle cambiate
				if (I.controllaOggVar(azioni[a])) {
					I.eseguiIstruzione(azioni[a]);
					azioneEseguita = 1;
				}
			}
		}

		// Se è avvenuto un cambio di scena, salta la parte finale che sarà superflua
		if (cambioScena === 1) return;

		// Se nessuna azione è stata eseguita, invita a provare altro
		if (azioneEseguita === 0) {
			e_inp.readOnly = true;
			e_inp.className = 'coloreSfondo testoCarattere testoGrandezza larghezzaMaxStoria';
			if (e_inp.style.color) Vista.coloreTestoP = e_inp.style.color;
			if (Vista.stile.coloreErrore) { e_inp.style.color = Vista.stile.coloreErrore; } else { e_inp.className += ' coloreErrore'; }
			e_inp.value = 'Prova qualcos\'altro...';
			// Dopo 1 sec scompare la scritta "Prova qualcos'altro..."
			Vista.timerPassaErrore = setTimeout(Vista.passaErrore, 1000);
			// Dopo 100 ms qualsiasi tasto che risulta premuto conclude il msg di errore
			setTimeout(function() {
				document.addEventListener('keydown', Vista.passaErrore);
				document.addEventListener('click', Vista.passaErrore);
				}, 100);
		} else {
			e_inp.value = '? ';
		}

		// Scorri il contenuto fino ad arrivare a fondo pagina
		window.scroll(0, window.innerHeight + window.pageYOffset);
	},

	scriviInput: function(inp) {
		document.getElementById('input').value = '? ' + inp;
		I.leggiInput();
	},

	controllaOggVar: function(cond) {

		// Controlla le condizioni sugli oggetti
		if (cond.seOggetti !== undefined) {
			for (var i = 0; i < cond.seOggetti.length; i++) {
				if (S.oggetti[cond.seOggetti[i].contenitore] === undefined ||
					S.oggetti[cond.seOggetti[i].contenitore][0].indexOf(cond.seOggetti[i].nome) === -1) { // Oggetto assente
					// L'oggetto dovrebbe essere presente
					if (cond.seOggetti[i].presenza === 1) return false;
				} else { // Oggetto presente
					// L'oggetto dovrebbe essere assente
					if (cond.seOggetti[i].presenza === 0) return false;
				}
			}
		}

		// Controlla le condizioni sulle variabili
		if (cond.seVariabili !== undefined) {
			for (var i = 0; i < cond.seVariabili.length; i++) {
				if (S.variabili[cond.seVariabili[i].nome] === undefined) { // Variabile non esiste
					// La variabile dovrebbe esistere
					if (cond.seVariabili[i].presenza === 1) return false;
				} else { // Variabile esiste
					// La variabile non dovrebbe esistere
					if (cond.seVariabili[i].presenza === 0) return false;
				}
			}
		}
		return true;
	},

	impostaOggVar: function(elementi) {
		// Imposta, ovvero crea o distrugge, sia oggetti che variabili
		// elementi: stringa con caratteri speciali che riporta direttive sia su oggetti che su variabili
		//   il carattere + separa oggetti tra loro, o anche oggetti e variabili copresenti su str
		//   la presenza della @ indica che si tratta di un oggetto e deve seguire il nome di un contenitore
		//   iniziare la stringa con "no!" significa che quell'oggetto o variabile va eliminato

		elementi = elementi.split('+');
		var presenza; var nome; var contenitore;
		for (var i = 0; i < elementi.length; i++) {
			// Se presente il "no!" l'oggetto o la variabile vanno cancellati
			if (elementi[i].substr(0, 3) == 'no!') {
				presenza = 0;
				elementi[i] = elementi[i].substr(3); // Viene rimosso il "no!"
			} else {
				presenza = 1;
			}
			if (elementi[i].indexOf('@') !== -1) { // Se contiene una chiocciola è un oggetto
				elementi[i] = elementi[i].split('@'); // Scomposizione oggetto@contenitore
				nome = elementi[i][0];
				contenitore = elementi[i][1];
				if (presenza == 1) {
					if (S.oggetti[contenitore] === undefined) {
						S.oggetti[contenitore] = [];
						S.oggetti[contenitore].push([]); // Elenco oggetti con articolo determinativo (id)
						S.oggetti[contenitore].push([]); // Elenco oggetti con articolo indeterminativo
					}
					if (S.oggetti[contenitore][0].indexOf(nome) == -1) {
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
				if (presenza == 1) {
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

		// Controlla se ci sono funzioni _agganciate a quella principale
		if (istro.immagine) {
			e_txt.innerHTML += '<img src="" />';
			nImm = e_txt.getElementsByTagName('img').length;
			var e_imm = e_txt.getElementsByTagName('img')[nImm - 1];
			e_imm.style.display = 'block';
			if (istro.imgW !== undefined) e_imm.width = istro.imgW;
			if (istro.imgH !== undefined) e_imm.height = istro.imgH;
			e_imm.src = istro.immagine;
		}
		if (istro.oggetti) {
			I.impostaOggVar(istro.oggetti);
		}
		if (istro.variabili) I.impostaOggVar(istro.variabili);
		if (istro.audio) eseguiAudio(istro.audio);

		// Prepara alcuni aspetti dello stile
		var ali = ''; if (istro.allineamento) ali = Vista.aliStyle(istro.allineamento);
		if (!ali && Vista.stile.testoAllineamento) ali = Vista.aliStyle(Vista.stile.testoAllineamento);
		var classi = ''; var coloreInline = '';

		// Esegue l'azione principale
		switch (istro.azione) { // (si intende il tipo di azione)
			case 'audio':
				eseguiAudio(istro.audio);
			break;
			case 'rispondi':
				if (istro.mossa === undefined) {
					classi = ' class="inviato';
					if (Vista.stile.coloreTestoInviato) {
						coloreInline = ' style="color:'+Vista.stile.coloreTestoInviato+';"';
					} else {
						classi += ' coloreTestoInviato';
					}
					classi += '"';
					e_txt.innerHTML += '<p'+ ali + coloreInline + classi +'>? '+ I.inputGrezzo +'</p>';
				}
				e_txt.innerHTML += '<p'+ali+'>' + Vista.testoSpeciale(istro.output) + '</p>';
			break;
			case 'vaiA':
				// Passa immediatamente ad una nuova scena che svuoterà le istruzioni in corso di verifica da parte di leggiInput().
				switch (istro.scena) {
					case 0: istruzioniScena(G.nScena); break;
					case -1: istruzioniScena(G.nScenaP); break;
					case -2: istruzioniScena(G.nScenaPP); break;
					default: istruzioniScena(istro.scena); break;
				}
			break;
			case 'rispondiVai':
				if (istro.mossa === undefined) {
					document.getElementById('input').style.display = 'none';
					classi = ' class="inviato';
					if (Vista.stile.coloreTestoInviato) {
						coloreInline = ' style="color:'+Vista.stile.coloreTestoInviato+';"';
					} else {
						classi += ' coloreTestoInviato';
					}
					classi += '"';
					e_txt.innerHTML += '<p'+ ali + coloreInline + classi +'>? ' + I.inputGrezzo + '</p>';
				}
				e_txt.innerHTML += '<p'+ali+'>' + Vista.testoSpeciale(istro.output) + '</p>';
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
		}
		Vista.testo = e_txt.innerHTML; // Devo tener aggiornato il testo nell'oggetto Vista
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
		if (Lingua.equivalenzeOrd.length !== 0) vocabolario();

		G.nuovaPartita();
		S.oggetti = {}; // Cancella tutti i contenitori con gli oggetti
		S.variabili = {}; // Cancella tutte le variabili
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
			if (G.nScena === 0) { S.Istruzioni.generali.push({}); } else { S.Istruzioni.scena.push({}); };
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
		}
	}
}

// Pila delle Condizioni che si sommano entrando in blocchi annidati
var Condizioni = {
	correntiABlocchi: [], // Contiene blocchi di condizioni "seOggetti e seVariabili" che si applicano alle istruzioni condizionate
	correnti: {}, // Somma dei blocchi di condizioni correnti
	righeCoinvolte: [], // 0: nessuna condizione; 1: solo la singola riga successiva; 2: una serie di righe di istruzioni (blocco)
	sommaCondizioni: function() {
		Condizioni.correnti = {'seOggetti': [], 'seVariabili': []};
		for (var b = 0; b < Condizioni.correntiABlocchi.length; b++) {
			Condizioni.correnti.seOggetti = Condizioni.correnti.seOggetti.concat(Condizioni.correntiABlocchi[b].seOggetti);
			Condizioni.correnti.seVariabili = Condizioni.correnti.seVariabili.concat(Condizioni.correntiABlocchi[b].seVariabili);
		}
	},
	popUltimoBlocco: function() {
		Condizioni.righeCoinvolte.pop(); // Sono state gestite le righe di istruzioni per questo blocco e va rimosso il tracciamento
		Condizioni.correntiABlocchi.pop(); // Le istruzioni per il blocco sono state eseguite, quindi si svuotano le ultime condizioni
		Condizioni.sommaCondizioni(); // Se un blocco di condizioni viene rimosso, va aggiornata la somma delle condizioni restanti
	}
}

//==================================//
// Istruzioni per definire le scene //
//==================================//

// Istruzioni per le impostazioni iniziali delle scene //

function titolo(str) {
	document.title = str;
}
function coloreSfondo(col) {
	if (col) Vista.stile.coloreSfondo = col;
}
function coloreTesto(col1, col2) {
	if (col1) Vista.stile.coloreTesto = col1;
	if (col2) Vista.stile.coloreTestoInviato = col2;
}
function coloreScelte(col1, col2) {
	if (col1) Vista.stile.coloreScelta = col1;
	if (col2) Vista.stile.coloreSceltaSelez = col2;
}
function coloreErrore(col) {
	if (col) Vista.stile.coloreErrore = col;
}
function carattereTesto(fnt, siz, ali) {
	if (fnt) Vista.stile.testoCarattere = fnt;
	if (siz) Vista.stile.testoGrandezza = siz;
	if (ali) Vista.stile.testoAllineamento = ali;
}
function intermezzo(txt, aud) {
	// txt: testo da visualizzare, anche html
	// aud: audio da eseguire alla comparsa del testo

	if (G.nScena === 0) { alert('L\'istruzione "intermezzo()" non può essere usata nelle istruzioni generali. Eliminarla.'); return; }
	if (aud !== undefined) { aud = aud + '&&&'; } else { aud = ''; }
	
	// Gestione dell'ultimo blocco condizionato in relazione alle righe di istruzioni coinvolte
	var esegui = 0; var iUB = Condizioni.correntiABlocchi.length - 1; // iUB: indice Ultimo Blocco
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		if (I.controllaOggVar(Condizioni.correnti) === true) esegui = 1;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	} else { esegui = 1; }

	if (esegui == 1) Vista.intermezzo.push(aud + txt);
}
function testo(txt, ali) {
	// txt: testo da visualizzare, anche html
	// ali: allineamento del testo (valori: "giustificato", "centrato", "destra", "sinistra")

	if (G.nScena === 0) { alert('L\'istruzione "testo()" non può essere usata nelle istruzioni generali. Eliminarla.'); return; }
	
	// Gestione dell'ultimo blocco condizionato in relazione alle righe di istruzioni coinvolte
	var esegui = 0; var iUB = Condizioni.correntiABlocchi.length - 1; // iUB: indice Ultimo Blocco
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		if (I.controllaOggVar(Condizioni.correnti) === true) esegui = 1;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	} else { esegui = 1; }
	
	if (esegui == 1) {
		if (ali) { ali = Vista.aliStyle(ali); } else { ali = ''; }
		if (Vista.stile.testoAllineamento) ali = Vista.aliStyle(Vista.stile.testoAllineamento);
		Vista.testo += '<p'+ali+'>' + txt + '</p>';
	}
}
function immagine(img, w, h) {
	// img: nome dell'immagine da posizionare nella stessa cartella di 'INIZIA.html'
	// w, h: larghezza e altezza da impostare forzatamente

	if (img === undefined || img === '') return;

	// Gestione dell'ultimo blocco condizionato in relazione alle righe di istruzioni coinvolte
	var esegui = 0; var iUB = Condizioni.correntiABlocchi.length - 1;
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		if (I.controllaOggVar(Condizioni.correnti) === true) esegui = 1;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	} else { esegui = 1; }

	if (esegui == 1) {
		var e_txt = document.getElementById('testo');
		if (w === undefined) { w = ''; } else { w = ' width="'+w+'"'; }
		if (h === undefined) { h = ''; } else { h = ' height="'+h+'"'; }
		Vista.testo += '<img style="display:block;" '+ w + h +' src="'+ img +'" />';
	}
}
function audio(aud) {
	if (G.nScena === 0) { alert('L\'istruzione "audio()" non può essere usata nelle istruzioni generali. Eliminarla.'); return; }
	
	// Gestione dell'ultimo blocco condizionato in relazione alle righe di istruzioni coinvolte
	var esegui = 0; var iUB = Condizioni.correntiABlocchi.length - 1; // iUB: indice Ultimo Blocco
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		if (I.controllaOggVar(Condizioni.correnti) === true) esegui = 1;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	} else { esegui = 1; }
	
	if (esegui == 1) document.getElementById('audio').innerHTML = '<audio id="fileAudio" src="' + aud + '"></audio>';
}
function contenitore(cont, ogg) {
	// cont: nome del contenitore che fa da chiave nell'array dei contenitori di oggetti: S.oggetti
	// ogg: oggetti contenuti separati con +, scrivere sempre l'articolo determinativo, faranno da etichette e da ID
	//   è possibile indicare l'articolo indeterminativo prima dell'etichetta oggetto servendosi di una barra '|'
	//   Es. "un|l'amuleto+dello|lo zucchero+il Martello di Tor+un'|l'albicocca" - Notare che può non venir usata la barra, in tal caso viene sempre presentata l'etichetta con articolo determinativo (o comunque quello che scriviamo), utile per oggetti unici (es. "martello"). L'articolo viene considerato comprensivo di apostrofo quindi con l' (l apostrofo) viene tolto anche apostrofo. Se l'oggetto è maschile o femminile, è lo scrittore che deve specificare o meno l'apostrofo nell'articolo indeterminativo, si veda l'esempio "amuleto" e "albicocca". L'eventuale spazio dopo l'articolo è automaticamente gestito (quindi non va mai messo).
	
	// Il contenitore va creato solo la prima volta che si incontra questa istruzione
	if (S.oggetti[cont] !== undefined) return;
	S.oggetti[cont] = [];

	// I contenitori sono array che contengono 2 array:
	// Primo array: oggetti con etichette art. det.; secondo array: oggetti con etichette art. indet.
	
	if (ogg === '' || ogg === undefined) {
		S.oggetti[cont].push([]); // Etichette-ID con art. det.
		S.oggetti[cont].push([]); // Etichette con art. indet.
	} else {
		var ogg_il = []; // Etichette-ID con art. det.
		var ogg_un = []; // Etichette con art. indet.
		ogg = ogg.split('+');
		for (var o = 0; o < ogg.length; o++) { // o: indice oggetto
			// Separa l'eventuale articolo indeterminativo dall'etichetta con art. det. (es. "un|l'amuleto")
			ogg[o] = ogg[o].split('|');
			switch (ogg[o].length) {
				case 1:
					ogg_il.push(ogg[o][0]);
					ogg_un.push(ogg[o][0]);
					break;
				case 2:
					ogg_il.push(ogg[o][1]); // Etichetta con art. det. già pronta
					// Etichetta con art. indet. va costruita controllando come iniziano le etichette con art. det.
					if (ogg[o][1].startsWith('gli')) {
						ogg_un.push(ogg[o][0]+ogg[o][1].substring(3));
					} else if (ogg[o][1].startsWith('gl\'')) {
						// Se finisce con un apostrofo, attacca l'articolo alla parola, altrimenti ci mette uno spazio
						if (ogg[o][0].substring(ogg[o][0].length - 1) === '\'') {
							ogg_un.push(ogg[o][0]+ogg[o][1].substring(3));
						} else {
							ogg_un.push(ogg[o][0]+' '+ogg[o][1].substring(3));
						}
					} else if (ogg[o][1].match(/^il|lo|la|le/)) {
						ogg_un.push(ogg[o][0]+ogg[o][1].substring(2));
					} else if (ogg[o][1].startsWith('l\'')) {
						// Se finisce con un apostrofo, attacca l'articolo alla parola, altrimenti ci mette uno spazio
						if (ogg[o][0].substring(ogg[o][0].length - 1) === '\'') {
							ogg_un.push(ogg[o][0]+ogg[o][1].substring(2));
						} else {
							ogg_un.push(ogg[o][0]+' '+ogg[o][1].substring(2));
						}
					} else if (ogg[o][1].startsWith('i')) {
						ogg_un.push(ogg[o][0]+ogg[o][1].substring(1));
					}
					break;
				default:
					alert('Un\'etichetta presenta più di un separatore ammesso per l\'articolo indeterminativo. Correggere la scena n. '+ G.nScena);
					return;
			}
		}
		S.oggetti[cont].push(ogg_il); // Etichette-ID con art. det.
		S.oggetti[cont].push(ogg_un); // Etichette con art. indet.
	}
}
function oggetti(oo) {
	// Gestione dell'ultimo blocco condizionato in relazione alle righe di istruzioni coinvolte
	var esegui = 0; var iUB = Condizioni.correntiABlocchi.length - 1;
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		if (I.controllaOggVar(Condizioni.correnti) === true) esegui = 1;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	} else { esegui = 1; }
	
	if (esegui == 1) I.impostaOggVar(oo);
}
function variabili(vv) {
	// Gestione dell'ultimo blocco condizionato in relazione alle righe di istruzioni coinvolte
	var esegui = 0; var iUB = Condizioni.correntiABlocchi.length - 1;
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		if (I.controllaOggVar(Condizioni.correnti) === true) esegui = 1;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	} else { esegui = 1; }
	
	if (esegui == 1) I.impostaOggVar(vv);
}

// Istruzioni per il comportamento delle scene //

function condizioni(cond, istruzioni) {
	// cond: stringa per specificare quali oggetti devono essere in certi contenitori e quali variabili si richiedono
	// formato stringa condizioni: [no!]l'oggetto@contenitore+[no!]nome variabile
	// istruzioni(): è la funzione per eseguire tutte le istruzioni condizionate
	// Devo tener traccia di ciascun blocco di condizioni, alla fine del blocco vanno svuotate, senza svuotare blocchi ancora non terminati

	var lastID = Condizioni.correntiABlocchi.length;
	Condizioni.correntiABlocchi.push({'seOggetti': [], 'seVariabili': []});

	var presenza;
	cond = cond.split('+'); // Elenco delle condizioni su oggetti e variabili
	for (var i = 0; i < cond.length; i++) {
		// Stabilire se si tratta di un oggetto o una variabile
		if (cond[i].indexOf('@') !== -1) { // Se contiene una chiocciola è un oggetto
			if (cond[i].substr(0, 3) == 'no!') {
				presenza = 0;
				cond[i] = cond[i].substr(3);
			} else {
				presenza = 1;
			}
			cond[i] = cond[i].split('@'); // Scomposizione oggetto@contenitore
			Condizioni.correntiABlocchi[lastID].seOggetti.push({'presenza': presenza, 'nome': cond[i][0], 'contenitore': cond[i][1]});
		} else { // Se non contiene una chiocciola è una variabile
			if (cond[i].substr(0, 3) == 'no!') {
				presenza = 0;
				cond[i] = cond[i].substr(3);
			} else {
				presenza = 1;
			}
			Condizioni.correntiABlocchi[lastID].seVariabili.push({'presenza': presenza, 'nome': cond[i]});
		}
	}
	// Ogni volta che vengono aggiunte le condizioni per blocchi, aggiornare la somma delle condizioni
	Condizioni.sommaCondizioni();
	// Se è stato definito un blocco di istruzioni condizionate, vanno eseguite, altrimenti è coinvolta solo la singola riga successiva
	if (istruzioni !== undefined) {
		Condizioni.righeCoinvolte.push(2);
		istruzioni();
		Condizioni.popUltimoBlocco();
	} else {
		// L'esecuzione dell'istruzione successiva dovrà svuotare le condizioni ed eliminare il tracciamento delle righe coinvolte
		Condizioni.righeCoinvolte.push(1);
	}
}
function nomeLuogo(nome) {
	// nome: del luogo da visualizzare dopo i punti cardinali
	if (G.nScena === 0) { alert('È vietato usare l\'istruzione "nomeLuogo()" nelle istruzioni generali. Eliminarla.'); return; }

	// Arbitrariamente un gruppo di scene può far parte di uno stesso luogo, però affinché il comando 'direzioni' possa essere usato per raggiungere rapidamente un luogo, occorre assegnare dei nomi ai luoghi. Di un insieme di scene, una deve essere scelta come preferita o idonea per "teletrasportarsi" (raggiungere subito) un luogo.
	nome = nome.split('|');
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
function bloccaDirezioni() {
	// Indica che per questa scena le direzioni veloci sono bloccate
	G.luoghiRagg.bloccati = 1;
}
function cancellaDirezione(nome) {
	// nome: del luogo raggiungibile da cancellare
	if (S.luoghiRagg[nome] !== undefined) delete S.luoghiRagg[nome];
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

	var L; // Livello delle istruzioni (generali o di scena)
	if (G.nScena === 0) { L = 'generali'; } else { L = 'scena'; Vista.stile.inputBox = 1; }

	// Aggiungi condizioni correnti
	var iUB = Condizioni.correntiABlocchi.length - 1; // iUB: indice ultimo blocco
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		var iUA = S.Istruzioni[L].length - 1; // iUA: indice ultima azione
		S.Istruzioni[L][iUA]['seOggetti'] = Condizioni.correnti.seOggetti;
		S.Istruzioni[L][iUA]['seVariabili'] = Condizioni.correnti.seVariabili;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	}
}
function rispondi(txt_in, txt_out) {
	// txt_in: input dell'utente
	// txt_out: risposta da ricevere

	// Trasforma le frasi articolate scritte dallo scrittore in frasi semantiche
	txt_in = Lingua.normalizzaInput(txt_in, 2);

	S.Istruzioni.crea();
	S.Istruzioni.valore('azione', 'rispondi');
	S.Istruzioni.valore('input', txt_in);
	S.Istruzioni.valore('output', txt_out);

	var L; // Livello delle istruzioni (generali o di scena)
	if (G.nScena === 0) { L = 'generali'; } else { L = 'scena'; Vista.stile.inputBox = 1; }

	// Aggiungi condizioni correnti
	var iUB = Condizioni.correntiABlocchi.length - 1; // iUB: indice ultimo blocco
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		var iUA = S.Istruzioni[L].length - 1; // iUA: indice ultima azione
		S.Istruzioni[L][iUA]['seOggetti'] = Condizioni.correnti.seOggetti;
		S.Istruzioni[L][iUA]['seVariabili'] = Condizioni.correnti.seVariabili;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	}
}
function rispondiVai(txt_in, txt_out, nS) {
	// txt_in: input dell'utente
	// txt_out: risposta momentanea da lasciare
	// nS: numero della scena verso cui andare
	// rit: ritardo in millisecondi prima di andare ad una scena

	// Trasforma le frasi articolate scritte dallo scrittore in frasi semantiche
	txt_in = Lingua.normalizzaInput(txt_in, 2);

	S.Istruzioni.crea();
	S.Istruzioni.valore('azione', 'rispondiVai');
	S.Istruzioni.valore('input', txt_in);
	S.Istruzioni.valore('output', txt_out);
	S.Istruzioni.valore('scena', nS);

	var L; // Livello delle istruzioni (generali o di scena)
	if (G.nScena === 0) { L = 'generali'; } else { L = 'scena'; Vista.stile.inputBox = 1; }

	var iUB = Condizioni.correntiABlocchi.length - 1; // iUB: indice ultimo blocco
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		var iUA = S.Istruzioni[L].length - 1; // iUA: indice ultima azione
		S.Istruzioni[L][iUA]['seOggetti'] = Condizioni.correnti.seOggetti;
		S.Istruzioni[L][iUA]['seVariabili'] = Condizioni.correnti.seVariabili;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	}
}
function nMosseVai(mosse, nS, rip) {
	// mosse: numero mosse del giocatore per far scattare l'evento
	// nS: numero della scena verso cui andare
	// rip: se non specificato sarà 0, ovvero scattato l'evento non si ripete, 'ripeti' per ripeterlo

	S.Istruzioni.crea();
	S.Istruzioni.valore('mosse', mosse - 1); // Conta anche lo zero
	S.Istruzioni.valore('mossa', 0);
	S.Istruzioni.valore('azione', 'vaiA');
	S.Istruzioni.valore('scena', nS);
	if (rip === undefined) rip = 0; // nMosse non viene ripetuto da impostazione predefinita
	if (rip === 'ripeti') rip = 1;
	S.Istruzioni.valore('ripeti', rip);

	var L; // Livello delle istruzioni (generali o di scena)
	if (G.nScena === 0) { L = 'generali'; } else { L = 'scena'; Vista.stile.inputBox = 1; }

	var iUB = Condizioni.correntiABlocchi.length - 1; // iUB: indice ultimo blocco
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		var iUA = S.Istruzioni[L].length - 1; // iUA: indice ultima azione
		S.Istruzioni[L][iUA]['seOggetti'] = Condizioni.correnti.seOggetti;
		S.Istruzioni[L][iUA]['seVariabili'] = Condizioni.correnti.seVariabili;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	}
}
function nMosseRispondi(mosse, txt_out, rip) {
	// mosse: numero mosse del giocatore per far scattare l'evento
	// txt_out: testo che deve comparire dopo n mosse
	// rip: se non specificato sarà 0, ovvero scattato l'evento non si ripete, 'ripeti' per ripeterlo

	S.Istruzioni.crea();
	S.Istruzioni.valore('mosse', mosse - 1); // Conta anche lo zero
	S.Istruzioni.valore('mossa', 0);
	S.Istruzioni.valore('azione', 'rispondi');
	S.Istruzioni.valore('output', txt_out);
	if (rip === undefined) rip = 0; // nMosse non viene ripetuto da impostazione predefinita
	if (rip === 'ripeti') rip = 1;
	S.Istruzioni.valore('ripeti', rip);

	var L; // Livello delle istruzioni (generali o di scena)
	if (G.nScena === 0) { L = 'generali'; } else { L = 'scena'; Vista.stile.inputBox = 1; }

	var iUB = Condizioni.correntiABlocchi.length - 1; // iUB: indice ultimo blocco
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		var iUA = S.Istruzioni[L].length - 1; // iUA: indice ultima azione
		S.Istruzioni[L][iUA]['seOggetti'] = Condizioni.correnti.seOggetti;
		S.Istruzioni[L][iUA]['seVariabili'] = Condizioni.correnti.seVariabili;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	}
}
function scegliVai(txt, nS, ali) {
	// txt: testo della scelta selezionabile
	// nS: numero della scena verso cui andare
	// ali: allineamento del testo (valori: "giustificato", "centrato", "destra", "sinistra")

	if (ali !== undefined) { ali = Vista.aliStyle(ali); } else { ali = ''; }
	Vista.scelte += '<p class="scelta coloreScelta" '+ ali +' onclick="S.vaiA('+nS+')">' + txt + '</p>';
}
function scegliRispondi(txt, txt_out, ali1, ali2) {
	// txt: testo della scelta selezionabile (se txt_out = "" allora txt verrà trattato come un input dell'utente)
	// txt_out: testo stampato dopo aver cliccato sulla scelta
	// ali1: allineamento del testo della scelta selezionabile
	// ali2: allineamento del testo stampato in risposta

	if (ali1 !== undefined) { ali1 = Vista.aliStyle(ali1); } else { ali1 = ''; }
	if (txt_out !== undefined && txt_out !== '') {
		var istro = {}; // istro: istruzione
		istro['azione'] = 'rispondi';
		I.inputGrezzo = txt;
		istro['output'] = txt_out.replace(/'/g, '"');
		if (ali2 !== undefined) istro['allineamento'] = ali2;
		Vista.scelte += '<p class="scelta coloreScelta" ' + ali1 + ' onclick="this.style.display = \'none\'; I.eseguiIstruzione('+JSON.stringify(istro).replace(/"/g, '\'')+');">' + txt + '</p>';
	} else {
		if (ali2 !== undefined) { ali2 = ', {\'outAli\':\''+ali2+'\'}'; } else { ali2 = ''; }
		txt =  txt.replace(/'/g, '"').replace(/"/g, '\'');
		Vista.scelte += '<p class="scelta coloreScelta" ' + ali1 + ' onclick="this.style.display = \'none\'; I.scriviInput(\''+txt+'\''+ali2+');">' + txt + '</p>';
	}
}

// Funzioni per ampliare le possibilità delle istruzioni precedenti //

function _oggetti(oo) {
	if (oo !== undefined) S.Istruzioni.valore('oggetti', Lingua.normalizzaDiacritici(oo.toLowerCase()));
}
function _variabili(vv) {
	S.Istruzioni.valore('variabili', Lingua.normalizzaDiacritici(vv.toLowerCase()));
}
function _audio(aud) {
	S.Istruzioni.valore('audio', aud);
}
function _immagine(img, w, h) {
	S.Istruzioni.valore('immagine', img);
	if (w !== undefined) S.Istruzioni.valore('imgW', w);
	if (h !== undefined) S.Istruzioni.valore('imgH', h);
}
function x(str) {
	var ee = str.split('|');
	var n = Math.floor((Math.random() * ee.length) + 1);
	return ee[n];
}
