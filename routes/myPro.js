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

router.post('/login', (req, res) => {
    var obj = req.body;
    var validateResult = validate(obj);
    if (validateResult.msg) {
        res.send(validateResult.msg);
        return;
    }

    var sql = 'SELECT * FROM xz_user WHERE uname = ? AND upwd = ?'
    pool.query(sql, [obj.uname, obj.upwd], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length) {
            res.send("Login Success!!");
        } else {
            res.send("Login Error!!");
        }
    });
})

router.get('/userlist', (req, res) => {
    var sql = 'SELECT * FROM xz_user';
    pool.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length) {
            res.send(result);
        } else {
            res.send('Error!!');
        }
    });
})

router.get('/del', (req, res) => {
    var obj = req.query;
    var validateResult = validate(obj);
    if (validateResult.msg) {
        res.send(validateResult.msg);
        return;
    }
    var sql = 'DELETE FROM xz_user WHERE uid = ?';

    pool.query(sql, [obj.uid], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.affectedRows) {
            res.send('Delete Success!!!');
        } else {
            res.send('Delete Error!!!');
        }
    });
})

router.post('/homework_del', (req, res) => {
    var obj = req.body;
    var validateResult = validate(obj);
    if (validateResult.msg) {
        res.send(validateResult.msg);
        return;
    }
    var sql = 'DELETE FROM xz_user WHERE uid = ?';

    pool.query(sql, [obj.uid], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.affectedRows) {
            res.send('Delete Success!!!');
        } else {
            res.send('Delete Error!!!');
        }
    });
})

router.get('/getInfoById', (req, res) => {
    var obj = req.query;
    var validateResult = validate(obj);
    if (validateResult.msg) {
        res.send(validateResult.msg);
        return;
    }
    var sql = 'SELECT * FROM xz_user WHERE uid = ?';
    pool.query(sql, [obj.uid], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length) {
            res.send(result);
        } else {
            res.send("该用户不存在");
        }
    });
});

router.post('/subUpdate', (req, res) => {
    var obj = req.body;
    // res.send(obj);
    var validateResult = validate(obj);
    if (validateResult.msg) {
        res.send(validateResult.msg);
        return;
    }
    var sql = 'UPDATE xz_user SET uname = ?, email = ?, phone = ?, user_name = ?, gender = ? where uid = ?';
    pool.query(sql, [obj.uname, obj.email, obj.phone, obj.user_name, obj.gender, obj.uid], (err, result) => {
        if (err) {
            throw err;
        } 
        if (result.affectedRows) {
            res.send('Update Success!!!');
        } else {
            res.send('Update Success!!!');
        }
    }); 
})

router.get('/update', (req, res) => {
    res.send(req.query.uid);       
})


module.exports = router;