var deleteStudentModal = document.getElementById("student-delete-modal");

function openDeleteStudentModal(event) {
    let rowToDelete = event.target.closest('tr');
    let userName = rowToDelete.getElementsByClassName("table-name-element")[0].innerText;
    let userId = rowToDelete.getElementsByTagName("span")[0].innerText;
    sessionStorage.setItem("userIdToDelete", userId);
    
    document.getElementById("username").innerText = userName;
    deleteStudentModal.style.display = "block";
}

function closeDeleteStudentModal() {
    deleteStudentModal.style.display = "none";
}

function deleteStudentFromDb() {
    let userId = sessionStorage.getItem("userIdToDelete");

    let jsonObj = {
        method: "delete",
        id: userId
    };

    const phpServerHost = `http://${config.localhost}/cmsproject/index.php/students/delete`;
    sendAjaxRequest("POST", JSON.stringify(jsonObj), phpServerHost, function(response) {
        console.log("Response from PHP server: " + response);
        jsonObj = JSON.parse(response);
        if(jsonObj.success == true) {
            window.alert("Delete success");
            location.reload();
        } else {
            window.alert(jsonObj.message);
        }
    }, function(error) {
        window.alert("Server error!");
        console.error("Error on PHP side: " + error);
        closeDeleteModal();
    })
}

