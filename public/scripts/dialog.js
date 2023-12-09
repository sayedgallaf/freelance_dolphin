let allDialogs = {
    all: [
        { content: 'Account Type', type: 'label' },
        { type: 'multipleChoice', name: 'accType', choices: [{ label: "Employer", value: "employer" }, { label: "Freelancer", value: "freelancer" }] },
        { content: 'Email', type: 'label' },
        { type: 'input', inputType: 'text', name: 'email' },
        { content: 'Password', type: 'label' },
        { type: 'input', inputType: 'password', name: 'password' },
        { type: 'function', content: 'Forgot Password', onclick: () => { generateDialog("login") } },
        { content: 'Bio', type: 'label' },
        { type: 'textarea', name: 'bio' },
        { type: 'button', content: 'Login', endpointURL: '/login' },
        { type: 'desc', content: 'ⓘ Please check your email for a 3-digit code and enter it here to proceed. If you didn’t receive the code, click here. ', endpointURL: '/' },
    ],
    signup: [
        { content: 'Account Type', type: 'label' },
        { type: 'multipleChoice', name: 'UserType', choices: [{ label: "Employer", value: "employer" }, { label: "Freelancer", value: "freelancer" }] },
        { content: 'Full Name', type: 'label' },
        { type: 'input', inputType: 'text', name: 'FullName' },
        { content: 'Email', type: 'label' },
        { type: 'input', inputType: 'text', name: 'Email' },
        { content: 'Password', type: 'label' },
        { type: 'input', inputType: 'password', name: 'Password' },
        { content: 'Repeat Password', type: 'label' },
        { type: 'input', inputType: 'password', name: 'Password2' },
        { type: 'button', content: 'Sign Up', endpointURL: '/signup' },
        { type: 'desc', content: 'ⓘ By creating this account you agree to our terms and services.', endpointURL: '/' },
    ],
    login: [
        { content: 'Email', type: 'label' },
        { type: 'input', inputType: 'text', name: 'Email' },
        { content: 'Password', type: 'label' },
        { type: 'input', inputType: 'password', name: 'Password' },
        { type: 'function', content: 'Forgot Password', onclick: () => { generateDialog("forgetPassword") } },
        { type: 'button', content: 'Login', endpointURL: '/login' },
        { type: 'function', content: 'Sign Up Instead', onclick: () => { generateDialog("signup") } }
    ],
    forgetPassword: [
        { content: 'Email', type: 'label' },
        { type: 'input', inputType: 'text', name: 'email' },
        { type: 'button', content: 'Send Link', endpointURL: '/forgotPassword' },
        { type: 'desc', content: 'ⓘ Please check your email for password reset link.', endpointURL: '/' },
    ],
    contact: [
        { content: 'Email', type: 'label' },
        { type: 'input', inputType: 'text', name: 'email' },
        { content: 'Message', type: 'label' },
        { type: 'textarea', name: 'message' },
        { type: 'button', content: 'Submit', endpointURL: '/contact' }
    ]
}
const dialogDiv = document.getElementById('dialogDiv');

dialogDiv.onclick = (e) => {
    if (e.target !== e.currentTarget) return;
    dialogDiv.style.display = "none"
}

function generateDialog(dialogName) {
    let dialog = allDialogs[dialogName]
    const form = document.getElementById('dynamicForm');
    while (form.lastElementChild) {
        form.lastElementChild.remove()
    }
    const formData = {}; // Object to store form data

    dialog.forEach(element => {
        let newElement;

        switch (element.type) {
            case 'label':
                newElement = document.createElement('label');
                newElement.textContent = element.content;
                newElement.classList.add("dialogLabel")
                break;

            case 'desc':
                newElement = document.createElement('span');
                newElement.textContent = element.content;
                newElement.classList.add("dialogDesc")
                break;

            case 'function':
                newElement = document.createElement('span');
                newElement.textContent = element.content;
                newElement.onclick = element.onclick;
                newElement.classList.add("dialogFunction")
                break;

            case 'input':
                newElement = document.createElement('input');
                newElement.setAttribute('type', element.inputType || 'text');
                newElement.setAttribute('name', element.name || '');
                newElement.setAttribute('placeholder', element.placeholder || '');
                newElement.classList.add('dialogInput');
                newElement.classList.add('lightBorder');
                newElement.addEventListener('input', function () {
                    formData[element.name] = newElement.value; // Update formData on input change
                });
                break;

            case 'textarea':
                newElement = document.createElement('textarea');
                newElement.setAttribute('name', element.name || '');
                newElement.classList.add('dialogTextArea');
                newElement.classList.add('lightBorder');
                newElement.addEventListener('input', function () {
                    formData[element.name] = newElement.value; // Update formData on textarea change
                });
                break;

            case 'button':
                newElement = document.createElement('button');
                newElement.setAttribute('type', 'button'); // Change type to 'button'
                newElement.textContent = element.content || 'Submit';
                newElement.classList.add('dialogBtn');
                newElement.classList.add('themedButton');
                newElement.addEventListener('click', function () {
                    sendDataToEndpoint(formData, element.endpointURL);
                });
                break;

            case 'multipleChoice':
                const choices = document.createElement('div');
                choices.className = "choicesDiv"
                element.choices.forEach(choice => {
                    const dialogChoiceBtn = document.createElement('button');
                    dialogChoiceBtn.textContent = choice.label || '';
                    dialogChoiceBtn.classList.add('dialogChoiceBtn');
                    dialogChoiceBtn.classList.add('lightBorder');
                    dialogChoiceBtn.addEventListener('click', function () {
                        const allChoices = document.querySelectorAll('.dialogChoiceBtn');
                        allChoices.forEach(btn => {
                            btn.classList.remove('selected');
                        });
                        dialogChoiceBtn.classList.add('selected');
                        // Store selected choice in formData
                        formData[element.name] = choice.value;
                    });
                    choices.appendChild(dialogChoiceBtn);
                });
                form.appendChild(choices)
                break;

            default:
                // Handle unrecognized types
                break;
        }

        if (newElement) {
            if (element.className) {
                newElement.className += ` ${element.className}`;
            }
            form.appendChild(newElement);
        }
    });
    dialogDiv.style.display = "flex"
}

// Function to send form data to an endpoint
function sendDataToEndpoint(data, endpointURL) {
    fetch(endpointURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Sending data as JSON
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
