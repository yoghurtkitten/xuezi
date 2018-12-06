
const express = require('express');
//创建好空路由器
var router = express.Router();
//引入连接池
var pool = require('../pool');

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
    return { str: mystr, code: mycode };
}

//添加路由

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

router.post('/validate', (req, res) => {
    var obj = req.body;
    if (!obj.uname) {
        res.send({code: 402, msg: '用户名不能为空'});        
        return;
    }
    var sql = 'SELECT * FROM xz_user WHERE uname = ?';
    pool.query(sql, [obj.uname], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length) {
            res.send({code: 401, msg: '该用户名已存在'});
        } else {
            res.send({code: 200, msg: '通过'});
        }
    });
});

router.post('/register', (req, res) => {
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
            // res.send('[{"code": 200, "msg": "Insert Success !!"}]');
            res.send({code: 200, msg: '插入成功 !!'});   
        } else {
            res.send({code: 401, msg: '插入失败 !!'});
        }
    })
});

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

router.post('/update', (req, res) => {
    var obj = req.body;
    // res.send(obj);
    var validateResult = validate(obj);
    if (validateResult.msg) {
        res.send(validateResult.msg);
        return;
    }
    var sql = 'UPDATE xz_user SET uname = ?, upwd = ?, email = ?, phone = ?, user_name = ?, gender = ? where uid = ?';
    pool.query(sql, [obj.uname, obj.upwd, obj.email, obj.phone, obj.user_name, obj.gender, obj.uid], (err, result) => {
        if (err) {
            throw err;
        } 
        if (result.affectedRows) {
            res.send({code: 200, msg: '修改成功'});
        } else {
            res.send({code: 401, msg: '修改失败'});
        }
    }); 
});

router.post('/delete', (req, res) => {
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
            res.send({code: 200, msg: '删除成功 !!!'});
        } else {
            res.send({code: 401, msg: '删除失败!!!'});
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

module.exports = router;
 