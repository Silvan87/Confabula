
# Documentazione per lo Scrittore


## Introduzione

Benvenuto *scrittore*! Scrivere un'avventura testuale non potrà mai essere banale, né per la logica di narrazione, né per le conoscenze minime da programmatore. L'intento è quello di semplificare e rendere il processo intuitivo, ma al tempo stesso offrire potenza e flessibilità. Conciliare tanti obiettivi richiederà un impegno da parte dello scrittore, ma alla fine dello studio di questa documentazione, avrete modo di constatare che sarà piuttosto piacevole scrivere storie interattive.


## Scelta del formato HTML

I browser Web sono lettori ormai onnipresenti sui nostri dispositivi ed il formato HTML5 e CSS3 è così ben standardizzato da risolvere il problema di formati speciali che richiedono l'installazione di programmi speciali per essere letti. Inoltre, un browser risolve gli aspetti grafici in modo brillante e semplice, basteranno pochi tocchi per avere risultati graficamente migliori rispetto a vari programmi di avventure testuali.

La programmazione è svolta tramite JavaScript, un linguaggio che permette di rendere interattive le pagine HTML. Non serve una conoscenza medio avanzata di JavaScript, gli aspetti più complessi sono stati separati e racchiusi nel file 'interprete.js', che non servirà mai aprirlo. Gli unici file JavaScript su cui lavora lo scrittore sono 'scene.js' e 'vocabolario.js', che richiedono conoscenze elementari di JavaScript.


## Iniziare con una nuova storia

Per creare una nuova storia basterà copiare la cartella 'sorgente' di Confabula, rinominare la cartella con il nome della storia nuova ed usare il vostro editor di testo preferito per lavorare con i file (è necessaria la colorazione del codice per non impazzire e suggerisco un tema di colori scuro, perché riposa la vista ed è più gradevole).

Si fa presente che attualmente le storie sono "in chiaro", ovvero non sono protette con una criptazione del codice. Quindi un utente medio può facilmente ispezionare il sorgente della pagina html della storia ed autosvelarsi tutto. Attualmente ci si affida alla reale intenzione del giocatore di godersi la storia senza "trucchi", ma è in previsione una protezione del codice e delle immagini su Confabula. La quale non è difficile da implementare, ma ci sono altri aspetti prioritari da sviluppare.


## Albero delle cartelle e dei file

La prima operazione da fare è copiare la cartella 'sorgente' e rinominarla con il nome della vostra storia. Dentro ci sono 5 file essenziali.

**INIZIA.html**
Non dovrete mai modificarlo, serve per far parire la storia con 2 click e connettere insieme tutti i "pezzi".

**interprete.js**
Non dovrete mai modificarlo, è il cervello di Confabula, deve solo essere presente.

**stile.css**
Questo file dovrete aprirlo per decidere alcuni aspetti grafici della vostra storia. Una volta aperto potete vedere che è diviso in due parti "Stile personalizzabile" ed "Impostazioni raccomandate". La seconda parte è raccomandabile lasciarla così come è. La prima parte presenta nomi intuitivi e qualche commento, così vi risulterà facile capire a quali aspetti ci si riferisce.

I colori, che sono uno dei principali aspetti che vorrete personalizzare, sono definiti con caratteri esadecimali. Si trovano facilmente sul Web applicazioni che vi fanno scegliere un colore visivamente e vi comunicano il suo codice esadecimale. Il codice inizia con un cancelletto # e seguono 2 caratteri per il rosso, 2 per il verde e 2 per il blu. FF è il valore massimo, ovvero 255 in decimale e 00 quello minimo. Quando i caratteri sono 3, per esempio #b3c, è sottointeso che vengano raddoppiati così: #bb33cc.

Se avete conoscenze medie o avanzate di CSS3 potete prendervi la libertà di personalizzare tutto il file come meglio preferite.

**scene.js**
Questo file richiede il vostro maggior lavoro e quasi tutta la documentazione per lo Scrittore sarà rivolta ad insegnarvi come lavorare su questo file.

**vocabolario.js**
Il vocabolario è più semplice da gestire, fondamentalmente serve a definire le espressioni sinonime generali. Non sono i classici sinonimi, per questo uso il termine più generico *espressioni sinonime*, per esempio, tutti gli articoli determinativi per Confabula sono sinonimi a livello di significato. Così come ciascun verbo indicativo presente è funzionalmente sinonimo di un imperativo su Confabula: "prendo la pergamena", "prendi la pergamena", in entrambi i casi bisogna fare la stessa cosa "prendere la pergamena", quindi 'prendo' e 'prendi' si possono dichiarare sinonimi. Naturalmente vale solo in questo ambito specifico.

**Sotto cartelle**
Per quanto non siano necessarie le sotto cartelle, essendo possibile aggiungere immagini, animazioni GIF e audio nelle storie interattive, è comodo organizzare i file multimediali in sotto cartelle: immagini o img, audio, ecc., con il nome che preferite. Come recuperare ed usare questi file multimediali si vedrà in seguito.


## Scrivere una storia "passo passo"

Suppongo ora che abbiate una cartella con il nome della vostra storia, per esempio, "La casa" e dentro contenga i file 'INIZIA.html' e 'interprete.js', i quali non vanno modificati, e i file 'vocabolario.js' e 'scene.js'.

[LAVORI IN CORSO]
