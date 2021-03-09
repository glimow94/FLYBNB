var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var ejs = require('ejs')

// carichiamo crypto, la configurazione e il middleware per il database
const crypto = require('crypto');
const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/middleware');

/* GET users listing. */
router.get('/profile/:user_id', getUserBookings);
router.get('/profile/request/:owner_id', getOwnerRequestBookings);
router.get('/profile/date/:id', getDateUserBookings);
router.get('/profile/date/:structure_id/:user_id', getDateUserBookingsStructure);
router.post('/profile/response/:id', postOwnerRequest);
router.post('/profile/response/refused/:id', postOwnerRequestRefused);
router.post('/add', addBooking);
router.post('/add/guest', addGuest);
router.post('/send/email', sendEmail);
router.post('/send/confirm', sendConfirmEmail);
router.post('/send/refused', sendRefusedEmail);

/**
 * La funzione ritorna le strutture per uno specifico utente loggato
 * escludendo le strutture inserite nel suo profilo in modo tale da impedire
 * all'utente di poter prenotare una propria struttura
 */
async function getUserBookings(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let sql = `SELECT bookings.structure_id, bookings.owner_id, bookings.checkIn, bookings.checkOut,\
    bookings.totPrice, bookings.cityTax, bookings.request,\
    structure.title, structure.type, structure.place, structure.street, structure.number, structure.price,\
    users.name, users.surname, users.email\
    FROM bookings, users , structure\
    WHERE bookings.owner_id = users.id AND bookings.structure_id = structure.id AND\
    bookings.user_id = ${req.params.user_id}`;
    let results = {};   
    try {
  
        await withTransaction(db, async() => {
            results = await db.query(sql, (err, result) => {
              if(err) throw err;
              res.send(result);
            });
        });
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}

/**
 * La funzione ritorna tutte le DATE delle prenotazioni di una specifica struttura
 */
async function getDateUserBookings(req, res, next) {
  
  const db = await makeDb(config);
  let sql = `SELECT bookings.checkIn, bookings.checkOut\
  FROM bookings
  WHERE bookings.structure_id = ${req.params.id} AND (bookings.request = 0 OR bookings.request = 1)`;
  let results = {};   
  try {

      await withTransaction(db, async() => {
          results = await db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
          });
      });
  } catch (err) {
      console.log(err);
      next(createError(500));
  }
}

/**
 * La funzione ritorna tutte le date delle prenotazioni che l'utente ha confermato
 * in una specifica struttura
 */
async function getDateUserBookingsStructure(req, res, next) {
  // istanziamo il middleware
  const db = await makeDb(config);
  let sql = `SELECT bookings.checkIn, bookings.checkOut\
  FROM bookings
  WHERE  bookings.structure_id = ? AND bookings.user_id = ? AND (bookings.request = 0 OR bookings.request = 1)`;
  let results = {};   
  try {
      await withTransaction(db, async() => {
          results = await db.query(sql, [req.params.structure_id, req.params.user_id], (err, result) => {
            if(err) throw err;
            res.send(result);
          });
          res.send(results);
          res.status(200);
          res.end();
      });
  } catch (err) {
      console.log(err);
      next(createError(500));
  }
}

/**
 * La funzione ritorna la LISTA DELLE RICHIESTE DI PRENOTAZIONE DI UN UTENTE PROPRIETARIO
 */
async function getOwnerRequestBookings(req, res, next) {
  /*
    LA QUERY FUNZIONA ANCHE SENZA LA CONDIZIONE bookings.owner_id = structure.user_id
    MA è NECESSARIA PER OTTIMIZZARE IL TEMPO DI RISPOSTA 
  */
  const db = await makeDb(config);
  let sql = `SELECT bookings.id, bookings.structure_id, bookings.owner_id, bookings.checkIn, bookings.checkOut,\
  bookings.totPrice, bookings.cityTax, bookings.request,\
  structure.title, structure.type, structure.place, structure.street, structure.number, structure.price,\
  users.name, users.surname, users.email\
  FROM structure, users, bookings\
  WHERE bookings.owner_id = structure.user_id AND bookings.structure_id = structure.id AND\
  bookings.user_id = users.id AND bookings.owner_id = ${req.params.owner_id}`;
  let results = {};
  try {

      await withTransaction(db, async() => {
          results = await db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
          });
      });
  } catch (err) {
      console.log(err);
      next(createError(500));
  }
}

/**
 * La funzione aggiorna il campo booking.request = 1 di un utente specifico
 * che ha ACCETTATO LA RICHIESTA DI PRENOTAZIONE di un cliente
 */
async function postOwnerRequest(req, res, next) {
  const db = await makeDb(config);
  let results = {};
  console.log(req.params);
  var data = {
    request: 1,
  };
  var sql = `UPDATE bookings SET ? WHERE bookings.id = ${req.params.id}`;
  try {
    await withTransaction(db, async() => {
        // inserimento utente
        results = await db.query(sql, data, (err, result) => {
        if(err) throw err;
      });
    });
    res.status(202);
    res.end();
  }catch (err) {
  console.log(err);
  next(createError(500));
  }
}

/**
 * La funzione aggiorna il campo booking.request = 2 di un utente specifico
 * che ha RIFIUTATO LA RICHIESTA DI PRENOTAZIONE di un cliente
 */
async function postOwnerRequestRefused(req, res, next) {
  const db = await makeDb(config);
  let results = {};
  console.log(req.params);
  var data = {
    request: 2,
  };
  var sql = `UPDATE bookings SET ? WHERE bookings.id = ${req.params.id}`;
  try {
    await withTransaction(db, async() => {
        // inserimento utente
        results = await db.query(sql, data, (err, result) => {
        if(err) throw err;
      });
    });
    res.status(202);
    res.end();
  }catch (err) {
  console.log(err);
  next(createError(500));
  }
}

/**
 * La funzione aggiunge nel database una riga
 * nella tabella BOOKINGS con i seguenti parametri
 */
async function addBooking(req, res, next){
  const db = await makeDb(config);
  var results = {};
  console.log(req.body);
  var data = {
    user_id: req.body.user_id,
    owner_id: req.body.owner_id,
    structure_id: req.body.structure_id,
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut,
    totPrice: req.body.totPrice,
    cityTax: req.body.cityTax,
  };
  var sql = 'INSERT INTO bookings SET ?';
  try {
    await withTransaction(db, async() => {
        // inserimento utente
        results = await db.query(sql, data, (err, result)=>{
          if(err) throw err;
        })
    });
  
    res.status(201);
    res.end();
  }catch (err) {
  console.log(err);
  next(createError(500));
  }
}

/**
 * La funzione aggiunge nel database una riga
 * nella tabella GUEST con i seguenti parametri
 */
async function addGuest(req, res, next){
  const db = await makeDb(config);
  var results = {};
  var sql = 'INSERT INTO guest SET ?';
  try {
    await withTransaction(db, async() => {

      //Ricavo il booking.id
      results = await db.query(`SELECT bookings.id FROM bookings WHERE bookings.user_id = ? AND bookings.owner_id = ? AND\
      bookings.structure_id = ? AND bookings.checkIn = ? AND bookings.checkOut = ? AND\
      bookings.totPrice = ? AND bookings.cityTax = ?`, [
        req.body.user_id,
        req.body.owner_id,
        req.body.structure_id,
        req.body.checkIn,
        req.body.checkOut,
        req.body.totPrice,
        req.body.cityTax,
      ] )
      .catch(err => {
        throw err;
      });
      var string = JSON.stringify(results);
      var json = JSON.parse(string);
      let bookings_id =json[0].id;

      var data = {
        user_id: req.body.user_id,
        booking_id: bookings_id,
        name: req.body.name,
        surname: req.body.surname,
        date: req.body.date,
        document: req.body.document
      };

      // inserimento ospite
      results = await db.query(sql, data, (err, result)=>{
        if(err) throw err;
        //console.log(result);
        })
      });
  
      res.status(201);
      res.end();
  }catch (err) {
  console.log(err);
  next(createError(500));
  }
}

/**
 * La funzione aggiunge nel database una riga
 * nella tabella bookings con i seguenti parametri
 */
async function sendEmail(req, res, next){
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'infomailer210@gmail.com',
        pass: 'qwerty123,.-'
    },
    tls: { rejectUnauthorized: false }
  });
  transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
  });
  
  const db = await makeDb(config);
  var results = {};
  try {
    await withTransaction(db, async() => {

        //calcolo l'ID della prenotazione
        results = await db.query(`SELECT bookings.id FROM bookings WHERE bookings.user_id = ? AND bookings.owner_id = ? AND\
        bookings.structure_id = ? AND bookings.checkIn = ? AND bookings.checkOut = ? AND\
        bookings.totPrice = ? AND bookings.cityTax = ?`, [
          req.body.user_id,
          req.body.owner_id,
          req.body.structure_id,
          req.body.checkIn,
          req.body.checkOut,
          req.body.totPrice,
          req.body.cityTax,
        ] )
        .catch(err => {
          throw err;
      });
        console.log("RISULTATO ID:");
        var string = JSON.stringify(results);
        var json = JSON.parse(string);
        console.log(json[0].id);
        let bookings_id =json[0].id;

        //calcolo le info del cliente
        var clientInfo = {}
        results = await db.query('SELECT users.email, users.name, users.surname\
        FROM bookings, users\
        WHERE bookings.id = ? AND\
        bookings.user_id = users.id', [bookings_id])
        .catch(err => {
          throw err;
        });

        string = JSON.stringify(results);
        clientInfo = JSON.parse(string);
        console.log("Client INFO:");
        console.log(clientInfo[0].email);
        console.log(clientInfo[0].name);
        console.log(clientInfo[0].surname);

        //calcolo le info del proprietario e della struttura
        var ownerInfo = {}
        results = await db.query('SELECT bookings.checkIn, bookings.checkOut,\
        bookings.totPrice, bookings.cityTax, bookings.request,\
        structure.title, structure.type, structure.place, structure.street, structure.number, structure.price,\
        users.name, users.surname, users.email\
        FROM bookings, users , structure\
        WHERE bookings.owner_id = users.id AND bookings.structure_id = structure.id AND bookings.id = ?', [bookings_id])
        .catch(err => {
          throw err;
        });

        string = JSON.stringify(results);
        ownerInfo = JSON.parse(string);
        console.log("OWNER INFO:");
        console.log(ownerInfo[0].email);
        console.log(ownerInfo[0].name);
        console.log(ownerInfo[0].surname);

        //calcolo le info degli Ospiti
        var guestInfo = {}
        results = await db.query('SELECT guest.name, guest.surname, guest.date, guest.document\
        FROM guest\
        WHERE guest.booking_id = ?', [bookings_id])
        .catch(err => {
          throw err;
        });

        console.log("NUMBER Guest");
        string = JSON.stringify(results);
        guestInfo = JSON.parse(string);
        var length = 0;
        var i=0;
        for(var k in guestInfo){ if(guestInfo.hasOwnProperty(k)) length++;}
        console.log(length);
        
        //passo le variabili al file /email.ejs
        const data = await ejs.renderFile(
          __dirname + '/emailOrder.ejs',
          {
              clientInfo: clientInfo[0],
              ownerInfo:  ownerInfo[0],
              guestInfo:  guestInfo,
              length:  length
          }
        );

        //creo un array che contiene tutti i documenti degli ospiti
        let attachments = []
        for(i=0; i< length; i++) attachments.push({path: guestInfo[i].document})
        
        //opzioni Email
        let emailOptions = {
          from: 'infomailer210@gmail.com',
          to: [clientInfo[0].email, ownerInfo[0].email],
          subject: "RICHIESTA DI PRENOTAZIONE",
          html: data,
          attachments: attachments
        };

        //SEND EMAIL
        console.log("RISULTATO MAIL:");
        transporter.sendMail(emailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Email SEND ' + info.response);
          transporter.close(); //close connection pool!
        });
    });
    res.status(200);
    res.end();
  }catch (err) {
  console.log(err);
  next(createError(500));
  }
}

async function sendConfirmEmail(req, res, next){
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'infomailer210@gmail.com',
        pass: 'qwerty123,.-'
    },
    tls: { rejectUnauthorized: false }
  });
  transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
  });
  
  const db = await makeDb(config);
  var results = {};
  try {
    await withTransaction(db, async() => {

        let bookings_id =req.body.id;

        //calcolo le info del cliente
        var clientInfo = {}
        results = await db.query('SELECT users.email, users.name, users.surname\
        FROM bookings, users\
        WHERE bookings.id = ? AND\
        bookings.user_id = users.id', [bookings_id])
        .catch(err => {
          throw err;
        });
        string = JSON.stringify(results);
        clientInfo = JSON.parse(string);
        console.log(clientInfo[0])

        //calcolo le info del OWNER
        var ownerInfo = {}
        results = await db.query('SELECT bookings.checkIn, bookings.checkOut,\
        bookings.totPrice, bookings.cityTax, bookings.request,\
        structure.title, structure.type, structure.place, structure.street, structure.number, structure.price,\
        users.name, users.surname, users.email\
        FROM bookings, users , structure\
        WHERE bookings.owner_id = users.id AND bookings.structure_id = structure.id AND bookings.id = ?', [bookings_id])
        .catch(err => {
          throw err;
        });
        string = JSON.stringify(results);
        ownerInfo = JSON.parse(string);
        console.log(ownerInfo[0])

        //calcolo le info degli Ospiti
        var guestInfo = {}
        results = await db.query('SELECT guest.name, guest.surname, guest.date, guest.document\
        FROM guest\
        WHERE guest.booking_id = ?', [bookings_id])
        .catch(err => {
          throw err;
        });

        console.log("NUMBER Guest");
        string = JSON.stringify(results);
        guestInfo = JSON.parse(string);
        var length = 0;
        var i=0;
        for(var k in guestInfo){ if(guestInfo.hasOwnProperty(k)) length++;}
        console.log(length);

        const data = await ejs.renderFile(
          __dirname + '/emailConfirm.ejs',
          {
              clientInfo: clientInfo[0],
              ownerInfo:  ownerInfo[0],
              guestInfo:  guestInfo,
              length:  length
          }
        );

        let attachments = []
        for(i=0; i< length; i++) attachments.push({path: guestInfo[i].document})

        let emailOptions = {
          from: 'infomailer210@gmail.com',
          to: [clientInfo[0].email, ownerInfo[0].email, 'questuraExample@mail.com'],
          subject: "PRENOTAZIONE CONFERMATA",
          html: data,
          attachments: attachments
        };

        console.log("RISULTATO MAIL:");
        transporter.sendMail(emailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Email SEND ' + info.response);
          transporter.close(); //close connection pool!
        });
    });
    res.status(200);
    res.end();
  }catch (err) {
  console.log(err);
  next(createError(500));
  }
}

async function sendRefusedEmail(req, res, next){
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'infomailer210@gmail.com',
        pass: 'qwerty123,.-'
    },
    tls: { rejectUnauthorized: false }
  });
  transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
  });
  
  const db = await makeDb(config);
  var results = {};
  try {
    await withTransaction(db, async() => {

        let bookings_id =req.body.id;

        //calcolo le info del cliente
        var clientInfo = {}
        results = await db.query('SELECT users.email, users.name, users.surname\
        FROM bookings, users\
        WHERE bookings.id = ? AND\
        bookings.user_id = users.id', [bookings_id])
        .catch(err => {
          throw err;
        });
        string = JSON.stringify(results);
        clientInfo = JSON.parse(string);

        //calcolo le info del OWNER
        var ownerInfo = {}
        results = await db.query('SELECT bookings.checkIn, bookings.checkOut,\
        bookings.totPrice, bookings.cityTax, bookings.request,\
        structure.title, structure.type, structure.place, structure.street, structure.number, structure.price,\
        users.name, users.surname, users.email\
        FROM bookings, users , structure\
        WHERE bookings.owner_id = users.id AND bookings.structure_id = structure.id AND bookings.id = ?', [bookings_id])
        .catch(err => {
          throw err;
        });
        string = JSON.stringify(results);
        ownerInfo = JSON.parse(string);

        const data = await ejs.renderFile(
          __dirname + '/emailRefused.ejs',
          {
              clientInfo: clientInfo[0],
              ownerInfo:  ownerInfo[0]
          }
        );

        let emailOptions = {
          from: 'infomailer210@gmail.com',
          to: [clientInfo[0].email, ownerInfo[0].email],
          subject: "PRENOTAZIONE RIFIUTATA",
          html: data
        };

        console.log("RISULTATO MAIL:");
        transporter.sendMail(emailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Email SEND ' + info.response);
          transporter.close(); //close connection pool!
        });
    });
    res.status(200);
    res.end();
  }catch (err) {
  console.log(err);
  next(createError(500));
  }
}
module.exports = router;
 