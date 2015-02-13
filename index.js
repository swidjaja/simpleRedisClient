module.exports.createClient = function (options) {
	var redisModule = require('./lib/redisClient');
	return new redisModule(options);
};