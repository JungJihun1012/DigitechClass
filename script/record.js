const recordList = document.getElementById("recordList");

const storeRecords = JSON.parse(localStorage.getItem('gameScores')) || [];

const renderRecords = (records) => {
    recordList.innerHTML = '';

    records.forEach(record => {
        const recordItem = document.createElement("div");
        recordItem.classList.add('record-item');
        recordItem.innerHTML = `
            <p>Score: <span>${record.score}</span></p>
            <p>Date: <span>${record.date}</span></p>
        `;
        recordList.appendChild(recordItem);
    });
};

document.getElementById('clearScoreButton').addEventListener("click", () => {
    localStorage.removeItem('gameScores');
    renderRecords([]);
});

renderRecords(storeRecords);