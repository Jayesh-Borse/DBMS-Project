//imports
const express = require('express')
const app=express()
const port = 3600
const mysql = require('mysql')


//sql connection
var connection = mysql.createConnection({
    host: "hostelmanagement.cvm78zwmdrtv.us-east-1.rds.amazonaws.com",
    user: "admin_hostel",
    password: "dqQwjrfe4J$SqvQbhavika",
    port: "3306",
    database: "hostel_db"
});

connection.connect(function(err){

    if(err){
        console.error('Database connection failed' + err.stack);
        return;
    }
    console.log('Connected to database.');

      });


//static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))


//set views
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
    
    connection.query('select * from _Owner', function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.render('in', {text: result})
      });
    
})



//listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`))
