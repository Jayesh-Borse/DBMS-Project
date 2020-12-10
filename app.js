//imports
const express = require('express')
const app=express()
const port = 3668
const mysql = require('mysql')
var bodyParser = require('body-parser')
const isLoggedIn = require('./middleware/index1')
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
app.use(bodyParser.json());


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//set views
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    let q = 'select * from Residence r join Image i on r.Residence_ID = i.Residence_ID join Location l on r.Residence_ID = l.Location_ID;select * from Satisfactory;select count(*) as var from Residence; select count(*) as var from Student; select count(*) as var from Review;';
    connection.query(q, function (err, result, fields) {
        if (err) throw err;
        // console.log(result);
        const userStatus = isLoggedIn;
        res.render('index', {text: result, userStatus: userStatus})
      });
    
})

app.get('/properties', (req,res) => {
    connection.query('select * from Residence r join Image i on r.Residence_ID = i.Residence_ID join Location l on r.Residence_ID = l.Location_ID', function(err, result, fields) {
        if(err) throw err;
        // console.log(result);
        const userStatus = isLoggedIn;
        res.render('properties', {properties : result, userStatus: userStatus});
    });
})

app.get('/about', (req, res) => {
    let q = 'select * from Residence r join Image i on r.Residence_ID = i.Residence_ID join Location l on r.Residence_ID = l.Location_ID;select * from Satisfactory;select count(*) as var from Residence; select count(*) as var from Student; select count(*) as var from Review;';
    connection.query(q, function (err, result, fields) {
        if (err) throw err;
        // console.log(result);
        const userStatus = isLoggedIn;
        res.render('about', {text: result, userStatus: userStatus})
      });
    
})

app.get('/contact', (req,res) => {
    const userStatus = isLoggedIn;
    res.render('contact', {userStatus: userStatus})
})

app.get('/signup', (req,res) => {
    res.render('auth/signup')
})

app.get('/login', (req,res) => {
    res.render('auth/login', {params : 200})
})

app.get('/logout', (req,res) => {
    isLoggedIn.setValue(0);
    console.log(isLoggedIn.getValue());
    res.redirect('/');
})

app.get('/:id', (req,res) => {
    let q = "select * from Residence r join Image i on r.Residence_ID = i.Residence_ID join Location l on r.Residence_ID = l.Location_ID where r.Residence_ID = ?;select * from Hos_Features hf join Gen_Amenities ga on hf.Gen_ID = ga.Gen_ID where hf.Residence_ID =?;select Email,Ph_no from _Owner o join Residence r on o.Owner_id = r.Owner_ID where r.Residence_ID=?;select * from Review re join Student s on re.Student_ID=s.User_id join Residence r on re.Residence_ID = r.Residence_ID where re.Residence_ID=?;"
    // let q = "select * from Residence r join Image i on r.Residence_ID = i.Residence_ID join Location l on r.Residence_ID = l.Location_ID where r.Residence_ID = ?";
    connection.query(q,[req.params.id,req.params.id,req.params.id,req.params.id],function(err, result, fields){  
        if(err);
        console.log(result);
        if(isLoggedIn.getValue()){
            res.render('properties-single',{property : result, userStatus : isLoggedIn});
        }
        else{
            res.redirect('/login');
        }
    });
    
});

app.post('/:id/create',(req,res) => {
    console.log(req.params.id);
    console.log(req.body.rev);
    let t="/"+req.params.id;
    req.params.id=parseInt(req.params.id);
    let q1 = "select count(*) from Student";
    let count = 0;
    connection.query(q1,function(err, result, fields){
        if(err) throw err;
        console.log(result[0]["count(*)"]);
        count = result[0]["count(*)"];
    });
    let q = "insert into Review values(null,?,4,now(),?,?);select * from Review where Student_ID=?";
    const id = isLoggedIn.getId();
    connection.query(q,[req.body.rev,id,req.params.id,id],function(err,result,fields){
        if(err) throw err;
        console.log(result[1]);
        // console.log(result);
        res.redirect(t);
    });
    
});

app.post('/search', (req, res) => {
    console.log("enetered");
    //console.log(req.params.id);
    var acc = req.body.Accomodate;
    let q = "select * from search3 where Category_Name=? and Gender_Type=? and Area_Name=?";
    let loc = req.body.location;
    let im = connection.query(q, [acc , req.body.gender, req.body.location], function (err, result, fields) {
        if (err) throw err;
        // console.log(req.body);
        // console.log(result);
        const userStatus = isLoggedIn;
        res.render('search_properties', {properties: result,loc : loc, userStatus: userStatus})
      });

})

app.post('/searchad', (req, res) => {
    console.log("enetered");
    //console.log(req.params.id);
    var acc = req.body.accomodation;
    var intime = parseInt(req.body.in_time);
    let loc = req.body.location;
    let q = "select * from search_advance where Category_Name=? and Gender_Type=? and Area_Name=? and InTime_ID=? and Type_Name=?";
    let im = connection.query(q, [acc , req.body.gender, req.body.location, intime, req.body.accomodation_type], function (err, result, fields) {
        if (err) throw err;
        console.log(req.body);
        console.log(result);
        const userStatus = isLoggedIn;
        res.render('search_properties', {properties: result, loc : loc, userStatus: userStatus})

      });

})
app.use('/loginroutes', require('./routes/loginroutes'))

//listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`));
