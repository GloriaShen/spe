(function ( root, factory ) {
	if (typeof exports === 'object') {
        //Node, CommonJS之类的
        module.exports = factory();
    } else {
        //浏览器全局变量(root 即 window)
        root.preloader = factory(root).p;
        root.page = factory(root).page;
    }
}(this, function(){
	var isFunc = function ( f ) {
		return typeof(f) === 'function';
	};
	var p = function( configMap ){
		if ( !configMap ) {
			console.log( '参数错误！' );
			return false;
		}
		this.resources = configMap.resources || [];
		this.baseUrl = 	configMap.baseUrl || './images';
		this.onStart = configMap.onStart || null;
		this.onProgress = configMap.onProgress || null;
		this.onComplete = configMap.onComplete || null;

		this.total = this.resources.length;
		this.countIdx = 0;
	};
	p.prototype.start = function () {
		var url, _this = this, image;
		if ( !this.total ) { return false; }
		this.resources.forEach(function(item){
			url = (item.indexOf('http') === 0 ? item : (_this.baseUrl + item));

			image = new Image();
			image.onload = image.onerror = function(){
				isFunc( _this.onProgress ) && _this.onProgress(++_this.countIdx, _this.total);
				(_this.countIdx === _this.total) && isFunc( _this.onComplete ) && _this.onComplete( _this.total );
			};
			image.src = url;
		});
		isFunc( _this.onStart ) && _this.onStart(_this.total);
	};
	var page = function(){
		var stateMap = {
				baseUrl: 'assets/images/',
			},  
			setStateMap, setAvtrModule, setImg, changeTime,
			typeWords,
			changepage, initModule;

		setStateMap = function(){
			stateMap.id = $('.show-box').prop('id');
			stateMap.$showbox = $('.show-box');
			stateMap.$img = stateMap.$showbox.find('.bg-img');
			stateMap.$text = stateMap.$showbox.find('.text');
			stateMap.$avtr = stateMap.$showbox.find('.avtr');
			stateMap.$words = stateMap.$showbox.find('.words');
			stateMap.bgImgUrl = '';
			stateMap.pidx = 0;
		};
		setAvtrModule = function (data){
			var  temp, isRole;

			isRole = stateMap.$words;
			if ( !isRole.length ) {
				temp = '<img class="bg-img" src="assets/images/'+ stateMap.bgImgUrl +'" data-text="'+ data.text +'"> <div class="uinfo"> <img src="'+ stateMap.baseUrl +  data.avtr +'" alt="" class="avtr"> <p class="words"></p> </div>';

				stateMap.$showbox.html( temp );
				stateMap.$words = stateMap.$showbox.find('.words');
			} else {
				stateMap.$img.attr({
					src: stateMap.baseUrl + stateMap.bgImgUrl,
					'data-text': data.text
				});
				stateMap.$avtr.attr('src', stateMap.baseUrl + data.avtr );
			}
			
			return true;
		};
		setImg = function (data){
			stateMap.$img.attr({
				src: 'assets/images/' + stateMap.bgImgUrl,
				'data-text': data.text
			});
			return true;
		};
		changepage = function( input_map ){
			var temp,
				data = input_map.data || '',
				type = input_map.type || '',
				callback = input_map.callback || null;

			clearTimeout(changeTime);
			if ( !data ) { return false; }
			stateMap.bgImgUrl =  ( data.img instanceof Array ? data.img[0] : data.img );
			if ( type === 'role' ) {
				setAvtrModule( data );
			} else {
				setImg( data );
			}
			
			callback && callback();

		};
		typeWords = function(config){
			var elem = config.obj,
				str = config.str || elem.prop('title').trim(),
				i = 1, len = str.length + 1, step, flag;
			clearTimeout(changeTime);

			function done(){
				if ( len && i < len ) {
					elem.html(str.substring(0, i));
					step = ( str.substring(i, i+5) == '<br/>'  ? 5 : 1);
					i += step;
				} else {
					clearInterval( flag );

				}
			}
			flag = setInterval(done, 100);
		};
		initModule = function (){
			console.log('page');
			setStateMap();
			if ( stateMap.id ) {
				stateMap.pidx = Math.floor(stateMap.$showbox.prop('id').substr(1)) + 1;
			}
			
			stateMap.$showbox.prop('id', 'p'+ stateMap.pidx);
			console.log('pidx', stateMap.pidx);

			if( stateMap.pidx == 10 ){
				var jump = '<div class="jump"></div>';
				$('.main-page').html(jump);
				setTimeout(function(){
					$('.main-page').remove();
					$('.join-page').addClass('show');
				},1700);
				return false;
			}
			if ( stateMap.pidx < 3 ) {
				changeTime = setTimeout(function(){
					changepage({
						data: mockData[stateMap.pidx],
						type: 'single',
						callback: function (){
							typeWords({
								obj: stateMap.$text,
								str: mockData[stateMap.pidx].text
							});
						}
					});
				}, 300);
			}
			else {
				changeTime = setTimeout(function(){
					changepage({
						data: mockData[stateMap.pidx],
						type: 'role',
						callback: function (){
							stateMap.$showbox.find('.uinfo').addClass('show');
							if( stateMap.pidx == 9 ) {
								var tempTime = null,
									dataArr = mockData[stateMap.pidx].text;
								stateMap.$img.attr({
									'data-text': dataArr[dataArr.length-1]
								});
								dataArr.forEach(function(item, index){
									(function(i,t){
										console.log(t);
										tempTime = setTimeout( function(){
											typeWords({
												obj: stateMap.$words,
												str: t
											});
										},i*1000);
									})(index, item);
								});
							} else {
								typeWords({
									obj: stateMap.$words,
									str: mockData[stateMap.pidx].text
								});
							}
							

							
						}
					});
				}, 300);
			}
		};
		initModule();
	}
	return {
		p: p,
		page: page
	};
}));

$.fn.typeWords = function(config){
	var elem = $(this),
		str = config.str || elem.prop('title').trim(),
		i = 1, len = str.length, step,
		flag = null;
		
	function done(){
		if ( len && i < len ) {
			elem.html(str.substring(0, i));
			step = ( str.substring(i, i+5) == '<br/>'  ? 5 : 1);
			i += step;
		} else {
			clearInterval( flag );
		}
	}
	flag = setInterval(done, 400);
};

