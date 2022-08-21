const express= require('express');
const app = express();
const router = express.Router();
const port= 4000;


const cookieParser = require('cookie-parser')

require('./middleware/handlebar')(app);

require('./middleware/session')(app);


app.use(cookieParser())

app.use(express.urlencoded({
    extended:true,
}));

/* app.use(async (req,res,next)=>{
  const { rows } = await pool.query('SELECT * FROM public."Users"');
  console.log(rows);
  next();
}); */
require('./middleware/passport')(app);

app.use('/', require('./controller/home.js'));

/* app.use('/signin', require('./controller/signin.js'));
app.use('/signup', require('./controller/signup.js')); */

app.use(express.static(__dirname + '/public'));
app.listen(port,() => console.log(`example app listening on port ${port}!`));

