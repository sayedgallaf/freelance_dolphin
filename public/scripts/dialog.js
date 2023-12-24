
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
        { type: 'desc', content: 'ⓘ Please check your email for a 3-digit code and enter it here to proceed. If you didn’t receive the code, click here. ' },
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
        { type: 'button', content: 'Sign Up', endpointURL: '/signup', endpointSuccess: () => {location.reload()} },
        { type: 'desc', content: 'ⓘ By creating this account you agree to our terms and services.' },
    ],
    login: [
        { content: 'Email', type: 'label' },
        { type: 'input', inputType: 'text', name: 'Email' },
        { content: 'Password', type: 'label' },
        { type: 'input', inputType: 'password', name: 'Password' },
        { type: 'function', content: 'Forgot Password', onclick: () => { generateDialog("forgotPassword") } },
        { type: 'button', content: 'Login', endpointURL: '/login', endpointSuccess: () => {location.reload()} },
        { type: 'function', content: 'Sign Up Instead', onclick: () => { generateDialog("signup") } }
    ],
    forgotPassword: [
        { content: 'Email', type: 'label' },
        { type: 'input', inputType: 'text', name: 'Email' },
        { type: 'button', content: 'Send Email', endpointURL: '/forgotPassword', endpointSuccess: () => {generateDialog("confirmForgotPassword")} }
    ],
    confirmForgotPassword: [
        { content: '6-Digit Code', type: 'label' },
        { type: 'input', inputType: 'number', name: 'ForgotPasswordCode' },
        { type: 'button', content: 'Confirm', endpointURL: '/confirmForgotPassword', endpointSuccess: () => {generateDialog("changePassword")} },
        { type: 'desc', content: 'ⓘ Please check your email for the 6-Digit Code.' }
    ],
    changePassword: [
        { content: 'New Password', type: 'label' },
        { type: 'input', inputType: 'password', name: 'Password' },
        { content: 'Repeat Password', type: 'label' },
        { type: 'input', inputType: 'password', name: 'Password2' },
        { type: 'button', content: 'Change Password', endpointURL: '/changePassword', endpointSuccess: () => {location.reload()} },
    ],
    contact: [
        { content: 'Email', type: 'label' },
        { type: 'input', inputType: 'text', name: 'Email' },
        { content: 'Message', type: 'label' },
        { type: 'textarea', name: 'Message' },
        { type: 'button', content: 'Submit', endpointURL: '/contact', endpointSuccess:() => {dialogDiv.style.display = "none"} }
    ],
    quote: [
        { content: 'Quote', type: 'label' },
        { type: 'val', name: 'JobID',value:(() => {return selectedJob.JobID}) },
        { type: 'input', inputType: 'text', name: 'QuoteAmount' },
        { content: 'Message', type: 'label' },
        { type: 'textarea', name: 'QuoteMessage' },
        { type: 'button', content: 'Submit', endpointURL: '/createQuote', endpointSuccess:() => {dialogDiv.style.display = "none"} }
    ],
    reportJob: [
        { type: 'val', name: 'ReportType',value:(() => {return "JobID: "+selectedJob.JobID}) },
        { content: 'Report', type: 'label' },
        { type: 'textarea', name: 'ReportDetails' },
        { type: 'button', content: 'Submit', endpointURL: '/createReport', endpointSuccess:() => {dialogDiv.style.display = "none"} }
    ],
    reportUser: [
        { type: 'val', name: 'ReportType',value:(() => {return "UserID: "+window.pageData.user.UserID}) },
        { content: 'Report', type: 'label' },
        { type: 'textarea', name: 'ReportDetails' },
        { type: 'button', content: 'Submit', endpointURL: '/createReport', endpointSuccess:() => {dialogDiv.style.display = "none"} }
    ],
    jobListingSettings: [
        { type: 'functionButton', content: 'Report Listing', onclick:() => {generateDialog("reportJob")} }
    ],
    profileSettings: [
        { type: 'functionButton', content: 'Report User', onclick:() => {generateDialog("reportUser")} }
    ],
    profileSettings2: [
        { type: 'functionButton', content: 'Change Full Name', onclick:() => {generateDialog("profileFullName")} },
        { type: 'functionButton', content: 'Edit Bio', onclick:() => {generateDialog("profileBio")} },
        { type: 'functionButton', content: 'Edit Skills', onclick:() => {generateDialog("profileSkills")} },
        { type: 'functionButton', content: 'Change Password', onclick:() => {generateDialog("changePassword")} }
    ],
    profileFullName:[
        { content: 'Full Name', type: 'label' },
        { type: 'val', name: 'type',value:(() => {return "FullName"}) },
        { type: 'input', inputType: 'text', name: 'value', value:() => {return window.pageData.authData.FullName} },
        { type: 'button', content: 'Update', endpointURL: '/updateProfile?type=FullName', endpointSuccess:() => {dialogDiv.style.display = "none"} }

    ],
    profileBio:[
        { content: 'New Bio', type: 'label' },
        { type: 'val', name: 'type',value:(() => {return "Bio"}) },
        { type: 'textarea', name: 'value', value:() => {return window.pageData.authData.Bio}},
        { type: 'button', content: 'Update', endpointURL: '/updateProfile?type=Bio', endpointSuccess:() => {dialogDiv.style.display = "none"} }
    ],
    profileSkills:[

    ],
    createJob: [
        { content: 'Job Title', type: 'label' },
        { type: 'input', inputType: 'text', name: 'Title' },
        { content: 'Job Description', type: 'label' },
        { type: 'textarea', name: 'Description' },
        { content: 'Skills', type: 'label' },
        { type: 'tagify', name: 'Skills', values:() => {return window.pageData.skills.map(skill => {return {value:skill.SkillName,id:skill.SkillID}}) }},
        { type: 'button', content: 'Publish', endpointURL: '/createJob', endpointSuccess:() => {dialogDiv.style.display = "none"} }
    ],
    deleteJob: [
        { content: 'Are you sure you want to delete this job listing?', type: 'label' },
        { type: 'val', name: 'JobID',value:(() => {return selectedJob.JobID}) },
        { type: 'button', content: 'Delete', endpointURL: '/deleteJob', endpointSuccess:() => {dialogDiv.style.display = "none"} }
    ],
    deposit:[
        { content: 'Payment Method', type: 'label' },
        { type: 'multipleChoice', name: 'paymentMethod', choices: [{ label: "PayPal", value: "paypal" }, { label: "BenefitPay", value: "benefitpay" }] },
        { content: 'Amount', type: 'label' },
        { type: 'input', inputType:"number", name: 'amount' },
        { type: 'button', content: 'Deposit', endpointURL: '/depositBalance', endpointSuccess:() => {dialogDiv.style.display = "none"} } 
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
        if(form.lastElementChild.tagify){
            form.lastElementChild.tagify.destroy()
        }
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
                if(element.value){
                    newElement.value = element.value()
                    formData[element.name] = newElement.value
                }
                newElement.addEventListener('input', function () {
                    formData[element.name] = newElement.value; // Update formData on input change
                });
                break;

            case 'val':
                formData[element.name] = element.value()
                break;
            case 'textarea':
                newElement = document.createElement('textarea');
                newElement.setAttribute('name', element.name || '');
                newElement.classList.add('dialogTextArea');
                newElement.classList.add('lightBorder');
                if(element.value){
                    newElement.value = element.value()
                    formData[element.name] = newElement.value
                }
                newElement.addEventListener('input', function () {
                    formData[element.name] = newElement.value; // Update formData on textarea change
                });
                break;

                case 'tagify':
                    newElement = document.createElement('textarea');
                    newElement.setAttribute('name', element.name || '');
                    newElement.classList.add("tagify")
                    newElement.classList.add('lightBorder');
                    if(element.value){
                        newElement.value = element.value()
                        formData[element.name] = newElement.value
                    }
                    newElement.addEventListener('input', function () {
                        formData[element.name] = newElement.value; // Update formData on textarea change
                        console.log(formData)
                    });
                    break;

            case 'button':
                newElement = document.createElement('button');
                newElement.setAttribute('type', 'button'); // Change type to 'button'
                newElement.textContent = element.content || 'Submit';
                newElement.classList.add('dialogBtn');
                newElement.classList.add('themedBtn');
                newElement.addEventListener('click', function () {
                    sendDataToEndpoint(formData, element.endpointURL, element.endpointSuccess);
                });
                break;

            case 'functionButton':
                newElement = document.createElement('button');
                newElement.setAttribute('type', 'button'); // Change type to 'button'
                newElement.textContent = element.content || 'Submit';
                newElement.classList.add('dialogBtn');
                newElement.onclick = element.onclick
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
            if(element.type == "tagify"){
                try {
                    const tagify = new Tagify(newElement, {
                        enforceWhitelist: false,
                        delimiters: null,
                        whitelist: element.values(),
                        maxTags: 10,
                        dropdown: {
                          maxItems: 20,          
                          classname: "tags-look",
                          enabled: 0,            
                          closeOnSelect: false   
                        }
                    });
                    tagify.on("add", () => {
                        formData[element.name] = tagify.value.map(skill => {return {id:skill.id, value:skill.value}});
                        console.log(formData)
                    })
                    tagify.on("remove", () => {
                        formData[element.name] = tagify.value.map(skill => {return {id:skill.id, value:skill.value}});
                        console.log(formData)
                    })
                    newElement.tagify = tagify
                } catch (error) {
                    
                }
            }
        }
    });
    dialogDiv.style.display = "flex"
}

// Function to send form data to an endpoint
function sendDataToEndpoint(data, endpointURL, endpointSuccess) {
    fetch(endpointURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Sending data as JSON
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Return data for successful requests
        } else {
            return response.json().then(errorData => {
                alert(errorData.message);
                throw new Error(errorData.message); // Throw an error with the server error message
            });
        }
    })
    .then(data => {
        endpointSuccess()
        alert(data.message);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
