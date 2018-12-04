const express = require('express');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');

const demoRouter = require('./routes/demo');
const bodyParser = require('body-parser');

const server = express();
server.listen(5050);
//托管静态资源
server.use(express.static('public'));

server.use(express.static('ajax_dir'));
//使用bodyParse
server.use(bodyParser.urlencoded({extended: false}));
//将路由器添加到路由中
server.use('/user', userRouter);
server.use('/product', productRouter);

server.use('/demo', demoRouter);