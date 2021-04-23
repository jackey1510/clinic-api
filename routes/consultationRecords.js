const express = require('express');
const router = express.Router();
// const consultationRecords = require('../services/consultationRecords');
const db = require('../db');

router.get('/', verifyToken, async function(req, res, next) {
  try {
    const consultation_records = await db.query(
    `SELECT clinic_name, doctor_name, patient_name, diagnosis, medication, consultation_fee, IF(has_follow_up, 'true', 'false') has_follow_up, created_at AS date 
    FROM consultation_records where user_id = ?`, 
    [
      res.user_id
    ]
    );
    res.status(200).json({consultation_records});
  } catch (err) {
    console.error(`Error while getting consultation records`, err.message);
    //next(err);
    res.status(500).json({message: err.message})
  }
});

router.post('/', verifyToken, async function(req, res, next) {
  let body = req.body
  try {
    const consultation_record = await db.query(
    `INSERT INTO consultation_records (user_id, clinic_name, doctor_name, patient_name, diagnosis, medication, consultation_fee, has_follow_up) 
    VALUES(?, ?, ?, ?, ?, ? ,?, ?)`, 
    [
      res.user_id, body.clinic_name, body.doctor_name, body.patient_name, body.diagnosis || null, body.medication || null, body.consultation_fee || 0, body.has_follow_up === true ? 1 : 0
    ]
    );
    res.status(201).json({message: "Consultation record created"});
  } catch (err) {
    console.error(`Error while signing in`, err.message);
    //next(err);
    res.status(500).json({message: err.message})
  }
});

async function verifyToken(req, res, next){
  try {
    // one week ago
    // console.log(req.headers.token);
    let token = req.headers.authorization;
    if(!token){
      return res.status(401).json({message: "Authorization token invalid"});
    }
    var date = new Date();
    // token only valid for 1 week
    date.setDate(date.getDate() - 7);
    const result = await db.query(
     `SELECT * FROM auth_tokens WHERE token = ? AND created_at > ?`,[token, date]
     );
    if (result.length === 0){
      return res.status(401).json({message: "Authorization token invalid"});
    }
    res.user_id = result[0].user_id
    

    next();
  }
  catch(err){
    return res.status(500).json({message: err.message});
  }
   
}




module.exports = router;