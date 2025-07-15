const Discord = require("discord.js");
const mysql = require("mysql");
const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
    name: "banlist",
    description: "Tüm banlı kullanıcıların listesini gösterir.",
    run: async(client, message, args) => {

        if(!message.member.roles.cache.has("1250117882839306291")) {
            return message.reply('Bu komutu kullanmak için gerekli role sahip değilsiniz.');
        }

        
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

            
            connection.query('SELECT * FROM bans', (err, banRows) => {
                connection.end();
                
                if (err) {
                    console.error('Database query error: ' + err.message);
                    return message.reply('Ban listesi sorgusu sırasında bir hata oluştu: ' + err.message);
                }

                if (banRows.length === 0) {
                    return message.reply('Hiç banlı kullanıcı bulunmuyor.');
                }

                
                const maxBansPerEmbed = 10;
                const embedPages = [];

                for (let i = 0; i < banRows.length; i += maxBansPerEmbed) {
                    const pageRows = banRows.slice(i, i + maxBansPerEmbed);
                    
                    const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle(`🚫 Ban Listesi`)
                        .setDescription(`\`\`\`
Toplam ${banRows.length} Banlı Kullanıcı
${pageRows.map((ban, index) => `
Serial: ${ban.serial}
Banlayan: ${ban.admin || 'Bilinmiyor'}
Sebep: ${ban.reason || 'Belirtilmemiş'}
Süre: ${ban.hours ? ban.hours + ' saat' : 'Süresiz'}
        `.trim()).join('\n---\n')}
\`\`\``);

                    embedPages.push(embed);
                }

                
                message.reply({ embeds: [embedPages[0]] }).then(async (sentMessage) => {
                    
                    if (embedPages.length > 1) {
                        let currentPage = 0;

                       
                        await sentMessage.react('⬅️');
                        await sentMessage.react('➡️');

                        const filter = (reaction, user) => 
                            ['⬅️', '➡️'].includes(reaction.emoji.name) && 
                            user.id === message.author.id;

                        const collector = sentMessage.createReactionCollector({ 
                            filter, 
                            time: 2 * 60 * 1000 // 2 dakika
                        });

                        collector.on('collect', async (reaction, user) => {
                           
                            await reaction.users.remove(user.id);

                           
                            if (reaction.emoji.name === '➡️' && currentPage < embedPages.length - 1) {
                                currentPage++;
                                await sentMessage.edit({ embeds: [embedPages[currentPage]] });
                            } else if (reaction.emoji.name === '⬅️' && currentPage > 0) {
                                currentPage--;
                                await sentMessage.edit({ embeds: [embedPages[currentPage]] });
                            }
                        });

                        collector.on('end', () => {
                            try {
                                sentMessage.reactions?.removeAll().catch(() => {});
                            } catch (error) {
                                console.error('Error removing reactions:', error);
                            }
                        });
                    }
                });
            });
        });
    }
}; 