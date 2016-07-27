'use strict'

var util = require('./libs/util');
var path = require('path');

var wechat_file = path.join(__dirname, './config/wechat.txt');

var config = {
	wechat: {
		appID: 'wx7cee4fdeff2e4c78',
		appSecret: '26aa96f6539b4fa000d168aa4696a88a',
		token: 'imoocwechat',
		getAccessToken: function() {
			return util.readFileAsync(wechat_file);
		},
		saveAccessToken: function(data) {
			data = JSON.stringify(data);
			return util.writeFileAsync(wechat_file, data);
		}
	}
}

module.exports = config;