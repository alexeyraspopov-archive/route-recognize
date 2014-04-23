module.exports = function(pattern, url){
	var keys, regex, results, params;

	keys = pattern.match(/(\:|\*)([^\/\?]+)/g);

	pattern = pattern
		.replace(/[\/]+/g, '/')
		.replace(/\/?$/, '/?')
		.replace(/\:[^\/\?]+(\?)?/g, '$1([^/]+)$1')
		.replace(/\*[^\/\?]+(\?)?/g, '$1(.+)$1');

	regex = new RegExp('^' + pattern + '$');

	if(!regex.test(url)){
		return;
	}

	results = url.match(regex).slice(1);

	if(keys){
		params = keys.map(function(key){
			return key.slice(1);
		}).reduce(function(params, key, index){
			params[key] = results[index];

			return params;
		}, {});
	}

	return {
		params: params || {},
		path: url
	};
};
