var mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const router = express.Router();

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
              res.redirect('/');
            }
            else{
              return res.status(204).json({
                   "code":204,
                   "success":"Email and password does not match"
              })
            }
          }
          else{
            return res.status(206).json({
              "code":206,
              "success":"Email does not exist."
                });
          }
        }
        });
    }

      // async function login(req,res){
      //   var email= req.body.email;
      //   var password = req.body.password;
      //   console.log(email);
      //   console.log(password);
      //   const encryptedPassword = await bcrypt.hash(password, saltRounds)
      //   console.log(encryptedPassword)
      //   connection.query('select * from Student where Email = ?',[email], async function (error, results, fields) {
      //     if (error) {
      //       res.send({
      //         "code":400,
      //         "failed":"Error ocurred."
      //       })
      //     }else{
      //       if(results.length >0){
      //         const comparision = await bcrypt.compare(password, results[0].password)
      //         console.log(comparision);
      //         if(comparision){
      //             res.send({
      //               "code":200,
      //               "success":"Login successful."
                    
      //             })
      //         }
      //         else{
      //           res.send({
      //                "code":204,
      //                "success":"Email and password does not match."
      //           })
      //         }
      //       }
      //       else{
      //         res.send({
      //           "code":206,
      //           "success":"This email address does not exist."
      //             });
      //       }
      //     }
      //     res.render('/');
      //   });
      // }
router.post('/signup', signup);
router.post('/login', login);
module.exports = router;

