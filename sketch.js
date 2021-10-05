var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;
var trex, trex_correndo, trexColidiu;
var bordas;
var imagemdosolo, solo, soloinvisivel;
var nuvem, imagemdanuvem, grupodenuvens;
var obstaculo,  grupodeobstaculos, obstaculoimagem,obstaculo1,obstaculo2,obstaculo3,obstaculo4,obstaculo5,obstaculo6;
var pontuacao = 0;
var fimdejogo, fimdejogoIMG;
var reiniciar, reiniciarIMG;
var somSalto, somMorte, SomCheckPoint;

function preload(){
  
  trex_correndo = loadAnimation ("trex1.png","trex3.png","trex4.png");
  
  imagemdosolo = loadImage( "ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage( "obstacle1.png");
  obstaculo2 = loadImage( "obstacle2.png");
  obstaculo3 = loadImage( "obstacle3.png");
  obstaculo4 = loadImage( "obstacle4.png");
  obstaculo5 = loadImage( "obstacle5.png");
  obstaculo6 = loadImage( "obstacle6.png");
  
  trexColidiu = loadAnimation("trex_collided.png");
  
  fimdejogoIMG = loadImage( "gameOver.png");
  
  reiniciarIMG = loadImage( "restart.png");
  
  somSalto = loadSound("jump.mp3"); 
  somMorte = loadSound("die.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
  
}

function setup(){
  
  createCanvas(windowWidth,windowHeight);
  
  // criando o trex 
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trexColidiu);
  
  //Atribuindo as bordas a variavel Bordas
  bordas = createEdgeSprites();
  
  //criando imagem solo
  solo = createSprite(width/2,height-20,width,20);
  solo.addImage("ground", imagemdosolo);
  solo.x = solo.width/2;
  
  //criando solo invisivel
  soloinvisivel = createSprite(width/2,height-10,width, 10);
  soloinvisivel.visible = false;
  
  //adicionando escala e posição ao trex
  trex.scale = 0.5;
  trex.x = 50
  
  //criar grupos de obstaculos e nuvens
  grupodeobstaculos = new Group();
  grupodenuvens = new Group();
  
  //concatenação de string
  //console.log("oi" + "mundo");
  
  //trex.setCollider("rectangle", 0,0,150, trex.width,trex.height );
  trex.setCollider("circle", 20,5,40,);
  trex.debug = true;
  
  fimdejogo = createSprite(width/2,height/2);
  fimdejogo.addImage(fimdejogoIMG);
  fimdejogo.scale = 0.5;
  
   
  reiniciar = createSprite(width/2,height/2 + 50);
  reiniciar.addImage(reiniciarIMG);
  reiniciar.scale = 0.5;
  
  
 
}

function draw(){ 
  
  // definir cor de fundo
  background("white");
  
  //texto e pontuação dos nosso jogo por frames/quadros
  text("Pontuação: " + pontuacao, width/2 -50,height-500);
 
  // console.log("isto é: ", estadoJogo)
  
  if(estadoJogo === JOGAR){
    fimdejogo.visible = false;
    reiniciar.visible = false;
    
    //atribuindo velocidade ao nosso solo
    solo.velocityX = -(2 + 3* pontuacao/100);
    
    //marcar pontos
    pontuacao = pontuacao + Math.round(frameRate()/ 60);
    
    if(pontuacao>0 && pontuacao % 300 === 0){
      somCheckPoint.play();    
    }
    
    //resetar solo
    if(solo.x<0){
      solo.x = solo.width/2;
    }
    
    // o trex pula quando a tecla espaço é acionada só
    //funciona o espaço quando a posição
    //y estiver maior ou igual a 100 não permitindo pular +.
    if(keyDown("space") || touches.length > 0 && trex.y > height- 60){
      trex.velocityY = -10;
      somSalto.play();
      touches = [];
    }
    
    //gravidade
    trex.velocityY = trex.velocityY + 0.5;
   
    //mostrar as nuvens
    gerarNuvens();
  
    //mostrar obstaculos
    gerarObstaculos();
    
    if(grupodeobstaculos.isTouching(trex)){
        //IA
        //trex.velocityY = -12;
        //somSalto.play();
      
      estadoJogo = ENCERRAR;
      somMorte.play();
    }
    
  } else if (estadoJogo === ENCERRAR){
    
    fimdejogo.visible = true;
    reiniciar.visible = true;
    //parar o solo
    solo.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("collided", trexColidiu);
    
    //define o tempo de vida dos objetos do jogo para que nunca sejam destruidos.
    grupodeobstaculos.setLifetimeEach(-1);
    grupodenuvens.setLifetimeEach(-1);
    
    grupodeobstaculos.setVelocityXEach(0);
    grupodenuvens.setVelocityXEach(0);
    
    if(mousePressedOver(reiniciar) || touches.length > 0){
      console.log("Riniciar o Jogo");
      reset();
      touches= [];
  }
  }
  
  // registrando a posição y do trex
  //console.log(trex.y)
  //console.log(solo.x);
    
  //impedir o trex de cair 
  trex.collide( soloinvisivel);
  
  // contar os frames ou quadros da tela.
  // console.log(frameCount);
  
 
  
  
  //mostrar os sprites na tela
  drawSprites();
}

function reset(){
  estadoJogo = JOGAR;
  fimdejogo.visible = false;
  reiniciar.visible = false;
  
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();
  
  trex.changeAnimation("running", trex_correndo);
  pontuacao = 0;
}

function gerarObstaculos(){
  if(frameCount % 60 === 0){
    obstaculo = createSprite (width,height-30,10,40);
    obstaculo.velocityX = -(6 + pontuacao/100);
    
    var rand = Math.round(random(1,6));
    switch(rand){
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
    case 6: obstaculo.addImage(obstaculo6 );
        break;    
    } 
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 200;
    
    //adicionar cada obstaculo ao grupo
    grupodeobstaculos.add(obstaculo);
  } 
}
function gerarNuvens(){
  if(frameCount % 60 === 0){
    nuvem = createSprite(600, 100, 40, 10);
    nuvem.addImage(imagemdanuvem);
    nuvem.y = Math.round(random(height-100,height-300)) 
    nuvem.scale = 0.5;    
    nuvem.velocityX = -3;
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1; 
    
    //Atribuindo tempo de duração a variavel
    nuvem.lifetime = 300;
    
    //add nuvem ao grupo
    grupodenuvens.add(nuvem);
    
    //console.log(trex.depth);
    //onsole.log(nuvem.depth);
}
}