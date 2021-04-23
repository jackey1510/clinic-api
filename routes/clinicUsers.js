const express = require('express');
const router = express.Router();
const db = require('../db');

// /* GET programming languages. */
// router.get('/', async function(req, res, next) {
//   try {
//     res.json(await clinicUsers.getMultiple(req.query.page));
//   } catch (err) {
//     console.error(`Error while getting clinic users `, err.message);
//     next(err);
//   }
// });
router.post('/', async function(req, res, next) {
	let clinic_user = req.body;
	try {
		const bcrypt = require('bcrypt');
		const crypto = require('crypto');
		const saltRounds = 10;
		const plaintextPassword = clinic_user.password;

		var passwordValid = false;
		var emailValid = false;
		var status = 200
		var message = "error"


		var passwordValidator = require('password-validator');

		// Create a schema
		var schema = new passwordValidator();

		schema
		.is().min(8)                                    // Minimum length 8
		.is().max(100)                                  // Maximum length 100
		.has().uppercase()                              // Must have uppercase letters
		.has().lowercase()                              // Must have lowercase letters
		.has().digits(1)                                // Must have at least 1 digit
		.has().not().spaces()                           // Should not have spaces

		// validate password
		if (!schema.validate(plaintextPassword)){
			message = "Invalid password. Password must have at least 8 characters, must contain 1 uppercase letter, 1 lowercase letter, 1 digit and not contain spaces"
			status = 401
			res.status(status).json({message});
		}
		const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

		if(!emailRegexp.test(clinic_user.email)){
			message = "Invalid email"
			status = 401
			res.status(status).json({message});
		}

		// Store password hash in db
		const salt = bcrypt.genSaltSync(saltRounds);
		const hash = bcrypt.hashSync(plaintextPassword, salt);

		const result = await db.query(
			`INSERT INTO clinic_users
			(email, password, clinic_name, phone_number, country_code, address) 
			VALUES 
			(?, ?, ?, ?, ?, ?)`, 
			[
			  clinic_user.email.toLowerCase(), hash,
			  ,clinic_user.clinic_name, clinic_user.phone_number, clinic_user.country_code, clinic_user.address
			]
		);


		if (result.affectedRows) {
			message = 'New user created successfully';
		}

	// return {message, status};
    res.status(status).json({message});
  } catch (err) {
    console.error(`Error while creating clinic users`, err.message);
    //next(err);
    res.status(500).json({message: err.message})
  }
});

router.post('/signIn', async function(req, res, next) {
	let clinic_user = req.body
  try {
	  const bcrypt = require('bcrypt');
		const crypto = require('crypto');
		// const jwt = require('jsonwebtoken');
		const saltRounds = 10;
		const plaintextPassword = clinic_user.password;
		let status = 200
		let message = "Error"

		// find if email exists
		const result = await db.query(
		  `SELECT id, email, clinic_name, password FROM clinic_users WHERE email = ?`,[clinic_user.email.toLowerCase()]
		);
		//console.log(result);
		if (result.length === 0){
			message = "Email not registered"
			status = 401;
			res.status(status).json({message});
		}

		let clinic_name = result[0].clinic_name
		let email = result[0].email

		if(!bcrypt.compareSync(clinic_user.password, result[0].password)){
		 	message = "Incorrect password"
			status = 401;
			res.status(status).json({message});
		}

		const token = crypto.randomBytes(48).toString('hex');
		const genToken = await db.query(
		`INSERT INTO auth_tokens (token, user_id) VALUES (?,?)`, [token, result[0].id]
		)
		status = 200
		message = "Successfully signed in"
		res.status(status).json({message, token, clinic_name, email});
		
  } catch (err) {
    console.error(`Error while signing in`, err.message);
    //next(err);
    res.status(500).json({message: err.message})
  }
});

module.exports = router;