var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;
var imgFimDeJogo,imgReiniciar;
var pular, morrer, ponto;


function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
    
  imgReiniciar = loadImage("restart.png");
  imgFimDeJogo = loadImage("gameOver.png");
  pular = loadSound("jump.mp3");
  morrer = loadSound("die.mp3");
  ponto = loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
  trex = createSprite(50,height-70,20,50);
  
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trex_colidiu);
  
  
  trex.scale = 0.5;
  
  solo = createSprite(width/2,height-90,width,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
    
  fimDeJogo = createSprite(width/2,height/2-50);
  fimDeJogo.addImage(imgFimDeJogo);
  
  reiniciar = createSprite(width/2,height/2);
  reiniciar.addImage(imgReiniciar);
  
  fimDeJogo.scale = 0.5;
  reiniciar.scale = 0.5;
    
  soloinvisivel = createSprite(width/2,height-10,width,120);
  soloinvisivel.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
      
  trex.setCollider("rectangle",0,0,trex.width+ 10,trex.height);
  trex.debug = false
  
  pontuacao = 0;
  
}

function draw() {
  
  background(180);
  //exibindo pontuação
  text("Pontuação: "+ pontuacao, 500,50);
    
  
  if(estadoJogo === JOGAR){
   
    fimDeJogo.visible = false
    reiniciar.visible = false
    //mudar a animação do Trex
    
    trex.changeAnimation("running", trex_correndo);
    solo.velocityX = -4;
    //marcando pontuação
    pontuacao = pontuacao + Math.round(frameRate()/60);
    if (pontuacao>0 && pontuacao%200=== 0) {
      ponto.play();
    }
  
    
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //saltar quando a tecla de espaço é pressionada
    if(touches.length>0||keyDown("space")&& trex.y >= height-120) {
       trex.velocityY = -12;
      pular.play();
      touches=[];
    
  }
  
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 1
   
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo
    gerarObstaculos();
    
    if(grupodeobstaculos.isTouching(trex)){
       trex.velocityY = -12;
       morrer.play();
        estadoJogo = ENCERRAR;
    }
      
   }
 
      else if (estadoJogo === ENCERRAR) {
        fimDeJogo.visible = true;
        reiniciar.visible = true;
        //altera a animação do Trex
        trex.changeAnimation("collided", trex_colidiu);
     
       
       
      solo.velocityX = 0;
      trex.velocityY = 0
       
     
      //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
    grupodeobstaculos.setLifetimeEach(-1);
    grupodenuvens.setLifetimeEach(-1);
     
     grupodeobstaculos.setVelocityXEach(0);
     grupodenuvens.setVelocityXEach(0);  
  }
     
  
  
  //evita que o Trex caia no solo
  trex.collide(soloinvisivel);

    if(mousePressedOver(reiniciar)){
      reset();
    }
  drawSprites();

}  




  function gerarObstaculos(){
     if (frameCount % 60 === 0){
     var obstaculo = createSprite(width,height-100,10,40);
     obstaculo.velocityX = -(6+3 *pontuacao/100);
      
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}

 function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(width+20,height-300,40,10);
    nuvem.y = Math.round(random(80,370));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 200; 
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
 }
function reset(){
  estadoJogo = JOGAR;
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();
  pontuacao = 0;
}