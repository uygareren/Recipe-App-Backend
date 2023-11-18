const connection = require("../config/db");

module.exports = class Recipe {
    constructor(recipe_name, recipe_image, recipe_desc, category_id) {
        this.recipe_name = recipe_name;
        this.recipe_image = recipe_image;
        this.recipe_desc = recipe_desc;
        this.category_id = category_id;
    }


    static saveRecipe(recipe){
        return new Promise((resolve, reject) => {
            if (!recipe){
                reject({status: 400, message:"Recipe dolu olmalı!"})
            }

            if(recipe.recipe_name && recipe.recipe_image && recipe.recipe_desc && recipe.category_id){
            const sql = 'INSERT INTO recipe (recipe_name, recipe_image, recipe_desc, category_id) VALUES (?, ?, ?, ?)';
            connection.query(sql, [recipe.recipe_name, recipe.recipe_image, recipe.recipe_desc, recipe.category_id], (err, result) => {
                if (err) {
                    console.error('Veritabanına ekleme hatası: ' + err.message);
                    reject({status:400, error: 'Kayıt sırasında bir hata oluştu' });
                }

                resolve({status:200, success: 'Recipe başarıyla kaydedildi' });
            });
            }

        })

    }

    static getRecipeById(id){
        return new Promise((resolve, reject) => {
            if(!id){
                reject({status:400, message:"İd hatalı!"})
            }else {
                connection.query("SELECT * FROM recipe WHERE id = ?", [id], (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (results.length === 0) {
                            resolve(null); // ID'ye adresine sahip kullanıcı yok
                        } else {
                            resolve({status: 200, result:results[0]}); // Id'ye adresine sahip kullanıcı bulundu
                        }
                    }
                });
            }


        })
    }

    static deleteById(id) {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject({ status: 400, message: "ID hatalı!" });
            } else {
                connection.query("DELETE FROM recipe WHERE id = ?", [id], (error, result) => {
                    if (error) {
                        console.error('Veritabanından silme hatası: ' + error.message);
                        reject({ status: 400, error: 'Silme işlemi sırasında bir hata oluştu' });
                    } else {
                        if (result.affectedRows === 0) {
                            resolve({ status: 404, message: 'Silinecek tarifi bulunamadı' });
                        } else {
                            resolve({ status: 200, success: 'Tarif başarıyla silindi' });
                        }
                    }
                });
            }
        });
    }
    

    
};
