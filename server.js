const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const UserDetails = require('./models/userModel');
const jwt = require('jsonwebtoken');
const middleware =require('./middleware');

require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;


app.use(cors({origin:"*"}));

const uri = process.env.ATLAS_URI;

mongoose.connect(uri,  { useNewUrlParser: true, useUnifiedTopology: true})

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('mongo DB connected successfully')
 });

app.use(express.json());


app.get('/', (req, res) => {
    res.send('server strted')
})

app.post('/registration', async (req, res) => {

    try {

        const { username, email, password, confirmpassword } = req.body;

        const existUser = await UserDetails.findOne({ email});
        if (existUser) {
            return res.status(400).send('User already exist');
        }
        if (password !== confirmpassword) {
            return res.status(400).send('Passwors are not matching');
        }
        let newUser = new UserDetails({
            username,
            email,
            password,
            confirmpassword
        })
        await newUser.save()
        return res.status(200).json('User added successfully')
    } catch (error) {
        console.log(error)
        return res.status(500).send('internal error')
    }

});

app.post('/login', async (req, res) => {
   try {
       const {email, password} = req.body;
       let existuser = await UserDetails.findOne({email})
       if(!existuser) {
          return res.status(400).send('user not registered')
       }
       if(existuser.password !== password){
           return res.status(400).send('Password not matching')
       }
       let payload = {
           user: {
               id: existuser.id
           }
       }
       jwt.sign(payload, 'jwtSecret', {expiresIn:3600000},
          (err, token) => {
              if(err) throw err;
              return res.json({token})
          }
        )
        
   } catch (error) {
       console.log(error)
        return res.status(500).send('internal error')
   }
});

app.get('/Dashboard', middleware,async (req, res) => {
    try {
        let existuser = await UserDetails.findById(req.user.id);
        if(!existuser){
           return res.status(400).send('user not found') 
        }
        return res.json(existuser)
    } catch (error) {
        console.log(error)
        return res.status(500).send('internal error')
    }
})

app.listen(port, () =>{
    console.log(`server listning to : ${port}`);
})