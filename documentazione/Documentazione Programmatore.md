# Documentazione per il Programmatore

## Introduzione

#### Come si presenta Confabula al Giocatore

Confabula produce dei file HTML eseguibili su browser Web. All'avvio si presenta all'utente una descrizione principalmente testuale (Scena) con una casella di testo sottostante (Input) dove l'utente (Giocatore) può scrivere in prima persona o con l'imperativo le sue azioni. In base a ciò che l'utente scrive possono comparire risposte e può aggiornarsi la Scena.

#### Come si presenta Confabula allo Scrittore

Lo scrittore ed autore di un'avventura testuale potrà copiare la cartella 'sorgente', rinominarla con il nome della sua storia e dovrà principalmente editare un file dedicato alle scene dove scriverà la sua storia. Potrà personalizzare anche altri file ed aggiungere immagini o suoni.

#### Come si presenta Confabula al Programmatore

Confabula è programmato in JavaScript 5 (più l'uso delle arrow function di JavaScript 6), i contenuti e la grafica sono realizzati con HTML5 e CSS3. Questa documentazione entrerà nei dettagli per spiegare tutto il codice di Confabula ed eventualmente continuare a svilupparlo.

## Albero delle cartelle e dei file

Confabula ha una struttura gerarchica molto semplice. I file essenziali sono tutti presenti in un'unica cartella. Eventuali sotto cartelle sono utili per raccogliere immagini, suoni, font, ecc., se ci sono. Di seguito l'elenco dei file essenziali.

#### INIZIA.html

`INIZIA.html` è un file statico e non verrà mai modificato dallo scrittore, solo eventuali cambi strutturali profondi (quindi rari) possono portare lo sviluppatore (programmatore) a rivedere alcuni punti.

#### interprete.js

`interprete.js` è il cervello di Confabula, lo sviluppatore dovrà arricchire di nuove funzioni questo file per mettere a disposizione nuove funzioni per lo scrittore. Inoltre, qui è possibile migliorare la gestione della lingua naturale.

#### stile.css

`stile.css` è un file internamente diviso in due sezioni. Lo *stile personalizzabile* che consiste in una serie di classi css auto-descrittive o con brevi commenti di supporto e le *impostazioni raccomandate* che non dovrebbero essere mai modificate, salvo personalizzazioni speciali o revisioni di alcuni aspetti predefiniti di Confabula.

#### scene.js

`scene.js` è il file su cui maggiormente lavorerà lo scrittore e deve rimanere più semplice ed intuitivo possibile.

Inizia con una funzione "istruzioniGenerali" che contiene una serie di istruzioni che avranno valore in tutte le scene del gioco. Le istruzioni sono definite tramite una funzione, ma ciascuna funzione serve solo a preparare le condizioni che saranno valutate ad ogni azione del giocatore per decidere se eseguire effettivamente l'istruzione oppure no.

Infine, c'è un grande blocco internamente suddiviso nel caso 1, 2, 3, ecc., i cui numeri corrispondono alle relative scene. Ciascuna scena è definita da una serie di istruzioni che sono scritte tramite funzioni. Come sopra, tutte le istruzioni delle scene servono a definire le condizioni, continuamente verificate durante il gioco, affinché, quando soddisfatte, giunge il momento di doverle eseguire effettivamente.

Le funzioni che descrivono le istruzioni nelle scene seguono indicativamente questo stile:

	preparatiAFareQuesto(condizione1, condizione2, effetto1, effetto2);

Anche se il nome di ciascuna istruzione deve essere più sintetico ed anche più intuitivo per lo Scrittore, egli deve pensare ad un Scena come da un insieme di righe, in cui per ciascuna riga si descrive qualcosa che può accadere in quella scena.

#### vocabolario.js

`vocabolario.js` è il file che raccoglie le espressioni sinonime, attualmente si può creare il sinonimo di una parola con un'altra parola, ma è in previsione la possibilità di rendere un'espressione di 2 o 3 parole sinonimo di un'altra di una sola parola. Inoltre, potrebbe arricchirsi di nuove potenzialità in futuro.

## Struttura logica di Confabula

### Livello 0 - Oggetti fondamentali

**N.B.**
Gli oggetti a cui ora ci si riferisce sono oggetti astratti per la programmazione e non oggetti che possono esistere all'interno delle storie interattive.

#### &#x26AB; Oggetto: Vista

**Scopo**: visualizzare la scena corrente.

**Proprietà**: serviranno per definire ogni aspetto della scena corrente (i colori, il testo, ecc.).

**Funzioni**: principalmente mostra e nascondi Vista, ma saranno più articolate.

#### &#x26AB; Oggetto: Scene

**Scopo**: è un insieme di scene che memorizza tutte le informazioni relative a ciascuna scena o relative a tutte le scene insieme. Questo oggetto è definito dal file `scene.js`.

**Proprietà**: tecnicamente nessuna, ma di fatto il file `scene.js` definisce le istruzioni generali, ovvero cose che possono accadere in tutte le scene, e le istruzioni specifiche per ciascuna scena, ovvero cose che possono accadere in specifiche scene. Inoltre, ciascuna scena, come fosse in un array, riceve un numero. Le scene non sono in un classico array, ma sono gestite da un selettori di casi. Ciascuna funzione presente nelle scene definisce un'istruzione per quella scena e ciascuna istruzione può essere logicamente concepita come una proprietà della scena.

**Funzioni**: ogni scena corrisponde ad un caso (1, 2, 3, ecc.), più le istruzioni generali (all'inizio) che valgono in tutte le scene. Ogni caso presenta una serie di funzioni, possiamo chiamare queste istruzioni, dato che ciascuna di queste descrive qualcosa che può accadere nella relativa scena, in particolare, tramite gli argomenti della funzione si definiscono le condizioni e gli effetti dell'istruzione.

#### &#x26AB; Oggetto: Input

**Scopo**: passare il testo dell'utente all'Interprete tramite invio.

**Proprietà**: essenzialmente ci sarà il testo scritto sulla casella.

**Funzioni**: quella per far scattare l'evento (es. pressione di invio e poco altro) per passare il testo all'Interprete.

**Note**: Input è una casella di testo che può essere visibile o meno nella Vista.

#### &#x26AB; Oggetto: Interprete

**Scopo**: decide in base all'Input del Giocatore quali azioni eseguire sulla Vista, sulle Scene, sul Giocatore ed in generale su ogni aspetto del gioco.

**Proprietà**: non possiede rilevanti proprietà, queste sono tutte presenti sugli oggetti manipolati dall'Interprete.

**Funzioni**: conterrà molte sofisticate funzioni per eseguire le azioni che nelle Scene sono solo descritte e mancano dell'effettivo codice che realizza gli effetti desiderati.

#### &#x26AB; Oggetto: Giocatore

**Scopo**: tener traccia delle informazioni relative al Giocatore ed eventualmente eseguire poche pertinenti azioni.

**Proprietà**: deducibili dallo scopo.

**Funzioni**: dovrebbero essere poche, in particolare "nuova partita".

#### &#x26AB; Oggetto: Storia

**Scopo**: tener traccia delle informazioni relative allo sviluppo della storia nella sua totalità.

**Proprietà**: deducibili dallo scopo, in particolare oggetti e variabili (non nel senso della programmazione, ma intesi nel gioco: chiavi, tavoli, "libro preso", ecc.) vanno collocati qui.

**Funzioni**: dovrebbero essere poche, in particolare "nuova partita" e "spostati alla scena n...".

#### &#x26AB; Oggetto: Lingua

**Scopo**: conservare informazioni ed eseguire funzioni generali per l'elaborazione della lingua.

**Proprietà**: principalmente occorre inserire tutte le espressioni sinonime (ovvero i sinonimi, ma anche espressioni equivalenti).

**Funzioni**: si deve gestire il rapporto tra l'input del giocatore e il testo atteso dallo scrittore, più altre funzioni di normalizzazione del testo. Deve essere presente una funzione che trasforma l'imperativo seconda persona in indicativo presente prima persona.


### Livello 1 - Proprietà e funzioni in dettaglio

#### &#x26AB; Oggetto: Vista

**Proprietà**

- _testo_: è una stringa di testo semplice o html che descrive la scena
- _intermezzo_: è un array di testi di intermezzo prima del testo effettivo
- _uscite_: è una stringa che contiene dei link html visibili che permettono di passare ad altre scene
- _scelte_: è un elenco di link html che possono essere visualizzati sotto la descrizione
- _coloreSfondo_: colore della pagina html
- _coloreTesto_: colore testo della scena
- _coloreTestoInviato_: colore dell'Input inviato dal Giocatore
- _testoCarattere_: carattere (font) di tutti i testi
- _testoGrandezza_: grandezza dei testi
- _testoAllineamento_: allineamento del testo della descrizione
- _coloreScelta_: colore di una scelta predefinita
- _coloreSceltaSelezionata_: colore di una scelta predefinita quando il puntatore ci passa sopra
- _coloreErrore_: colore degli eventuali messaggi di errore
- _coloreLink_: colore dei link all'interno della descrizione
- _coloreLinkSelezionato_: colore dei link all'interno della descrizione quando il puntatore ci passa sopra
- _larghezzaMax_: larghezza massima della Vista specificata in pixel

**Funzioni**

- _nascondi_: nasconde l'intera vista
- _mostra_: mostra la vista secondo tutte le proprietà impostate

#### &#x26AB; Oggetto: Scene

**Funzioni**

Da un punto di vista logico possono essere viste come proprietà per ciascuna scena, ma sono proprietà articolate che possono far scattare delle funzioni durante il gioco e nella particolare scena di riferimento. Ciò che occorre conoscere è quali funzioni esistono da poter essere usate nelle scene. Proprio queste sono le funzioni che lo Scrittore deve conoscere per scrivere le sue storie interattive.

A questo livello lo Sviluppatore non deve implementare le funzioni, ma può facilmente inventare un nome e degli argomenti che descrivano le condizioni che devono verificarsi durante il gioco e gli effetti che si produrranno date le giuste condizioni. Le funzioni saranno effettivamente implementate nell'Interprete.

La completa lista delle funzioni utilizzabili nelle scene è raccolta nella Documentazione per lo Scrittore e lì si rimanda.

#### &#x26AB; Oggetto: Input

**Proprietà**

- _value_: contiene il testo inserito nella casella di testo (input html)
- _display_: servirà poter visualizzare o far sparire la casella di testo

**Funzioni**

- _onblur_: quando la casella perde il focus dopo pochi secondi lo deve riprendere
- _onkeypress_: quando si preme invio il testo va passato all'interprete

#### &#x26AB; Oggetto: Interprete

**Funzioni**

Occorre sviluppare la documentazione mano a mano che si procede con la programmazione. Questa parte sarà la più difficile ed estesa di Confabula.

#### &#x26AB; Oggetto: Giocatore

- _nMosse_: n. delle mosse o azioni svolte nel gioco (è il modo più opportuno di contare il tempo in un'avventura testuale)
- _nPassaggiScena_: n. dei passaggi da scena a scena (una scena è solo un testo o una situazione di fronte al giocatore)
- _nPassaggiLuoghi_: n. dei passaggi da luogo a luogo (un luogo può essere rappresentato da più  scene)
- _tempoInizio_: la data comprensiva di orario di inizio della partita
- _oggetti_: è un array di array, o meglio un array di contenitori (es. inventario, tasche, zaino, bocca) che possono contenere liste di oggetti

N.B. un Oggetto nel gioco può passare da un contenitore ad un altro ed è un array con varie proprietà:

	_etichettaIl_: il nome che deve comparire con articolo determinativo (es. il martello)
	_etichettaUn_: il nome che deve comparire con articolo indeterminativo (es. un martello)
	_quantita_: il numero di entità (copie dell'oggetto o frecce o munizioni, ecc.) che può tornare utile contare

- _nScena_: n. scena corrente
- _nScenaP_: n. scena precedente
- _nScenaPP_: n. scena precedente alla precedente
- _nomeLuogoA_: nome del luogo attuale
- _nomeLuogoP_: nome del luogo precedente
- _luoghiRaggiungibili_: array dei nomi dei luoghi raggiungibili
- _usciteEsplorate_: elenco delle uscite (salvate come coppia di ID da nScena a nScena) che sono state attraversate

#### &#x26AB; Oggetto: Storia

**Proprietà**

- _oggetti_: un array di array, deve elencare per ogni luogo gli oggetti che sono stati lì lasciati

N.B. Se si vuol legare un oggetto ad una scena specifica, anziché ad un luogo, allora si deve lavorare con specifici contenitori

- _contenitori_: un array di array, che elenca i contenitori creati dallo scrittore ed il loro contenuto (ovvero oggetti)
- _variabili_: tutte le variabili di cui lo scrittore ha bisogno nella storia (es. drago morto, libro letto, ecc.)
- _vocabolario_: (facoltativo) è l'elenco dei predicati che il giocatore può usare nella storia

#### &#x26AB; Oggetto: Lingua

**Proprietà**

- _predicati_: array facoltativo dei predicati permessi ed usati dallo scrittore nella storia
- _equivalenze_: array di array che specifica quali espressioni sono equivalenti: es. `[['albero','pianta'], ['si','ya'], ... ]`
- _mappaDiacritici_: i caratteri diacritici devono essere rimossi e serve una mappa che riporti ogni lettera accentata ad una lettera base

**Funzioni**

- _normalizzaInput_: sia l'input del giocatore che il testo previsto dallo scrittore devono essere portati ad una forma normale per il confronto
- _confrontaInput_: dati due input normalizzati risponde vero se sono equivalenti e falso se sono differenti (di fatto si realizza un confronto semantico)


## Come implementare la struttura logica

Il file `interprete.js` sarà un unico file che include non solo l'oggetto Interprete, ma anche quasi tutti gli altri oggetti logici: Lingua, Vista, Interprete (abbreviato con I), Giocatore (abbreviato con G), Storia (abbreviato con S), Condizioni.

#### Oggetto: Vista

Si tratta di un oggetto js dentro il file `interprete.js`.

#### Oggetto: Scene

L'unico oggetto che fa eccezione. Non è propriamente un oggetto js, ma è un file `scene.js` che contiene tre funzioni fondamentali: vocabolario, istruzioniGenerali e istruzioniScena.

Le istruzioni permesse nelle scene sono definite sul primo livello del file `interprete.js` sotto il commento "Istruzioni per definire le scene". Infatti, se fossero poste dentro un oggetto, che fa da namespace, si appesantirebbe il lavoro dello scrittore che, anziché usare direttamente la funzione con il relativo nome, dovrebbe ogni volta scrivere il namespace.

#### Oggetto: Input

È un oggetto html, si tratta di una casella di testo dentro il file `INIZIO.html`.

#### Oggetto: Interprete

È un complesso ed articolato oggetto js dentro `interprete.js`, in linea di massima è funzionalmente centrale rispetto ai vari oggetti che compongono Confabula.

#### Oggetto: Giocatore

È un oggetto js dentro `interprete.js`.

#### Oggetto: Storia

È un oggetto js dentro `interprete.js`.

#### Oggetto: Lingua

È un oggetto js dentro `interprete.js`.


