document.addEventListener("DOMContentLoaded", function () {
    const gameBoard = document.getElementById("game-board");
    const startButton = document.getElementById("start-button");
    const scoreElement = document.getElementById("score");
    const mobileControls = document.getElementById("mobile-controls");

    let snake = [{ x: 0, y: 0 }];
    let apple = { x: 0, y: 0 };
    let direction = "right";
    let defaultSpeed = 200;
    let speed = defaultSpeed;
    let score = 0;
    let gameInterval;

    function startGame() {
        snake = [{ x: 0, y: 0 }];
        direction = "right";
        speed = defaultSpeed;
        score = 0;
        updateScore();
        createApple();
        draw();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(move, speed);
    }

    function updateScore() {
        scoreElement.textContent = "Score: " + score;
      }

    function createApple() {
        const maxRows = Math.floor(gameBoard.offsetHeight / 20);
        const maxColumns = Math.floor(gameBoard.offsetWidth / 20);

        do {
            apple.x = Math.floor(Math.random() * maxColumns) * 20;
            apple.y = Math.floor(Math.random() * maxRows) * 20;
        } while (isCollision(apple, snake));
    }

    function draw() {
        gameBoard.innerHTML = "";

        snake.forEach((segment) => {
            const snakeSegment = document.createElement("div");
            snakeSegment.className = "snake";
            snakeSegment.style.left = segment.x + "px";
            snakeSegment.style.top = segment.y + "px";
            gameBoard.appendChild(snakeSegment);
        });

        const appleElement = document.createElement("div");
        appleElement.className = "apple";
        appleElement.style.left = apple.x + "px";
        appleElement.style.top = apple.y + "px";
        gameBoard.appendChild(appleElement);
    }

    function move() {
        const head = { ...snake[0] };

        switch (direction) {
            case "up":
                head.y -= 20;
                break;
            case "down":
                head.y += 20;
                break;
            case "left":
                head.x -= 20;
                break;
            case "right":
                head.x += 20;
                break;
        }

        if (isCollisionWithBoard(head) || isCollision(head, snake)) {
            clearInterval(gameInterval);
            alert("Game Over! Your Score: " + score);
            return;
        }

        snake.unshift(head);

        if (head.x === apple.x && head.y === apple.y) {
            createApple();
            increaseSpeed();
            score += 10;
            updateScore();
        } else {
            snake.pop();
        }

        draw();
    }

    function isCollision(obj, array) {
        return array.some((segment) => segment.x === obj.x && segment.y === obj.y);
    }

    function isCollisionWithBoard(head) {
        const buffer = 1; // Adjust this value as needed
        const maxRows = Math.floor(gameBoard.offsetHeight / 20);
        const maxColumns = Math.floor(gameBoard.offsetWidth / 20);
    
        return (
            head.x < - buffer ||
            head.x >= (maxColumns * 20) ||
            head.y < - buffer ||
            head.y >= (maxRows * 20)
        );
    }

    function increaseSpeed() {
        speed -= 10;
        clearInterval(gameInterval);
        gameInterval = setInterval(move, speed);
    }

    startButton.addEventListener("click", startGame);
    document.addEventListener("keydown", handleKeyPress);

    // Detect if the device is a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // If it's a mobile device, show and set up mobile controls
    if (isMobile) {
        mobileControls.style.display = "grid";
        mobileControls.innerHTML = ''; // Clear previous content

        const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

        buttons.forEach(button => {
            const mobileButton = createMobileButton(button);
            mobileControls.appendChild(mobileButton);

            // Attach event listener for direction buttons (2, 4, 6, 8)
            if (button === '2' || button === '4' || button === '6' || button === '8') {
                mobileButton.addEventListener("click", () => {
                    direction = getDirectionFromButton(button);
                });
            }
        });
    }

    function createMobileButton(label) {
        const mobileButton = document.createElement("button");
        mobileButton.textContent = label;
        mobileButton.className = "mobile-control-button";
        return mobileButton;
    }

    function handleKeyPress(event) {
        switch (event.key) {
            case "ArrowUp":
                direction = "up";
                break;
            case "ArrowDown":
                direction = "down";
                break;
            case "ArrowLeft":
                direction = "left";
                break;
            case "ArrowRight":
                direction = "right";
                break;
        }
    }

    function getDirectionFromButton(button) {
        switch (button) {
            case '2':
                return 'up';
            case '4':
                return 'left';
            case '6':
                return 'right';
            case '8':
                return 'down';
            default:
                return '';
        }
    }
});
