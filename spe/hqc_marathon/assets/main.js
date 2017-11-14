var mockData = [
	{
		img: 'p1.png',
		text: '东汉末年，三国鼎立。'
	},
	{
		img: 'p2.png',
		text: '张飞被派剑阁种树。'
	},
	{
		img: 'p3.gif',
		text: '趁双十一网购了三箱牛肉干，越吃越胖。'
	},
	{
		img: '4.gif',
		text: '人生在世，吃喝二字。',
		avtr: 'zhangfei.png'
	},
	{
		img: ['5-2.gif','5-3.gif'],
		text: '三弟的身高和宽度都一样了，这如何是好？',
		avtr: 'liubei.png'
	},
	{
		img: '6.gif',
		text: '我是壮，你是胖！',
		avtr: 'guanyu.png'
	},
	{
		img: '7.gif',
		text: '赶紧去减肥！跑步最管用！',
		avtr: 'huangzong.png'
	},
	{
		img: '8.png',
		text: '张飞再不减，踢出五虎上将!',
		avtr: 'zhuge.png'
	},
	{
		img: '9.png',
		text: '11月12日，2017华侨城·剑门关蜀道半程国际马拉松必须拿第一!',
		avtr: 'zhuge.png'
	},
	{
		img: '10.gif',
		text: ['好好好！！！', '誓不做油腻中年人！', '燕人张翼德等你来战！'],
		avtr: 'zhangfei.png'
	}
	];
var loader = new preloader({
	resources : [
		'10.gif',
		'4.gif',
		'5-1.gif',
		'5-2.gif',
		'5-3.gif',
		'6.gif',
		'7.gif',
		'8.png',
		'9.png',
		'btn.gif',
		'btn.png',
		'code.png',
		'end_bg.jpg',
		'guanyu.png',
		'huangzong.png',
		'jump.gif',
		'liubei.png',
		'loading.gif',
		'main_bg.jpg',
		'main_bg.png',
		'p1.png',
		'p2.png',
		'p3.gif',
		'ball.png',
		'start_title.png',
		'zhangfei.png',
		'zhuge.png'
	],
	baseUrl: 'assets/images/',
	onStart : function(total){
		console.log('start:'+total);
	},
	onProgress : function(current, total){
		var percent = current/total*100;
		$('.progressbar').css('width', percent+'%');
		// $('.progresstext .current').text(current);
		// $('.progresstext .total').text(total);
	},
	onComplete : function(total){
		$('.prepare-page .inner').html($('#startTpl').html());
		console.log('加载完毕:'+total+'个资源');
		init();
	}
});

// WebFont.load({
//   custom: {
//     families: ['FZXS'],
//     urls : ['assets/FZXS/FZXS.css']  //字体声明处，页面不需要引入该样式
//   },
//   loading: function() {  //所有字体开始加载
//     console.log('loading');
//   },
//   active: function() {  //所有字体已渲染
//     console.log('active');
//     loader.start();
//   },
//   inactive: function() { //字体预加载失败，无效字体或浏览器不支持加载
//     console.log('inactive');
//     loader.start();
//   },
// });


loader.start();
var init = function () {
	var $showbox = $('.show-box');

	var  winAudio = $('#audio')[0];
	$(document).one('touchstart', function() {
	    winAudio.load();
	    $('.music').addClass('roll');
		winAudio.play();
	});

	$('.prepare-page').delegate('.start-btn', 'click' ,function(){
		$('.prepare-page').remove();
		page();
	});
	
	$('.main-page').delegate('.tool-box', 'click', function(){
		var $img = $showbox.find('.bg-img'),
			$text = $showbox.find('.text'),
			$words = $showbox.find('.words'),
			altStr = $img.attr('data-text'),
			len = altStr.length,
			cid = Math.floor($showbox.prop('id').substring(1)),
			s1 = $text.length && ( len !== $text.text().length ),
			s2 = $words.length && ( len !== $words.text().length );

		if ( ( cid < 3 && s1 ) || ( cid >3  && s2 ) ){
			console.log('role:', 'not end');
			return;
		} 
		console.log('cid: ',cid);
		$img.prop('src', 'assets/images/black.png');
		$text.text('');
		$words.text('');
		$showbox.find('.uinfo').removeClass('show');
		page();
		
		
	} );
	$('.tool-box').delegate('.again-btn', 'click', function(){
		window.location.href= location.href;
	});
	$('.tool-box').delegate('.share-btn', 'click', function(){
		$('.mask').addClass('show');
	});
	$('.mask').on('click', function(){
		$('.mask').removeClass('show');
	});

	$('.music').on('click', function( ){
		var _this = $(this);
		if ( _this.hasClass('roll') ) {
			_this.removeClass('roll');
			winAudio.pause();
		} else {
			_this.addClass('roll');
			winAudio.play();
		}
	});

}