var redis = require('redis');
var RSVP = require('rsvp');

var redisClient = null;

function RedisClient(options) {
	if (!options) {
		options = {};
	}
	this.host = options.host || '127.0.0.1';
	this.port = options.port || 6379;
	this.connectOptions = options.connectOptions || {};
	this.connectTimeout = options.connectTimeout || 10000;
};

RedisClient.prototype.connect = function () {
	var defer = RSVP.defer();

	var connectionTimer = setTimeout(function () {
		defer.reject('connection_timeout');
	}, this.connectTimeout);

	redisClient = redis.createClient(this.port, this.host, this.connectOptions);

	redisClient.on('error', function () {
		defer.reject('connection_failure');
	});

	redisClient.on('ready', function () {
		defer.resolve();
	});

	return defer.promise;
};

RedisClient.prototype.set = function (key, value) {
	return RSVP.denodeify(redisClient.set.bind(redisClient))(key, value);
};

RedisClient.prototype.get = function (key) {
	return RSVP.denodeify(redisClient.get.bind(redisClient))(key);
};

RedisClient.prototype.has = function (key) {
	return RSVP.denodeify(redisClient.exists.bind(redisClient))(key);
};

RedisClient.prototype.del = function (key) {
	return RSVP.denodeify(redisClient.del.bind(redisClient))(key);
};

RedisClient.prototype.disconnect = function (key, value) {
	redisClient.quit();
	redisClient = null;
};

module.exports = RedisClient;




