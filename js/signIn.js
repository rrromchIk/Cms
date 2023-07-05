var signInModal = document.getElementById("signIn-modal");

const signInInputElements = [
    document.getElementById("signIn-login"),
    document.getElementById("signIn-password")
]

function openSignInModal() {
    clearSignInForm();
    signInModal.style.display = "block";
}

function closeSignInModal() {
    signInModal.style.display = "none";
    for (el of signInInputElements) {
        el.classList.remove("invalid");
        el.classList.remove("valid");
    }
}

function signIn(event) {
    event.preventDefault();
    jsonObj = getJson("signIn-form");

    if(validateSignInForm(jsonObj) == false) {
        return;
    }

    const phpServerHost = `http://${config.localhost}/cmsproject/index.php/users`;
    sendAjaxRequest("POST", JSON.stringify(jsonObj), phpServerHost, signInRequestSuccess, singInRequestError);
}

function signInRequestSuccess(response) {
    console.log("Response: " + response);
    jsonObj = JSON.parse(response);

    if(jsonObj.success == true) {
        window.alert(jsonObj.message);

        let username = jsonObj.firstName + " " + jsonObj.lastName

        localStorage.setItem("logged", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("userId", jsonObj.userId);
        closeSignInModal();
        setUsernameAndDisplayProfile(username);
    } else {
        window.alert(jsonObj.message);
    } 
}

function singInRequestError(error) {
    closeSignInModal();

    window.alert("Server error");
    console.log(error);
}

function validateSignInForm(jsonObj) {
    let inputsValue = new Map();
    inputsValue.set(signInInputElements[0], jsonObj.login);
    inputsValue.set(signInInputElements[1], jsonObj.password);
    
    let returnValue = true;
    for(let i = 0; i < signInInputElements.length; ++i) {
        let value = inputsValue.get(signInInputElements[i]);
        
        if(value == "" || value == undefined) {
            returnValue = false;

            signInInputElements[i].classList.remove("valid");
            signInInputElements[i].classList.add("invalid");
        } else {
            signInInputElements[i].classList.remove("invalid");
            signInInputElements[i].classList.add("valid");
        }
    }

    if(returnValue == false) {
        console.log("Prevent signIn beacause form is not valid on the front");
    }
    return returnValue;
}

function clearSignInForm() {
    for(let item of signInInputElements) {
        item.value = "";
    }
}