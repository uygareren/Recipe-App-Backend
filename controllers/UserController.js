const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


exports.Register = async (req, res, next) => {
    try {
        const user = new User();

        user.name = req.query.name;
        user.surname = req.query.surname;
        user.email = req.query.email;
        user.password = req.query.password;
        user.confirm_password = req.query.confirm_password;

        const email = req.query.email
        const password = req.query.email

        const isEmail = await User.getUserByEmail(email);

        if(isEmail){
            return res.status(400).json({ message: 'User already exists!' });
        }

        if(password.length < 6){
            return res.status(400).json({message: 'Parola 6 haneden az olamaz!'})
        }


        const hashedPassword = await bcrypt.hash(password, 12);
        const isValidEmail = emailRegex.test(email);



        if (!isValidEmail) {
            return res.status(400).json({ message: 'Invalid email address!' });
        }

        User.saveUser({user})
        .then(() => {
            res.status(200).json({status:200, success: 'Kullanıcı başarıyla kaydedildi' });
        })
        .catch(error => {
            res.status(500).json({status: 500, error: error});
        });


        
    } catch (error) {
        res.status(500).json(error);
    }
};

