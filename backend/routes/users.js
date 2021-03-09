var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var ejs = require('ejs')

const bodyParser = require('body-parser');
const cors = require('cors');
router.use(bodyParser.json());
router.use(cors());

const crypto = require('crypto');
const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/middleware');

/* GET users listing. */
router.get('/image/:id', getUserImage);
router.post('/update/image/:id', updateImage);
router.post('/registration', registration);
router.post('/login', authentication);
router.get('/statement/:user_id', getUserStatement);
router.post('/send/emailStatement/:itemID', sendStatement);


/**
 * La funzione ritorna l'immagine del profilo dell'utente loggato
 */
async function getUserImage(req, res, next) {
  // istanziamo il middleware
  const db = await makeDb(config);
  let sql = `SELECT users.image FROM users WHERE users.id = ${req.params.id}`;
  let results = {};
  try {
      await withTransaction(db, async() => {
          // inserimento utente
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
 * La funzione aggiunge una riga nella tabella USERS con parametri selezionati
 */
async function registration(req, res, next){
  const db = await makeDb(config);
  let results = {};
  var sql = 'INSERT INTO users SET ?';
  try {
    await withTransaction(db, async() => {
      //controllo se la email utente è già presente nella tabella users
      results = db.query('SELECT * FROM `users` WHERE ?',[{email: req.body.email}])

      //se la email non è presente
      if(JSON.stringify(results) === '{}' || JSON.stringify(results) === '[]'){
        //cripta la password e inserisci l'utente
        results = await db.query('SELECT sha2(?,512) AS encpwd', [req.body.password])
        .catch(err => {
            throw err;
        });
        
        var string = JSON.stringify(results);
        var encpwd = JSON.parse(string);
        console.log(encpwd[0].encpwd)
        var data = {
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          date: req.body.date,
          gender: req.body.gender,
          city: req.body.city,
          address: req.body.address,
          password: encpwd[0].encpwd
        };
        // inserimento utente
        results = await db.query(sql, data, (err, result) => {
            if(err) throw err;
        });
        res.status(201);
        res.end();
      }
      //ritorna errore se la email già esiste
      else{
        res.status(406);
        res.end();
      }
    });
  }catch (err) {
  console.log(err);
  next(createError(500));
  }
}


async function authentication(req, res, next){
  const db = await makeDb(config);
  console.log(req.body);
  let results = {};
  var ret = [];
  var data = {
    email: req.body.email,
    //password: req.body.password
  };
  var sql = 'SELECT * FROM `users` WHERE ?';
  try {
    await withTransaction(db, async() => {
        // inserimento utente

        results = await db.query(sql, data, (err, result) => {
        if(err) throw err;
        console.log(result);
        });
        
    });
    console.log("RISULTATO:");
    if(JSON.stringify(results) === '{}' || JSON.stringify(results) === '[]'){
      console.log('Utente non trovato!');
      //next(createError(404, 'Utente non trovato'));
      res.status(404);
    } else{
      let pwdhash = crypto.createHash('sha512'); // istanziamo l'algoritmo di hashing
      pwdhash.update(req.body.password); // cifriamo la password
      let encpwd = pwdhash.digest('hex'); // otteniamo la stringa esadecimale

      if(encpwd != results[0].password){
        console.log('Password errata!');
        //next(createError(403, 'Password errata'));
        res.status(403);
      }else{
        console.log("login successful");
        res.send(results);
        res.status(200);
      }
    }
    res.end();
  }catch (err) {
  console.log(err);
  next(createError(500));
  }
}


async function getUserStatement(req, res, next){
  const db = await makeDb(config);
  console.log(req.body);
  let results = {};

  try {
    await withTransaction(db, async() => {
        // inserimento utente
        results = await db.query(`SELECT bookings.id, structure.id AS structure_id, guest.name, guest.surname, guest.date\
        FROM bookings, structure, guest\
        WHERE bookings.id = guest.booking_id\
        AND bookings.structure_id = structure.id\
        AND bookings.owner_id = structure.user_id\
        AND structure.user_id = ?`, [req.params.user_id]);
    });
    res.send(results);
    res.end();
  }catch (err) {
  console.log(err);
  next(createError(500));
  }
}

async function updateImage(req, res, next){
  const db = await makeDb(config);
  let results = {};
  var data = {
    image: req.body.image
  };
  var sql = `UPDATE users SET ? WHERE users.id = ${req.params.id}`;
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

async function sendStatement(req, res, next){
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
  var results = {}
  var statement = {
    structure_id: req.body.structure_id,
    statementNumber: req.body.statementNumber,
    booking_list: req.body.booking_list,
    totTaxes : req.body.totTaxes,
    date1: req.body.date1,
    date2: req.body.date2,
  };
  try {
    await withTransaction(db, async() => {
      
      //calcolo le info del proprietario
      var ownerInfo = {}
      results = await db.query('SELECT structure.type, structure.title, users.name, users.surname, users.email,\
      structure.place, structure.street, structure.number, structure.post_code\
      FROM structure, users\
      WHERE structure.id = ? and structure.user_id = users.id', [statement.structure_id])
      .catch(err => {
        throw err;
      });
      string = JSON.stringify(results);
      ownerInfo = JSON.parse(string);
      
      //memorizzo la città dell'ufficio del turismo alla quale mandare la email
      var place = ownerInfo[0].place.split(',');
      console.log(place)
      console.log("NUMBER bookings");
      var length = 0;
      for(var k in statement.booking_list){ if(statement.booking_list.hasOwnProperty(k)) length++;}
      console.log(length);
      console.log(statement.structure_id);

      const data = await ejs.renderFile(
        __dirname + '/emailStatement.ejs',
        {
          item: statement.booking_list,
          length:  length,
          city: place[2],
          ownerInfo : ownerInfo[0],
          totTaxes : statement.totTaxes,
          date1: statement.date1,
          date2: statement.date2,
        }
      );

      let tourismEmail = place[2] + "Turismo@mailexample.com"
      let emailOptions = {
        from: 'infomailer210@gmail.com',
        to: [tourismEmail, ownerInfo[0].email],
        subject: "RENDICONTO "+ownerInfo[0].title,
        html: data,
      };
      console.log("RISULTATO MAIL:");
      transporter.sendMail(emailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email SEND ' + info.response);
        transporter.close(); //close connection pool!
      });
      res.status(200);

      var updateValue = statement.statementNumber + 1;
      console.log(updateValue)
      results = await db.query(`UPDATE structure SET ? WHERE  structure.id = ${req.params.itemID} `, [{statement : updateValue}])
      .catch(err => {
        throw err;
      });
      console.log("STATEMENT aggiornato con successo");
    });
    res.status(202);
    res.end();
  }catch (err) {
  console.log(err);
  next(createError(500));
  }
}

module.exports = router;
