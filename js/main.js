var studentFormModal = document.getElementById("student-add-edit-modal");

const config = {
    localhost: "localhost"
}

window.addEventListener('load', function() {
    const logged = localStorage.getItem("logged");

    if(logged == "true") {
        const username = localStorage.getItem("username");
        setUsernameAndDisplayProfile(username);
    } else {
        hideProfileAndDisplaySignIn();
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            }
        );
    }  
    
    makeTableWithAllStudentsFromDb();
});

const inputs = [
    document.getElementById("firstName"),
    document.getElementById("lastName"),
    document.getElementById("birthday"),
    document.getElementById("group"),
    document.getElementById("gender")
]

function closeStudentModal() {
    studentFormModal.style.display = "none";
    for (el of inputs) {
        el.classList.remove("invalid");
        el.classList.remove("valid");
    }
}

function hideProfileAndDisplaySignIn() {
    $("#guest-info").show();
}

function setUsernameAndDisplayProfile(username) {
    $("#guest-info").css("display", "none");
    $("#profile").addClass("logged");
    $("#notification-icon").addClass("logged");
    $("#userFullName").text(username);
}

function logOut() {
    localStorage.setItem("logged", false);
    location.reload();
}

function getJson(formId) {
    const data = new FormData(document.getElementById(formId));
    const value = Object.fromEntries(data.entries());

    let jsonString = JSON.stringify(value);
    console.log("Json string: " + jsonString);

    return value;
}

function validateFormOnTheFront(jsonObj) {
    let inputsValue = new Map();
    inputsValue.set(document.getElementById("firstName"), jsonObj.firstName);
    inputsValue.set(document.getElementById("lastName"), jsonObj.lastName);
    inputsValue.set(document.getElementById("birthday"), jsonObj.birthday);
    inputsValue.set(document.getElementById("group"), jsonObj.group);
    inputsValue.set(document.getElementById("gender"), jsonObj.gender);

    let returnValue = true;
    for(let i = 0; i < inputs.length; ++i) {
        let value = inputsValue.get(inputs[i]);
        
        if(inputs[i].tagName.toLowerCase() == "input" && inputs[i].type == "text") {
            var pattern = /^[A-Za-z]+$/;

            value = pattern.test(value) ? value : "";   
        }

        if(value == "" || value == undefined) {
            returnValue = false;

            inputs[i].classList.remove("valid");
            inputs[i].classList.add("invalid");
        } else {
            inputs[i].classList.remove("invalid");
            inputs[i].classList.add("valid");
        }
    }

    if(returnValue == false) {
        console.log("Prevent adding beacause form is not valid on the front");
    }
    return returnValue;
}

function sendAjaxRequest(requestMethod, data, url, successCallback, errorCallBack) {
    console.log("Sending request to: " + url);
    $.ajax({
        url: url,
        type: requestMethod,
        data: data,
        crossDomain: true,

        success: function(response) {
            successCallback(response);
        },
        error: function(xhr, status, error) {
            errorCallBack(error);
        }
    });
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == studentFormModal) {
        closeStudentModal();
    }
    if (event.target == deleteStudentModal) {
        closeDeleteStudentModal();
    }
    if(event.target == signInModal) {
        closeSignInModal();
    }
    if(event.target == signUpModal) {
        closeSignUpModal();
    }
}

function changeCheckBoxes() {
    let mainCheckbox = document.getElementById("main-checkbox");
    const inputs = document.getElementsByTagName("input");
 
    for(let i = 0; i < inputs.length; ++i) {
        if(inputs[i].type === "checkbox") {
            inputs[i].checked = mainCheckbox.checked;
        }
    }
}

function makeTableWithAllStudentsFromDb() {
    const phpServerHost = `http://${config.localhost}/cmsproject/index.php/students`;

    sendAjaxRequest("GET", null, phpServerHost, function(response) {
        console.log("Response from PHP server: " + response);
        let parsedObjects = JSON.parse(response);
        parsedObjects.forEach(addStudentToTheTable);
    }, function(error) {
        window.alert("Server error!");
        console.error("Error on PHP side: " + error);
        closeStudentModal();
    })
}


