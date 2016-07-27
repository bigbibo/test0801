'use strict'

//回复策略，即进行消息种类的区别操作

var config = require('./config');
var Wechat = require('./wechat/wechat');

var wechatApi = new Wechat(config.wechat);

exports.reply = function* (next) {
	var message = this.weixin;

	if (message.MsgType === 'event') {
		if (message.Event === 'subscribe') {
			if (message.EventKey) {
				console.log('扫二维码进来' + message.EventKey + ' ' + message.ticket);
			}

			this.body = '你订阅了这个号';
		}
		else if (message.Event === 'unsubscribe') {
			console.log('无情取关');
			this.body = '';
		}
		else if (message.Event === 'LOCATION') {
			this.body = '您上报的位置：' + message.Latitude + '/' + message.Longitude + '-' + message.Precision;
		}
		else if (message.Event === 'CLICK') {
			this.body = '您点击了菜单： ' + message.EventKey;
		}
		else if (message.Event === 'SCAN') {
			console.log('关注后扫二维码' + message.EventKey + ' ' + message.Ticket);
			this.body = '看到你扫了一下哦';
		}
		else if (message.Event === 'VIEW') {
			this.body = '您点击了菜单中的链接' + message.EventKey;
		}
	}
	else if (message.MsgType === 'text'){ 
		var content = message.Content;
		var reply = '额，你说的' + content + '太复杂了';

		if (content === '1') {
			reply = '天下第一';
		}
		else if (content === '2') {
			reply = '天下第二';
		}
		else if (content === '3') {
			reply = '天下第三';
		}
		else if (content === '4') {
			reply =  [{
				title: '技术改变世界',
				description: '只是个描述而已',
				picUrl: 'http://img0.imgtn.bdimg.com/it/u=3040442226,3914537080&fm=21&gp=0.jpg',
				url: 'https://github.com'
			}, {
				title: 'Nodejs开发微信',
				description: '爽到爆',
				picUrl: 'http://img0.imgtn.bdimg.com/it/u=3040442226,3914537080&fm=21&gp=0.jpg',
				url: 'https://nodejs.org'
			}];
		}
		else if (content === '5') {
			var filepath = __dirname + '/2.jpg';
			var data = yield wechatApi.uploadMaterial('image', filepath);
			reply = {
				type: 'image',
				mediaId: data.media_id
			}
			//console.log(reply);
		}

		else if (content === '8') {
			var filepath = __dirname + '/2.jpg';
			var data = yield wechatApi.uploadMaterial('image', filepath, {type: 'image'});
			reply = {
				type: 'image',
				mediaId: data.media_id
			}
			//console.log(reply);
		}

		else if (content === '10') {
			var filepath = __dirname + '/2.jpg';
			var picData = yield wechatApi.uploadMaterial('image', filepath, {});
			//console.log(picData);
			var media = {
				articles: [{
					title: 'tututu4',
					thumb_media_id: picData.media_id,
					author: 'Scott',
					digest: '摘要',
					show_cover_pic: 1,
					content: '内容',
					content_source_url: 'https://github.com'
				}, {
					title: 'tututu5',
					thumb_media_id: picData.media_id,
					author: 'Scott',
					digest: '摘要',
					show_cover_pic: 1,
					content: '内容',
					content_source_url: 'https://github.com'
				}]
			};


			data = yield wechatApi.uploadMaterial('news', media, {});

			data = yield wechatApi.fetchMaterial(data.media_id, 'news', {});
			//console.log(data);

			var items = data.news_item;
			var news = [];

			console.log(typeof items);

			items.forEach(function(item) {
				news.push({
					title: item.title,
					description: item.digest,
					picUrl: picData.url,
					url: item.url
				});
			})

			reply = news;
		}
		else if (content === '11') {
			var counts = yield wechatApi.countMaterial();

			console.log(JSON.stringify(counts));

			var results = yield [
				wechatApi.batchMaterial({
					type: 'image',
					offset: 0,
					count: 10
				}),
				wechatApi.batchMaterial({
					type: 'video',
					offset: 0,
					count: 10
				}),
				wechatApi.batchMaterial({
					type: 'voice',
					offset: 0,
					count: 10
				}),
				wechatApi.batchMaterial({
					type: 'news',
					offset: 0,
					count: 10
				})
			];

			console.log(JSON.stringify(results));

			reply = '1';
		}

		this.body = reply;
	}

	yield next;
} 