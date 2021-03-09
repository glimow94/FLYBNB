var express = require('express');
var router = express.Router();

// carichiamo crypto, la configurazione e il middleware per il database
const crypto = require('crypto');
const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/middleware');

/* GET users listing. */
router.get('/:structure_place', getStructures);
router.get('/profile/:user_id', getUserStructures);
router.get('/search/:structure_place/:user_id', getSpecificStructures);
router.post('/add', addStructure);
router.post('/update/:id', updateStructure);
router.post('/update/statement/:itemID', updateStatement);

/**
 * La funzione ritorna tutte le STRUTTURE
 */
async function getStructures(req, res, next) {
  const db = await makeDb(config);
  let sql = `SELECT structure.id, structure.title, structure.user_id, structure.type,\
  structure.place, structure.street, structure.number, structure.post_code, structure.description,\
  structure.location_description, structure.beds, structure.price, structure.fullboard, structure.wifi,\
  structure.parking, structure.kitchen, structure.airConditioner,\
  structure.image1, structure.image2, structure.image3, structure.image4,\
  users.name, users.surname, users.email\
  FROM structure, users\
  WHERE (structure.place LIKE '%${req.params.structure_place}%' OR structure.title LIKE '%${req.params.structure_place}%') AND users.id = structure.user_id`;
  let results = {};
  try {

      await withTransaction(db, async() => {
          // inserimento utente
          results = await db.query(sql, (err, result) => {
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
 * La funzione ritorna tutte le STRUTTURE PRENOTABILI di un Utente loggato:
 * ovvero Tutte le strutture tranne quelle inserite nel proprio profilo
 */
async function getSpecificStructures(req, res, next) {
  const db = await makeDb(config);
  let sql = `SELECT structure.id, structure.title, structure.user_id, structure.type,\
  structure.place, structure.street, structure.number, structure.post_code, structure.description,\
  structure.location_description, structure.beds, structure.price, structure.fullboard, structure.wifi,\
  structure.parking, structure.kitchen, structure.airConditioner,\
  structure.image1, structure.image2, structure.image3, structure.image4,\
  users.name, users.surname, users.email\
  FROM structure, users\
  WHERE (structure.place LIKE '%${req.params.structure_place}%' OR structure.title LIKE '%${req.params.structure_place}%') AND users.id = structure.user_id AND users.id != ?`;
  let results = {};
  try {
      await withTransaction(db, async() => {
          results = await db.query(sql, [req.params.user_id],  (err, result) => {
            if(err) throw err;
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
 * La funzione ritorna tutte le STRUTTURE CHE POSSIDE UN UTENTE
 * visualizabili nel proprio profilo utente
 */
async function getUserStructures(req, res, next) {
  const db = await makeDb(config);
  let sql = `SELECT structure.id, structure.title, structure.user_id, structure.type,\
  structure.place, structure.street, structure.number, structure.post_code, structure.description,\
  structure.location_description, structure.beds, structure.price, structure.fullboard, structure.wifi,\
  structure.parking, structure.kitchen, structure.airConditioner,\
  structure.image1, structure.image2, structure.image3, structure.image4, structure.start_date, structure.statement\
  FROM structure, users\
  WHERE structure.user_id = users.id AND users.id = ${req.params.user_id}`;
  let results = {};
  try {
      await withTransaction(db, async() => {
          results = await db.query(sql, (err, result) => {
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
 * La funzione aggiunge nel database una riga
 * nella tabella STRUCTURE con i seguenti parametri
 */
async function addStructure(req, res, next){
  const db = await makeDb(config);
  let results = {};
  //console.log(req.body);
  
  var data = {
    user_id: req.body.user_id,
    title: req.body.title,
    type: req.body.type,
    place: req.body.place,
    street: req.body.street,
    number: req.body.number,
    post_code: req.body.post_code,
    description: req.body.description,
    location_description: req.body.location_description,
    beds: req.body.beds,
    price: req.body.price,
    fullboard: req.body.fullboard,
    wifi: req.body.wifi,
    parking: req.body.parking,
    kitchen: req.body.kitchen,
    airConditioner: req.body.airConditioner,
    image1: req.body.image1,
    image2: req.body.image2,
    image3: req.body.image3,
    image4: req.body.image4,
    start_date: req.body.start_date
  };
  var sql = 'INSERT INTO structure SET ?';
  try {
    await withTransaction(db, async() => {
        // inserimento utente
        results = await db.query(sql, data, (err, result) => {
        if(err) throw err;
      });
    });
    res.status(201);
    res.end();
  }catch (err) {
    console.log(err);
    next(createError(500));
  }
}

/**
 * La funzione aggiorna i campi selezionati nella tabella structure con uno specifico id;
 * PERMETTE ALL'UTENTE DI MODIFICARE LE PROPRIE STURTTURE
 */
async function updateStructure(req, res, next){
  const db = await makeDb(config);
  let results = {};
  var data = {
    title: req.body.title,
    type: req.body.type,
    place: req.body.place,
    street: req.body.street,
    number: req.body.number,
    post_code: req.body.post_code,
    description: req.body.description,
    location_description: req.body.location_description,
    beds: req.body.beds,
    price: req.body.price,
    fullboard: req.body.fullboard,
    wifi: req.body.wifi,
    parking: req.body.parking,
    kitchen: req.body.kitchen,
    airConditioner: req.body.airConditioner,
    image1: req.body.image1,
    image2: req.body.image2,
    image3: req.body.image3,
    image4: req.body.image4
  };
  var sql = `UPDATE structure SET ? WHERE structure.id = ${req.params.id}`;
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

async function updateStatement(req, res, next){
  const db = await makeDb(config);
  let results = {};

  var updateValue = req.body.statementNumber + 1;
  var data = {
    statement: updateValue
  };

  try {
    await withTransaction(db, async() => {
        // inserimento utente
        results = await db.query(`UPDATE structure SET ? WHERE structure.id = ${req.params.itemID}`, data)
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
