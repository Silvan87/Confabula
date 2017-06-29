
# Documentazione per lo Scrittore


## Introduzione

Benvenuto Scrittore! Scrivere un'avventura testuale non potrà mai essere banale, né per la logica di narrazione, né per le conoscenze minime da programmatore. L'intento è quello di semplificare e rendere il processo intuitivo, ma al tempo stesso offrire potenza e flessibilità. Conciliare tanti obiettivi richiederà un impegno da parte dello Scrittore, ma alla fine dello studio di questa documentazione, avrete modo di constatare che sarà piuttosto piacevole scrivere storie interattive.


## Scelta del formato HTML

I browser Web sono lettori ormai onnipresenti sui nostri dispositivi ed il formato HTML5 e CSS3 sono così ben standardizzati da risolvere il problema di formati speciali che richiedono l'installazione di programmi speciali per essere letti. Inoltre, un browser risolve gli aspetti grafici in modo brillante e semplice, basteranno pochi tocchi per avere risultati graficamente migliori rispetto a vari programmi per avventure testuali.

La programmazione è svolta tramite JavaScript, un linguaggio che permette di rendere interattive le pagine HTML. Non serve una conoscenza di JavaScript, risulterà tutto già pronto e gli aspetti più complessi separati e racchiusi nel file 'interprete.js', che non servirà mai aprirlo. L'unico file JavaScript (nonché il principale) su cui lavorerete sarà 'scene.js', ma qui le conoscenze di JavaScript richieste sono davvero minime.

Per creare una nuova storia basterà copiare la cartella 'sorgente' di Confabula, rinominarla con il nome della storia nuova ed usare il vostro editor di testo preferito (è necessaria la colorazione del codice per non impazzire e suggerisco un tema di colori scuro, perché riposa la vista ed è più gradevole).

Infine, si fa presente che attualmente le storie sono in chiaro, però si progetta di criptare il codice 'scene.js' per preservare la storia da un eventuale facile spoiler. È persino possibile realizzare un sistema di hashcode e criptazione che permette di avere una sicurezza matematica che il lettore scopra realmente la storia mano a mano che avanza oonestamente. Non è necessario dotarsi di un server per questo tipo di sicurezza. Non importa se parte dei termini vi suonano oscuri, semplicemente garantire che la storia non sia facilmente svelata o addirittura protetta in modo certo è possibile. Però, non è una priorità al momento.


## Albero delle cartelle e dei file

La prima operazione da fare è copiare la cartella 'sorgente' e rinominarla con il nome della vostra storia. Dentro ci sono 4 file essenziali.

**INIZIA.html**
Non dovrete mai modificarlo, serve per far parire la storia con 2 click e connettere insieme tutti i "pezzi".

**interprete.js**
Non dovrete mai modificarlo, è il cervello di Confabula, deve solo essere presente. Semplice.

**stile.css**
Questo file dovrete aprirlo per decidere alcuni aspetti grafici della vostra storia. Una volta aperto potete vedere che è diviso in due parti "Stile personalizzabile" ed "Impostazioni raccomandate". La seconda parte è raccomandabile lasciarla così come è. La prima parte presenta nomi intuitivi e qualche commento e vi risulterà facile capire a quali aspetti ci si riferisce.

I colori, che sono uno dei principali aspetti che vorrete personalizzare, sono definiti con caratteri esadecimali. Si trovano facilmente sul Web applicazioni che vi fanno scegliere un colore visivamente e vi comunicano il suo codice esadecimale. Il codice inizia con un cancelletto # e seguono 2 caratteri per il rosso, 2 per il verde e 2 per il blu. FF è il valore massimo, ovvero 255 in decimale e 00 quello minimo. Quando i caratteri sono 3, per esempio #b3c, è sottointeso che vengano raddoppiati così: #bb33cc.

Se avete conoscenze medie o avanzate di CSS3 potete prendervi la libertà di personalizzare tutto il file come meglio preferite.

**scene.js**
Questo file richiede il vostro maggior lavoro e tutta la documentazione per lo Scrittore sarà ora rivolta ad insegnarvi come lavorare su questo file.

**Sotto cartelle**
Per quanto non siano necessarie, dato che è possibile aggiungere immagini, animazioni GIF e audio nelle storie interattive, è raccomandabile organizzare i file multimediali in sotto cartelle: immagini o img, audio, ecc., con il nome che preferite. Come recuperare ed usare questi file multimediali si vedrà in seguito.


## Scrivere una storia passo per passo

[LAVORI IN CORSO]

Alcune funzioni possono essere utilizzate solo nel blocco istruzioniGenerali() e sono le seguenti.

- titolo("Nome della storia");
Imposta il titolo della storia all'inizio e non dovrebbe essere più cambiato.

Alcune funzioni possono essere utilizzate solo all'interno di scene specifiche e sono le seguenti.

- intermezzo("Questo testo compare prima della scena corrente");
Serve per aumentare la dinamicità o creare un po' di suspence prima di presentare il testo di una scena. Questa funzione può essere ripetuta ed avrà l'effetto di presentare successivi testi di intermezzo prima del testo della scena corrente.

Molte funzioni possono essere usate sia nella sezione generale che in scene specifiche e sono le seguenti.

