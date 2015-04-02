/**
 *snake.js
 *贪吃蛇
 *Author:mike
 *Created by mike on 14-9-1
 */
 
 
 /**
  *配置信息
  */
var Config = {
	CANVAS : {//画布的属性
	
		width : 800,
		
		height : 600
	},
	
	SIZE : {//node的属性（小矩形的属性）
	
		length : 10
	},
	
	DIRECTION : {//控制蛇移动的方向，0表示向上，1表示向右，2表示向下，3表示向左
	
		up : 0,
		
		right : 1,
		
		down : 2,
		
		left : 3
	}
};
	
/**
 * node
 */	
function Node(x,y){
	
	this.length = Config.SIZE.length;
	
	this.x = x;
	
	this.y = y;
}

//食物的配置信息
function Food(context){
	
	this.context = context;
	
	//x轴最多可以放置多少个矩形
	var stepX = Config.CANVAS.width / Config.SIZE.length - 1;
	
	var stepY = Config.CANVAS.height / Config.SIZE.length - 1;
	
	var x = Math.ceil(Math.random() * stepX) * Config.SIZE.length;
	
	var y = Math.ceil(Math.random() * stepY) * Config.SIZE.length;
	
	Node.apply(this,[x,y]);
}

//食物的私有属性，讲他画在画布上
Food.prototype._draw = function(){
	
	this.context.fillRect(this.x,this.y,Config.SIZE.length,Config.SIZE.length);
	
}

//蛇的构造函数
function Snake(context){
	
	this.context = context;
	
	this.body = [];
	
	this.food = new Food(this.context);
	
	this.direction = Config.DIRECTION.right;
	
	this.speed = 100;
	
	//s事件
	this.onEaten = null;//吃食物的事件
	
	this.onDie = null;//蛇死亡的事件
}

Snake.prototype.init = function(){
	
	var x = Config.SIZE.length * 10;
	
	var y = Config.SIZE.length * 10;
	
	for(var i = 0; i < 8; i++){
		 
		this.body.push(new Node(x - Config.SIZE.length * i,y));
	}
	
	//绑定键盘事件
	this._bind();
	
	//画到画布上
	this._draw();
};

//键盘事件
Snake.prototype._bind = function(){
	
	var that = this;
	
	$(window).keydown(function(event){
		
		switch(event.keyCode){
			
			case 38 : //向上的键
			
				if(that.direction == Config.DIRECTION.down){
					
					return;
				}
				
				that.direction = Config.DIRECTION.up;
				
				break;
			
			case 39 : //向右的键
				
				if(that.direction == Config.DIRECTION.left){
					
					return;
				}
				
				that.direction = Config.DIRECTION.right;
				
				break;
				
			case 40 : //向下的键
				
				if(that.direction == Config.DIRECTION.up){
					
					return;
				}
				
				that.direction = Config.DIRECTION.down;
				
				break;
			
			case 37 : //向左的键
				
				if(that.direction == Config.DIRECTION.right){
					
					return;
				}
				
				that.direction = Config.DIRECTION.left;
				
				break;
		}
	});
};

//画在画布上
Snake.prototype._draw = function (){
	
	this.context.clearRect(0,0,Config.CANVAS.width,Config.CANVAS.height);
	
	for(var i = 0, len = this.body.length; i < len; i++){
		
		this.context.fillRect(this.body[i].x , this.body[i].y , this.body[i].length , this.body[i].length);
	}
	
	this.food._draw();
};

//判断蛇是否吃到食物
Snake.prototype.isEatenFood = function (){

	return this.body[0].x === this.food.x && this.body[0].y === this.food.y;
};

//判断是否吃到自己了
Snake.prototype.isEatenMySelf = function(){
	
	for(var i = 1, len = this.body.length; i < len; i++){
		
		if(this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y){
			
			return true;
		}
	}
	
	return false;
};

//蛇的移动
Snake.prototype._move = function(){
	
	//判断是否吃到自己
	
	if(this.isEatenMySelf()){
		
		if(this.onDie){
			
			//如果存在死亡事件，就继承他
			this.onDie.call(this);
		}
		
		return;
	}
	
	//判断是否吃到食物
	if(this.isEatenFood()){
		
		if(this.onEaten){
			
			this.onEaten.call(this);
		}
		
		//蛇的身体加1
		this.body.unshift(this.food);
		
		//重新生成食物
		this.food = new Food(this.context);
	}
	
	//移动思路就是：蛇的尾部消失，蛇头朝着前进的方向加1
	this.body.pop();
	
	var headX = this.body[0].x;
	
	var headY = this.body[0].y;
	
	switch(this.direction){
		
		case Config.DIRECTION.up :
			
			if(headY <= 0){
				
				headY = Config.CANVAS.height;
			}
			
			this.body.unshift(new Node(headX , headY - Config.SIZE.length));
			
			break;
		
		case Config.DIRECTION.right :
			
			if(headX >= Config.CANVAS.width - Config.SIZE.length){
				
				headX = -Config.SIZE.length;
			}
			
			this.body.unshift(new Node(headX + Config.SIZE.length , headY));
			
			break;
			
		case Config.DIRECTION.down :
		
			if(headY >= Config.CANVAS.height - Config.SIZE.length){
				
				headY = -Config.SIZE.length;
			}
			
			this.body.unshift(new Node(headX , headY + Config.SIZE.length));
			
			break;
			
		case Config.DIRECTION.left :
		
			if(headX <= Config.SIZE.length){
				
				headX = Config.CANVAS.width;
			}
			
			this.body.unshift(new Node(headX - Config.SIZE.length , headY));
			
			break;
	}
	
	this._draw();
	
	setTimeout($.proxy(this._move , this) , this.speed);
	
};

//开始游戏
Snake.prototype.start = function(){
	
	this._move();
};





























	