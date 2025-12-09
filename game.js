// ==========================================
// 1. DEFINE THE SCENES FIRST (Classes)
// ==========================================

// --- SCENE 1: LOADER ---
class SceneLoad extends Phaser.Scene {
    constructor() { super('SceneLoad'); }

    preload() {
        // Loading Text
        let loadingText = this.add.text(400, 200, "Loading...", { 
            fontSize: '24px', fill: '#000' 
        }).setOrigin(0.5);

        // Error Handler
        this.load.on('loaderror', function (file) {
            console.log("Failed to load: " + file.src);
            loadingText.setText("Missing: " + file.key); 
            loadingText.setColor('#ff0000');
        });

        // LOAD ASSETS (Inside 'assets/' folder)
        this.load.image('logo', 'assets/logo.png'); 

        // Mascots
        this.load.image('tiger_idle', 'assets/mascot_tiger_01_idle.png');
        this.load.image('tiger_talk', 'assets/mascot_tiger_02_talking.png');
        this.load.image('tiger_happy', 'assets/mascot_tiger_03_happy.png');
        this.load.image('tiger_sad', 'assets/mascot_tiger_04_sad.png');
        this.load.image('tiger_surprised', 'assets/mascot_tiger_05_surprised.png');
        this.load.image('tiger_wave', 'assets/mascot_tiger_06_waving.png');
        this.load.image('tiger_jump', 'assets/mascot_tiger_07_jumping.png');
        this.load.image('tiger_sleep', 'assets/mascot_tiger_08_sleeping.png');

        // Maps
        this.load.image('map_flag', 'assets/map_bangladesh_intigrated_with_flag.png'); 
        this.load.image('map_base', 'assets/map_bangladesh_8divisions.png');

        // Puzzle Pieces
        this.load.image('div_barisal', 'assets/map_division_barisal.png');
        this.load.image('div_chittagong', 'assets/map_division_chittagong.png');
        this.load.image('div_dhaka', 'assets/map_division_dhaka.png');
        this.load.image('div_khulna', 'assets/map_division_khulna.png');
        this.load.image('div_mymensingh', 'assets/map_division_mymensingh.png');
        this.load.image('div_rajshahi', 'assets/map_division_rajshahi.png');
        this.load.image('div_rangpur', 'assets/map_division_rangpur.png');
        this.load.image('div_sylhet', 'assets/map_division_sylhet.png');
    }

    create() {
        this.scene.start('SceneIntro');
    }
}

// --- SCENE 2: INTRO ---
class SceneIntro extends Phaser.Scene {
    constructor() { super('SceneIntro'); }

    create() {
        this.cameras.main.setBackgroundColor('#E0F7FA');

        // Logo
        this.add.image(100, 60, 'logo').setScale(0.15);

        // Waving Tiger
        this.add.image(150, 300, 'tiger_wave').setScale(0.4);

        // Flag Map
        let flagMap = this.add.image(550, 250, 'map_flag').setScale(0.45);
        
        // Animation
        this.tweens.add({
            targets: flagMap,
            scale: 0.48,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Text
        this.add.text(400, 50, "Welcome to Bangladesh!", {
            fontFamily: 'Arial', fontSize: '32px', color: '#006a4e', fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(550, 400, "Click the Map to Play!", {
            fontFamily: 'Arial', fontSize: '24px', color: '#f42a41', backgroundColor: '#ffffff', padding: {x:10, y:5}
        }).setOrigin(0.5);

        // Interaction
        flagMap.setInteractive();
        flagMap.on('pointerdown', () => {
            this.scene.start('SceneLevel1');
        });
    }
}

// --- SCENE 3: LEVEL 1 ---
class SceneLevel1 extends Phaser.Scene {
    constructor() { super('SceneLevel1'); }

    create() {
        this.add.image(80, 50, 'logo').setScale(0.12);
        let tiger = this.add.image(700, 380, 'tiger_talk').setScale(0.25);
        
        let instruction = this.add.text(400, 40, "Drag DHAKA to the map!", { 
            fontSize: '28px', color: '#000', backgroundColor: '#ffffff', padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        let baseMap = this.add.image(400, 240, 'map_base').setScale(0.4).setAlpha(0.25);
        let piece = this.add.image(150, 240, 'div_dhaka').setScale(0.15).setInteractive();
        this.input.setDraggable(piece);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', function (pointer, gameObject) {
            let correctX = 400; 
            let correctY = 240;
            let tolerance = 60;

            if (Math.abs(gameObject.x - correctX) < tolerance && Math.abs(gameObject.y - correctY) < tolerance) {
                gameObject.x = correctX;
                gameObject.y = correctY;
                gameObject.disableInteractive();
                
                tiger.setTexture('tiger_happy');
                instruction.setText("Good Job! That is Dhaka.");
                instruction.setStyle({ color: 'green' });
            } else {
                gameObject.x = 150;
                gameObject.y = 240;
                tiger.setTexture('tiger_sad');
                instruction.setText("Try again!");
                instruction.setStyle({ color: 'red' });
                
                let scene = this.scene; 
                this.scene.time.delayedCall(2000, () => {
                    tiger.setTexture('tiger_talk');
                    instruction.setText("Drag DHAKA to the map!");
                    instruction.setStyle({ color: 'black' });
                });
            }
        });
    }
}

// ==========================================
// 2. CONFIGURE THE GAME LAST (After Classes)
// ==========================================
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    parent: 'game-container',
    backgroundColor: '#ffffff',
    scene: [SceneLoad, SceneIntro, SceneLevel1], // Now SceneLoad exists!
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);
