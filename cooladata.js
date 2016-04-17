/**
 * Created by backand on 3/27/16.
 */


var unirest = require('unirest');
var url = ''; //enter here v3 version url  //'https://api.cooladata.com/v3/ti9p1pqxkanfdfsfs8wdz94jv8jcaatag/track';
var dateConvert = require('./timeUtil');


var coolaAppender = function () {
};



//
//  This function get an array of messages and send them to cooladata
//
coolaAppender.prototype.processMessages = function (msgBulk, cb) {
    var self = this;

    // have to clone it because we have to add new fields.
    var newMsgBlk = [];
    for (var i = 0; i < msgBulk.length; i++) {
        var msg = msgBulk[i];
        var newMsg = JSON.parse(msg.origin);

        // clean message
        Object.keys(newMsg).forEach(function (key) {
            if (newMsg[key] === null) {
                newMsg[key] = "";
            }

            newMsg[key] = newMsg[key].toString().replace(/["]/g, "'").replace(/[:]/g, "").trim();

        });


        newMsg.event_name = ''; // set here event name
        newMsg.user_id = ''; // set here user_id
        newMsg.event_timestamp_epoch = ''; // set here time, use this function: dateConvert(newMsg.Time);

        newMsgBlk.push(newMsg);
    }

    // create bulk:
    var packtBefore = {"events": newMsgBlk};
    packt = encodeURIComponent(JSON.stringify(packtBefore)).replace(/'/g,"%27").replace(/"/g,"%22");

    // send to cooladata
    unirest.post(url)
        .header('Content-Type', 'application/x-www-form-urlencoded')
        .send(packt)
        .end(function (res) {

                var parsed;
                try {
                    parsed = JSON.parse(res.raw_body);
                    // you can check here result equal to msgBulk.length
                }
                catch (err) {
                    cb(err);
                    return;
                }
            }
        )
    ;
};

//
//  Allow use to send a single event
//
coolaAppender.prototype.processMessage = function(msg, cb){
    var arrayed = [msg];

    return this.processMessages(arrayed, cb);
};

module.exports = coolaAppender;


var a = new coolaAppender();
a.processMessage(a, console.log);
