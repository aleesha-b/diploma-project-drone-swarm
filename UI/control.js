document.addEventListener("DOMContentLoaded", function() {
    const distanceInput = document.getElementById("distance");
    const forwardBtn = document.getElementById("forwardBtn");
    const backBtn = document.getElementById("backBtn");
    const leftBtn = document.getElementById("leftBtn");
    const rightBtn = document.getElementById("rightBtn");
    const clockwiseBtn = document.getElementById("clockwiseBtn");
    const counterclockwiseBtn = document.getElementById("counterclockwiseBtn");
    const takeoffBtn = document.getElementById("takeoffBtn");
    const landBtn = document.getElementById("landBtn");
    const droneResponse = document.getElementById("controlReceived")
    const predatorAlert = document.getElementById("predator")

    let isButtonDisabled = false;

    // Event listeners to control buttons
    forwardBtn.addEventListener("click", function() {
        controlButton("forward");
    });

    backBtn.addEventListener("click", function() {
        controlButton("back");
    });

    leftBtn.addEventListener("click", function() {
        controlButton("left");
    });

    rightBtn.addEventListener("click", function() {
        controlButton("right");
    });

    clockwiseBtn.addEventListener("click", function() {
        controlButton("clockwise");
    });

    counterclockwiseBtn.addEventListener("click", function() {
        controlButton("counterclockwise");
    });

    takeoffBtn.addEventListener("click", function() {
        controlButton("takeoff");
    });

    landBtn.addEventListener("click", function() {
        controlButton("land");
    });

    predatorAlert.addEventListener("click", function() {
        fetch(`http://localhost:8000/drones/predator`)
            .then(response => response.json())
        .then(data => {
            if (data.response === "PREDATOR ALERT"){
                const popup = document.createElement("div");
                const popupBtn = document.createElement("button")
                popup.className = "popup";
                popupBtn.className = 'back-btn';
                popup.textContent = data.response;
                popupBtn.textContent = "Back"
                document.body.appendChild(popup);
                popup.appendChild(popupBtn);
                popupBtn.addEventListener('click', function () {
                    popup.remove()
                });

        }})
        .catch(error => {
            console.error(error);
        });
    });


    function controlButton(command) {
        if (isButtonDisabled) {
            return; // Do nothing if button is disabled
        }

        const distance = distanceInput.value;

        // Disable all buttons
        disableButtons();

        // Make AJAX request to backend API to control the drone
        fetch(`http://localhost:8000/drones/control`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([command, distance])
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Control request failed");
            }
            return response.json();
        })
        .then(data => {
            // Handle the response
            console.log("Drone control response:", data.response);
            droneResponse.textContent = "Drone control response: " + data.response
            setTimeout(enableButtons, 2000);
            enableButtons(); // Re-enable buttons
        })
        .catch(error => {
            console.error("Failed to control drone:", error);
            droneResponse.textContent = "";
            showErrorPopup(error.message);
            setTimeout(enableButtons, 2000);
            enableButtons(); // Re-enable buttons
        });
    }

    function disableButtons() {
        isButtonDisabled = true;
        forwardBtn.disabled = true;
        backBtn.disabled = true;
        leftBtn.disabled = true;
        rightBtn.disabled = true;
        clockwiseBtn.disabled = true;
        counterclockwiseBtn.disabled = true;
        takeoffBtn.disabled = true;
        landBtn.disabled = true;
    }

    function enableButtons() {
        isButtonDisabled = false;
        forwardBtn.disabled = false;
        backBtn.disabled = false;
        leftBtn.disabled = false;
        rightBtn.disabled = false;
        clockwiseBtn.disabled = false;
        counterclockwiseBtn.disabled = false;
        takeoffBtn.disabled = false;
        landBtn.disabled = false;
    }

    function showErrorPopup(message) {
        const popup = document.createElement("div");
        popup.className = "popup";
        popup.textContent = message;

        document.body.appendChild(popup);

        // Remove the popup after 3 seconds
        setTimeout(function() {
            popup.remove();
        }, 3000);
    }
});
