
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
router.post('/register', (req, res) => {
    var obj = req.body;

    //判断字段是否为空
    var validateResult = validate(obj);
    //如果有字段为空，则向浏览器发送错误信息
    if (validateResult.str) {
        res.send({ code: validateResult.code, msg: validateResult.str });
        return;
    }
    //将请求到的数据存入数据库中
    var sql = 'INSERT INTO xz_user VALUES(null, ?, ?, ?, ?, null, null, 0)';
    pool.query(sql, [obj.uname, obj.upwd, obj.email, obj.phone], (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);
    });
    // console.log(req.body);
    res.send('Register Success ！！！');
});

router.post('/login', (req, res) => {
    var obj = req.body;
    var validateResult = validate(obj);
    if (validateResult.str) {
        res.send({ code: validateResult.code, msg: validateResult.str });
        return;
    }
    // console.log(obj);
    var sql = 'SELECT * FROM xz_user WHERE uname = ? AND upwd = ?';
    pool.query(sql, [obj.uname, obj.upwd], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            res.send('{code: 200, msg: `Login Success!!!`}');
        } else {
            res.send('{code: 400, msg: `name or password error!!!`}');
        }
    })
});

router.get('/del', (req, res) => {
    var obj = req.query;
    if (!obj.uid) {
        res.send({ code: 401, msg: 'uid is null !!' });
        return;
    }
    var sql = 'SELECT * FROM xz_user WHERE uid = ?';
    var sql2 = 'DELETE FROM xz_user WHERE uid = ?';
    pool.query(sql, [obj.uid], (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);
        if (result.length) {
            pool.query(sql2, [obj.uid], (err, result) => {
                if (err) {
                    throw err;
                }
                if (result.affectedRows > 0) {
                    res.send({ code: 200, msg: 'Delete Success!!' });
                } else {
                    res.send({ code: 301, msg: 'Delete Error!!' });
                }
            })
        } else {
            res.send({ code: 410, msg: ' The user is invalid!!' });
        }
    })
});

router.get('/detail', (req, res) => {
    var obj = req.query;
    var sql = 'SELECT * FROM xz_user WHERE uid = ?';
    pool.query(sql, [obj.uid], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length) {
            res.send(result[0]);
        } else {
            res.send({ code: 301, msg: 'Query Error' });
        }
        console.log(result[0]);
    });
});

router.post('/update', (req, res) => {
    var obj = req.body;
    var validateResult = validate(obj);
    //如果有字段为空，则向浏览器发送错误信息
    if (validateResult.str) {
        res.send({ code: validateResult.code, msg: validateResult.str });
        return;
    }
    var sql = 'UPDATE xz_user SET email = ?, phone = ?, user_name = ?, gender = ? WHERE uid = ?';
    pool.query(sql, [obj.email, obj.phone, obj.user_name, obj.gender, obj.uid], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.affectedRows) {
            res.send({ code: 200, msg: 'update Success !!' });
        } else {
            res.send({ code: 301, msg: 'update Error !!' });
        }
        console.log(result);
    });
});

router.get('/list', (req, res) => {
    var obj = req.query;
    var _pno = parseInt(obj.pno);
    var _count = parseInt(obj.count);

    //如果页码和每页数量为空，设置默认值
    if (!_pno) {
        _pno = 1;//如果页码为空，默认第1页
    }
    if (!_count) {
        _count = 3;//如果每页数量为空，默认显示3条记录
    }

    var start = (_pno - 1) * _count;
    var sql = 'SELECT * FROM xz_user LIMIT ?, ?';
    pool.query(sql, [start, _count], (err, result) => {
        if (err) {
            throw err;
        }
        res.send(result);
    });
});
module.exports = router;
