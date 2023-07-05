function hasNotification() {
    let dot = document.getElementById("notification-dot");
    dot.style.visibility = "visible";
    dot.classList.add("pulse");
}

function hideNotification() {
    let dot = document.getElementById("notification-dot");
    dot.style.visibility = "hidden";
    dot.classList.remove("pulse");
}

function openChatPage() {
    const url = `http://${config.localhost}:8080/?name=` + localStorage.username + "&id=" + localStorage.userId;

    window.open(url, "_self");
}

function openTasksPage() {
    const url = `http://${config.localhost}:8080/tasks/?name=` + localStorage.username + "&id=" + localStorage.userId;

    window.open(url, "_self");
}

