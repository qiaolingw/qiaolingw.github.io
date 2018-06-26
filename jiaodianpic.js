
;(function($){
	$.fn.fadeAnimate = function(options){
		options = $.extend({
			liDomList: $(this).find('li'),
			liDomListLen: $(this).find('li').length,
			disableAutoEle: $('#account-box'),
			curIndex: 0,
			nextIndex: 1,
			curDom:undefined,
			nextDom:undefined,
			curLeft:0,
			minLeft:-960,
			fadeLock: false,
			fadeTime: 2500,
			imgWidth: 960,
			controller: $('#top-main .controller'),
			controllerList: $('#top-main .controller li'),
			timer: undefined,
			accSpeed: 15,
			Cx: 0.02, //阻力系数
			minRes: 0, //最小阻力
			curSpeed: 0
		}, options);		

		//移动到
		function changeTo(index){
			if(true == options.fadeLock){return;}
			window.clearTimeout(options.timer);
			options.nextIndex = index;
			options.fadeLock = true;

			//初始化
			options.curDom = options.liDomList.eq(options.curIndex);
			options.nextDom = options.liDomList.eq(options.nextIndex);
			options.nextDom.css('opacity',0);
			options.curLeft = 0;
			options.curSpeed = 0;
			options.nextDom.css('left', options.curLeft + options.imgWidth);
			controlChange(options.nextIndex);

			move();
		}

		//动画
		function move(){
			var nextLeft = getNextLeft();
			var opacity = Math.abs(nextLeft/options.imgWidth);
			var opacityPer = parseInt(opacity * 100);
			options.curDom.css({'left': nextLeft, 'opacity': 1-opacity, 'filter': 'alpha(opacity=' + (100 - opacityPer) + ')'});

			options.nextDom.css({'left': nextLeft + options.imgWidth, 'opacity': opacity, 'filter': 'alpha(opacity=' + opacityPer + ')'});
			if(nextLeft <= options.minLeft){
				options.curIndex = options.nextIndex;
				options.fadeLock = false;
				autoFade();
			}else{
				window.setTimeout(move, 20);	
			}
		}


		//获取下次速度
		function getNextSpeed(){
			var incSpeed = options.accSpeed - options.minRes - options.curSpeed * options.Cx; 
			return options.curSpeed += incSpeed;
		}

		//获取下次便宜left
		function getNextLeft() {
			var nextSpeed = getNextSpeed();
			options.curLeft = options.curLeft - nextSpeed < options.minLeft ? options.minLeft : options.curLeft - nextSpeed;
			return options.curLeft;
		}

		//获取下个索引
		function changeNext() {
			var nextIndex = options.curIndex + 1 >= options.liDomListLen ? 0 : options.curIndex + 1; 	
			changeTo(nextIndex);
		}	

		//轮播图按钮点击效果
		options.controller.delegate('li', 'click', function(e){
			var index = $(e.currentTarget).index();
			changeTo(index);
		});


		//手动控制
		function controlChange(index) {
			options.controllerList.eq(index).addClass('current').siblings('.current').removeClass('current');
		}

		//自动轮播
		function autoFade() {
			window.clearTimeout(options.timer);	
			options.timer = window.setTimeout(changeNext, options.fadeTime);	
		}

		autoFade();

		/*
		options.disableAutoEle.focusin(function(){
			window.clearTimeout(options.timer);	
		}).focusout(function(){
			autoFade();
		})
		*/
		
		$(this).mouseenter(function(){
			window.clearTimeout(options.timer);	
		}).mouseleave(function(){
			autoFade();
		});

		return $(this);
	}	
})(jQuery);
$('#top-main .left-banner').fadeAnimate({});