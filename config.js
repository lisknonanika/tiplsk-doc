const lisk = require('lisk-elements').default;
const twitter = require('twitter-lite');
const config = require('config');

function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: false,
        writable: false,
        configurable: false
    });
}

define('mode', config.mode);
define('lisk', config.lisk);
define('twitter', config.twitter);
define('mongo', config.mongo);

var liskClient = config.mode === 'test'? lisk.APIClient.createTestnetAPIClient():
                                         lisk.APIClient.createMainnetAPIClient();
define('LiskClient', liskClient);

var twitterClient = new twitter({
    consumer_key: config.twitter.apiKey,
    consumer_secret: config.twitter.apiSecret,
    access_token_key: config.twitter.accessToken,
    access_token_secret: config.twitter.accessTokenSecret,
}); 
define('TwitterClient', twitterClient);

var mongoClientParams = {auth:{user: config.mongo.user, password: config.mongo.password},
                         authSource: config.mongo.db, useNewUrlParser: true}
define('mongoClientParams', mongoClientParams);

var blacklist = ["1052365035895283712"];
define('blacklist', blacklist);

var regexp = {
    "receivekey": new RegExp(/(^[0-9a-zA-Z]{12,12}$)|(^[0-9a-zA-Z]{24,24}$)/),
    "tip": new RegExp(/(^|\s)@tiplsk\s(tip|send|チップ)\s@[0-9a-zA-Z_]{5,15}\s([1-9][0-9]{0,4}|0)(\.\d{1,5})?($|\s)/),
    "tip_s": new RegExp(/(^|\s)@tiplsk\s(tip|send|チップ)\s([1-9][0-9]{0,4}|0)(\.\d{1,5})?($|\s)/),
    "balance": new RegExp(/(^|\s)@tiplsk\s(balance|残高|所持金)($|\s)/),
    "deposit": new RegExp(/(^|\s)@tiplsk\s(deposit|入金)($|\s)/),
    "withdraw": new RegExp(/(^|\s)@tiplsk\s(withdraw|出金|送金)\s[0-9]{1,}L\s([1-9][0-9]{0,4}|0)(\.\d{1,8})?($|\s)/),
    "followme": new RegExp(/(^|\s)@tiplsk\s(followme|フォローして)($|\s)/)
}
define('regexp', regexp);

var filter = {
    track: "@tiplsk tip,@tiplsk send,@tiplsk チップ, " +
           "@tiplsk balance,@tiplsk 残高,@tiplsk 所持金, " +
           "@tiplsk deposit,@tiplsk 入金, " +
           "@tiplsk withdraw,@tiplsk 出金,@tiplsk 送金, " +
           "@tiplsk followme,@tiplsk フォローして"
}
define('filter', filter);

var liskExplorer = config.mode === 'test'? "https://testnet-explorer.lisk.io/tx/":
                                           "https://explorer.lisk.io/tx/";
var message = {
    "tipOk": ["\n\n{0} さんから {1}LSK（約{2}円） チップが届きました！",
              "\n\n{0} さんが {1}LSK（約{2}円） くれましたよ！",
              "\n\n{0} さんが {1}LSK（約{2}円） チップをくれたみたい。",
              "\n\n{1}LSK（約{2}円） {0}さんがくれたみたい。\nやったね！",
              "\n\nなんと！\n{0} さんが {1}LSK（約{2}円） くれましたよ！",
              "\n\n{0} さんからチップだよ！\n（ ・ω・）つ【{1}LSK（約{2}円）】",
              "\n\n{0} さんが {1}LSK（約{2}円） くれるみたいですよ！",
              "\n\n{0} さんが {1}LSK（約{2}円） くれましたー！",
              "\n\n{0} さんがあなたにって {1}LSK（約{2}円） くれましたよ？\n今日は何かのお祝いですか？",
              "\n\nやったやん！\n{0} さんから {1}LSK（約{2}円） 届いたで！",
              "\n\n{0} さんから {1}LSK（約{2}円） だーよー！",
              "\n\n{1}LSK（約{2}円）が {0} さんから届きました！",
              "\n\nおぉ！？\n{0} さんが {1}LSK（約{2}円） くれたよ！"],
    "tipError": ["\n\n残高不足のためチップを渡せませんでした。\n\n残高：{0}LSK",
                 "\n\n残高が不足しているみたいですよ？\n\n残高：{0}LSK",
                 "\n\nごめんなさい！\n残高が足りない時はチップを渡せないんです！\n\n残高：{0}LSK",
                 "\n\nん？間違っちゃいましたか？\n\n残高：{0}LSK",
                 "\n\n残高が足りない時はチップ渡せないって知りませんでした？\n\n残高：{0}LSK",
                 "\n\nチップむーりー\n\n残高：{0}LSK",
                 "\n\nちょいちょい！\n残高 {0}LSK なんやから無理やで！",
                 "\n\nごめんなぁ。。\n残高たりひんみたいやわぁ？\n\n残高：{0}LSK"],
    "withdrawDM": ["{0}LSK を {1} へ送金しました。\n" +
                   "承認状況はLisk Explorer等で確認してください。\n" +
                   liskExplorer + "{2}"],
    "withdrawError": ["\n\n残高不足のため出金できませんでした。\n\n出金可能：{0}LSK",
                      "\n\n出金できないみたい。\nLiskの手数料もあるから注意してね？\n\n出金可能：{0}LSK",
                      "\n\nごめんなさい！\n残高より多い枚数は出金できないんです！\n\n出金可能：{0}LSK",
                      "\n\nん？間違っちゃいましたか？\n\n出金可能：{0}LSK",
                      "\n\nそんなに出金できるほど持ってないでしょ？\n\n出金可能：{0}LSK",
                      "\n\n出金？\nムリムリ\n\n出金可能：{0}LSK",
                      "\n\n出金するにはちょーっと足りひんみたいやわぁ。。\n\n出金可能：{0}LSK"],
    "balance": ["\n\n残高は {0}LSK（約{1}円） です。\n出金時はLiskの送金手数料がかかるのでご注意ください。",
                "\n\n残高は {0}LSK（約{1}円） だよ！\n出金するときはLiskの送金手数料がかかるから注意してね？",
                "\n\n残高は {0}LSK（約{1}円） みたい。",
                "\n\n残高は～。。\n{0}LSK（約{1}円）？\nへー。",
                "\n\nんー？\n{0}LSK（約{1}円） かな？",
                "\n\n{0}LSK（約{1}円） だよ！",
                "\n\n{0}LSK（約{1}円） やで～",
                "\n\nウチの調べによると、残高は {0}LSK（約{1}円） みたいやで？",
                "\n\n残高はなんと！\n{0}LSK（約{1}円）！",
                "\n\nえーっと、残高は。。\n{0}LSK（約{1}円）！",
                "\n\n{0}LSK（約{1}円） ですよ。",
                "\n\n{0}LSK（約{1}円） 持ってるよ。",
                "\n\nな、なんと！\n{0}LSK（約{1}円） です！"],
    "depositDM": ["入金の際は発行されたKEYをトランザクションのメモ欄に入力してください。\n" +
                  "入力のし忘れ、間違いは対応できない可能性があるのでご注意ください。\n" +
                  "・KEY：{0}\n・入金先：{1}"],
    "receiveDM": ["{0}LSK 入金を確認しました。\n" +
                  "承認状況はLisk Explorer等で確認してください。\n" +
                  liskExplorer + "{1}"],
    "random": ["",
               "\n\ntiplskって？：https://lisknonanika.github.io/tiplisk/",
               "\n\ntiplskの使い方：https://lisknonanika.github.io/tiplisk/howto.html"]
}
define('message', message);