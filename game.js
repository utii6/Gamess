const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1000 }, debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let coins;
let obstacles;
let score = 0;
let scoreText;

function preload() {
    this.load.image('player', 'https://i.imgur.com/3Wz4KQp.png'); // شخصية بسيطة
    this.load.image('coin', 'https://i.imgur.com/7kG0Rzs.png');
    this.load.image('obstacle', 'https://i.imgur.com/1ZQZ1Zk.png');
    this.load.image('ground', 'https://i.imgur.com/6M7kOtz.png');
}

function create() {
    // الأرض
    const ground = this.physics.add.staticGroup();
    ground.create(window.innerWidth/2, window.innerHeight-50, 'ground').setScale(2).refreshBody();

    // اللاعب
    player = this.physics.add.sprite(100, window.innerHeight - 150, 'player').setScale(0.5);
    player.setCollideWorldBounds(true);

    // الكروت
    cursors = this.input.keyboard.createCursorKeys();

    // العملات
    coins = this.physics.add.group();
    this.time.addEvent({
        delay: 1000,
        callback: () => {
            const coin = coins.create(Math.random()*window.innerWidth, 0, 'coin');
            coin.setVelocityY(200);
        },
        loop: true
    });

    // العقبات
    obstacles = this.physics.add.group();
    this.time.addEvent({
        delay: 1500,
        callback: () => {
            const obs = obstacles.create(Math.random()*window.innerWidth, 0, 'obstacle');
            obs.setVelocityY(300);
        },
        loop: true
    });

    // تصادمات
    this.physics.add.collider(player, ground);
    this.physics.add.overlap(player, coins, collectCoin, null, this);
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);

    // النقاط
    scoreText = this.add.text(16, 16, 'النقاط: 0', { fontSize: '32px', fill: '#000' });
}

function update() {
    player.setVelocityX(0);
    if(cursors.left.isDown) player.setVelocityX(-300);
    if(cursors.right.isDown) player.setVelocityX(300);
}

function collectCoin(player, coin) {
    coin.destroy();
    score += 10;
    scoreText.setText('النقاط: ' + score);
}

function hitObstacle(player, obstacle) {
    this.scene.restart();
    score = 0;
}
