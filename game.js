// CONFIGURATION
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    parent: 'game-container',
    backgroundColor: '#ffffff',
    scene: [SceneLoad, SceneIntro, SceneLevel1],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

// --- SCENE 1: LOADER (Loads your specific PNGs) ---
class SceneLoad extends Phaser.Scene {
    constructor() { super('SceneLoad'); }

    preload() {
        // Visual Loading Text
        let loadingText = this.add.text(400, 225, "Loading Assets...", { fontSize: '24px', fill: '#000' }).setOrigin(0.5);

        // 1. MASCOTS (Updated to .png)
        this.load.image('tiger_idle', 'assets/mascot_tiger_01_idle.png');
        this.load.image('tiger_talk', 'assets/mascot_tiger_02_talking.png');
        this.load.image('tiger_happy', 'assets/mascot_tiger_03_happy.png');
        this.load.image('tiger_sad', 'assets/mascot_tiger_04_sad.png');
        this.load.image('tiger_surprised', 'assets/mascot_tiger_05_surprised.png');
        this.load.image('tiger_wave', 'assets/mascot_tiger_06_waving.png');
        this.load.image('tiger_jump', 'assets/mascot_tiger_07_jumping.png');
        this.load.image('tiger_sleep', 'assets/mascot_tiger_08_sleeping.png');

        // 2. MAPS - FULL & FLAG
        this.load.image('map_flag', 'assets/map_bangladesh_intigrated_with_flag.png'); 
        this.load.image('map_base', 'assets/map_bangladesh_8divisions.png');

        // 3. MAPS - INDIVIDUAL DIVISIONS (Puzzle Pieces)
        this.load.image('div_barisal', 'assets/map_division_barisal.png');
        this.load.image('div_chittagong', 'assets/map_division_chittagong.png');
        this.load.image('div_dhaka', 'assets/map_division_dhaka.png');
        this.load.image('div_khulna', 'assets/map_division_khulna.png');
        this.load.image('div_mymensingh', 'assets/map_division_mymensingh.png');
        this.load.image('div_rajshahi', 'assets/map_division_rajshahi.png');
        this.load.image('div_rangpur', 'assets/map_division_rangpur.png');
        this.load.image('div_sylhet', 'assets/map_division_sylhet.png');
        
        // Note: Using text for logo if image is missing, or add 'logo.png' to assets if you have it.
    }

    create() {
        this.scene.start('SceneIntro');
    }
}

// --- SCENE 2: INTRO (Level 0 - Discovery) ---
class SceneIntro extends Phaser.Scene {
    constructor() { super('SceneIntro'); }

    create() {
        this.cameras.main.setBackgroundColor('#E0F7FA');

        // 1. The Waving Tiger
        let tiger = this.add.image(150, 250, 'tiger_wave').setScale(0.4);

        // 2. The Flag Map (Your new integrated image)
        let flagMap = this.add.image(500, 225, 'map_flag').setScale(0.45);
        
        // Make the map "breathe" (pulse animation)
        this.tweens.add({
            targets: flagMap,
            scale: 0.48,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 3. Play Button / Instruction
        let titleText = this.add.text(400, 50, "Welcome to Bangladesh!", {
            fontFamily: 'Arial', fontSize: '32px', color: '#006a4e', fontStyle: 'bold'
        }).setOrigin(0.5);
        
        let subText = this.add.text(400, 90, "(Click the Map to Play)", {
            fontFamily: 'Arial', fontSize: '20px', color: '#f42a41'
        }).setOrigin(0.5);

        // 4. Interaction
        flagMap.setInteractive();
        flagMap.on('pointerdown', () => {
            this.scene.start('SceneLevel1');
        });
    }
}

// --- SCENE 3: LEVEL 1 (Puzzle Game) ---
class SceneLevel1 extends Phaser.Scene {
    constructor() { super('SceneLevel1'); }

    create() {
        // UI Setup
        let tiger = this.add.image(700, 380, 'tiger_talk').setScale(0.25);
        let instruction = this.add.text(400, 40, "Drag DHAKA to the map!", { 
            fontSize: '28px', color: '#000', backgroundColor: '#ffffff', padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        // 1. The Base Map (Grey/Faded background guide)
        let baseMap = this.add.image(400, 240, 'map_base').setScale(0.4).setAlpha(0.25);

        // 2. The Puzzle Piece (Using Dhaka for this test)
        // Note: For a real puzzle, we would spawn all 8. Here is one example.
        let piece = this.add.image(150, 240, 'div_dhaka').setScale(0.15).setInteractive();
        this.input.setDraggable(piece);

        // 3. Logic: Make it draggable
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        // 4. Logic: Drop Zone
        this.input.on('dragend', function (pointer, gameObject) {
            // "Win Zone" coordinates (Approximate center for Dhaka on the base map)
            // You may need to tweak these numbers based on how the images align
            let correctX = 400; 
            let correctY = 240;
            let tolerance = 60; // How close they need to get

            if (Math.abs(gameObject.x - correctX) < tolerance && Math.abs(gameObject.y - correctY) < tolerance) {
                // SUCCESS
                gameObject.x = correctX;
                gameObject.y = correctY;
                gameObject.disableInteractive();
                
                // Mascot Reaction
                tiger.setTexture('tiger_happy');
                instruction.setText("Good Job! That is Dhaka.");
                instruction.setStyle({ color: 'green' });

                // Success Sound/Effect could go here

            } else {
                // FAILURE - Reset Position
                gameObject.x = 150;
                gameObject.y = 240;
                
                // Mascot Reaction
                tiger.setTexture('tiger_sad');
                instruction.setText("Try again!");
                instruction.setStyle({ color: 'red' });
                
                // Reset mascot face after 2 seconds
                scene.time.delayedCall(2000, () => {
                    tiger.setTexture('tiger_talk');
                    instruction.setText("Drag DHAKA to the map!");
                    instruction.setStyle({ color: 'black' });
                });
            }
        });

        let scene = this; // Reference for the delayed call
    }
}