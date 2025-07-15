const Discord = require("discord.js");
const mysql = require("mysql");
const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder } = require("discord.js");
module.exports = {
    name: "adminver",
    description: "lexuizm back-end",
    run: async(client, message, args) => {
        if(!message.member.roles.cache.has("1268970020168532048")) {
            const yetkiyok = new EmbedBuilder()
            .setTitle('Yetkiniz Yok!')
            .setDescription('Bu komutu kullanmak için gerekli role sahip değilsiniz.')
            .setColor('Red')
            return message.reply({ embeds: [yetkiyok] });
        }

        if(!args[0] || !args[1]) return message.reply("Kullanım: .adminver <kullanıcı-adı> <verilecek-yetki>");
        
        const kullanıcı = args[0];
        const verilecekyetki = args[1];

        const yetkiyuksek = new EmbedBuilder()
        .setTitle('Başarısız!')
        .setDescription("Maalesef verilecek yetkiyi **9**'den yüksek yapamazsın.")
        .setColor('Blue')

        if(verilecekyetki > 9) return message.reply({ embeds: [yetkiyuksek] });

        const yetkidüşük = new EmbedBuilder()
        .setTitle('Başarısız!')
        .setDescription("Maalesef verilecek yetkiyi **0**'dan düşük yapamazsın.")
        .setColor('Blue')

        if(verilecekyetki < 0) return message.reply({ embeds: [yetkidüşük] });

        const config = require("../config.json");
        let connection = mysql.createConnection({
            host: `localhost`,
            user: `root`,
            password: `${config.sqlpassword}`,
            database: `${config.sqldatabase}`
        });

        var sorgu = connection.query(`SELECT * FROM accounts WHERE username = '${kullanıcı}'`);
        sorgu.on('result',function(row){
            var acName = row['username'];
            var oncekiyetki = row['admin'];
            connection.connect(function (err) {
                if(!acName) return;
                let rankSayı = verilecekyetki;
                let rankısı = "Oyuncu";
                if(rankSayı == 0) rankısı = "Oyuncu";
                if(rankSayı == 1) rankısı = "Deneme Admin";
                if(rankSayı == 2) rankısı = "Stajer Admin";
                if(rankSayı == 3) rankısı = "Admin";
                if(rankSayı == 4) rankısı = "Kıdemli Admin";
                if(rankSayı == 5) rankısı = "Lider Admin";
                if(rankSayı == 6) rankısı = "Üst Yönetim Ekibi";
                if(rankSayı == 7) rankısı = "Sunucu Yöneticisi";
                if(rankSayı == 8) rankısı = "Genel Yetkili";
                if(rankSayı == 9) rankısı = "Developer";

                let rank = "Oyuncu";
                if(rankSayı == 0) rankısı = "Oyuncu";
                if(rankSayı == 1) rankısı = "Deneme Admin";
                if(rankSayı == 2) rankısı = "Stajer Admin";
                if(rankSayı == 3) rankısı = "Admin";
                if(rankSayı == 4) rankısı = "Kıdemli Admin";
                if(rankSayı == 5) rankısı = "Lider Admin";
                if(rankSayı == 6) rankısı = "Üst Yönetim Ekibi";
                if(rankSayı == 7) rankısı = "Sunucu Yöneticisi";
                if(rankSayı == 8) rankısı = "Genel Yetkili";
                if(rankSayı == 9) rankısı = "Developer";

                let sqlSorgusu = `UPDATE accounts SET admin = '${verilecekyetki}', hiddenadmin = '0' WHERE username = '${kullanıcı}'`;
                connection.query(sqlSorgusu, function (err, results) {
                    const logEmbed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle('Admin yetkisi Verildi/Alındı/Düzenlendi!')
                    .setDescription(`${message.author.tag} tarafından **${acName}** isimli hesabın **Admin** yetkisi **${rankısı}** olarak ayarlandı!`)
                    .setTimestamp()
                    .setFooter({ text: `Kişinin önceki yetkisi: ${rank}`, iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true})})
                    message.reply({embeds: [logEmbed]})
                    client.channels.cache.get("1221553097055277096").send({embeds: [logEmbed]})
                });
            });
        });
    }
}