//imports
const express = require('express')
const app=express()
const port = 3668
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
app.use('/images', express.static(__dirname + 'public/images'))


//set views
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
    
    connection.query('select * from Image', function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.render('index', {text: result})
      });
    
})

// app.get('', (req,res) => {
//     res.render('index')
// })

app.get('/properties', (req,res) => {
    res.render('properties')
})

app.get('/about', (req,res) => {
    res.render('about')
})

app.get('/contact', (req,res) => {
    res.render('contact')
})

app.get('/signup', (req,res) => {
    res.render('signup')
})

app.get('/login', (req,res) => {
    res.render('login')
})

app.get('/:id', (req,res) => {
    res.render('properties-single')
})



//listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`))
