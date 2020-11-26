//imports
const express = require('express')
const app=express()
const port = 3668
const mysql = require('mysql')
var bodyParser = require('body-parser')
require('dotenv').config()
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
app.use(bodyParser.urlencoded({ extended: false }))

//set views
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    let q = 'select * from Residence r join Image i on r.Residence_ID = i.Residence_ID join Location l on r.Residence_ID = l.Location_ID;select * from Satisfactory';
    connection.query(q, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.render('index', {text: result})
      });
    
})

// app.get('/', (req,res) => {
//     connection.query("select * from Hos_Features hf join Residence r on hf.Residence_ID = r.Residence_ID where hf.Residence_ID=1", function(err, result, fields){
//         if(err) throw err;
//         console.log(result)
//         console.log(typeof result)
//     });
//     res.render('in');
// })

app.get('/properties', (req,res) => {
    connection.query('select * from Residence r join Image i on r.Residence_ID = i.Residence_ID join Location l on r.Residence_ID = l.Location_ID', function(err, result, fields) {
        if(err) throw err;
        console.log(result);
        res.render('properties', {properties : result});
    });
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
    let q = "select * from Residence r join Image i on r.Residence_ID = i.Residence_ID join Location l on r.Residence_ID = l.Location_ID where r.Residence_ID = ?;select * from Hos_Features hf join Gen_Amenities ga on hf.Gen_ID = ga.Gen_ID where hf.Residence_ID =?;select Email,Ph_no from _Owner o join Residence r on o.Owner_id = r.Owner_ID where r.Residence_ID=?"

    connection.query(q,[req.params.id,req.params.id,req.params.id],function(err, result, fields){  
        if(err) throw err;
        res.render('properties-single',{property : result});
    });
    
});

app.post('/:id/create',(req,res) => {
    console.log(req.params.id);
    console.log(req.body.rev);
    let t="/"+req.params.id;
    req.params.id=parseInt(req.params.id);
    let q = "insert into Review values(null,?,4,now(),1,?);select * from Review where Student_id=1;";
    connection.query(q,[req.body.rev,req.params.id],function(err,result,fields){
        if(err) throw err;
        console.log(result[1]);
        res.redirect(t);
    });
    
});

//listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`));
