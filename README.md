# FLYBNB
App di prenotazione camere web/mobile

Guida per eseguire l'applicativo:

# BACK-END

1. Accedere a MySQL con phpMyAdmin
2. creare nuovo database con nome 'flybnb' e codifica caratteri 'utf8mb4_general_ci'
3. Selezionare nuovo database creato e cliccare sula voce dell'header menu 'Importa'
4. Selezionare 'scegli file' e caricare il file flybnb.sql presente nella cartella "database" , quindi cliccare in basso 'Esegui'
5. Entrare nel file backend\db\config.js e inserire in 'user' e 'password' le proprie credenziali MySQL e salvare le modifiche
6. Da terminale, entrare nella cartella "backend/" ed eseguire i seguenti comandi:
> npm install

> npm start

# FRONT-END

1. Assicurarsi di essere connessi ad una rete
2. Aprire il terminale ed eseguire il comando 'ipconfig' per ottenere il proprio indirizzo IPV4
3. Aprire il file flybnb\src\configHost.js e incollare in 'host' l'indirizzo locale IPV4
4. Aprire ed Accendere un Emulatore Android oppure scaricare in uno Smartphone l'app "expo" e Scannarizzare il barcode restituito da expo start --android
5. Apri il terminale, entra nella cartella /flybnb/ ed esegui i seguenti comandi: 

vista desktop:

> expo start --web 

vista android:

>expo  start --android (per la vista app Android)




# FEATURES DEL SISTEMA

- Il software permette all’utente di visualizzare tutti gli alloggi di un determinato luogo o corrispondenti ai criteri di ricerca

- L’utente può selezionare il Luogo in cui intende alloggiare, filtrando i risultati in base al tipo di struttura (b&b o Casa Vacanze), posti letto, prezzo massimo, servizi generali (aria condizionata, parcheggio,pensione completa,cucina,wifi)

- il sistema gestisce la registrazione e l'autenticazione degli utenti

- l’utente non registrato/non loggato può  visualizzare le strutture presenti nel sistema, tuttavia non può effettuarne la prenotazione 

- Il sistema gestisce le date di checkin e checkout che l'utente intende prenotare, rendendo disponibili solo le date che non sono state prenotate da nessun altro utente. Inoltre è stato imposto un limite di 28 notti annuali per la prenotazione di una stessa struttura.

- Il sistema gestisce attraverso uno scambio di email le prenotazioni delle strutture*[1]

- il sistema gestisce gli ospiti selezionati dall'utente attraverso documenti d'identità e dati anagrafici

- l’utente può visualizzare tutte le prenotazioni effettuate e controllare se sono state rifiutate,accettate o se sono in attesa di approvazione attraverso la propria area personale

- l’utente può diventare Host aggiungendo una struttura nel proprio profilo personale, il numero di strutture è illimitato.

- Per ogni struttura è necessario inviare un rendiconto delle prenotazioni ogni 3 mesi all'ufficio del turismo, il sistema gestisce questa funzionalità *[2]

- Per ogni struttura vengono registrate tutte le prenotazioni effettuate ordinate in base alla data di pernottamento

- l’utente Host può gestire e controllare le richieste di prenotazione ricevute nelle proprie strutture ed eventualmente rifiutarle o accettarle



# VERIFICA EMAIL INVIATE DAL SISTEMA [1]

1. accedi a: infomailer210@gmail.com
2. password: qwerty123,.-
3. Accedere e controllare la sezione email inviate
	
# ACCESSO UTENTI TEST

1. USERNAME: ADMIN@ADMIN.COM    PASSWORD: Admin123
2. USERNAME: TEST@TEST.COM  PASSWORD: Test123


# NOTA [2] 
Per testare il funzionamento del rendiconto cambiare la data alla riga 73 del componente UserStructureList 
	ESEMPIO: new Date(2021,4,11) per avere come data odierna l' 11 marzo 2021




