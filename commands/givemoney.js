const Discord = require("discord.js");
const mysql = require("mysql");
const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder } = require("discord.js");
module.exports = {
    name: "givemoney",
    description: "lexuizm back-end",
    run: async(client, message, args) => {
        if(!message.member.roles.cache.has("1268970020168532048")) {
            const yetkiyok = new EmbedBuilder()
            .setTitle('Yetkiniz Yok!')
            .setDescription('Bu komutu kullanmak için gerekli role sahip değilsiniz.')
            .setColor('Red')
            return message.reply({ embeds: [yetkiyok] });
        }

        if(!args[0] || !args[1]) return message.reply("Kullanım: .givemoney <karakter-adı> <miktar>");
        
        const kullanıcı = args[0];
        const miktar = args[1];

        const config = require("../config.json");
        let connection = mysql.createConnection({
            host: `localhost`,
            user: `root`,
            password: `${config.sqlpassword}`,
            database: `${config.sqldatabase}`
        });

        const sorgu = connection.query(`SELECT * FROM characters WHERE charactername = '${kullanıcı}'`);
        sorgu.on('result',function(row){
            const acName = row['charactername'];
            const money = row['money']; 
            connection.connect(function (err) {
                if(!acName) return;
                let sqlSorgusu = `UPDATE characters SET money = money + '${miktar}' WHERE charactername = '${kullanıcı}'`;
                connection.query(sqlSorgusu, function (err, results) {
                    const logEmbed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle('İC Para verildi!')
                    .setDescription(`${message.author.tag} tarafından **${acName}** isimli karaktere **${miktar}** miktar İC Para verildi!`)
                    .setTimestamp()
                    .setFooter({ text: `Kişinin İC Para verilmeden önceki bakiyesi: ${money}`, iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true})})
                    message.reply({embeds: [logEmbed]})
                    client.channels.cache.get("1221553097055277096").send({embeds: [logEmbed]})
                });
            });
        });
    }
}