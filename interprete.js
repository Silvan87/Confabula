var stileBase = {};
var oggetti = []; var variabili = []; var direzioni = {};
var uVisibili = ''; /*uscite visibili*/ var direzioniBloccate = 0; /*blocca le direzioni se non ci sono uscite visibili*/
var intermezzoAzione = []; // Uno o piú testi che compaiono prima di aprire una scena

var Scena = {
	N: 1, /*numero scena corrente*/
	P: 1, /*numero precedente scena*/
	stile: {} // Qui si salveranno gli aspetti della scena che sovrascrivono lo stile base
};

var Azioni = {
	generali: [],
	scena: [],
	invioInp: '',
	bastaInvInp: 0,
	crea: function() {
		if (Scena.N === 0) { this.generali.push({}); } else { this.scena.push({}); }
	},
	valore: function(p/*proprietà*/, v/*valore*/) {
		if (Scena.N === 0) {
			Azioni.generali[Azioni.generali.length - 1][p] = v;
		} else {
			Azioni.scena[Azioni.scena.length - 1][p] = v;
		}
	},
	arrayValore: function(a/*nome array*/, v/*valore*/) {
		var ultima;
		if (Scena.N === 0) {
			ultima = Azioni.generali.length - 1;
			if (Azioni.generali[ultima][a] === undefined) Azioni.generali[ultima][a] = [];
			Azioni.generali[ultima][a].push(v);
		} else {
			ultima = Azioni.scena.length - 1;
			if (Azioni.scena[ultima][a] === undefined) Azioni.scena[ultima][a] = [];
			Azioni.scena[ultima][a].push(v);
		}
	},
	leggiUltima: function(p/*proprietà*/) {
		if (Scena.N === 0) {
			return Azioni.generali[Azioni.generali.length - 1][p];
		} else {
			return Azioni.scena[Azioni.scena.length - 1][p];
		}
	},
	esegui: function(azione, idS/*id scelta*/) {
		if (azione == 'S') {
			// Individua l'azione chiamata dalla scelta
			for (var ia = 0; ia < Azioni.scena.length; ia++) {
				if (Azioni.scena[ia].scelta == idS) {
					azione = Azioni.scena[ia];
					Azioni.invioInp = azione.input;
					break;
				}
			}
		}
		var e_des = document.getElementById('descrizione');

		// Controlla se ci sono funzioni _agganciate a quella principale
		if (azione.immagine) {
			e_des.innerHTML += '<img src="" />';
			nImm = e_des.getElementsByTagName('img').length;
			var e_imm = e_des.getElementsByTagName('img')[nImm - 1];
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
			mo = azione.menoOggetti.split('|');
			var po = azione.piuOggetti.split('|');
			for (var io = 0; io < mo.length; io++) {
				mo[io] = mo[io].split('@');
				if (mo[io][0] === '') { // Se non sono specificati oggetti è sottointeso che tutti quelli creati, vengono distrutti in questo contenitore
					for (var ios = 0; ios < po.length; ios++) {
						po[ios] = po[ios].split('@');
						var i_canc = oggetti[mo[io][1]][0].indexOf(po[ios][0]);
						if (i_canc != -1) {
							oggetti[mo[io][1]][0].splice(i_canc, 1);
							if (oggetti[mo[io][1]][1] != 'mio') {
								oggetti[mo[io][1]][1].splice(i_canc, 1);
							}
						}
					}
				} else {
					var i_canc = oggetti[mo[io][1]][0].indexOf(mo[io][0]);
					if (i_canc != -1) {
						oggetti[mo[io][1]][0].splice(i_canc, 1);
						if (oggetti[mo[io][1]][1] != 'mio') {
							oggetti[mo[io][1]][1].splice(i_canc, 1);
						}
					}
				}
			}
		}
		if (azione.variabili) imposta(azione.variabili);
		if (azione.audio) eseguiAudio(azione.audio);

		// Esegue le funzioni principali
		var ali = ''; if (azione.allineamento !== undefined) ali = stileAli(azione.allineamento);
		switch (azione.tipo) {
			case 'testo':
				if (uVisibili === '') {
					e_des.innerHTML += '<p'+ali+'>' + azione.testo + '</p>';
				} else {
					e_des.innerHTML += '<p'+ali+'>' + azione.testo + '<br />Uscite visibili: ' + uVisibili.substr(1) + '.</p>';
					uVisibili = ''; direzioniBloccate = 0;
				}
				break;
			case 'audio':
				eseguiAudio(azione.audio);
				break;
			case 'rispondi':
				var classi = '';
				if (!azione.passi) {
					if (Azioni.bastaInvInp === 0) {
						e_des.innerHTML += '<p'+ali+' class="inviato">? ' + Azioni.invioInp + '</p>';
					} else {
						classi = ' class="br"';
					}
				}
				e_des.innerHTML += '<p'+classi+ali+'>' + espandiContenitori(azione.output) + '</p>';
				break;
			case 'vai':
				if (azione.intermezzo !== undefined) intermezzoAzione = azione.intermezzo;
				if (azione.scena == -1) { scena(Scena.N); } else if (azione.scena == -2) { scena(Scena.P); } else { scena(azione.scena); }
				return;
			case 'rispondiVai':
				if (azione.intermezzo !== undefined) intermezzoAzione = azione.intermezzo;
				document.getElementById('input').style.display = 'none';
				if (Azioni.bastaInvInp === 0) e_des.innerHTML += '<p class="inviato">? ' + Azioni.invioInp + '</p>';
				e_des.innerHTML += '<p>' + azione.output + '</p>';
				aspettaVai(azione.ritardo, azione.scena);
				break;
		}
	},
	controlla: function(opzioni) { // Se non ci sono condizioni o sono soddisfate, eseguirà subito l'azione
		if (opzioni === undefined) opzioni = {}; /* Questo semplifica i controlli delle proprietà assenti */
		var e_inp = document.getElementById('input');
		var inp = e_inp.value.trim(); if (inp.charAt(0) == '?') inp = inp.substr(1).trim();
		Azioni.invioInp = inp;
		// Controlla prima le azioni di scena e poi quelle generali
		var gruppo = 'scena';
		var azione;
		for (var a = 0; a < 2; a++) {
			if (a == 1) gruppo = 'generali';
			for (var ia = 0; ia < Azioni[gruppo].length; ia++) {
				azione = Azioni[gruppo][ia];
				// Se è una scelta, non è soggetta a condizioni e va sempre saltata, si esegue con un click
				// Se è un'azione ritardata (n. passi) viene gestita in modo speciale piú avanti
				if (azione.scelta || azione.passi) continue;
				// Controlla se l'input soddisfa questa azione
				if (azione.input !== undefined) {
					if (inp === '') { e_inp.value = '? '; continue; } else { inp = noDiacritici(inp.toLowerCase()); }
					// Ci sono alcuni input speciali che fanno parte dell'interprete
					if (inp == 'vocabolario' || inp == 'v') {
						azione = {};
						azione.tipo = 'rispondi';
						azione.output = Parole.inizio.join(', ');
					} else if (((inp == 'direzioni' || inp == 'd' || inp == 'direzione') || (inp.split(' ')[0] == 'direzione' || inp.split(' ')[0] == 'd')) && direzioniBloccate === 1) {
						azione = {};
						azione.tipo = 'rispondi';
						azione.output = 'Ora non puoi dirigerti velocemente in nessun luogo.';
					} else if ((inp == 'direzioni' || inp == 'd' || inp == 'direzione') && direzioniBloccate === 0) {
						azione = {};
						azione.tipo = 'rispondi';
						var luoghi = '';
						if (direzioni !== undefined && direzioni[Scena.N].d !== 0) {
							for (var key in direzioni) {
								if (direzioni[key].d !== 0 && key != Scena.N && direzioni[key].nome !== undefined) {
									if (luoghi !== '') luoghi += ', ';
									luoghi += direzioni[key].nome.split('|')[0];
								}
							}
						}
						if (luoghi === '') {
							azione.output = 'Devi prima esplorare qualche luogo per poterlo raggiungere velocemente.';
						} else {
							azione.output = 'Luoghi raggiungibili: '+luoghi+'.';
						}
					} else if ((inp.split(' ')[0] == 'direzione' || inp.split(' ')[0] == 'd') && direzioniBloccate === 0) {
						if (direzioni === undefined || direzioni[Scena.N].d === 0) {
							azione = {};
							azione.tipo = 'rispondi';
							azione.output = 'Non puoi dirigerti velocemente in nessun luogo per ora.';
						} else {
							var inizio = inp.split(' ')[0].length + 1;
							for (var key in direzioni) {
								if (direzioni[key].d !== 0 && key != Scena.N && direzioni[key].nome !== undefined && direzioni[key].nome.split('|').indexOf(inp.substr(inizio)) != -1) {
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
				var soddisfatto = 1;
				// Controlla le condizioni sugli oggetti
				if (azione.seOggetti !== undefined) {
					for (var i = 0; i < azione.seOggetti.length; i++) {
						if (oggetti[azione.seOggetti[i].contenitore] === undefined ||
							oggetti[azione.seOggetti[i].contenitore][0].indexOf(azione.seOggetti[i].nome) == -1) { // Oggetto assente
							if (azione.seOggetti[i].presenza == 1) { // L'oggetto dovrebbe essere presente
								soddisfatto = 0; break;
							}
						} else { // Oggetto presente
							if (azione.seOggetti[i].presenza === 0) { // L'oggetto dovrebbe essere assente
								soddisfatto = 0; break;
							}
						}
					}
					if (soddisfatto === 0) {
						// Se alla prima occasione testo e audio non sono eseguibili rimuovili
						if (azione.tipo == 'testo' || azione.tipo == 'audio') { Azioni.scena.splice(ia, 1); ia--; }
						continue;
					}
				}
				// Controlla le condizioni sulle variabili
				if (azione.seVariabili !== undefined) {
					for (var i = 0; i < azione.seVariabili.length; i++) {
						if (variabili[azione.seVariabili[i].nome] === undefined) { // Variabile non esiste
							if (azione.seVariabili[i].presenza == 1) { // La variabile dovrebbe esistere
								soddisfatto = 0; break;
							}
						} else { // Variabile esiste
							if (azione.seVariabili[i].presenza === 0) { // La variabile non dovrebbe esistere
								soddisfatto = 0; break;
							}
						}
					}
					if (soddisfatto === 0) {
						// Se alla prima occasione testo e audio non sono eseguibili rimuovili
						if (azione.tipo == 'testo' || azione.tipo == 'audio') { Azioni.scena.splice(ia, 1); ia--; }
						continue;
					}
				}
				// Se arriva qui o non c'erano condizioni o sono state soddisfatte
				if (opzioni.outAli !== undefined) azione.allineamento = opzioni.outAli;
				// Le azioni di preparazione della scena vanno distrutte appena eseguite
				if (gruppo == 'scena') { if (azione.tipo == 'testo' || azione.tipo == 'audio') { Azioni.scena.splice(ia, 1); ia--; } }
				e_inp.value = '? '; // È segno che almeno un'azione è stata eseguita (piú sicuro metterlo prima dell'azione)
				Azioni.esegui(azione);
				if (!azione.prosegui) break;
				Azioni.bastaInvInp = 1;
			}
			if (e_inp.value == '? ' && !azione.prosegui) break;
		}
		Azioni.bastaInvInp = 0; // Finito un ciclo di controllo per tutte le azioni, va ripristinato
		// Se arriva qui nessuna condizione è stata soddisfatta oppure una o piú azioni sono state eseguite
		if (e_inp.value != '? ') { // Nessuna azione è stata eseguita
			e_inp.readOnly = true;
			var cE = '';
			if (stileBase.colErrore !== undefined) cE = stileBase.colErrore;
			if (Scena.stile.colErrore !== undefined && Scena.stile.colErrore !== '') cE = Scena.stile.colErrore;
			if (cE === '') { e_inp.className = 'errore'; } else { e_inp.style.color = cE; }
			e_inp.value = 'Prova qualcos\'altro...';
			setTimeout(function() { e_inp.value = '? '; e_inp.className = ''; e_inp.style.color = ''; e_inp.readOnly = false; }, 1000);
			// Dovrei aggiungere la caratteristica che se si inizia a scrivere è subito pronto e non perde le battute (document keydown)
		}
		// Gestione speciale delle azioni ritardate
		gruppo = 'scena';
		azione = {};
		for (a = 0; a < 2; a++) {
			if (a == 1) gruppo = 'generali';
			for (ia = 0; ia < Azioni[gruppo].length; ia++) {
				azione = Azioni[gruppo][ia];
				if (!azione.passi) continue; // Le azioni non ritardate le ignoro, dato che sono state gestite prima
				if (opzioni.inizioScena) continue; // Ad inizio scena non conto il passo, dato che per arrivarci segna già un passo
				var soddisfatto = 1;
				// Controlla le condizioni sugli oggetti
				if (azione.seOggetti !== undefined) {
					for (var i = 0; i < azione.seOggetti.length; i++) {
						if (oggetti[azione.seOggetti[i].contenitore] === undefined ||
							oggetti[azione.seOggetti[i].contenitore][0].indexOf(azione.seOggetti[i].nome) == -1) { // Oggetto assente
							if (azione.seOggetti[i].presenza == 1) { // L'oggetto dovrebbe essere presente
								soddisfatto = 0; break;
							}
						} else { // Oggetto presente
							if (azione.seOggetti[i].presenza === 0) { // L'oggetto dovrebbe essere assente
								soddisfatto = 0; break;
							}
						}
					}
					if (soddisfatto === 0) {
						Azioni[gruppo][ia].passo = 0;
						continue;
					}
				}
				// Controlla le condizioni sulle variabili
				if (azione.seVariabili !== undefined) {
					for (var i = 0; i < azione.seVariabili.length; i++) {
						if (variabili[azione.seVariabili[i].nome] === undefined) { // Variabile non esiste
							if (azione.seVariabili[i].presenza == 1) { // La variabile dovrebbe esistere
								soddisfatto = 0; break;
							}
						} else { // Variabile esiste
							if (azione.seVariabili[i].presenza === 0) { // La variabile non dovrebbe esistere
								soddisfatto = 0; break;
							}
						}
					}
					if (soddisfatto === 0) {
						Azioni[gruppo][ia].passo = 0;
						continue;
					}
				}
				// Se arriva qui o non c'erano condizioni o sono state soddisfatte
				Azioni[gruppo][ia].passo++;
				if (Azioni[gruppo][ia].passo == azione.passi + 1) {
					Azioni[gruppo][ia].passo = 0;
					if (azione.ripeti == 1) Azioni[gruppo].splice(ia, 1); ia--;
					Azioni.esegui(azione);
				}
			}
		}
		// Scorri il contenuto fino ad arrivare in fondo
		window.scroll(0, window.innerHeight + window.pageYOffset);
	}
};

/** Gestione delle parole **/
 
var Parole = {
	inizio: [], /*predicati ad inizio frase per interagire con gli oggetti*/
	eq: [] /*liste di parole equivalenti*/
};

// Mappa per sostituire le vocali accentate in vocali non accentate (lingua italiana)
var mappaDiacritici_it = [
	{'base':'a', 'letters':/[\u00E0\u00E1]/g},
	{'base':'e', 'letters':/[\u00E8\u00E9]/g},
	{'base':'i', 'letters':/[\u00EC\u00ED]/g},
	{'base':'o', 'letters':/[\u00F2\u00F3]/g},
	{'base':'u','letters':/[\u00F9\u00FA]/g}
];
var sostituzioni;

function noDiacritici(str) {
	// La stringa 'str' DEVE essere già in caratteri minuscoli, altrimenti non avverranno le sostituzioni
	if (!sostituzioni) sostituzioni = mappaDiacritici_it;
	for (var i = 0; i < sostituzioni.length; i++) {
		str = str.replace(sostituzioni[i].letters, sostituzioni[i].base);
	}
	return str;
}
function predicati(str) {
	Parole.inizio = str.toLowerCase().split('|').sort();
}

/** Funzioni principali **/

function azzeraMemoria() {
	if (Parole.inizio.length === 0) vocabolario();
	oggetti = []; variabili = [];
	uVisibili = ''; direzioni = {};
	Azioni.generali = [];
}
function svuota() {
	document.getElementById('audio').innerHTML = '';
	document.getElementById('scelte').style.display = 'none';
	document.getElementById('scelte').innerHTML = '';
	document.getElementById('input').style.display = 'none';
	document.getElementById('input').value = '? ';
	document.getElementById('descrizione').innerHTML = '';
	uVisibili = ''; direzioniBloccate = 1;
	Azioni.scena = [];
	Scena.stile = {};
	if (intermezzoAzione.length > 0) { Scena.stile.intermezzo = intermezzoAzione; intermezzoAzione = []; }
	coloreSfondo(stileBase.colSfondo);
	coloreTesto(stileBase.colTesto, stileBase.colTestoInviato);
	carattereTesto(stileBase.testoCarattere, stileBase.testoGrandezza, stileBase.testoAllineamento);
	coloreScelte(stileBase.colScelta, stileBase.colSelezione);
	coloreErrore(stileBase.colErrore);
}
function avvia(n) {
	document.removeEventListener('keypress', press_noAttesa);
	document.removeEventListener('click', press_noAttesa);
	if (n == 1) { azzeraMemoria(); Scena.N = 0; baseScene(); Scena.N = 1; }
	Scena.P = Scena.N; Scena.N = n; svuota();
}
function concludi() {
	var e_des = document.getElementById('descrizione');
	// Se c'è un intermezzo, mostra prima quello finché non si preme un tasto
	if (Scena.stile.intermezzo !== undefined) {
		if (Scena.stile.intermezzo.length > 0) {
			e_des.innerHTML = '<p>'+Scena.stile.intermezzo[0]+'</p>';
			Scena.stile.intermezzo.splice(0, 1);
			setTimeout(function(){ document.addEventListener('keypress', press_concludi); document.addEventListener('click', press_concludi); }, 200);
			return;
		} else if (Scena.stile.intermezzo.length === 0) {
			e_des.innerHTML = '';
			delete Scena.stile.intermezzo;
			setTimeout(concludi, 50);
			return;
		}
	}
	// Se c'è un'immagine da caricare, prepara il posto in cui apparirà
	if (Scena.stile.imgAttendi == 1) {
		e_des.innerHTML = '<img src="" />';
		nImm = e_des.getElementsByTagName('img').length;
		var e_imm = e_des.getElementsByTagName('img')[nImm - 1];
		e_imm.style.visibility = 'hidden';
		e_imm.style.display = 'block';
		if (Scena.stile.imgW !== undefined) e_imm.width = Scena.stile.imgW;
		if (Scena.stile.imgH !== undefined) e_imm.height = Scena.stile.imgH;
		e_imm.src = Scena.stile.img;
		Scena.stile.imgAttendi = 2;
	}
	// Se l'immagine è stata caricata, allora mostrala, altrimenti aspetta
	if (Scena.stile.imgAttendi == 2) {
		nImm = e_des.getElementsByTagName('img').length;
		var e_imm = e_des.getElementsByTagName('img')[nImm - 1];
		if (e_imm.naturalWidth !== 0 && e_imm.complete !== false) {
			delete Scena.stile.imgAttendi;
			e_imm.style.visibility = 'visible';
		} else {
			if (Scena.stile.tentativi === undefined) Scena.stile.tentativi = 0;
			Scena.stile.tentativi++;
			if (Scena.stile.tentativi > 400) {
				alert('L\'immagine impiega troppo tempo per essere caricata, forse il nome di richiamo o del file sono errati. Controllare la scena '+Scena.N+'.');
				delete Scena.stile.tentativi;
				delete Scena.stile.imgAttendi;
			} else {
				setTimeout(concludi, 100);
				return;
			}
		}
	}
	// Se l'immagine è pronta o non c'era, mostra tutto il resto della scena
	if (Scena.stile.imgAttendi === undefined) {
		if (Scena.stile.scrittura == 1) document.getElementById('input').style.display = 'block';
		document.getElementById('scelte').style.display = 'block';
		Azioni.controlla({'inizioScena': 1});
		pronto();
	}
}
function eseguiAudio(aud) {
	var e_aud = document.getElementById('audio');
	e_aud.innerHTML = '<audio src="' + aud + '" autoplay="autoplay"></audio>';
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
	concludi();
};
var attesaVai = [];
var press_noAttesa = function() {
	document.removeEventListener('keypress', press_noAttesa);
	document.removeEventListener('click', press_noAttesa);	
	clearTimeout(attesaVai[0]);
	scena(attesaVai[1]);
	attesaVai = [];
};
function ramificaInput(str, alt) {
	if (alt === undefined) alt = 1;
	var inpLivelli = []; var i1; var i2; var i3;
	// Se 'str' contiene [|] o (|) dovrà essere arricchito con altre frasi per soddisfare tutte le articolazioni
	// Livello 1 (frasi)
	inpLivelli = noDiacritici(str.toLowerCase()).split('|');
	// Livello 2 (parole)
	for (i1 = 0; i1 < inpLivelli.length; i1++) {
		inpLivelli[i1] = inpLivelli[i1].split(/(?: |')+/);
	}
	if (alt == 2) {
		// Livello 3 (alternative di parole)
		for (i1 = 0; i1 < inpLivelli.length; i1++) {
			for (i2 = 0; i2 < inpLivelli[i1].length; i2++) {
				// Devo cercare la parola in tutte le parole equivalenti e aggiungere le alternative
				var parola = inpLivelli[i1][i2];
				for (i3 = 0; i3 < Parole.eq.length; i3++) {
					if (Parole.eq[i3].indexOf(parola) != -1) {
						if (typeof inpLivelli[i1][i2] === 'string') { // è ancora una singola parola
							inpLivelli[i1][i2] = Parole.eq[i3];
						} else { // è un array da concatenare
							inpLivelli[i1][i2].concat(Parole.eq[i3]);
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
function contenitore(nome, obj_il, obj_un) {
	if (oggetti[nome] !== undefined) return; // Il contenitore va creato solo la prima volta
	oggetti[nome] = [];
	if (obj_il === undefined || obj_il === '') { oggetti[nome][0] = []; } else { oggetti[nome][0] = obj_il.split('|'); }
	if (obj_un == 'mio') {
		oggetti[nome][1] = 'mio';
	} else if (obj_un === undefined || obj_un === '') {
		oggetti[nome][1] = [];
	} else {
		oggetti[nome][1] = obj_un.split('|');
	}
}
function contenuto(nome) {
	if (oggetti[nome][0].length === 0 || oggetti[nome][0] === '') {
		return 'niente';
	} else {
		if (typeof oggetti[nome][1] === 'string' && oggetti[nome][1] == 'mio') {
			return oggetti[nome][0].join(', ');
		} else {
			return oggetti[nome][1].join(', ');
		}
	}
}
function espandiContenitori(str) {
	var out = [];
	out = str.split('@');
	if (out.length < 3) return str;
	for (var i = 1; i < out.length; i++) {
		if (oggetti[out[i]] !== undefined) {
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

/** Aspetti scena **/

function titolo(t) {
	document.title = t;
}
function coloreSfondo(col) {
	if (col !== undefined) {
		if (Scena.N === 0) stileBase.colSfondo = col;
		document.getElementById('corpo').style.backgroundColor = col;
		document.getElementById('input').style.backgroundColor = col;
	}
}
function coloreTesto(col1, col2) {
	if (col1 !== undefined) {
		if (Scena.N === 0) stileBase.colTesto = col1;
		document.getElementById('corpo').style.color = col1;
		document.getElementById('input').style.color = col1;
	}
	if (col2 !== undefined) {
		if (Scena.N === 0) stileBase.colTestoInviato = col2;
		Scena.stile.colTestoInviato = col2;
	}
}
function coloreScelte(col1, col2) {
	if (col1 !== undefined) {
		if (Scena.N === 0) stileBase.colScelta = col1;
		Scena.stile.colScelta = col2;
	}
	if (col2 !== undefined) {
		if (Scena.N === 0) stileBase.colSelezione = col2;
		Scena.stile.colSelezione = col2;
	}
}
function coloreErrore(col) {
	if (Scena.N === 0) stileBase.colErrore = col;
	Scena.stile.colErrore = col;
}
function carattereTesto(fnt, siz, ali) {
	if (Scena.N === 0) {
		if (fnt !== undefined) stileBase.testoCarattere = fnt;
		if (siz !== undefined) stileBase.testoGrandezza = siz;
		if (ali !== undefined) stileBase.testoAllineamento = ali;
	}
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
	if (ali !== undefined) allineamentoPredefinito(ali);
}
function allineamentoPredefinito(ali) {
	stileBase.testoAllineamento = ali;
	switch(ali) {
		case 'giustificato': ali = 'justify'; break;
		case 'centrato': ali = 'center'; break;
		case 'destra': ali = 'right'; break;
		case 'sinistra': ali = 'left'; break;
	}
	document.getElementById('corpo').style.textAlign = ali;
	document.getElementById('descrizione').style.textAlign = ali;
}
function audio(aud) {
	if (scena.N === 0) { alert('Il comando "audio()" non può essere usato nella base delle scene. Eliminarlo!'); return; }
	Azioni.crea();
	Azioni.valore('tipo', 'audio');
	Azioni.valore('audio', aud);
	Azioni.valore('prosegui', 1);
}
function immagine(img, w, h) {
	Scena.stile.img = img;
	if (img !== '') {
		Scena.stile.imgAttendi = 1;
		if (w !== undefined) Scena.stile.imgW = w;
		if (h !== undefined) Scena.stile.imgH = h;
	}
}
function intermezzo(txt) {
	if (Scena.stile.intermezzo === undefined) Scena.stile.intermezzo = [];
	Scena.stile.intermezzo.push(txt);
}
function testo(txt, ali) {
	if (Scena.N === 0) { alert('Il comando "testo()" non può essere usato nella base delle scene. Eliminarlo!'); return; }
	Azioni.crea();
	Azioni.valore('tipo', 'testo');
	Azioni.valore('testo', txt);
	Azioni.valore('allineamento', ali);
	Azioni.valore('prosegui', 1);
}
function scrittura(v) {
	if (v === 0) { Scena.stile.scrittura = 0; } else { Scena.stile.scrittura = 1; }
}

/** Azioni scena **/

function nomeScena(nome, gruppo, disponibile) {
	if (Scena.N === 0) { alert('È vietato usare il comando "nomeScena()" nella base delle scene. Si prega di eliminarlo.'); return; }
	if (direzioni[Scena.N] === undefined) {
		direzioni[Scena.N] = {};
		direzioni[Scena.N].nome = nome;
		direzioni[Scena.N].visitato = 1;
	}
	if (gruppo !== undefined) {
		if (isNaN(gruppo)) {
			direzioni[Scena.N].gruppo = gruppo;
		} else { // Attraverso 'gruppo' può essere passato zero che significa che la direzione non è raggiungibile
			direzioni[Scena.N].d = 0;
		}
	}
	if (disponibile !== undefined) {
		direzioni[Scena.N].d = 0;
	}
}
function cancellaDirezione(nome) {
	for (var key in direzioni) {
		if (direzioni[key].nome == nome) delete direzioni[key];
	}
}
function cancellaDirezioni(gruppo) {
	if (gruppo === undefined) { direzioni = {}; return; }
	for (var key in direzioni) {
		if (direzioni[key].gruppo == gruppo) delete direzioni[key];
	}
}
function rispondi(txt_in, txt_out) {
	txt_in = noDiacritici(txt_in.toLowerCase());
	Azioni.crea();
	Azioni.valore('tipo', 'rispondi');
	Azioni.valore('input', ramificaInput(txt_in, 2));
	Azioni.valore('output', txt_out);
	if (Scena.N > 0) scrittura(1);
}
function aspettaVai(rit, num) {
	Scena.stile.scrittura = 0;
	setTimeout(function(){ document.addEventListener('keypress', press_noAttesa); document.addEventListener('click', press_noAttesa); }, 200);
	attesaVai[0] = setTimeout(function() { scena(num); }, rit);
	attesaVai[1] = num;
}
function rispondiVai(txt_in, txt_out, num, rit) {
	txt_in = noDiacritici(txt_in.toLowerCase());
	if (rit === undefined) rit = txt_out.length * 100;
	Azioni.crea();
	Azioni.valore('tipo', 'rispondiVai');
	Azioni.valore('input', ramificaInput(txt_in, 2));
	Azioni.valore('output', txt_out);
	Azioni.valore('scena', num);
	Azioni.valore('ritardo', rit);
	if (Scena.N > 0)  scrittura(1);
}
function nAzioniVai(passi, num, rip) {
	Azioni.crea();
	Azioni.valore('passi', passi);
	Azioni.valore('passo', 0);
	Azioni.valore('tipo', 'vai');
	Azioni.valore('scena', num);
	if (rip !== undefined) Azioni.valore('ripeti', rip);
}
function nAzioniRispondi(passi, txt_out, rip) {
	Azioni.crea();
	Azioni.valore('passi', passi);
	Azioni.valore('passo', 0);
	Azioni.valore('tipo', 'rispondi');
	Azioni.valore('output', txt_out);
	if (rip !== undefined) Azioni.valore('ripeti', rip);
}
function simulaInput(inp, opz) {
	document.getElementById('input').value = '? ' + inp;
	if (opz === undefined) { Azioni.controlla(); } else { Azioni.controlla(opz); }
}
function scegliVai(txt, num, ali) {
	if (ali !== undefined) { ali = stileAli(ali); } else { ali = ''; }
	Azioni.crea();
	Azioni.valore('tipo', 'vai');
	var idS = document.getElementsByClassName("scelta").length + 1; /*id scelta*/
	Azioni.valore('scelta', idS);
	Azioni.valore('scena', num);
	document.getElementById('scelte').innerHTML += '<p class="scelta" ' + ali + ' onclick="Azioni.esegui(\'S\', '+idS+')">' + txt + '</p>';
}
function scegliRispondi(txt, txt_out, ali1, ali2) {
	if (ali1 !== undefined) { ali1 = stileAli(ali1); } else { ali1 = ''; }
	if (txt_out !== undefined && txt_out !== '') {
		Azioni.crea();
		Azioni.valore('tipo', 'rispondi');
		var idS = document.getElementsByClassName("scelta").length + 1; /*id scelta*/
		Azioni.valore('scelta', idS);
		Azioni.valore('input', txt); // L'input può rimanere con maiuscole e diacritici perché la scelta forza l'esecuzione dell'azione
		Azioni.valore('output', txt_out);
		if (ali2 !== undefined) Azioni.valore('allineamento', ali2);
		document.getElementById('scelte').innerHTML += '<p class="scelta" ' + ali1 + ' onclick="Azioni.esegui(\'S\', '+idS+'); this.style.display = \'none\';">' + txt + '</p>';
	} else {
		if (ali2 !== undefined) { ali2 = ', {\'outAli\':\''+ali2+'\'}'; } else { ali2 = ''; }
		document.getElementById('scelte').innerHTML += '<p class="scelta" ' + ali1 + ' onclick="simulaInput(\''+txt+'\''+ali2+'); this.style.display = \'none\';">' + txt + '</p>';
	}
}
function uscita(txt_in, num, mostra) {
	if (mostra === undefined) {
		// 0: invisibile sempre // 1: visibile se esplorata (nome se esplorata) // 2: visibile sempre (nome se esplorata) // 3: visibile sempre con nome
		mostra = 2;
	}
	// Anche se invisibili input e relativa azione devono funzionare
	Azioni.crea();
	Azioni.valore('tipo', 'vai');
	Azioni.valore('scena', num);
	var parte2 = '';
	if (mostra > 0 && Scena.N > 0) {
		if (mostra > 1 || (direzioni[num] !== undefined && direzioni[num].visitato !== undefined)) {
			if (mostra == 3 || (direzioni[num] !== undefined && direzioni[num].visitato !== undefined)) {
				if (direzioni[num].nome !== undefined) {
					parte2 = ' ' + direzioni[num].nome.split('|')[0];
					Azioni.valore('input', txt_in+'|'+direzioni[num].nome);
				}
				if ((parte2 == '' || parte2 == ' ') && direzioni[num] !== undefined && direzioni[num].visitato == 1) parte2 = ' (esplorato)';
			}
			uVisibili += ', <a class="scelta" onclick="simulaInput(\''+txt_in.split('|')[0]+'\')">' + txt_in.split('|')[0] + '</a>' + parte2;
		}
	}
	if (Azioni.leggiUltima('input') === undefined) Azioni.valore('input', txt_in);
	Azioni.valore('input', ramificaInput(Azioni.leggiUltima('input'), 2));
}
function imposta(set_obj, set_var) {
	// Se le set_var sono state messe nei set_obj, inverte gli argomenti
	if (set_obj !== undefined && set_obj !== '' && set_obj.indexOf('@') == -1) {
		if (set_var === undefined) {
			set_var = set_obj;
			set_obj = undefined;
		} else {
			var tmp = set_obj;
			set_obj = set_var;
			set_var = tmp;
			tmp = undefined;
		}
	}
	// Controlla i set_obj da creare o distruggere
	var azione = {};
	if (set_obj !== undefined && set_obj !== '') {
		var presenza; var nome; var contenitore;
		azione.set_obj = set_obj.split('|'); // Elenco degli set_obj formato: (!)oggetto@contenitore
		for (var i = 0; i < azione.set_obj.length; i++) {
			if (azione.set_obj[i].substr(0, 1) == '!') {
				presenza = 0;
				azione.set_obj[i] = azione.set_obj[i].substr(1); // Viene rimosso il punto esclamativo
			} else {
				presenza = 1;
			}
			azione.set_obj[i] = azione.set_obj[i].split('@'); // Scomposizione oggetto@contenitore
			nome = azione.set_obj[i][0];
			contenitore = azione.set_obj[i][1];
			if (presenza == 1) {
				if (oggetti[contenitore] === undefined) {
					oggetti[contenitore] = [];
					oggetti[contenitore][0] = [];
					oggetti[contenitore][1] = [];
				}
				if (oggetti[contenitore][0].indexOf(nome) == -1) {
					oggetti[contenitore][0].push(nome); // Aggiunge anche un oggetto vuoto all'inizio!!! ******
					if (oggetti[contenitore][1] !== 'mio') oggetti[contenitore][1].push(nome);
				}
			} else if (oggetti[contenitore] !== undefined) { // Se non esiste il contenitore, inutile cercarci un oggetto dentro per distruggerlo
				var i_canc = oggetti[contenitore][0].indexOf(nome);
				if (i_canc != -1) {
					oggetti[contenitore][0].splice(i_canc, 1);
					if (oggetti[contenitore][1] !== 'mio') oggetti[contenitore][1].splice(i_canc, 1);
				}
			}
		}
	}
	// Controlla le set_var da impostare o cancellare
	if (set_var !== undefined && set_var !== '') {
		var presenza;
		azione.set_var = set_var.split('|'); // Elenco delle set_var fomato: (!)nome_variabile
		for (var i = 0; i < azione.set_var.length; i++) {
			if (azione.set_var[i].substr(0, 1) == '!') {
				presenza = 0;
				azione.set_var[i] = azione.set_var[i].substr(1);
			} else {
				presenza = 1;
			}
			if (presenza == 1) {
				if (variabili[azione.set_var[i]] === undefined) variabili[azione.set_var[i]] = 1;
			} else {
				if (variabili[azione.set_var[i]] !== undefined) delete variabili[azione.set_var[i]];
			}
		}
	}
}
function _se(seOggetti, seVariabili) {
	// Se le variabili sono state messe negli oggetti, inverte gli argomenti
	if (seOggetti !== undefined && seOggetti !== '' && seOggetti.indexOf('@') == -1) {
		if (seVariabili === undefined) {
			seVariabili = seOggetti;
			seOggetti = undefined;
		} else {
			var se_tmp = seOggetti;
			seOggetti = seVariabili;
			seVariabili = se_tmp;
			se_tmp = undefined;
		}
	}
	// Le scelte per il fatto che sono cliccabili non sono soggette a condizioni, ma sempre disponibili
	if (Azioni.leggiUltima('scelta')) {
		alert('È vietato aggiungere condizioni "_se()" alle scelte cliccabili. Controllare la scena '+Scena.N+' ed eliminare tali condizioni.');
		return;
	}
	var azione = {};
	var presenza;
	if (seOggetti !== undefined && seOggetti !== '') {
		seOggetti = seOggetti.split('|'); // Elenco degli oggetti
		for (var i = 0; i < seOggetti.length; i++) {
			if (seOggetti[i].substr(0, 1) == '!') {
				presenza = 0;
				seOggetti[i] = seOggetti[i].substr(1);
			} else {
				presenza = 1;
			}
			seOggetti[i] = seOggetti[i].split('@'); // Scomposizione oggetto@contenitore
			Azioni.arrayValore('seOggetti', {'presenza': presenza, 'nome': seOggetti[i][0], 'contenitore': seOggetti[i][1]});
		}
	}
	if (seVariabili !== undefined && seVariabili !== '') {
		seVariabili = seVariabili.split('|'); // Elenco delle variabili
		for (var i = 0; i < seVariabili.length; i++) {
			if (seVariabili[i].substr(0, 1) == '!') {
				presenza = 0;
				seVariabili[i] = seVariabili[i].substr(1);
			} else {
				presenza = 1;
			}
			Azioni.arrayValore('seVariabili', {'presenza': presenza, 'nome': seVariabili[i]});
		}
	}
}
function _annullaSe(seOggetti, seVariabili) {
	// Se le variabili sono state messe negli oggetti, inverte gli argomenti
	if (seOggetti !== undefined && seOggetti !== '' && seOggetti.indexOf('@') == -1) {
		if (seVariabili === undefined) {
			seVariabili = seOggetti;
			seOggetti = undefined;
		} else {
			var se_tmp = seOggetti;
			seOggetti = seVariabili;
			seVariabili = se_tmp;
			se_tmp = undefined;
		}
	}
	// Annullare un'azione ritardata è possibile solo per nAzioniQualcosa
	if (Azioni.leggiUltima('tipo') != 'nAzioniVai' && Azioni.leggiUltima('tipo') != 'nAzioniRispondi') {
		alert('La funzione "_annullaSe()" è applicabile solo alle funzioni "nAzioniQualcosa". Controllare la scena '+Scena.N+' e i suoi "_annullaSe()".');
		return;
	}
	var azione = {};
	var presenza;
	if (seOggetti !== undefined && seOggetti !== '') {
		seOggetti = seOggetti.split('|'); // Elenco degli oggetti
		for (var i = 0; i < seOggetti.length; i++) {
			if (seOggetti[i].substr(0, 1) == '!') {
				presenza = 0;
				seOggetti[i] = seOggetti[i].substr(1);
			} else {
				presenza = 1;
			}
			seOggetti[i] = seOggetti[i].split('@'); // Scomposizione oggetto@contenitore
			Azioni.arrayValore('annullaSeOgg', {'presenza': presenza, 'nome': seOggetti[i][0], 'contenitore': seOggetti[i][1]});
		}
	}
	if (seVariabili !== undefined && seVariabili !== '') {
		seVariabili = seVariabili.split('|'); // Elenco delle variabili
		for (var i = 0; i < seVariabili.length; i++) {
			if (seVariabili[i].substr(0, 1) == '!') {
				presenza = 0;
				seVariabili[i] = seVariabili[i].substr(1);
			} else {
				presenza = 1;
			}
			Azioni.arrayValore('annullaSeVar', {'presenza': presenza, 'nome': seVariabili[i]});
		}
	}
}
function _intermezzo(txt) {
	Azioni.arrayValore('intermezzi', 'testo', txt);
}
function _oggetti(obj_in, obj_out) {
	if (obj_in !== undefined) Azioni.valore('piuOggetti', noDiacritici(obj_in.toLowerCase()));
	if (obj_out !== undefined) Azioni.valore('menoOggetti', noDiacritici(obj_out.toLowerCase()));
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
function _prosegui() {
	Azioni.valore('prosegui', 1);
}