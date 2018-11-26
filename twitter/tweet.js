const limitCtrlCollection = require('../mongo/limitCtrl');
const config = require('../config');
const util = require('../util');

module.exports = function(text, replyId, screenName){
    return new Promise(function(resolve, reject){
        limitCtrlCollection.update(config.twitter.tweet.name)
        .then((remain) => {return tweet(text, replyId, screenName, remain)})
        .then(() => {resolve()})
        .catch((err) => {
            console.log("[" + util.getDateTimeString() + "] Main");
            console.log(replyId, screenName);
            console.log(err);
            reject(err);
        });
    });
}

var tweet = function(text, replyId, screenName, remain){
    return new Promise(function(resolve, reject){
        if(remain > 0) {
            var param ={}
            param['status'] = !screenName? text: `@${screenName} ${text}`;
            param['in_reply_to_status_id'] = !replyId? null: replyId;
            config.TwitterClient.post('statuses/update', null, param)
            .then((result) => {
                resolve();
            })
            .catch((err) => {
                console.log("[" + util.getDateTimeString() + "] tweet");
                console.log(replyId, screenName);
                console.log(err);
                reject(err);
            });

        } else {
            reject("Limit: tweet");
        }
    });
}
