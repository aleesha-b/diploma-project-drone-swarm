document.addEventListener("DOMContentLoaded", function() {
    const videoContainer = document.querySelector(".video-container");
    const controls = document.querySelector(".controls");
    const distanceInput = document.getElementById("distance");
    const forwardBtn = document.getElementById("forwardBtn");
    const backBtn = document.getElementById("backBtn");
    const leftBtn = document.getElementById("leftBtn");
    const rightBtn = document.getElementById("rightBtn");
    const clockwiseBtn = document.getElementById("clockwiseBtn");
    const counterclockwiseBtn = document.getElementById("counterclockwiseBtn");
    const takeoffBtn = document.getElementById("takeoffBtn");
    const landBtn = document.getElementById("landBtn");
    const droneButtonsContainer = document.querySelector(".drone-buttons");

    // Fetch the number of drones from the backend
    fetch("http://localhost:8000/drones/control")
        .then(response => response.json())
        .then(data => {
            const numberOfDrones = data.number_of_drones;
            displayDroneButtons(numberOfDrones);
            displayVideoFeed()
        })
        .catch(error => {
            console.error("Failed to retrieve number of drones:", error);
        });

    function displayDroneButtons(numberOfDrones) {
        for (let i = 1; i <= numberOfDrones; i++) {
            const droneButton = document.createElement("button");
            droneButton.classList.add("btn", "drone-btn");
            droneButton.textContent = "Drone " + i;
            droneButton.dataset.droneId = i;
            droneButtonsContainer.appendChild(droneButton);
        }
    }

    // Add event listeners to drone buttons
    droneButtonsContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("drone-btn")) {
            const droneId = event.target.dataset.droneId;
        }
    });


    // Add event listeners to control buttons
    forwardBtn.addEventListener("click", function() {
        const distance = distanceInput.value;
        controlDrone("forward", distance);
    });

    backBtn.addEventListener("click", function() {
        const distance = distanceInput.value;
        controlDrone("back", distance);
    });

    leftBtn.addEventListener("click", function() {
        const distance = distanceInput.value;
        controlDrone("left", distance);
    });

    rightBtn.addEventListener("click", function() {
        const distance = distanceInput.value;
        controlDrone("right", distance);
    });

    clockwiseBtn.addEventListener("click", function() {
        const distance = distanceInput.value;
        controlDrone("clockwise", distance);
    });

    counterclockwiseBtn.addEventListener("click", function() {
        const distance = distanceInput.value;
        controlDrone("counterclockwise", distance);
    });

    takeoffBtn.addEventListener("click", function() {
        const distance = distanceInput.value;
        controlDrone("takeoff", distance);
    });

    landBtn.addEventListener("click", function() {
        const distance = distanceInput.value;
        controlDrone("land", distance);
    });

    function displayVideoFeed() {
        // Make AJAX request to backend API to retrieve video feed
        fetch(`http://localhost:8000/drones/video_feed`)
        .then(response => response.json())
        .then(data => {
            // Display video feed in the UI
            const videoFeedElement = document.createElement("div");
            videoFeedElement.classList.add("video-feed");
            videoFeedElement.innerHTML = data.video_feed;
            videoFeedElement.innerHTML += "<button class='back-btn'>Back</button>";
            videoContainer.innerHTML = "";
            videoContainer.appendChild(videoFeedElement);
        })
        .catch(error => {
            console.error("Failed to retrieve video feed:", error);
        });
    }

    function controlDrone(command, distance) {
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
        })
        .catch(error => {
            console.error("Failed to control drone:", error);
        });
    }

});
