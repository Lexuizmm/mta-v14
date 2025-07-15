const Discord = require("discord.js");
const mysql = require("mysql");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
    name: "serialdegistir",
    description: "Belirtilen kullanıcının MTA serialini değiştirir.",
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
        if (!args[0] || !args[1]) return message.reply('Kullanım: `.serialdegistir <kullanıcı-adı> <yeni_serial>`');

        const username = args[0];
        const newSerial = args[1];

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
            connection.query('SELECT username, mtaserial FROM accounts WHERE username = ?', [username], (err, rows) => {
                if (err) {
                    connection.end();
                    console.error('Database query error: ' + err.message);
                    return message.reply('Hesap kontrolü sırasında bir hata oluştu: ' + err.message);
                }

                if (rows.length === 0) {
                    connection.end();
                    return message.reply(`Kullanıcı adı: ${username} ile eşleşen hesap bulunamadı.`);
                }

                const oldSerial = rows[0].mtaserial;

                // Hesap bulundu, seriali güncelle
                const query = 'UPDATE accounts SET mtaserial = ? WHERE username = ?';

                connection.query(query, [newSerial, username], (err, results) => {
                    connection.end();

                    if (err) {
                        console.error('Database update error: ' + err.message);
                        return message.reply('Serial değiştirilirken bir hata oluştu: ' + err.message);
                    }

                    const successEmbed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('Serial Değiştirildi!')
                        .setDescription(`**${username}** adlı hesabın seriali başarıyla değiştirildi.`)
                        .addFields(
                            { name: 'Eski Serial', value: oldSerial || 'Yok', inline: true },
                            { name: 'Yeni Serial', value: newSerial, inline: true }
                        )
                        .setTimestamp()
                        .setFooter({ text: `${message.author.tag} tarafından değiştirildi`, iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true})});

                    message.reply({ embeds: [successEmbed] });
                });
            });
        });
    }
}; 