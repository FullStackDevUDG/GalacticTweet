var MiniScreenScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function MiniScreenScene() {
        Phaser.Scene.call(this, { key: 'MiniScreen' });
    },

    preload(){
    },

    create(){
        this.input.keyboard.on('keydown-ESC', function(event) {
            if (game.scene.isActive('MiniScreen')) {

                game.scene.resume('GalacticalTweet');

                // Habilita el procesamiento de entrada de la escena anterior
    
                // Destruye la escena de la minipantalla
                game.scene.remove('MiniScreen');  
            }


        });
        
    }
});

var game;
var isPaused=false;
var gameOptions = {
    gravetat: 800,
    VelocitatX: 150,
    forçaClick: 350,
    distMinim: 100,
    distanciaEntreObstacles: [150, 300],
    foratObstacle: [100, 300],

    localStorageName: 'puntuacioMax'
}
window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor:0xE1E8ED,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: 'thegame',
            width:1080,
            height:511
        },
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scene: GalacticalTweet
    }
    game = new Phaser.Game(gameConfig);
}

class GalacticalTweet extends Phaser.Scene{
    //Constructor per defecte
    constructor(){
        super('GalacticalTweet');
    }
    preload(){
        //Càrrega de imatges
        this.load.image('player', '../textures/player.png');
        this.load.image('obstacle', '../textures/obstacle3.png');
        this.load.image('ball', '../textures/ball.png');
        this.load.image('ball2', '../textures/ball2.png');
    }
    create(){

        //creació mascara per realitzar la acció de l'obstacle dolent
        this.isCollision = false;
        this.maskGraphics = this.add.graphics().setDepth(1);
        this.maskGraphics.fillStyle(0x000000);

        //creació grup d'obtsacles
        this.grupObstacles = this.physics.add.group();
        this.grupBalls = this.physics.add.group();
        this.grupBalls2 = this.physics.add.group();
        //Array Obstacles
        this.llistaObstacles = [];
        
        for(let i = 0; i < 4; i++){
            this.llistaObstacles.push(this.grupObstacles.create(0, 0, 'obstacle'));
            this.llistaObstacles.push(this.grupObstacles.create(0, 0, 'obstacle'));
            this.posarObstacles(false);
        }

        this.grupObstacles.setVelocityX(-gameOptions.VelocitatX);//velocitat dels obstacles
        this.grupBalls.setVelocityX(-gameOptions.VelocitatX);
        this.grupBalls2.setVelocityX(-gameOptions.VelocitatX);

        this.bird = this.physics.add.sprite(80, game.config.height / 1.5, 'player');
        //this.bird.tint=0x6df1d8;
        this.bird.setScale(0.08);//ajustar escala de l'sprite
        this.bird.body.gravity.y = gameOptions.gravetat;//asigna gravetat al jugador
        this.input.on('pointerdown', this.impuls, this); //es crea event de click a la pantalla. SI es clica es crida a this.impuls


        this.input.keyboard.on('keydown-ESC', function(event) {
            if (!game.scene.isActive('MiniScreen')) {
                var miniScreenScene = game.scene.add('MiniScreen', MiniScreenScene, true);
                // Pausa la escena actual
                game.scene.pause('GalacticalTweet');
                // Deshabilita el procesamiento de entrada de la escena actual
                //game.input.enabled = false;
            }


        });


        this.Puntuacio = 0;
        if(localStorage.getItem(gameOptions.localStorageName) == null)
            this.topPuntuacio = 0;
        else
            this.topPuntuacio = localStorage.getItem(gameOptions.localStorageName);
        this.PuntuacioText = this.add.text(10, 10, '');
        this.actualitzaPuntuacio();
    }
    actualitzaPuntuacio(){
        this.Puntuacio++;
        this.PuntuacioText.text = 'Puntuacio: ' + this.Puntuacio + '\nMillor: ' + this.topPuntuacio;
    }
    //NECESITA DOS OBSTACLES PER A FUNCIONAR
    posarObstacles(afegirPuntuacio){
        let dretaPos = this.obstacleMesDreta();
        let alturaForatObstacle = Phaser.Math.Between(gameOptions.foratObstacle[0], gameOptions.foratObstacle[1]); //valor aleatori entre l'interval declarat al principi
        let posicioForatObstacle = Phaser.Math.Between(gameOptions.distMinim + alturaForatObstacle / 2, game.config.height - gameOptions.distMinim - alturaForatObstacle / 2); 
        //valor aleatori entre el resultat de tots dos calculs

        //Establim la posició horitzontal del primer obstacle a la llistaObstacles.
        //La calculem suman dretaPos, l'ample de cada obstacle i una distancia aleatoria entre l'interval de distancia entre obstacles.
        this.llistaObstacles[0].x = dretaPos + this.llistaObstacles[0].getBounds().width + Phaser.Math.Between(gameOptions.distanciaEntreObstacles[0], gameOptions.distanciaEntreObstacles[1]);
        

        this.llistaObstacles[0].y = posicioForatObstacle - alturaForatObstacle / 2;
        this.llistaObstacles[0].setOrigin(0, 1);

        //posicio horitzontal del segon obstacle igual que la del primer
        this.llistaObstacles[1].x = this.llistaObstacles[0].x;

        this.llistaObstacles[1].y = posicioForatObstacle + alturaForatObstacle / 2;
        this.llistaObstacles[1].setOrigin(0, 0);

        //Creació Obstacle BO
        if (Phaser.Math.Between(1, 100) <= 30) {
            let randomX = Phaser.Math.Between(dretaPos + this.llistaObstacles[0].getBounds().width, this.llistaObstacles[0].x);
            let randomY = Phaser.Math.Between(this.llistaObstacles[0].y, this.llistaObstacles[1].y);
            let ball = this.grupBalls.create(randomX, randomY, 'ball');
            ball.setOrigin(0.5, 0.5);
            ball.setScale(0.05);
            ball.setVelocityX(this.grupObstacles.getChildren()[0].body.velocity.x);
        }
        //Creació Obstacle DOLENT
        if (Phaser.Math.Between(1, 100) <= 20) {
            let randomX = Phaser.Math.Between(dretaPos + this.llistaObstacles[0].getBounds().width, this.llistaObstacles[0].x);
            let randomY = Phaser.Math.Between(this.llistaObstacles[0].y, this.llistaObstacles[1].y);
            let ball2 = this.grupBalls2.create(randomX, randomY, 'ball2');
            ball2.setOrigin(0.5, 0.5);
            ball2.setScale(0.05);
            ball2.setVelocityX(this.grupObstacles.getChildren()[0].body.velocity.x);
        }
        //buidem l'array d'obstacles
        this.llistaObstacles = [];

        if(afegirPuntuacio){
            this.actualitzaPuntuacio();
        }
    }
        impuls(){
            this.bird.body.velocity.y = -gameOptions.forçaClick;
        }
        impuls2(){
            this.bird.body.velocity.y = -gameOptions.forçaClick*0.6;
        }

    obstacleMesDreta(){
        let dretaPosObstacle = 0;
        this.grupObstacles.getChildren().forEach(function(obstacle){
            dretaPosObstacle = Math.max(dretaPosObstacle, obstacle.x);
        });
        return dretaPosObstacle;
    }
    update(){
        //detectar colisió
        this.physics.world.collide(this.bird, this.grupObstacles, function(){
            this.die();
        }, null, this);

        //detectar bola BONA
        this.physics.world.collide(this.bird, this.grupBalls, function(bird, ball) {
            ball.destroy();
            this.bird.body.velocity.x = 0;
            this.reducirVelocidad(0.5,3000);
            this.cambiarGravedadPajaro(1000,3000)
        }, null, this);

        this.physics.world.collide(this.bird, this.grupBalls2, function(bird, ball2) {
            ball2.destroy();
            this.bird.body.velocity.x = 0;
            this.maskGraphics.fillRect(0, 0, game.config.width, game.config.height);
            this.maskGraphics.setAlpha(1);
            this.time.delayedCall(500, function() {
                this.maskGraphics.clear(); // Borrar la máscara
            }, [], this);

        }, null, this);

        //detectar limits pantalla
        if(this.bird.y > game.config.height || this.bird.y < 0){
            this.die();
        }
        
        //recorre tots els obstacles del grup Obstacles. I aplica la següent funcio
        this.grupObstacles.getChildren().forEach(function(obstacle){
            //mira si l0obstacle esta fora de la pantalla
            if(obstacle.getBounds().right < 0){
                //si esta fora ho afegeix a la llistaObstacles
                this.llistaObstacles.push(obstacle);
                //si hi han dos Obstacles a la llista crida a posarObstacles
                if(this.llistaObstacles.length == 2){
                    this.posarObstacles(true);
                }
            }
        }, this)
    }

    cambiarGravedadPajaro(nuevaGravedad, duracion) {
        this.input.on('pointerdown', this.impuls2, this);
        let gravedadActual = this.bird.body.gravity.y;
        this.bird.body.gravity.y = nuevaGravedad;
        this.time.delayedCall(duracion, function() {
            this.input.on('pointerdown', this.impuls, this);
            this.bird.body.gravity.y = gravedadActual;
        }, [], this);
    }

    reducirVelocidad(factorReduccion, duracion) {
        this.grupObstacles.setVelocityX(-gameOptions.VelocitatX * 0.5);
        this.grupBalls.setVelocityX(-gameOptions.VelocitatX * 0.5);
        this.grupBalls2.setVelocityX(-gameOptions.VelocitatX * 0.5);
        // Después de la duración especificada, restaurar la velocidad original
        this.time.delayedCall(duracion, function() {
            this.grupObstacles.setVelocityX(-gameOptions.VelocitatX);
            this.grupBalls.setVelocityX(-gameOptions.VelocitatX);
            this.grupBalls2.setVelocityX(-gameOptions.VelocitatX);
        }, [], this);
    }

    die(){
        localStorage.setItem(gameOptions.localStorageName, Math.max(this.Puntuacio, this.topPuntuacio));
        this.scene.start('GalacticalTweet');
    }

    goPause(){
        console.log("aaaa")
    }
}

game.scene.add("PauseScreen", PauseScreen, true);
