var mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/index1')
//sql connection
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    multipleStatements : true
});
connection.connect(function(err){
    if(!err) {
        console.log("Database is connected.");
    } else {
        console.log("Error connecting database.");
    }
    });

    async function signup(req,res){
        const password = req.body.password;
        const encryptedPassword = await bcrypt.hash(password, saltRounds)
        // var users={
        //     "Fname": req.body.fname,
        //     "Lname": req.body.lname,
        //     "Gender": req.body.gender,
        //     "Email":req.body.email,
        //     "Password":encryptedPassword,
        //     "Ph_no": req.body.phone,
        //     "College": req.body.college,
        //  }
         console.log(req.body);
        
        connection.query('insert into Student values(null, ?, ?, ?, ?, ?, ?, ?)',[req.body.fname, req.body.lname, req.body.gender, req.body.email, encryptedPassword, req.body.phone, req.body.college], function (error, results, fields) {
          if (error) {
            return res.status(400).json({
              "code":400,
              "failed":"Error ocurred."
            })
          } else {
            res.redirect('/login');
            }
        });
       
    }
    async function login(req,res){
      var email= req.body.email;
      var password = req.body.password;
      connection.query('SELECT * FROM Student WHERE Email = ?',[email], async function (error, results, fields) {
        if (error) {
          return res.status(400).json({
            "code":400,
            "failed":"error ocurred"
          })
        }else{
          if(results.length >0){
            console.log(results);
            const comparision = await bcrypt.compare(password, results[0].St_Password)
            if(comparision){
              isLoggedIn.setValue(1);
              isLoggedIn.setUser(results[0].Fname + ' ' + results[0].Lname);
              isLoggedIn.setId(results[0].User_id);
              res.redirect('/');
            }
            else{
              res.render('D:/DBMS-Project/views/auth/login.ejs', {params : 204})
            }
          }
          else{
            res.render('D:/DBMS-Project/views/auth/login.ejs', {params : 206})

          }
        }
        });
    }

router.post('/signup', signup);
router.post('/login', login);
// module.exports = isLoggedIn;
module.exports = router;

