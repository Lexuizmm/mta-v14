const Discord = require("discord.js");
const mysql = require("mysql");
const config = require("../config.json");

module.exports = {
    name: "kullanicibul",
    description: "Belirtilen kullanıcının MTA serialini gösterir.",
    run: async(client, message, args) => {
        // Role check
        if(!message.member.roles.cache.has("1250117882839306291")) {
            return message.reply('Bu komutu kullanmak için gerekli role sahip değilsiniz.');
        }

        // Argument check
        if (!args[0]) return message.reply('Kullanım: `.kullanicibul <kullanıcı-adı>`');

        const username = args[0];

        // Database connection
        let connection = mysql.createConnection({
            host: `localhost`,
            user: `root`,
            password: `${config.sqlpassword}`,
            database: `${config.sqldatabase}`
        });

        connection.connect(function(err) {
            if (err) {
                console.error('Database connection error: ' + err.stack);
                return message.reply('Veritabanı bağlantısı sırasında bir hata oluştu.');
            }

            // Hesabı sorgula
            connection.query('SELECT username, mtaserial FROM accounts WHERE username = ?', [username], (err, rows) => {
                connection.end();
                
                if (err) {
                    console.error('Database query error: ' + err.message);
                    return message.reply('Hesap kontrolü sırasında bir hata oluştu: ' + err.message);
                }

                if (rows.length === 0) {
                    return message.reply(`Kullanıcı adı: ${username} ile eşleşen hesap bulunamadı.`);
                }

                const userSerial = rows[0].mtaserial || 'Yok';
                message.reply(`Kullanıcı Adı: ${username}\nSerial: ${userSerial}`);
            });
        });
    }
}; 