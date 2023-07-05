function openAddStudentModal() {
    clearAddStudentForm();
    studentFormModal.style.display = "block";
    document.getElementById("modal-window-title").innerText = "Add student";
    const button = document.getElementById("add-student-form-main-button");
    button.innerText = "Create";
    button.onclick = addStudentToDb;
}

function clearAddStudentForm() {
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("birthday").value = "";
    document.getElementById("group").options[0].selected = true;
    document.getElementById("gender").options[0].selected = true;
}

function addStudentToDb(event) {
    event.preventDefault();
    jsonObj = getJson("add-student-form");

    if(validateFormOnTheFront(jsonObj) == false) {
        return;
    }

    jsonObj.method = "add";

    const phpServerHost = `http://${config.localhost}/cmsproject/index.php/students/add`;
    sendAjaxRequest("POST", JSON.stringify(jsonObj), phpServerHost, function(response) {
        console.log("Response from PHP server: " + response);
        jsonObj = JSON.parse(response);
        if(jsonObj.success == true) {
            window.alert("Adding success");
            location.reload();
        } else {
            window.alert(jsonObj.message);
        }
    }, function(error) {
        window.alert("Server error!");
        console.error("Error on PHP side: " + error);
        closeStudentModal();
    })
}

function addStudentToTheTable(jsonObj) {
    let table = document.getElementsByTagName('tbody')[0];
    let tableRow = document.createElement("tr");

    appendId(tableRow, jsonObj.id);
    appendCheckBox(tableRow);
    appendGroup(tableRow, jsonObj.group);
    appendFullName(tableRow, jsonObj.firstname + " " + jsonObj.lastname);
    appendGender(tableRow, jsonObj.gender);

    let birthday = jsonObj.birthday;
    let year = birthday.split("-")[0];
    let month = birthday.split("-")[1];
    let day = birthday.split("-")[2];
    appendBirthday(tableRow, day + "." + month + "." + year);

    appendStatus(tableRow, "online");

    let tableHeader = document.createElement("th");

    appendEditButton(tableHeader);
    appendDeleteButton(tableHeader);
    
    tableRow.appendChild(tableHeader);
    table.appendChild(tableRow);

    closeStudentModal();
}

function appendId(row, id) {
    let span = document.createElement("span");
    span.style.display = "none";
    span.innerText = id;
    row.appendChild(span);
}

function appendCheckBox(row) {
    let tableItem = document.createElement("td");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("main-checkbox-element");
    tableItem.appendChild(checkbox);
    row.appendChild(tableItem);
}

function appendGroup(row, value) {
    let tableHeader = document.createElement("th");
    tableHeader.innerText = value;
    tableHeader.classList.add("table-group-element");
    row.appendChild(tableHeader);
}

function appendFullName(row, value) {
    tableHeader = document.createElement("th");
    tableHeader.innerText = value;
    tableHeader.classList.add("table-name-element");
    row.appendChild(tableHeader);
}

function appendGender(row, value) {
    tableHeader = document.createElement("th");
    tableHeader.innerText = value;
    tableHeader.classList.add("table-gender-element");
    row.appendChild(tableHeader);
}

function appendBirthday(row, value) {
    tableHeader = document.createElement("th");
    tableHeader.innerText = value;
    tableHeader.classList.add("table-birthday-element");
    row.appendChild(tableHeader);
}

function appendStatus(row, statusValue) {
    let tableHeader = document.createElement("th");
    let status = document.createElement("img");
    if(statusValue === "online") {
        status.src = "../images/icon_status-online.png";
        status.alt = "online-status-image";
        status.className = "status-image";
    } else {
        status.src = "../images/icon_status-offline.png";
        status.alt = "offline-status-image";
        status.className = "status-image";
    }
    tableHeader.classList.add("table-status-element");
    tableHeader.appendChild(status);
    row.appendChild(tableHeader);
}

function appendDeleteButton(tableHeader) {
    let deleteButton = document.createElement("button");
    deleteButton.className = "button delete-button";
    deleteButton.onclick = openDeleteStudentModal;
    let i1 = document.createElement("i");
    i1.className = "fa fa-times-rectangle";
    deleteButton.appendChild(i1);
    tableHeader.classList.add("table-options-element");
    tableHeader.appendChild(deleteButton);
}

function appendEditButton(tableHeader) {
    let editButton = document.createElement("button");
    editButton.className = "button edit-button";
    editButton.onclick = openEditStudentModal;
    let i = document.createElement("i");
    i.className = "fa fa-pencil-square-o";
    editButton.appendChild(i);
    tableHeader.appendChild(editButton);
    tableHeader.appendChild(document.createTextNode(" "));
}