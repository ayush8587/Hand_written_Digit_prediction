// JavaScript for Handwritten Digit Prediction

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("digitCanvas");
    const ctx = canvas.getContext("2d");

    const predictButton = document.getElementById("predictButton");
    const predictionResult = document.getElementById("predictionResult");

    const undoButton = document.getElementById("undoButton");
    const clearButton = document.getElementById("clearButton");

    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    const strokeHistory = [];

    canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        [lastX, lastY] = [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop];
        ctx.beginPath();
    });

    canvas.addEventListener("mouseup", () => {
        drawing = false;
        ctx.closePath();
        strokeHistory.push(canvas.toDataURL("image/png"));
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!drawing) return;

        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";

        const [x, y] = [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop];

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        [lastX, lastY] = [x, y];
    });

    undoButton.addEventListener("click", () => {
        if (strokeHistory.length > 0) {
            strokeHistory.pop(); // Remove the last stroke
            clearCanvas(canvas);
            redrawCanvas(canvas, strokeHistory);
        }
    });

    clearButton.addEventListener("click", () => {
        strokeHistory.length = 0; // Clear the stroke history
        clearCanvas(canvas);
    });

    predictButton.addEventListener("click", () => {
        // Get the drawn image data from the canvas
        const imageData = canvas.toDataURL("image/png");

        // Send the image data to the Flask backend for prediction
        fetch("/predict_digit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ image_data: imageData }),
        })
            .then((response) => response.json())
            .then((data) => {
                const predictedDigit = data.predicted_digit;
                predictionResult.textContent = `Predicted Digit: ${predictedDigit}`;
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });

    function clearCanvas(canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function redrawCanvas(canvas, strokeHistory) {
        const img = new Image();
        img.src = strokeHistory[0];
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
    }
});
