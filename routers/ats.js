const router = require('express').Router();
const database = require('../database/database');
const createHttpErrors = require('http-errors');

const ATSCODE_LENGTH = 6;

function validator (req, res, next) {
  if (isNaN(req.body.ats)) {
    let error_message = 'enter only numbers'
    return res.status(500).json({ error: error_message })
  } else if (req.body.ats.length != ATSCODE_LENGTH) {
    let error_message = `Enter ${ATSCODE_LENGTH} digits only`;
    return res.status(500).json({ error: error_message })
  } else {
    next();
  }
}

//POST User Input ATSCode
router.post('/', validator, function (req, res) {
      let atsCode = req.body.ats
      return database
        .query(`INSERT INTO ats_codes (id, ats_code) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET ats_code = $2`, [1, atsCode])
        .then(function () {
          return res.status(201).json({ ats: atsCode });
        })

});

//returns a random ATSCode 
function generateRandomATS() {
  return Math.floor(100000 + Math.random() * 900000)
}

//POST Randomised ATSCode
router.post('/random-ats', function (req, res, next) {

  let atsCode = generateRandomATS();

  return database
    .query(`INSERT INTO ats_codes (id, ats_code) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET ats_code = $2`, [1, atsCode])
    .then(function () {
      return res.status(201).json({ random: atsCode });
    })
    .catch(function (error) {
      if (error) {
        return next(createHttpErrors(400, `unknown error occured`));
      }
      return next(error);
    });
})

//GET ATSCode
router.get('/:id', function (req, res, next) {
  let id = req.params.id
  return database
    .query(`SELECT ats_code FROM ats_codes WHERE id = $1;`, [id])
    .then(function (result) {
      if (result.rowCount == 0) {
        let error_message = "No ATS Found";
        return res.status(200).json({ error: error_message })
      } else {
        console.log(result.rows)
        let atsCode = result.rows[0].ats_code
        return res.status(200).json({ ats: atsCode });
      }
    })
    .catch(function (error) {
      console.log(error.message)
      let error_message = error.message;
      return res.status(500).json({ error: error_message })

    });

    
});

//DELETE ATSCode
router.delete('/delete-ats', function (req, res, next) {
  return database.query(`DELETE FROM ats_codes WHERE id = $1`, [1])
  .then(function (result,error ) {
    if (error) {
      console.log(error.message)
      let error_message = error.message;
      return res.status(500).json({ error: 'error_message' })
    }
    return res.status(200).json({ deleteMessage: 'deleted'});
  });
});

module.exports = router;