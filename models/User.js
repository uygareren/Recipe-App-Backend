const connection = require("../config/db");

module.exports = class User {
    constructor(name, surname, email, password, confirm_password) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.confirm_password = confirm_password;
    }

    static saveUser(user) {
        return new Promise((resolve, reject) => {
            // Şifre kontrolü
            if (user.password != user.confirm_password) {
                reject({status: 400, error: 'Şifreler eşleşmiyor' });
            }

            // MySQL'e veri ekleme
            const sql = 'INSERT INTO user (name, surname, email, password, confirm_password) VALUES (?, ?, ?, ?, ?)';
            connection.query(sql, [user.name, user.surname, user.email, user.password, user.confirm_password], (err, result) => {
                if (err) {
                    console.error('Veritabanına ekleme hatası: ' + err.message);
                    reject({status:400, error: 'Kayıt sırasında bir hata oluştu' });
                }

                console.log('Kullanıcı başarıyla kaydedildi');
                resolve({status:200, success: 'Kullanıcı başarıyla kaydedildi' });
            });
        });
    };

    static getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            if (!email) {
                reject({status: 400, error: "E-mail boş bırakılamaz" });
            } else {
                connection.query("SELECT * FROM user WHERE email = ?", [email], (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (results.length === 0) {
                            resolve(null); // E-posta adresine sahip kullanıcı yok
                        } else {
                            resolve(results[0]); // E-posta adresine sahip kullanıcı bulundu
                        }
                    }
                });
            }
        });
    }
    
    
};
