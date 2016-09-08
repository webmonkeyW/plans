// HY2JS by 华扬长沙 王仁  QQ：842837175
window.publicInfo = {
	content: $('#content'),
	page: $('.page', this.content),
	indexPage: 0,
	pageCutover: false, //页面切换开关
	pageLen: 0, //总共多少页
	prefix: null,
	htmlFontSize: -1,
};
var win = window,
    doc = document,
    isPostB = true;


window.publicInfo.pageLen = window.publicInfo.page.length;


window.HyWr = window.hy2Js = {
	docId: function(isId) {
		return document.getElementById(isId);
	},
	print: function(printObject) {
		/*
			name   		参数名
			price		参数值
			printObject	传入的参数可以是数组也可以是单个对象
			数组对象格式为：[{name:"name",price:1},{name:"name",price:1},{name:"name",price:1}]
			对象格式为：{name:"name",price:1}
		*/
		if (window.HyWr.getDataType(printObject) == "Array") {
			for (var i = 0; i < printObject.length; i++) {
				console.log(printObject[i].name + ":" + printObject[i].price);
			};
		} else if (window.HyWr.getDataType(printObject) == "Object") {
			console.log(printObject.name + ":" + printObject.price);
		} else {
			console.log("NONONO");
		}

	},
	popup: function(printObject) {
		if (printObject) {
			alert(printObject)
		};
	},
	//延时执行function
	delay: null,
	delayFun: function(isObject) {
		/*
		 ****isObject
		 ******time    	延时
		 ******Fun  		执行方法
		 */
		if (!isObject) {
			return;
		}
		window.HyWr.delay = setTimeout(function() {
			isObject.Fun();
		}, isObject.time);
	},
	//循环执行function
	loopCall: null,
	loopFun: function(isObject) {
		/*
		 ****isObject
		 ******time    	每隔多久执行一次
		 ******Fun  		执行方法
		 */
		var isEndNumb = 0;
		if (!isObject) {
			return;
		}
		window.HyWr.loopCall = setInterval(function() {
			isEndNumb += 1;
			isObject.Fun();
			if (isEndNumb == isObject.end) {
				clearInterval(window.HyWr.loopCall);
			}
		}, isObject.time);
	},
	hammTap: function(id, executeCode) {
		var hammertime = new Hammer(window.HyWr.docId(id));
		hammertime.on("tap", executeCode);
	},
	hamm: function(myId, event, executeCode) {
		var hammertime = new Hammer(HyWr.docId(myId));
		if (event == "swipeleft" || event == "swiperight" || event == "swipeup" || event == "swipedown") {
			hammertime.get('swipe').set({
				velocity: 0,
				threshold: 30,
				direction: 30
			});
		}
		hammertime.on(event, executeCode);
	},
	getDataType: function(a) {
		if (typeof a == 'object') {
			if (typeof a.length == 'number') {
				return 'Array';
			} else {
				return 'Object';
			}
		} else {
			return 'param is no object type';
		}
	},
	//判断手机操作系统
	MobileType: "",
	judgeMobileType: function() {
		var type = navigator.userAgent;
		if (type.indexOf('Android') > -1 || type.indexOf('Linux') > -1) {
			window.HyWr.MobileType = "Android";
		} else if (type.indexOf('iPhone') > -1) {
			window.HyWr.MobileType = "iPhone";
		} else if (type.indexOf('Windows Phone') > -1) {
			window.HyWr.MobileType = "Windows Phone";
		}
	},
	actUrl: "", // 接口地址
	isLocal: function(local) { //local:0 表示本地接口， 1表示线上接口
		if (local == 1) {
			this.actUrl = 'http://www.bw30v.com/jhzp_wr_hl_20160726/'; // 此处写接口地址前面的相同部分
		} else if (local == 0) {
			this.actUrl = '';
		}
	},
	pageFunc: function(num, func) {
		var t = 0;
		var oldPage = publicInfo.page.eq(publicInfo.indexPage),
			newPage = publicInfo.page.eq(num),
			currPage = $('.page.show').index();
			//console.log(currPage);
		if(currPage==num){ //如果num是当前显示的页面则不进行跳转
			return;
		}
		publicInfo.indexPage = num;
		oldPage.fadeOut(500);
		newPage.fadeIn(500, function() {
			if (func) func();
			oldPage.removeClass('show');
			newPage.addClass('show');
			publicInfo.pageCutover = true;
		});
	},
	//预载器
	preload: function(srcArr, callback, endCallback) {
		srcArr = typeof(srcArr) == 'string' ? [srcArr] : srcArr;
		var num = 0,
			imgArrObj = {};
		for (var i = 0, len = srcArr.length; i < len; i++) {
			(function(i) {
				var newImg = new Image();
				imgArrObj[srcArr[i].id || i + ''] = newImg;
				newImg.onload = function() {
					num++;
					var progress = Math.floor(num * 100 / len);
					if (progress >= 100) progress = 99;
					srcArr[i]['result'] = this;
					srcArr[i]['progress'] = progress;
					callback(srcArr[i]);
					if (num === len) {
						endCallback(imgArrObj);
					}
				};
				newImg.onerror = function() {
					throw (srcArr[i] + ' Failed to load');
				};
				newImg.src = srcArr[i].path;
			})(i);
		}
	},
	lazyLoad: function(selector, callback, endCallback) {
		var doc = document,
			assets = [],
			ele = doc.querySelectorAll(selector);

		for (var i = 0, len = ele.length; i < len; i++) {
			var obj = {
				path: '',
				type: '',
				ele: ele[i]
			}
			if (ele[i].nodeName === 'IMG') {
				obj.type = 'img';
			} else {
				obj.type = 'bj';
			}
			obj.path = ele[i].getAttribute('data-pic');
			if (obj.path) {
				assets.push(obj)
			}
		};

		window.HyWr.preload(assets, function(item) {
			if (item.type == 'img') {
				item.ele.setAttribute('src', item.path);
			} else if (item.type == 'bj') {
				item.ele.style.backgroundImage = 'url(' + item.path + ')';
			}
			if (callback) callback(item);
		}, function(result) {
			if (endCallback) endCallback(result);
		})

	},

	//获取地址参数
	getvalue: function(name, defaultV) {
		var str = window.location.search;
		if (str.indexOf(name) != -1) {
			var pos_start = str.indexOf(name) + name.length + 1;
			var pos_end = str.indexOf("&", pos_start);
			if (pos_end == -1) {
				return str.substring(pos_start);
			} else {
				return str.substring(pos_start, pos_end)
			}
		} else {
			return defaultV;
		}
	},
	scrollBox_M: function(boxEle, nrEle) {
		if (!boxEle || !nrEle) return false;
		var mc = new Hammer(boxEle),
			startRegY = 0;
		startTop = 0,
			minTop = boxEle.offsetHeight - nrEle.offsetHeight,
			B = true;
		mc.get('pan').set({
			direction: 30
		});
		mc.on("panmove", function(e) {
			if (!B) return false;
			var V = startTop + (e.center.y - startRegY);
			if (V > 0) {
				V = 0
			} else if (V < minTop) {
				V = minTop
			};
			//window.J.css(nrEle,'top',V+'px');
			$(nrEle).css('top', V)
		});
		mc.on("panstart", function(e) {
			minTop = boxEle.offsetHeight - nrEle.offsetHeight;
			if (minTop >= 0) {
				B = false;
			} else {
				B = true
			}
			startRegY = e.center.y;
			startTop = parseInt($(nrEle).css('top'));

		});
		mc.on("panend", function(e) {
			if (!B) return false;
			startRegY = 0;
			startTop = 0;
		});
	},
	isMobile: function(str) {
		if (str == null || str == "") return false;
		//var result=str.match(/^((\(\d{2,3}\))|(\d{3}\-))?((13\d{9})|(15\d{9})|(18\d{9}))$/);
		var result = str.match(/^1[3|4|5|7|8][0-9]\d{8}$/);
		if (result == null) return false;
		return true;
	},
	addMp4: function(src, autoplay) {
		var audioEle = document.createElement('audio');
		audioEle.setAttribute('src', src);
		audioEle.loop = true;

		if (autoplay) {
			//audioEle.autoplay = true;
			audioEle.setAttribute('autoplay', true);
			audioEle.play();
		} else {
			audioEle.pause();
		}
		return audioEle;
	},
	setMp4Btn: function(audioBtn, audioEle, playB) {
		audioBtn.style.display = 'block';
		var oldClass = audioBtn.className;

		if (playB && !audioEle.paused) {
			audioBtn.className = oldClass + ' show';
			audioEle.play();
		} else {
			audioBtn.className = oldClass + ' hide';
			audioEle.pause();
		}
		var mc = new Hammer(audioBtn);
		mc.on('tap', function(e) {
			if (audioBtn.className == oldClass + ' hide') {
				audioBtn.className = oldClass + ' show';
				//audioEle.currentTime = 0;
				audioEle.play();
			} else {
				audioBtn.className = oldClass + ' hide';
				audioEle.pause();
			}
		});
	},
	contains: function(arr, obj) { //判断元素是否存在于数组中
		var i = arr.length;
		while (i--) {
			if (arr[i] === obj) {
				return true;
			}
		}
		return false;
	},
	WaitHint:function(obj,text){	//1:显示   0:隐藏
		$('.waitHint').html(text);
		if (obj == 1) {
            $('.wait').fadeIn(100);
        } else if (obj == 0) {
            $('.wait').fadeOut(100);
        }
	},
	gradeChange:function(id){
		var objS = document.getElementById(id);
        var _val = objS.options[objS.selectedIndex].value;
        return _val;
	}
};

////////////////////
(function() {
	var defaultConfig = {
		setPrefix: false, //
		isRem: false, //是否为rem适配
		pageSwipeB: {
			'0': false,
			'1': false,
			'2': false,
			'3': false,
			'4': false,
			'5': false,
			'6': false,
			'7': false,
		},
	}
	if (defaultConfig.setPrefix) {
		/*
		获取浏览器前缀：
			文档模式为 [ie8- 和 [Opera12.16- prefix 将返回null；
			(Opera12.16+ 内核改为谷歌内核 将返回 webkit 前缀；
			不过这些浏览器没有必要获取浏览器前缀了 浏览器前缀主要用于css3 而这些老古董浏览器不支持大部分的css3；
		*/
		if (window.opera || !window.getComputedStyle) return null;
		var styles = window.getComputedStyle(document.documentElement, ''),
			pre = (Array.prototype.slice
				.call(styles)
				.join('')
				.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
			)[1],
			dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
		window.publicInfo.prefix = {
			dom: dom,
			lowercase: pre,
			css: '-' + pre + '-',
			js: pre[0].toUpperCase() + pre.substr(1)
		};
	}
	if (defaultConfig.isRem) {
		//rem适配
		var docEl = doc.documentElement,
			resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
			bodyEle = document.getElementsByTagName('body')[0],
			recalc = function() {
				var clientWidth = docEl.clientWidth;
				if (!clientWidth) return;
				var sizeV = 100 * (clientWidth / 640);
				sizeV = sizeV > 100 ? 100 : sizeV;
				docEl.style.fontSize = sizeV + 'px';
				bodyEle.style.fontSize = '24px';
				window.publicInfo.htmlFontSize = sizeV;
			};

		if (!doc.addEventListener) return;
		win.addEventListener(resizeEvt, recalc, false);
		recalc();
		//doc.addEventListener('DOMContentLoaded', recalc, false);

	}

	//设置翻页事件
	if (window.publicInfo.page.length > 0) {
		var mc = new Hammer(publicInfo.content[0]);
		mc.get('swipe').set({
			velocity: 0,
			threshold: 30,
			direction: 30
		}); //修改滑动的速度与方向
		//下一页
		mc.on("swipeup", function() {
			if (!publicInfo.pageCutover || defaultConfig.pageSwipeB[publicInfo.indexPage + ''] === false || defaultConfig.pageSwipeB[publicInfo.indexPage + ''] < 0) return false;
			publicInfo.pageCutover = false;
			HyWr.pageFunc(publicInfo.indexPage + 1);
		});
		//上一页
		mc.on("swipedown", function() {
			if (!publicInfo.pageCutover || defaultConfig.pageSwipeB[publicInfo.indexPage + ''] === false || defaultConfig.pageSwipeB[publicInfo.indexPage + ''] > 0) return false;
			publicInfo.pageCutover = false;
			HyWr.pageFunc(publicInfo.indexPage - 1);
		});
	}
})();

(function() {	
    var dpr, rem, scale;
    var docEl = document.documentElement;
    var fontEl = document.createElement('style');
    var metaEl = document.querySelector('meta[name="viewport"]');
    dpr = window.devicePixelRatio || 1;
    rem = docEl.clientWidth * dpr / 10;
    scale = 1 / dpr;
    // 设置viewport，进行缩放，达到高清效果
    metaEl.setAttribute('content', 'width=' + dpr * docEl.clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');

    // 设置data-dpr属性，留作的css hack之用
    docEl.setAttribute('data-dpr', dpr);

    // 动态写入样式
    docEl.firstElementChild.appendChild(fontEl);
    fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';


    // 给js调用的，某一dpr下rem和px之间的转换函数
    window.rem2px = function(v) {
        v = parseFloat(v);
        return v * rem;
    };
    window.px2rem = function(v) {
        v = parseFloat(v);
        return v / rem;
    };

    window.dpr = dpr;
    window.rem = rem;
})();

$('#fxbtn').on('click', function() {
	setTimeout(function() {
		$('#fx').fadeIn(500);
	}, 500);
});
$('#fx').on('click', function() {
	$(this).fadeOut(500);
	$('.p3next').fadeIn(300, function() {
		$('.p3next').addClass('show');
	});
});