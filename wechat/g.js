'use strict'

//有关微信测试号验证和自动回复

var sha1 = require('sha1');
var Wechat = require('./wechat');
var getRawBody = require('raw-body');
var util = require('./util');

//var weixin = require('../weixin');


module.exports = function(opts, handler) {

	//测试时，不需要票据操作；自动回复消息也不需要获取票据
	//业务层逻辑可通过生成实例来实现？？
	var wechat = new Wechat(opts);

	return function *(next) {  //返回一个生成器函数，才可以作为Koa框架的中间件
				var that = this;

				var signature = this.query.signature;
				var echostr = this.query.echostr;
				var timestamp = this.query.timestamp;
				var nonce = this.query.nonce;
				var token = opts.token;

				var str = [token, timestamp, nonce].sort().join('');
				var sha = sha1(str);

				if (this.method === 'GET') {
					if (sha = signature) {
						this.body = echostr + '';
					} else {
						this.body = 'failed!';
					}	
				}
				else if (this.method === 'POST') {
					/*if (sha !== signature) {
						this.body = 'failed!';
						return false;
					}*/
					var data = yield getRawBody(this.req, {
						length: this.length,
						limit: '1mb',
						encoding: this.charset
					})
					//console.log(data.toString());
					
					//暂停执行后面的代码，直到调用next()方法才会继续执行
					var content = yield util.parseXMLAsync(data);
					//console.log(content);

					var message = util.formatMessage(content.xml);
					console.log('message');
					console.log(message);

					this.weixin = message;
					//this.body = '大二逼呀';
					//这里应走向外层逻辑，把控制权交给业务该yield，层，来决定回复何种消息

					//通过call改变上下文，将next作为参数传递给weixin.reply
					yield handler.call(this, next);
					
					wechat.reply.call(this);	//其中有对this.body的赋值(在weixin.js中)，即产生响应



				}
			}
	}


