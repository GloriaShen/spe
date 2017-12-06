
var loader = new preloader({
	resources : [
		'bc.png',
		'bg1.jpg', 'bg2.jpg', 'bg3.jpg',
		'btn1.png', 'btn2.png',
		'cdfer.png',
		'd1.png', 'd2.png', 'd3.png',
		'h1.png', 'h2.png', 'h3.png', 'h4.png',
		'hp.png', 'i1.png', 'map.png', 
		'p1.png', 'p2.png', 'p3.png', 'p4.png',
		'f1.png', 'f2.png', 'f3.png', 'f4.png', 'f5.png',
		'start_btn.png', 'title.png', 'title1.png',
		'xian_title.png', 'zb.png', 'save.png'

	],
	baseUrl: 'static/images/',
	onStart : function(total){
		console.log('start:'+total);
		Gl.initSize();
	},
	onProgress : function(current, total){
		// var percent = current/total*100;
		// $('.progressbar').css('width', percent+'%');
		// $('.progresstext').text(percent +'%');
		// $('.progresstext .current').text(current);
		// $('.progresstext .total').text(total);
	},
	onComplete : function(total){
		console.log('加载完毕:'+total+'个资源');
		init();
	}
});




var Gl = {
	current: null,
	currentIdx: 100,
	leaveTime: null,
	dropTime: null,
	dyingTime: null,
	remoteImg: null,
	initSize: function(){
		var dpr = 1,
            w = (document.documentElement.clientWidth || document.body.clientWidth)*dpr,
            h = (document.documentElement.clientHeight|| document.body.clientHeight)*dpr;

        $('#container').css({
            width: h,
            height: w,
            'margin-left': -h/2,
            'margin-top': -w/2
        });
	},
	getHtml: function(el, rep){
		var html = el.html();
		if(rep){
			var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
			html = html.replace(reg, function (node, key) { 
				return { 'score': rep.score?rep.score:0, 
				'src': rep.src,
				'content': rep.content, 'id': rep.id}[key]; 
			});
		}
		return html;
	},
	djs: function(){
		var num = 0, rnum = 0;
		(function tt(){
			rnum = Math.floor(Math.random()*(15-5+1))+5;
			num = Math.floor(configMap.page3.find('i').text()) - rnum;
			configMap.page3.find('i').text( num );
			if( num > 0 ){
				Gl.leaveTime = setTimeout(tt, 1000);
			}else{
				clearTimeout(Gl.leaveTime);
				configMap.mainPage.html(Gl.getHtml(configMap.page4Tpl));
				configMap.page4 = $('.page-4');
				configMap.trainMusic.pause();
				configMap.bgMusic.play();
			}
		})();
	},
	showResult: function(tips){
		clearTimeout(Gl.leaveTime);
		clearTimeout(Gl.dyingTime);
		clearTimeout(Gl.dropTime);
		
		$.post("http://wx.hxpic.com/spe/2017xunqin/index.php?action=poster", { "rank": Gl.currentIdx },
	      	function(data){
	      		Gl.remoteImg = data;
	      		configMap.showbox.html(Gl.getHtml(configMap.resultTpl, {
					score: Gl.currentIdx,
					content: tips
				}));
	    });
	},
	dying: function(){
		var bar = $('.progressbar'),
			txt = $('.progresstxt'),
			initNum;

		(function dy(){
			initNum = Math.floor(txt.text().split('/')[0]) - 5;

			if( initNum > -1 ){
				bar.width(initNum+'%');
				txt.text(initNum+'/100');
				Gl.dyingTime = setTimeout(dy, 1000);
			}else{
				if(Gl.currentIdx<1){
					Gl.currentIdx = 1;
				}
				Gl.showResult('大吉大利，再接再厉！');
			}
		})();
	},
	getListr: function(data, idx){
		return '<li>'+ data.fname +' <img src="static/images/i1.png" alt="i1"> '+ data.tname +' - 第'+ idx +'名产生</li>';
	},
	loopData: function(){
		var noticeList = $('.notice-list'), num = 0,
			lh = $('.notice-box').height()/2;

		(function tt(){
			num++;
			Gl.currentIdx = 100-(num+1);
			
			noticeList.append(Gl.getListr(mockdata[num], Gl.currentIdx));
			if(num>2){
				noticeList.animate({
					scrollTop: -lh
				}, 500, function(){
					noticeList.find('li:first-child').remove();
					configMap.wi1.text(Gl.currentIdx);
				});
			}
			if( Gl.currentIdx == 1 ){
				Gl.showResult('大吉大利，今晚吃鸡！');
			}
			Gl.leaveTime = setTimeout(tt, 500);
		})();

	},
	eating: function(el){
		var mask = $('.eat-box .mask'),
			blue = el.attr('blue'),
			idx = el.attr('class').substr(1),
			num, t, temp, eat, dnum;
		
		mask.removeClass('hide').text(4);
		
		if(blue<3){
			num = 5;
		}else{
			num = (blue < 4 ? 20 : 30);
		}
		temp = Math.floor($('.progresstxt').text().split('/')[0]) + num;
		temp = temp > 100 ? 100 : temp;
		$('.progress').append('<i>+'+ num +'</i>');
		$('.progressbar').width(temp + '%');
		$('.progresstxt').text(temp + '/100');

		clearTimeout(Gl.dyingTime);
		Gl.dying();

		(function eat(){
			dnum = Math.floor(mask.text()) - 1;
			if(dnum>0){
				mask.text(dnum);
				t = setTimeout(eat, 1000);
			}else{
				mask.addClass('hide');
				$('.progress i').remove();
				clearTimeout(t);
			}
		})();
	},
	person: function(){
		var t, hero = $('.hero'), n = 1;
		configMap.pickupMusic.play();
		(function h(){
			hero.attr('src','static/images/h'+ n +'.png');
			if(n<5){
				t = setTimeout(h, 200);
			}else {
				clearTimeout(t);
				hero.attr('src','static/images/h1.png');
				configMap.pickupMusic.pause();
			}
			n++;
		})();
	},
	dropSth: function(){
		var  an = 0;
		function addFood(){
			var rn = Math.floor(Math.random()*(5-1+1))+1,
			ln = Math.floor(Math.random()*(36-(-40)+1)+(-40))/10,
			blue = 0;
			if(rn<3){
				blue = 2;
			}else{
				blue = (rn < 4 ? 3 : 4);
			}
			$('.food-box').append('<img blue="'+ blue +'" class="f'+ rn +'" src="static/images/f'+ rn +'.png" />');
			$('.food-box img:last-child').css({
				transform: 'translate('+ ln +'rem, -100%)'
			});
			an++;
			if(an>6){
				$('.food-box img:first-child').remove();
			}
			Gl.dropTime = setTimeout(addFood, 500); 
		}
		
		addFood();
	}
}

var init,
	configMap = {
		mainPage: $('.main-page'),
		page1Tpl: $('#page1'),
		page2Tpl: $('#page2'),
		page3Tpl: $('#page3'),
		page4Tpl: $('#page4'),
		confirmTpl: $('#comfirmTpl'),
		resultTpl: $('#resultTpl'),
		noticeTpl: $('#noticeTpl'),
		bgMusic: $('#audio1')[0],
		trainMusic: $('#audio2')[0],
		pickupMusic: $('#audio3')[0]
	};

init = function(){
	$('.prepare-page').remove();
	var  winAudio = $('.audio')[0];
	$(document).one('touchstart', function() {
	    winAudio.load();
	    winAudio.play();
	});
	configMap.mainPage.html(Gl.getHtml(configMap.page1Tpl))
	.delegate('.start-btn', 'click', function(){
		configMap.mainPage.html(Gl.getHtml(configMap.page2Tpl));
	});

	configMap.mainPage.delegate('.cc a', 'click', function(){
		var html;
		 Gl.current = $(this);
		configMap.page2 = $('.page-2');
		if(Gl.current.hasClass('hj')){
			html = Gl.getHtml(configMap.confirmTpl, {
				content: '由于忘带降落伞，此次行动不能坐飞机。',
				id: 0
			});
		}else{
			html = Gl.getHtml(configMap.confirmTpl, {
				content: '确认选择<em>高铁</em>？',
				id: 1
			});
		}
		
		configMap.page2.append(html);
		configMap.confirmMask = configMap.page2.find('.mask');
	})
	.delegate('.confirm-btn', 'click', function(){
		var status = $(this).attr('dataid');
		if( status == 0 ){
			configMap.confirmMask.remove();
		}else{
			configMap.mainPage.html(Gl.getHtml(configMap.page3Tpl));
			configMap.page3 = $('.page-3');
			Gl.djs();
			configMap.bgMusic.pause();
			configMap.trainMusic.play();
		}
	});
	configMap.mainPage.delegate('.page-3 .title', 'click', function(){
		clearTimeout(Gl.leaveTime);
		configMap.mainPage.html(Gl.getHtml(configMap.page4Tpl));
		configMap.trainMusic.pause();
		configMap.bgMusic.play();
		configMap.page4 = $('.page-4');
	})
	.delegate('.show-box .tips', 'click', function(){
		Gl.current = $(this);
		if(Gl.current.hasClass('clicked')){
			$('.tips-mask').remove();
			$('.start-tip').removeClass('hide');
		} else {
			Gl.current.addClass('clicked').html('但由于过度饥饿，你已无法前进<br>毒气正在蔓延...');
		}
		
	})
	.delegate('.start-tip img', 'click', function(){
		Gl.current = $(this);
		var idx = Math.floor(Gl.current.attr('class').substr(2)) + 1;
		if( idx > 3 ){ 
			Gl.current.remove();
			$('.page-4').addClass('bling');
			$('.show-box').prepend(Gl.getHtml(configMap.noticeTpl));
			configMap.wi1 = $('.wi-1');
			configMap.showbox = $('.show-box');
			Gl.dropSth();
			Gl.dying();
			Gl.loopData();

			configMap.mainPage.delegate('.food-box img', 'click', function(){
				if(Math.floor($('.eat-box .mask').text()) > 1){ return; }
				Gl.person();
				Gl.eating($(this));
			});

			return false; 
		}
		Gl.current.attr({
			'class': 'st'+idx,
			'src': 'static/images/d'+ idx +'.png'
		})
	});

	configMap.mainPage.delegate('.share-btn', 'click', function(){
		console.log('share!!!');
		var _this = $(this);
		if(_this.hasClass('disabled')){
			return false;
		}
		_this.text('生成中···').addClass('disabled');
		configMap.resultBox = $('.result-box');
		configMap.resultBox.load( Gl.remoteImg ,function(){
			console.log('loadded!!');
			_this.removeClass('disabled');
			configMap.resultBox.html('<img class="share-img" src="'+ Gl.remoteImg +'" alt="图片" /><img class="save-img" src="static/images/save.png" alt="save" />');
		});
	});	
}

loader.start();

