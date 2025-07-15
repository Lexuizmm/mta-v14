const Discord = require("discord.js");
const mysql = require("mysql");
const config = require("../config.json");

module.exports = {
    name: "bansorgula",
    description: "Belirtilen serialin ban bilgilerini gösterir ve ban kaldırma seçeneği sunar.",
    run: async(client, message, args) => {
        
        if(!message.member.roles.cache.has("1250117882839306291")) {
            return message.reply('Bu komutu kullanmak için gerekli role sahip değilsiniz.');
        }

        
        if (!args[0]) return message.reply('Kullanım: `.bansorgula <serial>`');

        const serial = args[0];

       
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

            
            connection.query('SELECT * FROM bans WHERE serial = ? ORDER BY id DESC', [serial], (err, banRows) => {
                connection.end();
                
                if (err) {
                    console.error('Database query error: ' + err.message);
                    return message.reply('Ban sorgusu sırasında bir hata oluştu: ' + err.message);
                }

                let history = '';
                let lastBanId = null;
                
                if (banRows.length === 0) {
                  
                    return message.reply('Bu kullanıcı zaten banlı değil.');
                } else {
                    banRows.forEach((ban, index) => {
                        
                        const date = new Date(ban.date).toLocaleString('tr-TR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        });

                        let line = `**Banlayan Kişi**: ${ban.admin || 'Bilinmiyor'} **Banlanma Sebebi**: ${ban.reason || 'Belirtilmemiş'} **Saat**: ${ban.hours ? ban.hours + ' saat' : 'Süresiz'}\n`;

                        history += line;

                       
                        if (index === 0) {
                            lastBanId = ban.id;
                        }
                    });
                }

               
                let messageText = `📋 ${serial} Serial Ban Sorgusu\n\n${history}\n`;
                messageText += `Ban Atan Admin: ${banRows[0]?.admin || 'Bilinmiyor'}\n`;
                messageText += `Ban Sebebi: ${banRows[0]?.reason || 'Belirtilmemiş'}\n\n`;
                messageText += `Kişinin banını kaldırmak için "evet" yazınız.`;

                message.reply(messageText);

               
                const filter = m => m.author.id === message.author.id;
                const collector = message.channel.createMessageCollector({ 
                    filter, 
                    max: 1, 
                    time: 30000 
                });

                collector.on('collect', async m => {
                    const response = m.content.toLowerCase().trim();
                    
                    if (response === 'evet') {
                       
                        let removeConnection = mysql.createConnection({
                            host: `localhost`,
                            user: `root`,
                            password: `${config.sqlpassword}`,
                            database: `${config.sqldatabase}`
                        });

                        removeConnection.connect(function(err) {
                            if (err) {
                                console.error('Database connection error: ' + err.stack);
                                return message.reply('Veritabanı bağlantısı sırasında bir hata oluştu.');
                            }

                           
                            removeConnection.query('DELETE FROM bans WHERE id = ?', [lastBanId], (err, result) => {
                                removeConnection.end();

                                if (err) {
                                    console.error('Ban kaldırma hatası: ' + err.message);
                                    return message.reply('Ban kaldırılırken bir hata oluştu.');
                                }

                                message.reply('Ban başarıyla kaldırıldı.');
                            });
                        });
                    } else {
                        message.reply('Ban kaldırma işlemi iptal edildi.');
                    }
                });

                collector.on('end', collected => {
                    if (collected.size === 0) {
                        message.reply('Zaman aşımı. İşlem iptal edildi.');
                    }
                });
            });
        });
    }
}; 