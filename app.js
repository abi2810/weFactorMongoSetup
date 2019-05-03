const express = require('express');
const path = require('path');
const morgan = require('morgan');
var bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')

// For password encryption
const bcrypt = require('bcrypt');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
// var bcrypt = require('bcryptjs');
var secret = 'supersecret';

// Image upload destination
var multer = require('multer');
var ejs = require('ejs')
var upload = multer({ dest: 'public/images/' })

//dB connection key
var mongoose = require('mongoose')
var mongodb = require('mongodb')
// const db = require('./config/key').mongoURI
const uri = require('./config/key').mongoURI
console.log(uri)

// Send OTP
var SendOtp = require('sendotp');
let authKey = require('./config/key').authKey

// create our Express app
const app = express();
// To connect mongodb
const server = http.createServer(app)

app.set('view engine', 'ejs')
app.use(express.static('/images'))
// app.use(bodyParser);
// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/public',express.static(__dirname + '/images'))
// put the HTML file containing your form in a directory named "public" (relative to where this script is located)
// app.get("/", express.static(path.join(__dirname, "./public")));

//logger
app.use(morgan());
// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors())
//routes
const v1 = require('./routes/v1');
app.use('/v1', v1);

//Db connection
const MongoClient = require('mongodb').MongoClient;

// replace the uri string with your connection string.
mongoose.connect(uri, { useNewUrlParser: true }, (err, database) =>{
    if(err)
        return console.error(err);

    const port = 3000;
    server.listen(port, ()=> console.log("hai port"));
    // app.listen(port, ()=> console.log('Listening on port'  ${port}));
});

// Load Models
var Admin = require('./data/models/admin');

app.get('/hello', (req,res)=>{
	res.send({msg:'Hello World  Checking'})
});

// // Upload general image
// app.post('/uploadfile', upload.single('image_url'), function(req,res) {
//   const host = req.host;
//   const filePath = req.protocol + "://" + host + '/' + req.file.path;
//   //home/tbc1/Documents/wefactordemo/images/1c09e54e680f964d678edcad97058889
//   console.log(filePath)
// 	res.send(req.file)
// })

// Send OTP to professions
app.post('/sendOTPtoProfessions',async(req,res,callback) =>{
  const sendOtp = new SendOtp(authKey);
  let result = await sendOtp.send('9994879415', '611332', function async(err, data, callback){
    console.log(data)
    if (data.type === "Success") {
      res.send({message:"OTP has sent your registerd number"})
    }
    else{
      sendOtp.retry("9994879415", false, function async(error, data) {
        console.log(data);
      });
    }
  });
  console.log(callback)
  res.send('Done')
})


module.exports = app;
