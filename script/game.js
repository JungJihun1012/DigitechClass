// 별 생성 함수
function createStars(num) {
    const gameArea = document.querySelector('.gameArea');
    for (let i = 0; i < num; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = Math.random() * 100 + 'vh';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.animationDuration = Math.random() * 2 + 1 + 's';
        gameArea.appendChild(star);
    }
}

// 별 200개 생성
createStars(200);

// 캔버스 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 우주선 요소
const rocket = document.getElementById('rocket');

// 모달 창 요소
const startModal = document.getElementById('startModal');
const gameOverModal = document.getElementById('gameOverModal');
const startButton = document.getElementById('startButton');
const retryButton = document.getElementById('retryButton');
const homeButton = document.getElementById('homeButton');
const finalScore = document.getElementById('finalScore');

// 점수 요소
const total = document.getElementById('score');

// 게임 상태 변수
let score = 0;
let gameOver = false;
let animationId;
let scoreInterval;

// 우주선의 위치 및 속도
let rocketX = canvas.width / 2 - 25; // 초기 x 위치
let rocketY = canvas.height - 100; // 초기 y 위치
const rocketSpeed = 5;

// 키보드 입력 상태
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// 장애물 클래스
class Obstacle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
    }
}

// 장애물 배열
let obstacles = [];

// 장애물 생성 함수
function spawnObstacle() {
    const radius = Math.random() * 20 + 15;
    let x, y;

    // 화면의 상단 또는 양쪽에서 장애물 생성
    if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        y = Math.random() * canvas.height;
    } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    // 장애물 색상 랜덤
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

    // 우주선 방향으로 이동하는 속도
    const angle = Math.atan2(
        rocketY + 25 - y,
        rocketX + 25 - x
    );
    const velocity = {
        x: Math.cos(angle) * (Math.random() * 2 + 1),
        y: Math.sin(angle) * (Math.random() * 2 + 1)
    };

    obstacles.push(new Obstacle(x, y, radius, color, velocity));
}

function saveScore(score) {
    const scores = JSON.parse(localStorage.getItem('gameScores')) || [];

    scores.push({ score: score, date: new Date().toISOString().split('T')[0]});
    
    localStorage.setItem('gameScores', JSON.stringify(scores));
};

// 애니메이션 및 게임 로직
function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 장애물 업데이트
    obstacles.forEach((obstacle, index) => {
        obstacle.update();

        // 장애물이 화면을 벗어나면 제거
        if (
            obstacle.x + obstacle.radius < 0 ||
            obstacle.x - obstacle.radius > canvas.width ||
            obstacle.y + obstacle.radius < 0 ||
            obstacle.y - obstacle.radius > canvas.height
        ) {
            obstacles.splice(index, 1);
        }

        // 충돌 감지
        const dist = Math.hypot(rocketX + 25 - obstacle.x, rocketY + 25 - obstacle.y);
        if (dist - obstacle.radius - 25 < 1) {
            // 충돌 시 게임 오버
            cancelAnimationFrame(animationId);
            clearInterval(scoreInterval);
            gameOver = true;
            saveScore(score);
            finalScore.innerText = `Your Score: ${score}`;
            gameOverModal.classList.remove('hidden');
        }
    });

    // 우주선 이동
    if (keys.ArrowUp && rocketY > 0) {
        rocketY -= rocketSpeed;
    }
    if (keys.ArrowDown && rocketY < canvas.height - 50) {
        rocketY += rocketSpeed;
    }
    if (keys.ArrowLeft && rocketX > 0) {
        rocketX -= rocketSpeed;
    }
    if (keys.ArrowRight && rocketX < canvas.width - 50) {
        rocketX += rocketSpeed;
    }

    // 우주선 위치 업데이트
    rocket.style.left = `${rocketX}px`;
    rocket.style.top = `${rocketY}px`;
}

// 점수 증가 함수
function startScore() {
    score = 0;
    total.innerText = `Score: ${score}`;
    scoreInterval = setInterval(() => {
        score += 1;
        total.innerText = `Score: ${score}`;
    }, 1000);
}

// 게임 시작 함수
function startGame() {
    // 초기화
    obstacles = [];
    rocketX = canvas.width / 2 - 25;
    rocketY = canvas.height - 100;
    rocket.style.left = `${rocketX}px`;
    rocket.style.top = `${rocketY}px`;
    gameOver = false;
    gameOverModal.classList.add('hidden');
    startModal.classList.add('hidden');
    startScore();
    animate();

    // 장애물 생성 1.5초마다 생성됨
    obstacleInterval = setInterval(spawnObstacle, 1500);
}

function retryGame() {
    clearInterval(obstacleInterval);
    startGame();
}

function goHome() {
    clearInterval(obstacleInterval);
    window.location.href = 'waitingRoom.html';
}


window.addEventListener('keydown', (event) => {
    if (event.key in keys) {
        keys[event.key] = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
    }
});

startButton.addEventListener('click', startGame); //게임시작
retryButton.addEventListener('click', retryGame);//게임 다시시작
homeButton.addEventListener('click', goHome);//홈으로 가기

// 창 크기 조절 시 캔버스 크기 업데이트
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    rocketX = canvas.width / 2 - 25;
    rocketY = canvas.height - 100;
    rocket.style.left = `${rocketX}px`;
    rocket.style.top = `${rocketY}px`;
});