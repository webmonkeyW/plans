// box2Deasy.js by hylink 杨燚平 2015-07-03 email:849890769@qq.com
;(function(box2Deasy){
	var world = null,
		stageWidth = null,
		stageHeight = null;
		
	//create world
	box2Deasy.createWorld=function(id,gravity){
		world = new b2World(gravity, true);
		stageWidth=document.getElementById(id).width;
		stageHeight=document.getElementById(id).height;
		
		createDebug(id);
        return world;
		//box2Deasy.updateWorld();
	}
	//create debug 创建调试对象
	function createDebug(id){
		var debug = new b2DebugDraw();//新建调试试图对象
    	debug.SetSprite(document.getElementById(id).getContext("2d"));//必须先设置context，后面才能设置ctx的线条宽度以及其他属性
    	debug.SetLineThickness(1);//线条粗细
    	debug.SetFillAlpha(0.5);//内容的填充色的透明度
    	debug.SetAlpha(1);//边框的透明度
    	debug.SetDrawScale(30);//设置调试视图的绘制比例。
    	debug.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_centerOfMassBit | b2DebugDraw.e_jointBit);//位与的方式 开启调试选项  这里开启了 刚体形状 刚体中心 刚体关节
    	world.SetDebugDraw(debug);//将调试试图对象添加到舞台/世界
	}
	
	box2Deasy.updateWorld = function(onUpdate,isDebug){
		var isDebug=(isDebug==true)?1:0;
		//setInterval(update, (1000/60));
		requestAnimationFrame(update);	
		function update() {
    		var timeStep = 1/60;   //帧率
    		var velocityInterations = 10;   //速率
    		var positionIterations = 10;

    		world.Step(timeStep, velocityInterations, positionIterations);
   			world.ClearForces();// 在2.1版本清除力，以提高效率
			
			for(var b=world.GetBodyList();b;b=b.GetNext()){
				if(b.GetUserData()=="remove"){
					world.DestroyBody(b);
				}
				if(b.texture && !isDebug){
					b.texture.x=b.GetPosition().x * 30;
					b.texture.y=b.GetPosition().y * 30;
					b.texture.rotation=b.GetAngle()*180/Math.PI;	
				}
			}
			//刷新回调
    		if(isDebug){
				world.DrawDebugData();// 绘制
			}else{onUpdate();}
			
			requestAnimationFrame(update);	
		}
	}
	


	
	
	box2Deasy.createGround=function(opt){//有待完善
		if(!opt)throw('parameters are required');
		var bodyDef = new b2BodyDef;//新建bodyDef
    	bodyDef.type = b2Body.b2_staticBody;//刚体类型为静态刚体
		bodyDef.userData=opt.userData||'ground';
		bodyDef.position.Set(opt.x/30, opt.y/30);
		bodyDef.angle=opt.angle || 0;
		
		//console.log(opt.restitution)
		
		var fixDef = new b2FixtureDef;//新建fixDef
    	fixDef.density = opt.density!=undefined? opt.density : 1;//密度
    	fixDef.friction = opt.friction!=undefined? opt.friction : 0.1;//摩擦系数
    	fixDef.restitution = opt.restitution!=undefined? opt.restitution : 0.4;//弹性系数
    	fixDef.shape = new b2PolygonShape;//形状为矩形
    	fixDef.shape.SetAsBox(opt.width/30, opt.height/30);
		
    	var newBody=world.CreateBody(bodyDef);
		newBody.CreateFixture(fixDef)	
		newBody.texture=opt.texture;//质地 即纹理

		return newBody;
	}
	

	
	
	

	
	
	
})(window.box2Deasy=window.box2Deasy || {});















































