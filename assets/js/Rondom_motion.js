window.addEventListener('load', (e) => draw([]));
document.querySelector('.speedSlider').addEventListener('change', (e) => {params.speed = 100- e.srcElement.valueAsNumber});
document.querySelector('.maxCountSlider').addEventListener('change', (e) => {params.maxCount = e.srcElement.valueAsNumber});

let counterSpan = document.querySelector('.count');

let params = {
	speed: 50,
	size: 10,
	spacing: 2,
	maxCount: 50,
	trail: 0.8
}

const draw = (worms=[]) => {
	let canvas = document.querySelector('#animBg');
	if (canvas.getContext) {
		setDimensions(canvas);
		
		if (Math.floor(Math.random() * 100) < params.maxCount) {
			worms.push(new Worm(canvas, params));
			counterSpan.innerHTML = worms.length;
		}
		
		worms = worms.reduce((acc, worm, i) => {
			if (worm.active === true) {
				worm.renderPath();
				acc.push(worm);
			}
			return acc;
		}, []);		
	}

	setTimeout(() => {draw(worms)}, params.speed);
};

const findNextPoint = (rect) => {	
	let newRect = '';
	
	return newRect;
}

class Worm {
	constructor(canvas) {
		this.canvas = canvas;
		this.sides = this.setSides();
		this.enterPoint = this.setBoundaryPoint(this.sides.enter, this.canvas);
		this.exitPoint =  this.setBoundaryPoint(this.sides.exit, this.canvas);
		this.size = params.size
		this.spacing = params.spacing;
		this.rects = [this.startPath()];
		this.active = true;
		this.color = this.getRandColorVal()+','+ this.getRandColorVal()+','+ this.getRandColorVal()
	}
	
	getRandColorVal() {
		let base = 255;
		let mod = 50;
		return mod + Math.floor(Math.random() * (base-mod));
	}
	findNextRectPos(posInfo) {
		let lastRect = this.rects[this.rects.length-1];
		let lastDir = lastRect.dir;
		let nextX = lastRect.posInfo.x
		let nextY = lastRect.posInfo.y
		let posMod = params.spacing+params.size
		
		switch(lastRect.posInfo.dir) {
			case 'down':
				nextY = lastRect.posInfo.y+posMod;
				break;
			case 'left':
				nextX = lastRect.posInfo.x-posMod;
				break;
			case 'up':				
				nextY = lastRect.posInfo.y-posMod;
				break;
			case 'right':
				nextX = lastRect.posInfo.x+posMod;
				break;
		}
		return {x: nextX, y: nextY, dir: lastRect.posInfo.dir}
	}
	
	renderPath() {
		if (this.rects.length > 0) {
			this.rects.push(new Rect(this.canvas, this.findNextRectPos(), this.color));
		} else {
			this.active = false;
			return;
		}
		
		this.rects = this.rects.reduce((acc, rect, i) => {
			// reduce opacity
			rect.opacity = rect.opacity*0.8;
			if (rect.opacity > 0.001 && !this.outOfBounds(rect)) {
				rect.draw();
				acc.push(rect);
			}
			return acc;
		}, []);
	}
	
	outOfBounds(rect) {
		if (rect.posInfo.x < 0 || rect.posInfo.x > this.canvas.width || rect.posInfo.y < 0 || rect.posInfo.y > this.canvas.height) {
			return true;
		}
		return false;
	}
	
	startPath() {
		return new Rect(this.canvas, this.enterPoint, this.color);
	}
	
	setSides(dirArr = ['down', 'left', 'up', 'right']) {
		let x = dirArr[Math.floor(Math.random() * (dirArr.length))];
			dirArr = dirArr.reduce((acc, val) => {
				if (val !== x) {
					acc.push(val);
				}
				return acc;
			}, []);
		let y = dirArr[Math.floor(Math.random() * (dirArr.length-1))];
		return {enter: x, exit: y};
	}
	
	setBoundaryPoint(dir, canvas) {
		let retObj = {};
		let randWidth = Math.floor(Math.random() * canvas.width);
		let randHeight = Math.floor(Math.random() * canvas.height);
		switch (dir) {
			case 'down':
				retObj.x = randWidth;
				retObj.y = 0;
				break;
			case 'left':
				retObj.x = canvas.width;
				retObj.y = randHeight;
				break;
			case 'up':
				retObj.x = randWidth;
				retObj.y = canvas.height;
				break;
			case 'right':
				retObj.x = 0;
				retObj.y = randHeight;
				break;
		}
		retObj.dir = dir;
		return retObj;
	}

}

class Rect {
	constructor(canvas, posInfo, color) {
		this.color = color;
		// pos = {x, y} - Where are my x and y coordinates
		this.posInfo = posInfo;
		this.opacity = 1;
		this.active = true;
		// ctx is a 2d context for the canvas so I can draw myself(Rect)
		// onto the canvas
		this.ctx = canvas.getContext('2d');
		
	}
	// Draw myself on to the screen
	draw() {
		this.fill ='rgba('+this.color+', '+this.opacity+')'
		this.ctx.fillStyle = this.fill;
		this.ctx.fillRect(this.posInfo.x, this.posInfo.y, params.size, params.size);
	}
}


const setDimensions = (canvas) => {
	let containerElem = document.querySelector('.canvasWrap');
	canvas.width = containerElem.clientWidth+params.size;
	canvas.height = containerElem.clientHeight+params.size;
	canvas.style.top = -Math.abs(params.size)+'px';
	canvas.style.left = -Math.abs(params.size)+'px';
}