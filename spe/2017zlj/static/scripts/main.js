
var loader = new preloader({
	resources : [
		'bg.jpg',
		'dec.png',
		'i1.png',
		'i2.png',
		'i3.png',
		'i4.png',
		'i_right.png',
		'i_share.png',
		'i_wrong.png',
		'logo.png',
		'p1.png',
		'p2.png',
		'qa_bg.jpg',
		'right.png',
		'start.png',
		'title.png'
	],
	baseUrl: 'static/images/',
	onStart : function(total){
		console.log('start:'+total);
	},
	onProgress : function(current, total){
		var percent = current/total*100;
		$('.progressbar').css('width', percent+'%');
		$('.progresstext .current').text(current);
		$('.progresstext .total').text(total);
	},
	onComplete : function(total){
		console.log('加载完毕:'+total+'个资源');
		init();
	}
});

var mock = true,
	Qa;

Qa = {
	current:1,
	score:0,
	answer:null,
	data: null,
	init: function(){
		$.getJSON('http://wx.hxpic.com/spe/well/index.php?action=question',function(res){
			// console.log('init data: ', res);
			Qa.data = res;
			Qa.setContent(Qa.data[0]);
		});
		
	},
	setTips: function(bo, str){
		var tipStr = '';
		if(bo<0){
			tipStr = '<p>'+ str +'</p>'
				+'<img class="a-dec" src="./static/images/i_wrong.png" />';
			$('.tip-box').html(tipStr).addClass('wrong');
			return false;
		}
		if(!bo){
			tipStr = '<p>很抱歉，您答错了！<br>正确答案是 '+ (str.length>1? str.split().join('、') : str) +'</p>'
				+'<img class="a-dec" src="./static/images/i_wrong.png" />';
			$('.tip-box').html(tipStr).addClass('wrong');
		}else{
			Qa.score += 10;
			tipStr = '<p>恭喜你，回答正确！<br>再接再厉</p>'
				+'<img class="a-dec" src="./static/images/i_right.png" />';
			$('.tip-box').html(tipStr).addClass('right');
		}
		$('.qa-box input').prop('disabled', true);
	},
	setContent: function(data){
		var typeStr,type;
		if(data.type==1){
			typeStr = '单选';
			type = 'radio';
		}else{
			typeStr = '多选';
			type="checkbox";
		}
		var str = '<h6 class="question">'
					+'<span class="qindex">'+ this.current +'</span>'
					+'<i class="qtype">' + typeStr + '</i>'
					+ '<span class="q">' + data.question +'</span>'
					+'</h6>';
		str += '<ul class="answer-list">';

		for (var item in data.answer){
			str += '<li><label><input type="'+ type +'" name="answer" value="'+ item +'" > <i></i>'+ item +'、'+ data.answer[item] +'</label></li>';
		}

		str += '</ul>';
		str += '<a class="qa-btn" href="javascript:;">确 认</a>';
		str += '<div class="tip-box"><img class="qa-dec qa'+ data.id +'" src="./static/images/icons/'+ data.id +'.png" alt="装饰图"></div>'
		$('.qa-box').html(str);

		this.answer = data.right.join('');
	},
	getResult: function(srcId, destId){
		$('#'+destId).html($('#'+srcId).html());
	},
	setPrize: function(str,img,mask){
		// console.log('str:', str);
		var str = '<p>您的本次测评成绩<br><em>'+ Qa.score +'</em>分</p>'
				+'<p class="words">'+ str +'</p>'
				+'<img class="xj" src="./static/images/i'+ img +'.png" />';
		if(mask){
			str += configMap.maskTpl.html();
		}else{
			str += '<a class="prize-btn" href="javascript:;">生成专属奖状</a>';
			configMap.resultBox.html(str).addClass('good');
		}
		configMap.qaBox.remove();
		configMap.resultBox.html(str);
		configMap.mask = $('.mask');
	},
	getPaper: function(url){
		var str = '<div class="img-box"> <img src="'+ url +'" alt=""> </div> <p>长按奖状，保存这一刻</p>';
		str += configMap.maskTpl.html();
		configMap.resultBox.html(str).addClass('better');
		configMap.mask = $('.mask');
	}
}
loader.start();
var configMap = {
	startBox: $('.start-box'),
	qaBox: $('.qa-box'),
	resultBox: $('.result-box'),
	maskTpl: $('#maskTpl'),
};

var init = function(){
	$('.prepare-page').remove();

	var  winAudio = $('#audio')[0];
	$(document).one('touchstart', function() {
	    winAudio.load();
	    winAudio.play();
	});

	var startStr = '<img class="title" src="./static/images/title.png" alt="你是不是自贡人？" class="title"> <img class="xj" src="./static/images/dec.png" alt="xj" /><img class="pop" src="./static/images/pop.png" /> <a class="start-btn"></a>';
	configMap.startBox.html(startStr);
	configMap.startBox.delegate('.start-btn', 'click', function(){
		configMap.startBox.remove();
		Qa.init();
	});
}

configMap.qaBox.delegate('.qa-btn', 'click', function(){
	var _this = $(this),
		cur = $('input[name="answer"]:checked'),
		cur_ans;
	if(cur.length>1){
		cur_ans = [];
		cur.map(function(index, item){
			cur_ans.push($(item).val());
		});
		cur_ans = cur_ans.join('');
	}else{
		cur_ans = cur.val();
	}
	// console.log(cur_ans +'----'+ Qa.answer);

	if( _this.hasClass("nextQa") ){
		Qa.setContent(Qa.data[Qa.current-1]);
		return false;
	}
	if( !cur_ans ) {
		// console.log('不能为空！');
		Qa.setTips(-1, '请选择答案！');
		return false;
	}
	if(cur_ans == Qa.answer){
		// 回答正确
		Qa.setTips(1);
	}else{
		// 回答错误
		Qa.setTips(0, Qa.answer);
	}
	Qa.current++;
	if(Qa.current>10){
		// 下一页
		Qa.getResult('qaTpl', 'qaBox');
	}else{
		// 下一题
		// console.log(' score: ', Qa.score);
		$(this).text('下一题').addClass('nextQa');
	}
});
configMap.qaBox.delegate('.get-result', 'click', function(){
	
	if(Qa.score <80) {
		if(Qa.score<60){
			Qa.setPrize('我很沮丧我想静静',1,true);
			return false;
		}
		Qa.setPrize('及格了我也不骄傲',2,true);
	}else{
		if(Qa.score==100){
			Qa.setPrize('你是自流井文明守护神',4,false);
			return false;
		}
		Qa.setPrize('你是醇正自流井好市民',3,false);
	}
});

configMap.resultBox.delegate('.prize-btn', 'click', function(){
	$.post("http://wx.hxpic.com/spe/well/index.php?action=poster", { "score": Qa.score },
      	function(data){
      		// console.log('post res data:', data);
      		Qa.getPaper(data);
    });
});
$(document).delegate('.share-btn', 'click', function(){
	configMap.mask.addClass('show');
});
$(document).delegate('.again-btn', 'click', function(){
	location.href = 'http://wx.hxpic.com/spe/well/index.php';
});
$(document).delegate('.mask', 'click', function(){
	configMap.mask.removeClass('show');
});