const startButton = document.getElementById("start-button");

if(startButton) {
    startButton.addEventListener("click", (event) => {
        event.preventDefault();
        document.body.classList.add("fade-out");

        setTimeout(function() {
            window.location.href = "game.html";
        }, 500);
    });
};