var signUpModal = document.getElementById("signUp-modal");

const signUpInputElements = [
    document.getElementById("signUp-login"),
    document.getElementById("signUp-password"),
    document.getElementById("signUp-firstName"),
    document.getElementById("signUp-lastName")
]

function openSignUpModal() {
    clearSignUpForm();
    signUpModal.style.display = "block";
}

function closeSignUpModal() {
    signUpModal.style.display = "none";
    for (el of signUpInputElements) {
        el.classList.remove("invalid");
        el.classList.remove("valid");
    }
}

function signUp(event) {
    event.preventDefault();
    jsonObj = getJson("signUp-form");

    if(validateSignUpForm(jsonObj) == false) {
        return;
    }

    const phpServerHost = `http://${config.localhost}/cmsproject/index.php/users/add`;
    sendAjaxRequest("POST", JSON.stringify(jsonObj), phpServerHost, signUpRequestSuccess, signUpRequestError);
}

function signUpRequestSuccess(response) {
    console.log("Response: " + response);
    jsonObj = JSON.parse(response);

    if(jsonObj.success == true) {
        window.alert(jsonObj.message);
        closeSignUpModal();
    } else {
        window.alert(jsonObj.message);
    } 
}

function signUpRequestError(error) {
    closeSignUpModal();

    window.alert("Server error");
    console.log(error);
}

function validateSignUpForm(jsonObj) {
    let inputsValue = new Map();
    inputsValue.set(signUpInputElements[0], jsonObj.login);
    inputsValue.set(signUpInputElements[1], jsonObj.password);
    inputsValue.set(signUpInputElements[2], jsonObj.firstName);
    inputsValue.set(signUpInputElements[3], jsonObj.lastName);
    
    let returnValue = true;
    for(let i = 0; i < signUpInputElements.length; ++i) {
        let value = inputsValue.get(signUpInputElements[i]);
        
        if(value == "" || value == undefined) {
            returnValue = false;

            signUpInputElements[i].classList.remove("valid");
            signUpInputElements[i].classList.add("invalid");
        } else {
            signUpInputElements[i].classList.remove("invalid");
            signUpInputElements[i].classList.add("valid");
        }
    }

    if(returnValue == false) {
        console.log("Prevent signUp beacause form is not valid on the front");
    }
    return returnValue;
}

function clearSignUpForm() {
    for(let item of signUpInputElements) {
        item.value = "";
    }
}
