
var loader = new preloader({
	resources : [
		'2-2.png',
		'bg1.jpg',
		'j1.png',
		'j2.png',
		'j3.png',
		'j4.png',
		'j5.png',
		'j6.png',
		'j7.png',
		'j8.png',
		'logo.png',
		'sbg.jpg',
		'sp.png',
		'titile.png',
		'xian.png',
		'6.jpg',
		'hg.png',
		'yp.png',
		'd-avtrbg.png',
		'dbg.jpg',
		'sprite.png'
	],
	baseUrl: 'assets/images/',
	onStart : function(total){
		console.log('start:'+total);
	},
	onProgress : function(current, total){
		var percent = Math.floor(current/total*100);
		$('.progressbar').css('width', percent+'%');
		$('.progresstext').text(percent + '%');
		// $('.progresstext .total').text(total);
	},
	onComplete : function(total){
		console.log('加载完毕:'+total+'个资源');
		init();
	}
});
var looper;

var init = function(){
	if($('.page-1').length>0){
		if (window.DeviceMotionEvent) { 
			window.addEventListener('devicemotion',deviceMotionHandler, false); 
		}else{ 
		    alert('亲，你的浏览器不支持DeviceMotionEvent哦~'); 
		}
	}
	var setBarrager = function(data){
		var looper_time=.5*1000,	//每条弹幕发送间隔
			speed = 0.5,	//弹幕速度
			items = data,
			total = data.length,	//弹幕总数
			run_once = true,	//是否首次执行
			index = 0;	//弹幕索引
		//先执行一次
		barrager();
		function  barrager(){
		  if(run_once){
		      //如果是首次执行,则设置一个定时器,并且把首次执行置为false
		      looper=setInterval(barrager,looper_time);                
		      run_once=false;
		  }
		  //发布一个弹幕
		  $('.barrager-box').barrager(items[index]);
		  //索引自增
		  index++;
		  //所有弹幕发布完毕，清除计时器。
		  if(index == total){
		      clearInterval(looper);
		      $.fn.barrager.removeAll();
		      init();
		      return false;
		  }
		}
	}
	$('.prepare-page').remove();
	$('.main-box').addClass('show');
	if( !$('.barrager-box').length ){
		return false;
	}
	$.ajaxSettings.async = false;
	$.getJSON('http://wx.hxpic.com/lara/public/api/barrage/lists/',function(data){
		setBarrager(data);
	});
}
function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}
function deviceMotionHandler(eventData) { 
    // 
    var acceleration = eventData.accelerationIncludingGravity; 

    var ax = Math.round(acceleration.x + Math.random());
    var ay = Math.round(acceleration.y + Math.random()); 
    var translate = 'translate('+ ax +'%, '+ ay +'%)';
    var myDom = $('.page-2 a img, .title, .jr');
    $('.title').css({
  		'-webkit-transform': 'translate('+ Math.round(acceleration.x + Math.random())+5 +'%, '+ Math.round(acceleration.y + Math.random())+5 +'%)',
  		'transform': 'translate('+ Math.round(acceleration.x + Math.random())+5 +'%, '+ Math.round(acceleration.y + Math.random())+5 +'%)'
    });
    $('.jr').css({
		'-webkit-transform': 'translate('+ Math.round(acceleration.x + Math.random()) +5 +'%, '+ Math.round(acceleration.y + Math.random()) +5 +'%)',
  		'transform': 'translate('+ Math.round(acceleration.x + Math.random()) +5 +'%, '+ Math.round(acceleration.y + Math.random()) +5 +'%)'
    });
    $('.page-2 a img:odd').css({
  		'-webkit-transform': 'translate('+ Math.round(acceleration.x + Math.random()) +6+'%, '+ Math.round(acceleration.y + Math.random()) +6+'%)',
  		'transform': 'translate('+ Math.round(acceleration.x + Math.random()) +6+'%, '+ Math.round(acceleration.y + Math.random()) +6+'%)'
    });
    $('.page-2 a img:even').css({
  		'-webkit-transform': 'translate('+ Math.round(acceleration.x + Math.random()) +6+'%, '+ Math.round(acceleration.y + Math.random()) +6+'%)',
  		'transform': 'translate('+ Math.round(acceleration.x + Math.random()) +6+'%, '+ Math.round(acceleration.y + Math.random()) +6+'%)'
    });    
}
loader.start();
$('.send-box').delegate('.submit-btn', 'click', function(){
	if(!isWeiXin()){
		alert('请使用微信发送弹幕');
		console.log(" 是来自微信内置浏览器");
		return false;
	}
	var _this = $(this),
		openId = '',
		words = $('input[type="text"]').val();
	if( words!='' && !_this.hasClass('disabled')){
		_this.addClass('disabled').val('发送中');

		document.cookie.split(';').forEach(function(arr){
			if(arr.split('=')[0].replace(/\s+/g,'') == 'wxopenid'){
				openId = arr.split('=')[1];
			}
		});
		$.post("http://wx.hxpic.com/lara/public/api/barrage/send", { content: words,wechaid:openId }, function(res){
			console.log("Data Loaded: ", res);
			$('.send-box input[type="text"]').val('');
			_this.removeClass('disabled').val('发 送');
			if(res.code == 1){
				// 发送成功
				clearInterval(looper);
				$.fn.barrager.removeAll();
	      		init();
			}
			
		});
	}
});


