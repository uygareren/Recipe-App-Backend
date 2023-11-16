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


        const email = req.query.email;

        const isEmail = await User.getUserByEmail(email);

        if (isEmail) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        if (user.password.length < 6) {
            return res.status(400).json({ message: 'Parola 6 haneden az olamaz!' });
        }

        
        const isValidEmail = emailRegex.test(email);

        if (!isValidEmail) {
            return res.status(400).json({ message: 'Invalid email address!' });
        }else{
            await User.saveUser(user);
            return res.status(200).json({ status: 200, message: 'Kayıt başarılı!' });

        }

        
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.Login = async (req, res, next) => {
    try {

        const email = req.query.email;
        const password = req.query.password;

        // E-posta ve şifre boş olmamalı
        if (!email || !password) {
            return res.status(400).json({ message: 'E-posta ve şifre zorunlu alanlardır.' });
        }

        // Kullanıcıyı e-posta adresine göre getir
        const user = await User.getUserByEmail(email);

        // Kullanıcı bulunamazsa hata döndür
        if (!user) {
            return res.status(400).json({ message: 'Kullanıcı bulunamadı.' });
        }


        if (password != user.password) {
            return res.status(400).json({status:400, message: 'Şifre yanlış.' });
        }else{
            return res.status(200).json({status: 200, message: "Giriş Başarılı"})
        }

        // // Başarılı giriş durumunda token oluşturabilir veya başka bir işlem yapabilirsiniz
        // const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

        // res.cookie('token', token, { httpOnly: true }).json({
        //     token,
        //     user
        // });

    } catch (error) {
        res.status(500).json(error);
    }
};

