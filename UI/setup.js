document.addEventListener("DOMContentLoaded", function() {
    const ipAddressesInput = document.getElementById("ipAddresses");
    const setupBtn = document.getElementById("setupBtn");

    setupBtn.addEventListener("click", function() {
        const ipAddresses = ipAddressesInput.value.split(",");
        setupDrones(ipAddresses);
    });

    function setupDrones(ipAddresses) {
        // Make AJAX request to backend API to send IP addresses
        fetch("http://localhost:8000/drones/setup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ipAddresses)
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "control.html"; // Redirect to control hub page
            } else {
                console.error("Failed to setup drones.");
            }
        })
        .catch(error => {
            console.error("Failed to setup drones:", error);
        });
    }
});
