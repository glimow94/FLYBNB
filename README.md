# FLYBNB
App di prenotazione camere web/mobile

Guida per eseguire l'applicativo:

BACK-END

1. Accedere a MySQL con phpMyAdmin
2. creare nuovo database con nome 'flybnb' e codifica caratteri 'utf8mb4_general_ci'
3. Selezionare nuovo database creato e cliccare sula voce dell'header menu 'Importa'
4. Selezionare 'scegli file' e caricare il file flybnb.sql presente nella cartella "database" , quindi cliccare in basso 'Esegui'
5. Entrare nel file backend\db\config.js e inserire in 'user' e 'password' le proprie credenziali MySQL e salvare le modifiche
6. Da terminale, entrare nella cartella "backend/" ed eseguire i seguenti comandi:
 	npm install
	npm start

FRONT-END

1. Assicurarsi di essere connessi ad una rete
2. Aprire il terminale ed eseguire il comando 'ipconfig' per ottenere il proprio indirizzo IPV4
3. Aprire il file flybnb\src\configHost.js e incollare in 'host' l'indirizzo locale IPV4
4. Aprire ed Accendere un Emulatore Android oppure scaricare in uno Smartphone l'app "expo" e Scannarizzare il barcode restituito da expo start --android
5. Apri il terminale, entra nella cartella /flybnb/ ed esegui i seguenti comandi: 
	npm install
	expo start --web (per la vista Desktop/Web)
	expo  start --android (per la vista app Android)

VERIFICA EMAIL INVIATE DAL SISTEMA
1. accedi a: infomailer210@gmail.com
2. password: qwerty123,.-
3. Accedere e controllare la sezione email inviate
	
ACCESSO UTENTI TEST

1. USERNAME: ADMIN@ADMIN.COM    PASSWORD: Admin123
2. USERNAME: TEST@TEST.COM  PASSWORD: Test123

NOTA:

-Per testare il funzionamento del rendiconto cambiare la data alla riga 73 del componente UserStructureList 
	ESEMPIO: new Date(2021,4,11) per avere come data odierna l' 11 marzo 2021

-Per testare ll'invio dei documenti inserire immagini di pochi kilobyte


