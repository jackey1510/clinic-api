# clinic-api
API for clinic consultation records in node.js

<h2>Database Configuration</h2>

You can add a .env file to configure the database in the root folder as the example below.

`SECRET=secret
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=clinic`

You may also run `npm run createdb.js` to initialize the database.

<h2>Start Server</h2>

`npm run index.js`
Server will listen at 3000 port or the port set in .env file.

<h2>Routes</h2>

<h3>POST /clinic_users</h3>

Register a user account. 

Arguments: 

email(String,Mandatory): Email address

password(String,Mandatory): Password must have at least 8 characters, must contain 1 uppercase letter, 1 lowercase letter, 1 digit and not contain spaces

clinic_name(String,Mandatory): Clinic Name

phone_number(integer, optional): Phone number

country_code(integer, optional): Country code of phone number

address(String, optional): Address


<h3>POST /clinic_users/signIn</h3>

Sign in for authentication. An authentication token will be returned if signed in successfully.

Arguments:

email(String,Mandatory): Email address

password(String,Mandatory): Password must have at least 8 characters, must contain 1 uppercase letter, 1 lowercase letter, 1 digit and not contain spaces

Example response: 

`{
    "message": "Successfully signed in",
    "token": "3533551ce9297e253f9b453e9895c441cff9598c6f82a5dacbd2235ac659c4726d11f712674fe7bdeb0e52c95f2e00e4",
    "clinic_name": "clinic",
    "email": "abc@email.com"
}`

<h3>POST /consultation_records</h3>

Create a consultation record. Authrization is required.

Header:

`Authorization: 3533551ce9297e253f9b453e9895c441cff9598c6f82a5dacbd2235ac659c4726d11f712674fe7bdeb0e52c95f2e00e4` (Token from sign in response)

Arguments: 

doctor_name(String, Mandatory): Name of Doctor 
 
patient_name(String, Mandatory): Name of patient
 
diagnosis(String, Optional): Diagnosis from consultation
 
medication(String, Optional): Medication for consultation

consultation_fee(Decimal, Optional): Consultation fee

has_follow_up(Boolean, Mandatory): Whether the patient needs follow up

<h3>GET /consultation_records</h3>

Get consultation records in the pass. Return 10 records per page by default.

Query: 

page: default 1

Example response:

`{
    "data": [
        {
            "clinic_name": "clinic",
            "doctor_name": "Dr. Name",
            "patient_name": "Mr. Chan",
            "diagnosis": "Cancer",
            "medication": "none",
            "consultation_fee": "100000",
            "has_follow_up": "false",
            "date": "2021-04-23T03:24:12.000Z"
        },
        {
            "clinic_name": "clinic",
            "doctor_name": "Dr. Name",
            "patient_name": "Mr. Chan",
            "diagnosis": null,
            "medication": null,
            "consultation_fee": "0",
            "has_follow_up": "false",
            "date": "2021-04-23T03:33:02.000Z"
        },
        {
            "clinic_name": "clinic",
            "doctor_name": "Dr. Name",
            "patient_name": "Mr. Chan",
            "diagnosis": null,
            "medication": null,
            "consultation_fee": "0",
            "has_follow_up": "false",
            "date": "2021-04-23T05:09:22.000Z"
        },
        {
            "clinic_name": "clinic_abc",
            "doctor_name": "Dr. Name",
            "patient_name": "Mr. Chan",
            "diagnosis": null,
            "medication": null,
            "consultation_fee": "0",
            "has_follow_up": "false",
            "date": "2021-04-23T05:09:50.000Z"
        }
    ],
    "meta": {
        "page": 1
    }
}`
 
 



  

