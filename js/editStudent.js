function openEditStudentModal(event) {
    const rowWithInfo = event.target.closest('tr');
    const userId = rowWithInfo.getElementsByTagName("span")[0].innerText;
    sessionStorage.setItem("userIdToEdit", userId);
    fillEditForm(rowWithInfo);

    studentFormModal.style.display = "block";
    const tittle = document.getElementById("modal-window-title");
    tittle.innerText = "Edit student";
    const createButton = document.getElementById("add-student-form-main-button");
    createButton.innerText = "Save";
    createButton.onclick = editStudentInDb;
}

function editStudentInDb(event) {
    event.preventDefault();
    let jsonObj = getJson("add-student-form");

    if(validateFormOnTheFront(jsonObj) == false) {
        return;
    }

    jsonObj.method = "edit";
    jsonObj.id = sessionStorage.getItem("userIdToEdit");

    const phpServerHost = `http://${config.localhost}/cmsproject/index.php/students/edit`;
    sendAjaxRequest("POST", JSON.stringify(jsonObj), phpServerHost, function(response) {
        console.log("Response from PHP server: " + response);
        jsonObj = JSON.parse(response);
        if(jsonObj.success == true) {
            window.alert("Edit sucess");
            location.reload();
        } else {
            window.alert(jsonObj.message);
        }
    }, function(error) {
        window.alert("Server error!");
        console.error("Error on PHP side: " + error);
    })
}

function fillEditForm(rowWithInfo) {
    setFullName(rowWithInfo);

    let select = document.getElementById("group");
    let group = rowWithInfo.getElementsByClassName("table-group-element")[0].innerText.toString();
    setSelectOption(select, group);

    gender = rowWithInfo.getElementsByClassName("table-gender-element")[0].innerText.toString();
    select = document.getElementById("gender");
    setSelectOption(select, gender);

    setBirtday(rowWithInfo);
}

function setFullName(rowWithInfo) {
    let fullName = rowWithInfo.getElementsByClassName("table-name-element")[0].innerText.toString();
    const firstName = fullName.split(" ")[0];
    const lastName = fullName.split(" ")[1];

    document.getElementById("firstName").value = firstName;
    document.getElementById("lastName").value = lastName;
}

function setSelectOption(selectElement, optionText) {
    let options = Array.from(selectElement.options);
    let optionToSelect = options.find(item => item.value === optionText);
    optionToSelect.selected = true;
}

function setBirtday(rowWithInfo) {
    let birthday = rowWithInfo.getElementsByClassName("table-birthday-element")[0].innerText.toString();
    let day = birthday.split(".")[0];
    let month = birthday.split(".")[1];
    let year = birthday.split(".")[2];
    document.getElementById("birthday").value = year + "-" + month + "-" + day;
}

