const Discord = require("discord.js");
const mysql = require("mysql");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
    name: "sifredegistir",
    description: "Belirtilen kullanıcının şifresini değiştirir.",
    run: async(client, message, args) => {
        // Role check
        if(!message.member.roles.cache.has("1250117882839306291")) {
            const yetkiyok = new EmbedBuilder()
            .setTitle('Yetkiniz Yok!')
            .setDescription('Bu komutu kullanmak için gerekli role sahip değilsiniz.')
            .setColor('Red')
            return message.reply({ embeds: [yetkiyok] });
        }

        // Argument check
        if (!args[0] || !args[1]) return message.reply('Kullanım: `.sifredegistir <kullanıcı-adı> <yeni_şifre>`');

        const username = args[0];
        const newPassword = args[1];

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

            // Önce hesabın var olup olmadığını kontrol et
            connection.query('SELECT username FROM accounts WHERE username = ?', [username], (err, rows) => {
                if (err) {
                    connection.end();
                    console.error('Database query error: ' + err.message);
                    return message.reply('Hesap kontrolü sırasında bir hata oluştu: ' + err.message);
                }

                if (rows.length === 0) {
                    connection.end();
                    return message.reply(`Kullanıcı adı: ${username} ile eşleşen hesap bulunamadı.`);
                }

                // Hesap bulundu, şifreyi güncelle
                const salt = Math.random().toString(36).substring(2, 10);
                const query = 'UPDATE accounts SET password = SHA1(CONCAT(?, ?)), salt = ? WHERE username = ?';

                connection.query(query, [salt, newPassword, salt, username], (err, results) => {
                    connection.end();

                    if (err) {
                        console.error('Database update error: ' + err.message);
                        return message.reply('Şifre değiştirilirken bir hata oluştu: ' + err.message);
                    }

                    const successEmbed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('Şifre Değiştirildi!')
                        .setDescription(`**${username}** adlı hesabın şifresi başarıyla değiştirildi.`)
                        .setTimestamp()
                        .setFooter({ text: `${message.author.tag} tarafından değiştirildi`, iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true})});

                    message.reply({ embeds: [successEmbed] });
                });
            });
        });
    }
}; 