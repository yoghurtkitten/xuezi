const express = require('express');
const pool = require('../pool');
const router = express();

function validate(body) {
    var mystr = '';
    var mycode = 400
    for (const key in body) {
        if (body[key] == '') {
            mystr = `${key} is null !!`;
            break;
        }
        mycode ++;
    }
    return { msg: mystr, code: mycode };
}

router.get('/ajaxDemo', (req, res) => {

    res.send('这是第一个ajax');
});

router.get('/demologin', (req, res) => {
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
    var obj = req.body;
    var validateResule = validate(obj);
    if (validateResule.msg) {
        res.send({code: validateResule.code, msg: validateResule.msg});
        return;
    }
    var sql = 'SELECT * FROM xz_user WHERE uname = ? AND upwd = ?';
    pool.query(sql, [obj.uname, obj.upwd], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length) {
            res.send({code: 200, msg: 'Login Success!!'});
        } else {
            res.send({code: 401, msg: 'Login Error!!'});
        }
    });
});

router.post('/login', (req, res) => {
    var obj = req.body;
    var validateResule = validate(obj);
    if (validateResule.msg) {
        res.send({code: validateResule.code, msg: validateResule.msg});
        return;
    }
    var sql = 'INSERT INTO xz_user SET ?';

    pool.query(sql, [obj], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.affectedRows) {
            res.send({code: 200, msg: 'Insert Success !!'});
        } else {
            res.send({code: 401, msg: 'Insert Error !!'});
        }
    })
});

router.get('/getlist', (req, res) => {
    var sql = 'SELECT * FROM xz_user';
    pool.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length) {
            res.send(result);
        } else {
            res.send('Error!!!');
        }
    });
});

router.post('/validate', (req, res) => {
    var obj = req.body;
    var sql = 'SELECT * FROM xz_user WHERE uname = ?';
    pool.query(sql, [obj.uname], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length) {
            res.send('用户名被占用');
        } else {
            res.send('用户名可用');
        }
    });
});



module.exports = router;