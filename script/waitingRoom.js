const startButton = document.getElementById("start-button");
const recordButton = document.getElementById("record-button");

function handlePage(url) {
    document.body.classList.add("fade-out");
    setTimeout(function() {
        window.location.href = url;
    }, 500);
}

if(startButton) {
    startButton.addEventListener("click", (event) => {
        event.preventDefault();
        handlePage("game.html");
    });
};

if(recordButton) {
    recordButton.addEventListener("click", (event) => {
        event.preventDefault();
        handlePage("record.html");
    });
};