'use strict'

var Koa = require('koa');
var wechat = require('./wechat/g');
var config = require('./config');
var weixin = require('./weixin');

//Koa框架的所有中间件都必须是生成器函数
var app = new Koa();
app.use(wechat(config.wechat, weixin.reply));	//将weixin.reply也作为参数传入

app.listen(1234);
console.log('Listening: 1234!');
