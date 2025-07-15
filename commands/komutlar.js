const Discord = require("discord.js");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "komutlar",
    description: "Tüm komutları listeler.",
    run: async(client, message, args) => {
        if(!message.member.roles.cache.has("1175395791230210169")) {
            return message.channel.send('Bu komutu kullanma izniniz yok.');
        }

        const embed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('Komutlar')
            .addFields(
                {
                    name: 'sifredegistir',
                    value: 'Kullanıcının şifresini değiştirir.',
                    inline: true
                },
                {
                    name: 'bakiyever',
                    value: 'Kullanıcıya bakiye verir.',
                    inline: true
                },
                {
                    name: 'adminver',
                    value: 'Kullanıcıya admin yetkisi verir.',
                    inline: true
                },
                {
                    name: 'serialdegistir',
                    value: 'Kullanıcının serialini değiştirir.',
                    inline: true
                },
                {
                    name: 'kullanicibul',
                    value: 'Account isminde seriali bulmaya yarar.',
                    inline: true
                },
                {
                    name: 'bansorgula',
                    value: 'Serialden ban bilgilerini sorgulamaya yarar.',
                    inline: true
                },
                {
                    name: 'banlist',
                    value: 'Sunucudaki tüm banları listeler.',
                    inline: true
                },
                {
                    name: 'serialbul',
                    value: 'Serialden account ismini bulmaya yarar.',
                    inline: true
                },
                {
                    name: 'givemoney',
                    value: 'Karaktere IC para verir.',
                    inline: true
                }
            )
            .setFooter({ 
                text: 'developed with ❤️ by lexuizm ', 
                iconURL: message.guild.iconURL({ dynamic: true })
            });

        message.reply({ embeds: [embed] });
    }
}; 