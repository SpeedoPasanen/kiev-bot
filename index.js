/* 
Käyttö: 
Aseta oman Slack Incoming Webhookisi URL ao. muuttujaan
$ npm install
$ node index
*/
var slackIncomingWebHookURL = 'KORVAA OMALLA WEBHOOK-URLILLASI';
var oispaSite = 'http://oispa.kievinkanaa.com/';
var fetch = require('node-fetch');
var cheerio = require('cheerio');
fetch(oispaSite).then(resp => resp.text()).then(body => {
    var $ = cheerio.load(body);
    var exp = /kyllä/i;
    var hasKiev = exp.test($('#answer').text());
    if (hasKiev) {
        var paikat = [];
        $('.accordtitle[data-refid]').each(function () {
            paikat.push(
                $(this).text()
                    .replace(/\s{2,}/g, ' ')
                    .replace(/^\s+/, '')
                    .replace(/\s+$/, '')
            );
        });
        var postData = {
            username: 'Kiev-bot',
            icon_emoji: ':chicken:',
            text: 'Tänään on Kievin kanaa! ' + paikat.join(', ') + '. <http://oispa.kievinkanaa.com|Lue lisää »>'
        };
        var request = require('request');
        request({
            method: 'POST',
            url: slackIncomingWebHookURL,
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(postData)
        },
            (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    return;
                }
                console.log('Virhe: ' + response.statusMessage);
            }
        );
    }
}, err => {
    // Lakkasiko oispa-saitti olemasta?
});