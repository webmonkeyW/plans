var express = require('express');
var router = express.Router();
var OAuth = require('wechat-oauth');
// 微信授权和回调
var client = new OAuth('', '');
var domain = '';


var userInfo;
// 主页,主要是负责OAuth认证
router.get('/', function(req, res, next) {
    var url = client.getAuthorizeURL('http://' + domain + '/c', '123', 'snsapi_userinfo');
    res.redirect(url);
});




/**
 * 认证授权后回调函数
 *
 */
router.get('/c', function(req, res, next) {
    console.log('---- weixin callback -----');
    var code = req.query.code;
    client.getAccessToken(code, function(err, result) {
        console.dir(result);
        var accessToken = result.data.access_token;
        var openid = result.data.openid;
        client.getUser(openid, function(err, result) {
            userInfo = result;
        });
    });
    res.render('index', { title: "工作计划" });
});







router.post('/getwxinfo', function(req, res) { //发送本微信相关信息
    res.send(userInfo);
});



module.exports = router;
