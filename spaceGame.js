const cv = document.getElementById("game");
const ct = cv.getContext("2d");
const fps = 50;
var start = false;
var score = 0;

class stc{
  constructor(x,y,w,h,c,v,stopL,stopR){
    this.soundShoot;
    this.go = false;
    this.x = x/2-w/2;
    this.y = y-2*w;
    this.w = w;
    this.h = h;
    this.c = c;
    this.velocity = v;
    this.stopL = false;
    this.stopR = false;
    this.reset();

    this.soundShoot = document.createElement("audio");
    this.soundShoot.src  = "shoot.wav";
    this.soundShoot.setAttribute("preload","auto");
    this.soundShoot.setAttribute("controls","none");
    this.soundShoot.style.display = "none";
    document.body.appendChild(this.soundShoot);

    this.soundKilled = document.createElement("audio");
    this.soundKilled.src = "invaderkilled.wav";
    this.soundKilled.setAttribute("preload","none");
    this.soundKilled.setAttribute("controls","none");
    this.soundKilled.style.display = "none";
    document.body.appendChild(this.soundKilled);

    this.soundDead = document.createElement("audio");
    this.soundDead.src = "explosion.wav";
    this.soundDead.setAttribute("preload","none");
    this.soundDead.setAttribute("controls","none");
    this.soundDead.style.display = "none";
    document.body.appendChild(this.soundDead);
  }

  playShootSound(){
    this.soundShoot.play();
  }

  playKilledSound(){
    this.soundKilled.play();
  }

  playDeadSound(){
    this.soundDead.play();
  }

  reset(){
    drawRect(this.x,this.y,this.w,this.h,this.c);
  }

  controlLeft(){
    if(this.x <= st.w/2){
      this.stopL = true;
      return st.stopL;
    }
  }

  controlRight(){
    if(this.x+2*this.w >= cv.width){
      this.stopR = true;
      return st.stopR;
    }
  }

  moveLeft(){
    if(!this.controlLeft()){
      this.x -= this.velocity*3;
  }
}

    moveRight(){
      if(!st.controlRight()){
      this.x += this.velocity*3;
    }
  }

  gameOver(){
    setTimeout(() =>{
    //clear(st.x,st.y,st.w,st.h,"black");
    st.go = true;
    ct.fillStyle = "white";
    ct.font = cv.width/25+"px sans-serif";
    ct.fillText("Game Over Click Space to Play Again",cv.width/6,cv.height/7);
    am.stop = true;
  },500)
  }

    restart(){
      clear(st.x,st.y,st.w,st.h,"black");

    this.go = false;
    this.x = game.x/2-game.w/2;
    this.y = game.y-2*game.w;
    this.w = game.w;
    this.h = game.h;
    this.c = game.c;
    this.velocity = game.v;
    this.stopL = false;
    this.stopR = false;

    am.stop = false;
    am.ok = false;
    am.x = st.x + ammoObj.w/4*3;
    am.y = st.y - 2*ammoObj.h;
    am.w = ammoObj.w;
    am.h = ammoObj.h;
    am.c = ammoObj.c;

    tr.w = am.w;
    tr.h = am.h;
    tr.c = targetObj.c;
    tr.stop = false;

    drawRect(st.x,st.y,st.w,st.h,"white");
    render();
  }
}

class ammo{
  constructor(w,h,c){
    this.stop = false;
    this.ok = false;
    this.x = st.x + w/4*3;
    this.y = st.y - 2*h;
    this.w = w;
    this.h = h;
    this.c = c;
  }

  updateCoor(){
    this.x = st.x + am.w/4*3;
    this.y = st.y - 2*am.h;
  }
// && Math.abs(am.x-tr.x) < am.w
  check(){
    if(am.y-tr.y >= 0 && am.y-tr.y <= am.h && Math.abs(am.x-tr.x) < am.w + 8)
      return true;
    else
      false;
  }

  inter(){
    this.stop = true;
    am.ok = false;
    let inter = setInterval(() => {
      if(this.check()){
        setTimeout(st.playKilledSound(),200);
        clearInterval(inter);
        changeScore();
        clear(this.x,this.y,this.w,this.h,"black")
        this.updateCoor();
        this.stop = false;
        this.ok = true;
        return true;
      }
      else if(am.y - tr.y < 0){
        clearInterval(inter);
        clear(this.x,this.y,this.w,this.h,"black")
        this.updateCoor();
        this.stop = false;
        return true;
      }
      clear(this.x,this.y,this.w,this.h,"black");
      this.y -= game.v;
      drawRect(this.x,this.y,this.w,this.h,this.c);
    },1000/fps);
  }

  move(){
    this.inter();
  }
}

class target{
  constructor(c){
    this.w = am.w;
    this.h = am.h;
    this.c = c;
    this.stop = false;
  }

  inter(){
    am.ok = false;
    this.stop = true;
    let inter = setInterval(() => {
      clear(this.x-1,this.y-1,this.w+2,this.h+2,"black");
      this.y += game.v/3;
      drawRect(this.x,this.y,this.w,this.h,this.c);
      if(am.ok){
        clearInterval(inter);
        clear(this.x-1,this.y-1,this.w+2,this.h+2,"black");
        this.stop = false;
        this.produce();
      }
      else if(this.y >= cv.height - 3*st.h){
        clearInterval(inter);
        setTimeout(st.playDeadSound(),150);
        clear(this.x-1,this.y-1,this.w+2,this.h+2,"black");
        this.stop = false;
        st.gameOver();
      }
    },1000/fps);
  }

  move(){
    this.inter();
  }

  produce(){
    if(!this.stop){
    this.x = (Math.random()*((cv.width/25-2)-2)+2)*25;
    this.y = cv.height/28;
    drawRect(this.x,this.y,this.w,this.h,this.c);
    this.move();
  }
  }
}

const drawRect = (x,y,w,h,c) =>{
  ct.fillStyle = c;
  ct.fillRect(x,y,w,h);
}

const clear = (x,y,w,h,c) =>{
  drawRect(x,y,w,h,c);
}

const keyDown = (e) =>{
  if(e.key == "ArrowLeft"){
    if(start){}

    else{
    clear(st.x,st.y,st.w,st.h,"black");
    st.moveLeft();
    drawRect(st.x,st.y,st.w,st.h,"white");
    if(!am.stop)
        am.updateCoor();
  }
}
  else if(e.key == "ArrowRight"){
    if(start){}

    else{
    clear(st.x,st.y,st.w,st.h,"black");
    st.moveRight();
    drawRect(st.x,st.y,st.w,st.h,"white");
    if(!am.stop)
        am.updateCoor();
  }
}
  else if(e.key == " "){
    if(start){
      start = false;
      render();
    }
    else if(st.go){
      st.restart();
    }
    else if(!am.stop){
    drawRect(am.x,am.y,am.w,am.h,am.c);
    setTimeout(st.playShootSound(),200);
    am.move();
    }
  }
}

const changeScore = () =>{
    score+=5;
    drawRect(0,0,cv.width/2,cv.width/10,"black");
    ct.fillStyle = "white";
    ct.font = cv.width/15+"px sans-serif";
    ct.fillText(score,cv.width/50,cv.height/25);
}

const render = () =>{
  st.go = false;
  score = 0;
  drawRect(0,0,cv.width,cv.height,"black");
  ct.fillStyle = "white";
  ct.font = cv.width/15+"px sans-serif";
  ct.fillText(score,cv.width/50,cv.height/25);
  st.reset();
  tr.produce();
}

const startGame = () =>{
  drawRect(0,0,cv.width,cv.height,"black");
  ct.fillStyle = "white";
  ct.font = cv.width/25+"px sans-serif";
  ct.fillText("Click Space to Start Game",cv.width/4,cv.height/7);
  start = true;
}

const game = {
  x:cv.width,
  y:cv.height,
  w:cv.width/10,
  h:cv.width/10,
  c:"white",
  v:14
};

const ammoObj = {
  w:game.w/5*2,
  h:game.h/5*2,
  c:"blue"
};

const targetObj = {
  c:"red"
};

var st = new stc(game.x,game.y,game.w,game.h,game.c,game.v,false,false);
var am = new ammo(ammoObj.w,ammoObj.h,ammoObj.c);
var tr = new target(targetObj.c);
document.addEventListener("keydown",keyDown);

startGame();
