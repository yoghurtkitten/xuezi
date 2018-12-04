const express = require('express');
const router = express();

router.get('/ajaxDemo', (req, res) => {

    res.send('这是第一个ajax');
});

router.get('/login', (req, res) => {
    var uname_ = req.query.uname;
    var upwd_ = req.query.upwd;

    if (!uname_) {
        res.send('用户名为空');
        return;
    }

    if (!upwd_) {
        res.send('用户名为空');
        return;
    }

    res.send(`用户名：${uname_}, 密码：${upwd_}`);
});

router.post('/postAjax', (req, res) => {
    res.send(req.body);
});



module.exports = router;