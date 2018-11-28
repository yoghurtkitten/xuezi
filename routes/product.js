const express = require('express');
const pool = require('../pool');
var router = express.Router();

function validate(body) {
    var mystr = '';
    var mycode = 400;
    for (const key in body) {
        if (body[key] == '') {
            mystr = `${key} is null !!`;
            break;
        }
        mycode ++;
    }
    return { str: mystr, code: mycode };
}

router.get('/list', (req, res) => {
    var obj = req.query;
    var _pno = parseInt(obj.pno);
    var _count = parseInt(obj.count);
    //设置默认值
    if (!_pno) {
        _pno = 1;
    }
    if (!_count) {
        _count = 5;
    }
    
    var start = (_pno - 1) * _count;
    var sql = 'SELECT * FROM xz_laptop LIMIT ?, ?';
    pool.query(sql, [start, _count], (err, result) => {
        if (err) {
            throw err;
        }
        res.send(result);
    });
});

router.get('/detail', (req, res) => {
    var obj = req.query;
    if (!obj.lid) {
        res.send({code: 301, msg: 'lid is Require'});
        return;
    }
    var sql = 'SELECT * FROM xz_laptop WHERE lid = ?';
    pool.query(sql, [obj.lid], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length) {
            res.send(result);
        } else {
            res.send({code: 302, msg: 'lid is Error'});
        }
    });
})

router.get('/del', (req, res) => {
    var obj = req.query;
    if (!obj.lid) {
        res.send({code: 301, msg: 'lid is Require'});        
        return ;
    }
    var sql = 'DELETE FROM xz_laptop WHERE lid = ?';
    pool.query(sql, [obj.lid], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.affectedRows){
            res.send({code: 200, msg: 'Delete Success!'});        
        } else {
            res.send({code: 302, msg: 'Delete Error!'});        
        }
    });
});

router.post('/add', (req, res) => {
    var obj = req.body;
    var validateResult = validate(obj);
    if (validateResult.str) {
        res.send({code: validateResult.code, msg: validateResult.str});
        return ;
    } 
    var sql = 'INSERT INTO xz_laptop SET ?';
    pool.query(sql, [obj], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.affectedRows) {
            res.send({code: 200, msg: 'Insert Success!!'});
        } else {
            res.send({code: 301, msg: 'Insert Error!!'});
        }
    });
});

router.post('/update', (req, res) => {
    var obj = req.body;
    var validateResult = validate(obj);
    if (validateResult.str) {
        res.send(validateResult);
        return ;
    }
    var sql = 'UPDATE xz_laptop SET title = ?, subtitle = ?, family_id = ?, price = ?, promise = ?, spec = ? WHERE lid = ?';
    pool.query(sql, [obj.title, obj.subtitle, obj.family_id, obj.price, obj.promise, obj.spec, obj.lid], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.affectedRows) {
            res.send('Update Success!');
        } else {
            res.send('Update Error!');
        }
    });

});


module.exports = router;