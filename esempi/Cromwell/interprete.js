var Lingua = {
	predicati: [],
	equivalenze: [],
	mappaDiacritici: [ /* Mappa per sostituire le vocali accentate in vocali non accentate */
		{'base':'a', 'letters':/[\u00E0\u00E1]/g},
		{'base':'e', 'letters':/[\u00E8\u00E9]/g},
		{'base':'i', 'letters':/[\u00EC\u00ED]/g},
		{'base':'o', 'letters':/[\u00F2\u00F3]/g},
		{'base':'u','letters':/[\u00F9\u00FA]/g}
	],
	noDiacritici: function(str) {
		// La stringa DEVE essere già in caratteri minuscoli, altrimenti non avverranno le sostituzioni
		for (var i = 0; i < Lingua.mappaDiacritici.length; i++) {
			str = str.replace(Lingua.mappaDiacritici[i].letters, Lingua.mappaDiacritici[i].base);
		}
		return str;
	}
}

var Storia = {
	// Lo stile predefinito viene impostato nel CSS
	oggetti: {}, // Dizionario di contenitori che contengono oggetti
	variabili: {}, // Dizionario di variabili che possono assumere un valore
	luoghiRaggiungibili: {},
	istruzioniGenerali: [],
	nuovaPartita: function() {
		if (Lingua.equivalenze.length === 0) vocabolario();
		Storia.oggetti = {}; // Cancella tutti i contenitori con gli oggetti
		Storia.variabili = {}; // Cancella tutte le variabili
		Storia.luoghiRaggiungibili = {}; // Cancella tutti i nomi dei luoghi raggiungibili
		Storia.istruzioniGenerali = []; // Svuota le istruzioni per le azioni generali
	}
}

var Scena = {
	N: 1, /*n. scena attuale*/
	P: 1, /*n. scena precedente*/ P2: 1, /*n. scena ancora precedente*/
	stile: {}, // Aspetti della scena che sovrascrivono lo stile predefinito
	usciteVisibili: '',
	direzioniBloccate: 0,
	svuota: function () {
		document.getElementById('audio').innerHTML = '';
		document.getElementById('scelte').style.visibility = 'hidden';
		document.getElementById('scelte').innerHTML = '';
		document.getElementById('input').style.display = 'none';
		document.getElementById('input').value = '? ';
		document.getElementById('testo').style.visibility = 'hidden';
		document.getElementById('testo').innerHTML = '';
		Scena.stile = {};
		Scena.usciteVisibili = '';
		Azioni.scena = [];
	},
	avvia: function(n) {
		document.removeEventListener('keypress', press_noAttesa);
		document.removeEventListener('click', press_noAttesa);
		if (n == 1) { // Comportamento speciale per l'avvio della scena 1
			Storia.nuovaPartita();
			Scena.N = undefined; // L'assenza del numero di scena segnala che le istruzioni sono generali
			istruzioniGenerali();
			Scena.N = 1; // Reimposto il numero di scena attuale che è quello di inizio
		};
		Scena.P2 = Scena.P; Scena.P = Scena.N; Scena.N = n;
		Scena.svuota();
	},
	concludi: function() {
		var e_txt = document.getElementById('intermezzo');
		// Finché c'è un intermezzo, mostra prima quello, finché non si preme un tasto
		if (Scena.stile.intermezzo !== undefined) {
			if (Scena.stile.intermezzo.length > 0) {
				e_txt.innerHTML = '<p>'+Scena.stile.intermezzo[0]+'</p>';
				e_txt.style.visibility = 'visible';
				Scena.stile.intermezzo.splice(0, 1);
				setTimeout(function(){ document.addEventListener('keypress', press_concludi); document.addEventListener('click', press_concludi); }, 200);
				return;
			} else {
				e_txt.innerHTML = '';
				e_txt.style.visibility = 'hidden';
				delete Scena.stile.intermezzo;
			}
		}
		// Inserisci le eventuali uscite visibili
		var e_txt = document.getElementById('testo');
		if (Scena.usciteVisibili !== '') {
			e_txt.innerHTML += '<p>Uscite visibili:' + Scena.usciteVisibili.substr(1) + '.</p>';
					Scena.usciteVisibili = ''; Scena.direzioniBloccate = 0;
		}
		// Se c'è qualche immagine da caricare, attendi che siano tutte caricate
		if (Scena.stile.immagini !== undefined) {
			Scena.stile.timerImg = setInterval(Scena.controllaImg, 150);
		} else { // Se non ci sono immagini da caricare mostra subito tutto
			Scena.mostra();
		}
	},
	controllaImg: function() {
		var e_img;
		for (var i = 0; i < Scena.stile.immagini.length; i++) {
			e_img = document.getElementById(Scena.stile.immagini[i]);
			if (e_img.naturalWidth === 0 || e_img.complete === false) {
				return; // Esce dalla funzione e dovrà essere richiamata per un nuovo controllo e proseguire in caso di buon fine
			}
		}
		clearInterval(Scena.stile.timerImg);
		Scena.mostra();
	},
	mostra: function() {
		document.getElementById('testo').style.visibility = 'visible';
		if (Scena.stile.scrittura == 1) document.getElementById('input').style.display = 'block';
		document.getElementById('scelte').style.visibility = 'visible';
		var e_fileAudio = document.getElementById('fileAudio');
		if (e_fileAudio !== null) e_fileAudio.play(); // Esegui file audio se caricato
		pronto(); // Passa il focus alla casella di input
	},
	controllaInput: function(opzioni) {
		if (opzioni === undefined) opzioni = {}; // Semplifica i controlli delle proprietà assenti nell'array opzioni
		var e_inp = document.getElementById('input');
		var inp = e_inp.value.trim(); if (inp.charAt(0) == '?') inp = inp.substr(1).trim();
		Azioni.invioInp = inp;
		var livelli = ['scena', 'generale']; // Controllare prima le azioni di scena e poi quelle generali
		var azione = {};
		for (var L = 0; L <= 1; L++) {
			for (var ia = 0; ia < Azioni[livelli[L]].length; ia++) {
				azione = Azioni[livelli[L]][ia];
				if (azione.mosse) continue; // Se è un'azione ritardata (n. mosse) viene gestita in modo speciale piú avanti
				if (azione.input !== undefined) { // Controlla se l'input soddisfa questa azione
					if (inp === '') { e_inp.value = '? '; return; } else { inp = Lingua.noDiacritici(inp.toLowerCase()); }
					// Ci sono alcuni input speciali che fanno parte dell'interprete
					if ((inp.split(' ')[0] == 'direzione' || inp.split(' ')[0] == 'd') && Scena.direzioniBloccate === 1) {
						azione = {};
						azione.tipo = 'rispondi';
						azione.output = 'Ora non puoi dirigerti velocemente in nessun luogo.';
					} else if ((inp == 'direzioni' || inp == 'd' || inp == 'direzione') && Scena.direzioniBloccate === 0) {
						azione = {};
						azione.tipo = 'rispondi';
						var luoghi = '';
						if (Storia.luoghiRaggiungibili !== undefined && Storia.luoghiRaggiungibili[Scena.N].visitato !== 0) {
							for (var key in Storia.luoghiRaggiungibili) {
								if (Storia.luoghiRaggiungibili[key].visitato !== 0 && key != Scena.N && Storia.luoghiRaggiungibili[key].nome !== undefined) {
									if (luoghi !== '') luoghi += ', ';
									luoghi += Storia.luoghiRaggiungibili[key].nome.split('|')[0];
								}
							}
						}
						if (luoghi === '') {
							azione.output = 'Devi esplorare altri luoghi, poi potrai raggiungerli velocemente.';
						} else {
							azione.output = 'Luoghi raggiungibili: '+luoghi+'.';
						}
					} else if ((inp.split(' ')[0] == 'direzione' || inp.split(' ')[0] == 'd') && direzioniBloccate === 0) {
						if (Storia.luoghiRaggiungibili === undefined || Storia.luoghiRaggiungibili[Scena.N].visitato === 0) {
							azione = {};
							azione.tipo = 'rispondi';
							azione.output = 'Non puoi dirigerti velocemente in nessun luogo per ora.';
						} else {
							var inizio = inp.split(' ')[0].length + 1;
							for (var key in Storia.luoghiRaggiungibili) {
								if (Storia.luoghiRaggiungibili[key].visitato !== 0 && key != Scena.N && Storia.luoghiRaggiungibili[key].nome !== undefined && Storia.luoghiRaggiungibili[key].nome.split('|').indexOf(inp.substr(inizio)) != -1) {
									e_inp.value = '? ';
									scena(parseInt(key, 10));
									return;
								}
							}
							continue; // Se la direzione non era valida, controlla comunque eventuali altre azioni
						}
					} else {
						var inpAlbero = ramificaInput(inp, 1);
						if (!soddisfa(inpAlbero, azione.input)) continue;
					}
				}
				if (Condizioni.verifica({'seOggetti': azione.seOggetti, 'seVariabili': azione.seVariabili}) === false) continue;
				// Se arriva qui o non c'erano condizioni o sono state soddisfatte
				if (opzioni.outAli !== undefined) azione.allineamento = opzioni.outAli;
				e_inp.value = '? '; // È segno che almeno un'azione è stata eseguita (piú sicuro metterlo prima dell'azione)
				Azioni.esegui(azione);
				break;
				Azioni.bastaInvioInp = 1; // Ha davvero senso questo parametro?
			}
			if (e_inp.value == '? ') break;
		}
		Azioni.bastaInvioInp = 0; // Finito un ciclo di controllo per tutte le azioni, va ripristinato
		// Se arriva qui nessuna condizione è stata soddisfatta oppure una o piú azioni sono state eseguite
		if (e_inp.value != '? ') { // Nessuna azione è stata eseguita
			e_inp.readOnly = true;
			var cE = '';
			//if (stileBase.colErrore !== undefined) cE = stileBase.colErrore;
			if (Scena.stile.colErrore !== undefined && Scena.stile.colErrore !== '') cE = Scena.stile.colErrore;
			if (cE === '') { e_inp.className = 'errore'; } else { e_inp.style.color = cE; }
			e_inp.value = 'Prova qualcos\'altro...';
			setTimeout(function() { e_inp.value = '? '; e_inp.className = ''; e_inp.style.color = ''; e_inp.readOnly = false; }, 1000);
			// Dovrei aggiungere la caratteristica che se si inizia a scrivere è subito pronto e non perde le battute (document keydown)
		}
		// Gestione speciale delle azioni ritardate
		livelli = ['scena', 'generale'];
		azione = {};
		for (L = 0; L <= 1; L++) {
			for (ia = 0; ia < Azioni[livelli[L]].length; ia++) {
				azione = Azioni[livelli[L]][ia];
				if (!azione.mosse) continue; // Le azioni non ritardate le ignoro, dato che sono state gestite prima
				if (Condizioni.verifica({'seOggetti': azione.seOggetti, 'seVariabili': azione.seVariabili}) === false) continue;
				// Se arriva qui o non c'erano condizioni o sono state soddisfatte
				if (Azioni[livelli[L]][ia].mossa == azione.mosse - 1) {
					Azioni[livelli[L]][ia].mossa = 0;
					if (azione.ripeti == 0) Azioni[livelli[L]].splice(ia, 1); ia--;
					Azioni.esegui(azione);
				} else {
					Azioni[livelli[L]][ia].mossa++;
				}
			}
		}
		// Scorri il contenuto fino ad arrivare a fondo pagina
		window.scroll(0, window.innerHeight + window.pageYOffset);
	},
	eseguiAudio: function(aud) {
		var e_aud = document.getElementById('audio');
		e_aud.innerHTML = '<audio src="' + aud + '" autoplay="autoplay"></audio>';
	},
	vai: function(nS) {
		switch (nS) {
			case 0: scena(Scena.N); break;
			case -1: scena(Scena.P); break;
			case -2: scena(Scena.P2); break;
			default: scena(nS); break;
		}
	}
}

var Condizioni = {
	correntiBlocchi: [], // Contiene blocchi di condizioni "seOggetti e seVariabili" che si applicano alle istruzioni condizionate
	correnti: {}, // Somma dei blocchi di condizioni correnti
	righeCoinvolte: [], // 0: nessuna condizione; 1: solo la singola riga successiva; 2: una serie di righe di istruzioni (blocco)
	sommaCondizioni: function() {
		Condizioni.correnti = {'seOggetti': [], 'seVariabili': []};
		for (var b = 0; b < Condizioni.correntiBlocchi.length; b++) {
			Condizioni.correnti.seOggetti = Condizioni.correnti.seOggetti.concat(Condizioni.correntiBlocchi[b].seOggetti);
			Condizioni.correnti.seVariabili = Condizioni.correnti.seVariabili.concat(Condizioni.correntiBlocchi[b].seVariabili);
		}
	},
	popUltimoBlocco: function() {
		Condizioni.righeCoinvolte.pop(); // Sono state gestite le righe di istruzioni per questo blocco e va rimosso il tracciamento
		Condizioni.correntiBlocchi.pop(); // Le istruzioni per il blocco sono state eseguite, quindi si svuotano le ultime condizioni
		Condizioni.sommaCondizioni(); // Se un blocco di condizioni viene rimosso, va aggiornata la somma delle condizioni restanti
	},
	verifica: function(cond) {
		var soddisfatto = true;
		// Controlla le condizioni sugli oggetti
		if (cond.seOggetti !== undefined) {
			for (var i = 0; i < cond.seOggetti.length; i++) {
				if (Storia.oggetti[cond.seOggetti[i].contenitore] === undefined ||
					Storia.oggetti[cond.seOggetti[i].contenitore][2].indexOf(cond.seOggetti[i].nome) == -1) { // Oggetto assente
					if (cond.seOggetti[i].presenza == 1) { // L'oggetto dovrebbe essere presente
						soddisfatto = false; break;
					}
				} else { // Oggetto presente
					if (cond.seOggetti[i].presenza === 0) { // L'oggetto dovrebbe essere assente
						soddisfatto = false; break;
					}
				}
			}
		}
		// Controlla le condizioni sulle variabili
		if (cond.seVariabili !== undefined) {
			for (var i = 0; i < cond.seVariabili.length; i++) {
				if (Storia.variabili[cond.seVariabili[i].nome] === undefined) { // Variabile non esiste
					if (cond.seVariabili[i].presenza == 1) { // La variabile dovrebbe esistere
						soddisfatto = false; break;
					}
				} else { // Variabile esiste
					if (cond.seVariabili[i].presenza === 0) { // La variabile non dovrebbe esistere
						soddisfatto = false; break;
					}
				}
			}
		}
		return soddisfatto;
	}
}

var Azioni = {
	generale: [],
	scena: [],
	invioInp: '',
	bastaInvioInp: 0,
	crea: function() {
		if (Scena.N === undefined) { Azioni.generale.push({}); } else { Azioni.scena.push({}); };
	},
	valore: function(p/*proprietà*/, v/*valore*/) {
		if (Scena.N === undefined) {
			Azioni.generale[Azioni.generale.length - 1][p] = v;
		} else {
			Azioni.scena[Azioni.scena.length - 1][p] = v;
		}
	},
	valoreArray: function(a/*nome array*/, v/*valore*/) {
		var ultima;
		if (Scena.N === undefined) {
			ultima = Azioni.generale.length - 1;
			if (Azioni.generale[ultima][a] === undefined) Azioni.generale[ultima][a] = [];
			Azioni.generale[ultima][a].push(v);
		} else {
			ultima = Azioni.scena.length - 1;
			if (Azioni.scena[ultima][a] === undefined) Azioni.scena[ultima][a] = [];
			Azioni.scena[ultima][a].push(v);
		}
	},
	ultimaLeggi: function(p/*proprietà*/) {
		if (Scena.N === undefined) {
			return Azioni.generale[Azioni.generale.length - 1][p];
		} else {
			return Azioni.scena[Azioni.scena.length - 1][p];
		}
	},
	esegui: function(azione) {
		var e_txt = document.getElementById('testo');

		// Controlla se ci sono funzioni _agganciate a quella principale
		if (azione.immagine) {
			e_txt.innerHTML += '<img src="" />';
			nImm = e_txt.getElementsByTagName('img').length;
			var e_imm = e_txt.getElementsByTagName('img')[nImm - 1];
			e_imm.style.display = 'block';
			if (azione.imgW !== undefined) e_imm.width = azione.imgW;
			if (azione.imgH !== undefined) e_imm.height = azione.imgH;
			e_imm.src = azione.immagine;
		}
		if (azione.piuOggetti) {
			imposta(azione.piuOggetti);
		}
		if (azione.menoOggetti) {
			var mo = [];
			mo = azione.menoOggetti.split('+');
			var po = azione.piuOggetti.split('+');
			for (var io = 0; io < mo.length; io++) {
				mo[io] = mo[io].split('@');
				if (mo[io][0] === '') { // Se non sono specificati oggetti è sottointeso che tutti quelli creati, vengono distrutti in questo contenitore
					for (var ios = 0; ios < po.length; ios++) {
						po[ios] = po[ios].split('@');
						var i_canc = oggetti[mo[io][1]][1].indexOf(po[ios][0]);
						if (i_canc != -1) {
							oggetti[mo[io][1]][1].splice(i_canc, 1);
							oggetti[mo[io][1]][2].splice(i_canc, 1);
						}
					}
				} else {
					var i_canc = oggetti[mo[io][1]][1].indexOf(mo[io][0]);
					if (i_canc != -1) {
						oggetti[mo[io][1]][1].splice(i_canc, 1);
						oggetti[mo[io][1]][2].splice(i_canc, 1);
					}
				}
			}
		}
		if (azione.variabili) imposta(azione.variabili);
		if (azione.audio) eseguiAudio(azione.audio);

		// Esegue le funzioni principali
		var ali = ''; if (azione.allineamento !== undefined) ali = stileAli(azione.allineamento);
		switch (azione.tipo) {
			case 'audio':
				eseguiAudio(azione.audio);
				break;
			case 'rispondi':
				var classi = '';
				if (!azione.mosse) {
					if (Azioni.bastaInvioInp === 0) {
						if (Azioni.invioInp == '') { // Serve alle scelte selezionabili che non derivano da un input genuino
							e_txt.innerHTML += '<p'+ali+' class="inviato">? ' + azione.input + '</p>';
						} else {
							e_txt.innerHTML += '<p'+ali+' class="inviato">? ' + Azioni.invioInp + '</p>';
						}
					} else {
						classi = ' class="br"';
					}
				}
				e_txt.innerHTML += '<p'+classi+ali+'>' + espandiContenitori(azione.output) + '</p>';
				break;
			case 'vai':
				switch (azione.scena) {
					case 0: scena(Scena.N); break;
					case -1: scena(Scena.P); break;
					case -2: scena(Scena.P2); break;
					default: scena(azione.scena); break;
				}
				break;
			case 'rispondiVai':
				document.getElementById('input').style.display = 'none';
				if (Azioni.bastaInvioInp === 0) e_txt.innerHTML += '<p class="inviato">? ' + Azioni.invioInp + '</p>';
				e_txt.innerHTML += '<p>' + azione.output + '</p>';
				aspettaVai(azione.ritardo, azione.scena);
				break;
		}
	}
}

/** Funzioni secondarie **/

function pronto() {
	var e_inp = document.getElementById('input');
	e_inp.focus();
	if (e_inp.value == '? ') e_inp.setSelectionRange(4, 4);
}
var press_concludi = function() {
	document.removeEventListener('keypress', press_concludi);
	document.removeEventListener('click', press_concludi);
	Scena.concludi();
}
var attesaVai = [];
var press_noAttesa = function() {
	document.removeEventListener('keypress', press_noAttesa);
	document.removeEventListener('click', press_noAttesa);	
	clearTimeout(attesaVai[0]);
	scena(attesaVai[1]);
	attesaVai = [];
}
function ramificaInput(str, alt) {
	if (alt === undefined) alt = 1;
	var inpLivelli = []; var i1; var i2; var i3;
	// Se 'str' contiene [|] o (|) dovrà essere arricchito con altre frasi per soddisfare tutte le articolazioni
	// Livello 1 (frasi)
	inpLivelli = Lingua.noDiacritici(str.toLowerCase()).split('|');
	// Livello 2 (parole)
	for (i1 = 0; i1 < inpLivelli.length; i1++) {
		inpLivelli[i1] = inpLivelli[i1].split(/(?: |'|’)+/);
	}
	if (alt == 2) {
		// Livello 3 (alternative di parole)
		for (i1 = 0; i1 < inpLivelli.length; i1++) {
			for (i2 = 0; i2 < inpLivelli[i1].length; i2++) {
				// Devo cercare la parola in tutte le parole equivalenti e aggiungere le alternative
				var parola = inpLivelli[i1][i2];
				for (i3 = 0; i3 < Lingua.equivalenze.length; i3++) {
					if (Lingua.equivalenze[i3].indexOf(parola) != -1) {
						if (typeof inpLivelli[i1][i2] === 'string') { // è ancora una singola parola
							inpLivelli[i1][i2] = Lingua.equivalenze[i3];
						} else { // è un array da concatenare
							inpLivelli[i1][i2].concat(Lingua.equivalenze[i3]);
						}
					}
				}
				if (typeof inpLivelli[i1][i2] === 'string') { // è ancora una singola parola
					inpLivelli[i1][i2] = [inpLivelli[i1][i2]]; // è un array con un elemento
				}
			}
		}
	}
	return inpLivelli;
}
function soddisfa(inp1, inp2) {
	// Verifica se l'input1 lineare soddisfa le condizioni dell'input2 con alternative
	// Livello 1 (frasi)
	for (var i1 = 0; i1 < inp2.length; i1++) {
		var p = 0;
		// Livello 2 (parole)
		for (var i2 = 0; i2 < inp2[i1].length; i2++) {
			var p_ok = 0;
			// Livello 3 (alternative di parole)
			if (inp2[i1][i2].indexOf(inp1[0][p]) != -1) p_ok = 1;
			if (p_ok === 0) {
				if (inp2[i1][i2].indexOf('') != -1) { continue; } else { break; }
			}
			p++;
			if (p == inp1[0].length && i2 == (inp2[i1].length - 1)) return true;
		}
	}
	return false;
}
function stileAli(ali) {
	switch(ali) {
		case 'giustificato': ali = ' style="text-align:justify;"'; break;
		case 'centrato': ali = ' style="text-align:center;"'; break;
		case 'destra': ali = ' style="text-align:right;"'; break;
		case 'sinistra': ali = ' style="text-align:left;"'; break;
	}
	return ali;
}
function imposta(elementi_str) {
	// elementi_str: può essere una serie di oggetti e/o variabili in formato stringa
	elementi = elementi_str.split('+');
	var presenza; var nome; var contenitore;
	for (var i = 0; i < elementi.length; i++) {
		// Se presente il cancelletto l'oggetto o la variabile vanno cancellati
		if (elementi[i].substr(0, 1) == '#') {
			presenza = 0;
			elementi[i] = elementi[i].substr(1); // Viene rimosso il cancelletto
		} else {
			presenza = 1;
		}
		if (elementi[i].indexOf('@') !== -1) { // Se contiene una chiocciola è un oggetto
			elementi[i] = elementi[i].split('@'); // Scomposizione oggetto@contenitore
			nome = elementi[i][0];
			contenitore = elementi[i][1];
			if (presenza == 1) {
				if (Storia.oggetti[contenitore] === undefined) {
					Storia.oggetti[contenitore] = [];
					Storia.oggetti[contenitore].push(0); // Contenitore dell'ambiente (predefinito) o del giocatore
					Storia.oggetti[contenitore].push([]); // Elenco oggetti con articolo determinativo (id)
					Storia.oggetti[contenitore].push([]); // Elenco oggetti con articolo indeterminativo
				}
				if (Storia.oggetti[contenitore][1].indexOf(nome) == -1) {
					Storia.oggetti[contenitore][1].push(nome);
					Storia.oggetti[contenitore][2].push(nome);
				}
			} else if (Storia.oggetti[contenitore] !== undefined) { // Se non esiste il contenitore, inutile cercarci un oggetto dentro per distruggerlo
				var i_canc = Storia.oggetti[contenitore][1].indexOf(nome);
				if (i_canc != -1) {
					Storia.oggetti[contenitore][1].splice(i_canc, 1);
					Storia.oggetti[contenitore][2].splice(i_canc, 1);
				}
			}
		} else { // Se non contiene una chiocciola è una variabile
			if (presenza == 1) {
				if (Storia.variabili[elementi[i]] === undefined) Storia.variabili[elementi[i]] = 1;
			} else {
				if (Storia.variabili[elementi[i]] !== undefined) delete Storia.variabili[elementi[i]];
			}
		}
	}
}
function contenitore(personale, nome, ogg_un, ogg_il) {
	// personale: indica il tipo di contenitore: 0 è dell'ambiente, 1 è del giocatore
	// nome: nome del contenitore che fa da chiave nell'array
	// ogg_il: elenco delle etichette degli oggetti contenuti con articolo determinativo, faranno da id dell'oggetto
	// ogg_un: elenco delle etichette degli oggetti contenuti con articolo indeterminativo
	if (Storia.oggetti[nome] !== undefined) return; // Il contenitore va creato solo la prima volta
	Storia.oggetti[nome] = [];
	Storia.oggetti[nome].push(personale);
	if (ogg_il === '') { Storia.oggetti[nome].push([]); } else { Storia.oggetti[nome].push(ogg_il.split('+')); }
	if (ogg_un === '') { Storia.oggetti[nome].push([]); } else { Storia.oggetti[nome].push(ogg_un.split('+')); }
}
function contenuto(nome) {
	// nome: nome del contenitore di cui visualizzare il contenuto
	
	if (Storia.oggetti[nome] === undefined) {
		return 'niente';
	} else {
		if (Storia.oggetti[nome][0] === 1) { // Contenitore del giocatore
			return Storia.oggetti[nome][2].join(', ');
		} else { // Contenitore dell'ambiente
			return Storia.oggetti[nome][1].join(', ');
		}
	}
}
function espandiContenitori(str) {
	var out = [];
	out = str.split('@');
	if (out.length < 3) return str;
	for (var i = 1; i < out.length; i++) {
		if (Storia.oggetti[out[i]] !== undefined) {
			out[i] = contenuto(out[i]); i++;
		} else {
			out[i] = '@' + out[i];
		}
	}
	return out.join('');
}
function x(str) {
	var ee = str.split('|');
	var n = Math.floor((Math.random() * ee.length) + 1);
	return ee[n];
}

/** Impostazioni scena (eseguite subito all'inizio) **/

function titolo(str) {
	if (Scena.N !== undefined) alert('Il titolo della storia va impostato nelle istruzioni generali. Dunque, rimuoverlo dalla scena '+Scena.N+'.');
	document.title = str;
}
function coloreSfondo(col) {
	if (col !== undefined) {
		document.getElementById('corpo').style.backgroundColor = col;
		document.getElementById('input').style.backgroundColor = col;
	}
}
function coloreTesto(col1, col2) {
	if (col1 !== undefined) {
		document.getElementById('corpo').style.color = col1;
		document.getElementById('input').style.color = col1;
	}
	if (col2 !== undefined) {
		Scena.stile.colTestoInviato = col2;
	}
}
function coloreScelte(col1, col2) {
	if (col1 !== undefined) {
		Scena.stile.colScelta = col2;
	}
	if (col2 !== undefined) {
		Scena.stile.colSelezione = col2;
	}
}
function coloreErrore(col) {
	Scena.stile.colErrore = col;
}
function carattereTesto(fnt, siz, ali) {
	var e_cor = document.getElementById('corpo');
	var e_inp = document.getElementById('input');
	if (fnt !== undefined) {
		e_cor.style.fontFamily = fnt;
		e_inp.style.fontFamily = fnt;
	}
	if (siz !== undefined) {
		e_cor.style.fontSize = siz + 'px';
		e_inp.style.fontSize = siz + 'px';
	}
	if (ali !== undefined) {
		switch(ali) {
			case 'giustificato': ali = 'justify'; break;
			case 'centrato': ali = 'center'; break;
			case 'destra': ali = 'right'; break;
			case 'sinistra': ali = 'left'; break;
		}
		document.getElementById('corpo').style.textAlign = ali;
		document.getElementById('testo').style.textAlign = ali;
	}
}
function audio(aud) {
	if (Scena.N === undefined) { alert('Il comando "audio()" non può essere usato nelle istruzioni generali. Eliminarlo!'); return; }
	
	// Gestione dell'ultimo blocco condizionato in relazione alle righe di istruzioni coinvolte
	var esegui = 0; var iUB = Condizioni.correntiBlocchi.length - 1;
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		if (Condizioni.verifica(Condizioni.correnti) === true) esegui = 1;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	} else { esegui = 1; }
	
	if (esegui == 1) document.getElementById('audio').innerHTML = '<audio id="fileAudio" src="' + aud + '"></audio>';
}
function immagine(img, w, h) {
	// img: nome dell'immagine da posizionare nella stessa cartella di 'INIZIA.html'
	// w, h: larghezza e altezza da impostare forzatamente
	if (img === undefined || img === '') return;

	// Gestione dell'ultimo blocco condizionato in relazione alle righe di istruzioni coinvolte
	var esegui = 0; var iUB = Condizioni.correntiBlocchi.length - 1;
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		if (Condizioni.verifica(Condizioni.correnti) === true) esegui = 1;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	} else { esegui = 1; }

	if (esegui == 1) {
		if (Scena.stile.immagini === undefined) Scena.stile.immagini = [];
		var id_img = 'img' + (Scena.stile.immagini.length + 1);
		Scena.stile.immagini.push(id_img);
		var e_txt = document.getElementById('testo');
		if (w === undefined) { w = ''; } else { w = ' width="'+w+'"'; }
		if (h === undefined) { h = ''; } else { h = ' height="'+h+'"'; }
		e_txt.innerHTML += '<img id="'+ id_img +'" style="display:block;" '+ w + h +' src="'+ img +'" />';
	}
}
function testo(txt, ali) {
	// txt: testo da visualizzare
	// ali: allineamento del testo (valori: "giustificato", "centrato", "destra", "sinistra")
	if (Scena.N === undefined) { alert('Il comando "testo()" non può essere usato nelle istruzioni generali. Eliminarlo!'); return; }
	
	// Gestione dell'ultimo blocco condizionato in relazione alle righe di istruzioni coinvolte
	var esegui = 0; var iUB = Condizioni.correntiBlocchi.length - 1;
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		if (Condizioni.verifica(Condizioni.correnti) === true) esegui = 1;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	} else { esegui = 1; }
	
	if (esegui == 1) {
		var e_txt = document.getElementById('testo');
		if (ali === undefined) { ali = ''; } else { ali = stileAli(ali); }
		e_txt.innerHTML += '<p'+ali+'>' + txt + '</p>';
	}
}
function oggetti(oggs) {
	// Gestione dell'ultimo blocco condizionato in relazione alle righe di istruzioni coinvolte
	var esegui = 0; var iUB = Condizioni.correntiBlocchi.length - 1;
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		if (Condizioni.verifica(Condizioni.correnti) === true) esegui = 1;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	} else { esegui = 1; }
	
	if (esegui == 1) imposta(oggs);
}
function variabili(vars) {
	// Gestione dell'ultimo blocco condizionato in relazione alle righe di istruzioni coinvolte
	var esegui = 0; var iUB = Condizioni.correntiBlocchi.length - 1;
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		if (Condizioni.verifica(Condizioni.correnti) === true) esegui = 1;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	} else { esegui = 1; }
	
	if (esegui == 1) imposta(vars);
}

/** Istruzioni scena (eseguite eventualmente dopo) **/

function condizioni(cond, istruzioni) {
	// str: stringa per specificare quali oggetti devono essere in certi contenitori e quali variabili si richiedono
	// formato stringa condizioni: [#]l'oggetto@contenitore+[#]nome variabile
	// istruzioni(): è la funzione per eseguire tutte le istruzioni condizionate
	// Devo tener traccia di ciascun blocco di condizioni, alla fine del blocco vanno svuotate, senza svuotare blocchi ancora non terminati

	var lastID = Condizioni.correntiBlocchi.length;
	Condizioni.correntiBlocchi.push({'seOggetti': [], 'seVariabili': []});

	var presenza;
	cond = cond.split('+'); // Elenco delle condizioni su oggetti e variabili
	for (var i = 0; i < cond.length; i++) {
		// Stabilire se si tratta di un oggetto o una variabile
		if (cond[i].indexOf('@') !== -1) { // Se contiene una chiocciola è un oggetto
			if (cond[i].substr(0, 1) == '#') {
				presenza = 0;
				cond[i] = cond[i].substr(1);
			} else {
				presenza = 1;
			}
			cond[i] = cond[i].split('@'); // Scomposizione oggetto@contenitore
			Condizioni.correntiBlocchi[lastID].seOggetti.push({'presenza': presenza, 'nome': cond[i][0], 'contenitore': cond[i][1]});
		} else { // Se non contiene una chiocciola è una variabile
			if (cond[i].substr(0, 1) == '#') {
				presenza = 0;
				cond[i] = cond[i].substr(1);
			} else {
				presenza = 1;
			}
			Condizioni.correntiBlocchi[lastID].seVariabili.push({'presenza': presenza, 'nome': cond[i]});
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
function intermezzo(txt) {
	if (Scena.stile.intermezzo === undefined) Scena.stile.intermezzo = [];
	
	// Gestione dell'ultimo blocco condizionato in relazione alle righe di istruzioni coinvolte
	var esegui = 0; var iUB = Condizioni.correntiBlocchi.length - 1;
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		if (Condizioni.verifica(Condizioni.correnti) === true) esegui = 1;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	} else { esegui = 1; }

	if (esegui == 1) Scena.stile.intermezzo.push(txt);
}
function luogoVisitato(nome, gruppo) {
	// nome: nome del luogo da visualizzare dopo i punti cardinali
	// gruppo: utile per raccogliere più luoghi in un unico gruppo (funzione non ancora supportata)
	if (Scena.N === undefined) { alert('È vietato usare il comando "luogoVisitato()" nelle istruzioni generali. Eliminarlo!'); return; }
	if (Storia.luoghiRaggiungibili[Scena.N] === undefined) {
		Storia.luoghiRaggiungibili[Scena.N] = {};
		Storia.luoghiRaggiungibili[Scena.N].nome = nome; // Se non impostato sarà 'undefined'
		Storia.luoghiRaggiungibili[Scena.N].visitato = 1;
	}
	if (gruppo !== undefined) Storia.luoghiRaggiungibili[Scena.N].gruppo = gruppo;
}
function cancellaDirezione(nome) {
	// nome: luogo da cancellare dai luoghi raggiungibili
	for (var key in Storia.luoghiRaggiungibili) {
		if (Storia.luoghiRaggiungibili[key].nome == nome) delete Storia.luoghiRaggiungibili[key];
	}
}
function cancellaDirezioni(gruppo) {
	// gruppo: gruppo di luoghi da cancellare dai luoghi raggiungibili
	if (gruppo === undefined) { Storia.luoghiRaggiungibili = {}; return; } // Se non si specifica un gruppo cancella tutte le direzioni
	for (var key in Storia.luoghiRaggiungibili) {
		if (Storia.luoghiRaggiungibili[key].gruppo == gruppo) delete Storia.luoghiRaggiungibili[key];
	}
}
function uscita(txt_in, nS, mostra, destinazione) {
	// txt_in: input dell'utente
	// nS: numero della scena verso cui andare
	// mostra: opzioni di visibilità dell'uscita
	// destinazione: il nome della destinazione, serve se deve esser visibile il nome prima dell'esplorazione
	if (mostra === undefined) mostra = 2;
	Azioni.crea();
	Azioni.valore('tipo', 'vai');
	Azioni.valore('scena', nS);
	/*switch (mostra) {
		case 0: // 0: invisibile sempre
			break;
		case 1: // 1: visibile se esplorata (nome ignorato)
			break;
		case 2: // 2: visibile sempre (nome se esplorata)
			break;
		case 3: // 3: visibile sempre (nome ignorato)
			break;
		case 4: // 4: visibile sempre e con nome
			break;
	}*/
	var parte2 = '';
	if (mostra > 0 && Scena.N !== undefined) {
		if (mostra > 1 || (Storia.luoghiRaggiungibili[nS] !== undefined && Storia.luoghiRaggiungibili[nS].visitato !== undefined)) {
			if (mostra == 3 || (Storia.luoghiRaggiungibili[nS] !== undefined && Storia.luoghiRaggiungibili[nS].visitato !== undefined)) {
				if (Storia.luoghiRaggiungibili[nS].nome !== undefined) {
					parte2 = ' ' + Storia.luoghiRaggiungibili[nS].nome.split('|')[0];
					Azioni.valore('input', txt_in+'|'+Storia.luoghiRaggiungibili[nS].nome);
				}
				if ((parte2 == '' || parte2 == ' ') && Storia.luoghiRaggiungibili[nS] !== undefined && Storia.luoghiRaggiungibili[nS].visitato == 1) parte2 = ' (esplorato)';
			}
			Scena.usciteVisibili += ', <a class="scelta" onclick="simulaInput(\''+txt_in.split('|')[0]+'\')">' + txt_in.split('|')[0] + '</a>' + parte2;
		}
	}
	if (Azioni.ultimaLeggi('input') === undefined) Azioni.valore('input', txt_in);
	Azioni.valore('input', ramificaInput(Azioni.ultimaLeggi('input'), 2));

	var L; // livello delle azioni (generale o scena)
	if (Scena.N === undefined) { L = 'generale'; } else { L = 'scena'; Scena.stile.scrittura = 1; }

	// Aggiungi condizioni correnti
	var iUB = Condizioni.correntiBlocchi.length - 1; // iUB: indice ultimo blocco
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		var iUA = Azioni[L].length - 1; // iUA: indice ultima azione
		Azioni[L][iUA]['seOggetti'] = Condizioni.correnti.seOggetti;
		Azioni[L][iUA]['seVariabili'] = Condizioni.correnti.seVariabili;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	}
}
function rispondi(txt_in, txt_out) {
	// txt_in: input dell'utente
	// txt_out: risposta ricevuta
	txt_in = Lingua.noDiacritici(txt_in.toLowerCase());
	Azioni.crea();
	Azioni.valore('tipo', 'rispondi');
	Azioni.valore('input', ramificaInput(txt_in, 2));
	Azioni.valore('output', txt_out);

	var L; // livello delle azioni (generale o scena)
	if (Scena.N === undefined) { L = 'generale'; } else { L = 'scena'; Scena.stile.scrittura = 1; }

	// Aggiungi condizioni correnti
	var iUB = Condizioni.correntiBlocchi.length - 1; // iUB: indice ultimo blocco
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		var iUA = Azioni[L].length - 1; // iUA: indice ultima azione
		Azioni[L][iUA]['seOggetti'] = Condizioni.correnti.seOggetti;
		Azioni[L][iUA]['seVariabili'] = Condizioni.correnti.seVariabili;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	}
}
function aspettaVai(rit, nS) {
	// rit: ritardo in millisecondi prima di andare ad una scena
	// nS: numero della scena verso cui andare
	Scena.stile.scrittura = 0;
	setTimeout(function(){ document.addEventListener('keypress', press_noAttesa); document.addEventListener('click', press_noAttesa); }, 200);
	attesaVai[0] = setTimeout(function() { scena(nS); }, rit);
	attesaVai[1] = nS;
}
function rispondiVai(txt_in, txt_out, nS, rit) {
	// txt_in: input dell'utente
	// txt_out: risposta momentanea da lasciare
	// nS: numero della scena verso cui andare
	// rit: ritardo in millisecondi prima di andare ad una scena
	txt_in = Lingua.noDiacritici(txt_in.toLowerCase());
	if (rit === undefined) rit = txt_out.length * 100;
	Azioni.crea();
	Azioni.valore('tipo', 'rispondiVai');
	Azioni.valore('input', ramificaInput(txt_in, 2));
	Azioni.valore('output', txt_out);
	Azioni.valore('scena', nS);
	Azioni.valore('ritardo', rit);

	var L; // livello delle azioni (generale o scena)
	if (Scena.N === undefined) { L = 'generale'; } else { L = 'scena'; Scena.stile.scrittura = 1; }

	var iUB = Condizioni.correntiBlocchi.length - 1; // iUB: indice ultimo blocco
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		var iUA = Azioni[L].length - 1; // iUA: indice ultima azione
		Azioni[L][iUA]['seOggetti'] = Condizioni.correnti.seOggetti;
		Azioni[L][iUA]['seVariabili'] = Condizioni.correnti.seVariabili;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	}
}
function nMosseVai(mosse, nS, rip) {
	// mosse: numero mosse del giocatore per far scattare l'evento
	// nS: numero della scena verso cui andare
	// rip: se non specificato sarà 1, ovvero dopo n mosse riparte il ciclo, 0 per non ripeterlo
	Azioni.crea();
	Azioni.valore('mosse', mosse);
	Azioni.valore('mossa', 0);
	Azioni.valore('tipo', 'vai');
	Azioni.valore('scena', nS);
	if (rip === undefined) rip = 1; // nMosse appena termina viene ripetuto come impostazione predefinita
	Azioni.valore('ripeti', rip);

	var L; // livello delle azioni (generale o scena)
	if (Scena.N === undefined) { L = 'generale'; } else { L = 'scena'; Scena.stile.scrittura = 1; }

	var iUB = Condizioni.correntiBlocchi.length - 1; // iUB: indice ultimo blocco
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		var iUA = Azioni[L].length - 1; // iUA: indice ultima azione
		Azioni[L][iUA]['seOggetti'] = Condizioni.correnti.seOggetti;
		Azioni[L][iUA]['seVariabili'] = Condizioni.correnti.seVariabili;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	}
}
function nMosseRispondi(mosse, txt_out, rip) {
	// mosse: numero mosse del giocatore per far scattare l'evento
	// txt_out: testo che deve comparire dopo n mosse
	// rip: se non specificato sarà 1, ovvero dopo n mosse riparte il ciclo, 0 per non ripeterlo
	Azioni.crea();
	Azioni.valore('mosse', mosse);
	Azioni.valore('mossa', 0);
	Azioni.valore('tipo', 'rispondi');
	Azioni.valore('output', txt_out);
	if (rip === undefined) rip = 1; // nMosse appena termina viene ripetuto come impostazione predefinita
	Azioni.valore('ripeti', rip);

	var L; // livello delle azioni (generale o scena)
	if (Scena.N === undefined) { L = 'generale'; } else { L = 'scena'; Scena.stile.scrittura = 1; }

	var iUB = Condizioni.correntiBlocchi.length - 1; // iUB: indice ultimo blocco
	if (Condizioni.righeCoinvolte[iUB] > 0) {
		var iUA = Azioni[L].length - 1; // iUA: indice ultima azione
		Azioni[L][iUA]['seOggetti'] = Condizioni.correnti.seOggetti;
		Azioni[L][iUA]['seVariabili'] = Condizioni.correnti.seVariabili;
		if (Condizioni.righeCoinvolte[iUB] == 1) Condizioni.popUltimoBlocco();
	}
}
function simulaInput(inp, opz) {
	document.getElementById('input').value = '? ' + inp;
	Scena.controllaInput(opz); // Se opz è undefined va bene lo stesso
}
function scegliVai(txt, nS, ali) {
	// txt: testo della scelta selezionabile
	// nS: numero della scena verso cui andare
	// ali: allineamento del testo (valori: "giustificato", "centrato", "destra", "sinistra")
	if (ali !== undefined) { ali = stileAli(ali); } else { ali = ''; }
	document.getElementById('scelte').innerHTML += '<p class="scelta" '+ ali +' onclick="Scena.vai('+nS+')">' + txt + '</p>';
}
function scegliRispondi(txt, txt_out, ali1, ali2) {
	// txt: testo della scelta selezionabile (se txt_out = "" allora txt verrà trattato come un input dell'utente)
	// txt_out: testo stampato dopo aver cliccato sulla scelta
	// ali1: allineamento del testo della scelta selezionabile
	// ali2: allineamento del testo stampato in risposta
	if (ali1 !== undefined) { ali1 = stileAli(ali1); } else { ali1 = ''; }
	if (txt_out !== undefined && txt_out !== '') { // txt va trattato come un input dell'utente
		var azione = {};
		azione['tipo'] = 'rispondi';
		azione['input'] = txt.replace(/'/g, '"');
		azione['output'] = txt_out.replace(/'/g, '"');
		if (ali2 !== undefined) azione['allineamento'] = ali2;
		document.getElementById('scelte').innerHTML += '<p class="scelta" ' + ali1 + ' onclick="Azioni.esegui('+JSON.stringify(azione).replace(/"/g, '\'')+'); this.style.display = \'none\';">' + txt + '</p>';
	} else {
		if (ali2 !== undefined) { ali2 = ', {\'outAli\':\''+ali2+'\'}'; } else { ali2 = ''; }
		txt =  txt.replace(/'/g, '"').replace(/"/g, '\'');
		document.getElementById('scelte').innerHTML += '<p class="scelta" ' + ali1 + ' onclick="simulaInput(\''+txt+'\''+ali2+'); this.style.display = \'none\';">' + txt + '</p>';
	}
}
function _oggetti(ogg_in, ogg_out) {
	if (ogg_in !== undefined) Azioni.valore('piuOggetti', Lingua.noDiacritici(ogg_in.toLowerCase()));
	if (ogg_out !== undefined) Azioni.valore('menoOggetti', Lingua.noDiacritici(ogg_out.toLowerCase()));
}
function _variabili(vars) {
	Azioni.valore('variabili', vars.toLowerCase());
}
function _audio(aud) {
	Azioni.valore('audio', aud);
}
function _immagine(img, w, h) {
	Azioni.valore('immagine', img);
	if (w !== undefined) Azioni.valore('imgW', w);
	if (h !== undefined) Azioni.valore('imgH', h);
}