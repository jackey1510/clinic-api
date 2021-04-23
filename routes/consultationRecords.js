const express = require('express');
const router = express.Router();
// const consultationRecords = require('../services/consultationRecords');
const db = require('../db');
const helper = require('../helper');
const config = require('../config');

router.get('/', verifyToken, async function(req, res, next) {
  let page = req.query.page || 1
  try {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
    `SELECT clinic_name, doctor_name, patient_name, diagnosis, medication, consultation_fee, IF(has_follow_up, 'true', 'false') has_follow_up, created_at AS date 
    FROM consultation_records where user_id = ? ORDER BY CREATED_AT DESC LIMIT ? OFFSET ?`, 
    [
      res.user_id, config.listPerPage + "", offset + ""
    ]
    );
    const data = helper.emptyOrRows(rows);
    const meta = {page};

    
    res.status(200).json({
    data,
    meta});
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
      res.user_id, res.clinic_name, body.doctor_name, body.patient_name, body.diagnosis || null, body.medication || null, body.consultation_fee || 0, body.has_follow_up === true ? 1 : 0
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
     `SELECT user_id, clinic_name FROM auth_tokens JOIN clinic_users on clinic_users.id = user_id WHERE token = ? AND auth_tokens.created_at > ?`,[token, date]
     );
    if (result.length === 0){
      return res.status(401).json({message: "Authorization token invalid"});
    }
    res.user_id = result[0].user_id
    res.clinic_name = result[0].clinic_name
    

    next();
  }
  catch(err){
    return res.status(500).json({message: err.message});
  }
   
}




module.exports = router;