const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;

var backImage,backgr;
var player, player_running;
var ground,ground_img;
var barrel1;
var END =0;
var PLAY =1;
var gameState = PLAY;

var survivaltime=0;
var score=0;
var button;

function preload(){
  backImage      = loadImage("image/bg.jpg");
  player_running = loadAnimation("image/runner1.png","image/runner2.png","image/runner3.png");

  coinImage = loadImage("image/logo.jpg");
  monsterImage = loadImage("image/monster.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  engine = Engine.create();
  world = engine.world;
  
  backgr=createSprite(windowWidth/2+200,windowHeight/2,windowWidth,windowHeight);
  backgr.addImage(backImage);
  backgr.scale=1.5;
  backgr.x=backgr.width/2;
  backgr.velocityX=-4;
  
  player = createSprite(windowWidth/2-windowWidth/2+50,windowHeight/2+30,20,50);
  player.addAnimation("Running",player_running);
  player.scale = 0.5;
  
  ground = createSprite(windowWidth/2,windowHeight-50,800,10);
  ground.x=ground.width/2;
  ground.visible=false;

  monsterGroup = createGroup();
  coinGroup = createGroup();

  button = createButton('restart');
  button.position(windowWidth-100,windowHeight/2-windowHeight/2+50);
  button.style('width', '100px');
  button.style('height', '40px');
  button.style('background', 'lightpink');
  
  barrel1 = new Barrel(500,250,50,20);
  barrel1.velocityX=-5;
  

}

function draw() { 
  background(0);

  Engine.update(engine);

  button.mousePressed(() => {
    restart();
});


  if(gameState===1){

  survivaltime = survivaltime + Math.round(getFrameRate()/60);
  //console.log(getFrameRate());
  //console.log("frameCount"+frameCount);

  if(backgr.x<350){
    backgr.x=backgr.width/2;
  }
  
  if(barrel1.x<0){
    barrel1.x=windowWidth-50;
  }
   
    player.velocityY = player.velocityY + 0.8;
  
    player.collide(ground);

    spawncoins();
    spawnmonsters();

    if(player.isTouching(coinGroup)){
      coinGroup[0].destroy();
      score = score +1;
      player.scale +=  + 0.05;
    }

    /*if(player.isTouching(barrel1)){
      coinGroup[0].destroy();
      score = score +1;
      player.scale +=  + 0.05;
    }*/

    if (player.isTouching(monsterGroup)) {
      gameState=0;
    }

   

      if(keyDown("space") ) {
        player.velocityY = -20;
      }

    barrel1.display();

  }else if (gameState===0) {
  ground.velocityX = 0;
  player.velocityY = 0;
  backgr.x = 300;

  monsterGroup.setVelocityXEach(0);
  coinGroup.setVelocityXEach(0);
  
  monsterGroup.setLifetimeEach(-1);
  coinGroup.setLifetimeEach(-1);
}
  
  drawSprites();

  stroke("blue");
  fill("black");
  textSize(20);
  text("Survival Time: "+ survivaltime,250,50);

  stroke("black");
  fill("white");
  text("Score:"+score,250,80);
  
}

function spawncoins() {
  
  if (frameCount % 120 === 0) {
  coin = createSprite(windowWidth-50,0,20,20);
  coin.y=Math.round(random(150, 230));
  coin.addImage(coinImage);
  coin.scale=0.2;
  coin.lifetime=300;
    
  coin.velocityX = -4;
  player.depth = coin.depth + 1;
  coinGroup.add(coin);
  }
}

function spawnmonsters() {
  
  if (frameCount % 150 === 0) {
  monster = createSprite(displayWidth-50,displayHeight/2+150,20,20);
  monster.addImage(monsterImage);
  monster.scale=0.5;
  monster.debug=true;
  monster.setCollider('circle',0,0,100);
  monster.velocityX = -(6 + survivaltime/60);
  
  monsterGroup.add(monster);
}

}

function restart(){
  gameState=1;
  score=0;
  survivaltime=0;

  console.log("restart");
  coinGroup.destroyEach();
  monsterGroup.destroyEach();
}