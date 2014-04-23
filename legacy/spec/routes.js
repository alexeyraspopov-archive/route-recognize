// TODO: create specs for error catching

describe('routes', function(){
	function recognize(pattern, url){
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
	}

	it('should recognize simple route', function(){
		var params = recognize('/post', '/post');

		expect(params.path).toBe('/post');
	});

	it('should recognize nested route', function(){
		var params = recognize('/post/comments', '/post/comments');

		expect(params.path).toBe('/post/comments');
	});

	it('should recognize conditionally finish slash', function(){
		var params = recognize('/post/comments', '/post/comments/');

		expect(params.path).toBe('/post/comments/');
	});

	it('should recognize smart route', function(){
		var params = recognize('/user/:id', '/user/id1');

		expect(params.params).toBeDefined();
		expect(params.params.id).toBe('id1');
	});

	it('should recognize smart nested route', function(){
		var params = recognize('/path/*long', '/path/a/b/c');

		expect(params.params.long).toBe('a/b/c');
	});

	it('should recognize mixin of routes', function(){
		var params = recognize('/path/*long/:short', '/path/a/b/c/id');

		expect(params.params.long).toBe('a/b/c');
		expect(params.params.short).toBe('id');
	});

	it('should recognize conditionally items', function(){
		var params1 = recognize('/:chapter/:slide?', '/main/frontpage'),
			params2 = recognize('/:chapter/:slide?', '/main');

		expect(params1.params.chapter).toBe('main');
		expect(params1.params.slide).toBe('frontpage');

		expect(params2.params.chapter).toBe('main');
		expect(params2.params.slide).toBeUndefined();
	});

	it('should pass this crazy test', function(){
		var params1 = recognize('/path/:id/*long?/:short', '/path/id1/a/b/c/boo'),
			params2 = recognize('/path/:id/*long?/:short', '/path/id1/boo');

		expect(params1.params.id).toBe('id1');
		expect(params1.params.long).toBe('a/b/c');
		expect(params1.params.short).toBe('boo');

		expect(params2.params.id).toBe('id1');
		expect(params2.params.long).toBeUndefined();
		expect(params2.params.short).toBe('boo');
	});
});