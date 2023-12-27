
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
        { type: 'button', content: 'Sign Up', endpointURL: '/signup', endpointSuccess: () => {location.href = "/profile?signedUp"} },
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
        { content: 'Quote (BD)', type: 'label' },
        { type: 'val', name: 'JobID',value:(() => {return selectedJob.JobID}) },
        { type: 'input', inputType: 'number', name: 'QuoteAmount' },
        { content: 'Message', type: 'label' },
        { type: 'textarea', name: 'QuoteMessage' },
        { type: 'button', content: 'Submit <small>(0.1 BD)</small>', endpointURL: '/createQuote', endpointSuccess:() => {location.reload()} }
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
        { type: 'functionButton', content: 'Change Password', onclick:() => {generateDialog("changePassword")} },
        { type: 'functionButton', content: 'Change Picture', onclick:() => {generateDialog("profilePic")} },
        { type: 'functionButton', content: 'Socials', onclick:() => {generateDialog("socials")} }
    ],
    profileFullName:[
        { content: 'Full Name', type: 'label' },
        { type: 'val', name: 'type',value:(() => {return "FullName"}) },
        { type: 'input', inputType: 'text', name: 'value', value:() => {return window.pageData.authData.FullName} },
        { type: 'button', content: 'Update', endpointURL: '/updateProfile?type=FullName', endpointSuccess:() => {location.reload()} }

    ],
    profileBio:[
        { content: 'Bio', type: 'label' },
        { type: 'val', name: 'type',value:(() => {return "Bio"}) },
        { type: 'textarea', name: 'value', value:() => {return window.pageData.authData.Bio}},
        { type: 'button', content: 'Update', endpointURL: '/updateProfile?type=Bio', endpointSuccess:() => {location.reload()} }
    ],
    profileSkills:[
        { content: 'Skills', type: 'label' },
        { type: 'val', name: 'type',value:(() => {return "Skills"}) },
        { type: 'tagify', name: 'value', values:() => {return {
            selected:window.pageData.user.skills.map(skill => {return {value:skill.skillName,id:skill.skillId}}),
            all:window.pageData.skills.map(skill => {return {value:skill.SkillName,id:skill.SkillID}})
        }}},
        { type: 'button', content: 'Update', endpointURL: '/updateProfile?type=Skills', endpointSuccess:() => {location.reload()} }
    ],
    createJob: [
        { content: 'Job Title', type: 'label' },
        { type: 'input', inputType: 'text', name: 'Title' },
        { content: 'Job Description', type: 'label' },
        { type: 'textarea', name: 'Description' },
        { content: 'Skills', type: 'label' },
        { type: 'tagify', name: 'Skills', values:() => {return {all:window.pageData.skills.map(skill => {return {value:skill.SkillName,id:skill.SkillID}})} }},
        { type: 'button', content: 'Publish', endpointURL: '/createJob', endpointSuccess:() => {location.reload()} }
    ],
    deleteJob: [
        { content: 'Are you sure you want to delete this job listing?', type: 'Question' },
        { type: 'val', name: 'JobID',value:(() => {return selectedJob.JobID}) },
        { type: 'button', content: 'Yes', endpointURL: '/deleteJob', endpointSuccess:() => {location.reload()} }
    ],
    deposit:[
        { content: 'Payment Method', type: 'label' },
        { type: 'multipleChoice', name: 'paymentMethod', choices: [{ label: "PayPal", value: "paypal" }, { label: "BenefitPay", value: "benefitpay" }] },
        { content: 'Amount', type: 'label' },
        { type: 'input', inputType:"number", name: 'amount' },
        { type: 'button', content: 'Deposit', endpointURL: '/depositBalance', endpointSuccess:() => {location.reload()} } 
    ],
    createContract:[
        { type: 'val', name: 'DiscussionID',value:(() => {return selectedDiscussion.DiscussionID}) },
        { type: 'val', name: 'JobID',value:(() => {return selectedDiscussion.JobID}) },
        { type: 'val', name: 'FreelancerID',value:(() => {return selectedDiscussion.FreelancerID}) },
        { content: 'Amount', type: 'label' },
        { type: 'input', inputType:"number", name: 'Amount' },
        { content: 'Deadline', type: 'label' },
        { type: 'input', inputType:"text", name: 'Deadline' },
        { type: 'button', content: 'Create', endpointURL: '/createContract', endpointSuccess:() => {location.reload()} } 
    ],
    deleteDiscussion:[
        { content: 'Are you sure you want to cancel this negotiation?', type: 'Question' },
        { type: 'val', name: 'DiscussionID',value:(() => {return selectedDiscussion.DiscussionID}) },
        { type: 'button', content: 'Yes', endpointURL: '/deleteDiscussion', endpointSuccess:() => {location.reload()} }
    ],
    finishJob:[
        { content: 'Are you sure you want to set this job as finished?', type: 'Question' },
        { type: 'val', name: 'ContractID',value:(() => {return selectedDiscussion.ContractID}) },
        { type: 'val', name: 'DiscussionID',value:(() => {return selectedDiscussion.DiscussionID}) },
        { type: 'button', content: 'Yes', endpointURL: '/endContract', endpointSuccess:() => {location.reload()} }
    ],
    createDispute:[
        { content: 'Describe your issue:', type: 'label' },
        { type: 'textarea', name: 'Description' },
        { type: 'val', name: 'ContractID',value:(() => {return selectedDiscussion.ContractID}) },
        { type: 'val', name: 'DiscussionID',value:(() => {return selectedDiscussion.DiscussionID}) },
        { type: 'val', name: 'JobID',value:(() => {return selectedDiscussion.JobID}) },
        { type: 'button', content: 'Dispute', endpointURL: '/createDispute', endpointSuccess:() => {location.reload()} }
    ],
    createReview:[
        { content: 'Rating (Out of 5)', type: 'label' },
        { type: 'input', inputType:"number", name: 'Rating' },
        { content: 'Review', type: 'label' },
        { type: 'textarea', name: 'Comment' },
        { type: 'val', name: 'JobID',value:(() => {return selectedDiscussion.JobID}) },
        { type: 'val', name: 'ReviewedID',value:(() => {return window.pageData.authData.UserType == "employer" ? selectedDiscussion.FreelancerID : selectedDiscussion.EmployerID}) },
        { type: 'button', content: 'Create', endpointURL: '/addReview', endpointSuccess:() => {location.reload()} }
    ],
    socials:[
        { type: 'functionButton', content: 'Youtube', onclick:() => {generateDialog("socialYoutube")} },
        { type: 'functionButton', content: 'Github', onclick:() => {generateDialog("socialGithub")} },
        { type: 'functionButton', content: 'Instagram', onclick:() => {generateDialog("socialInstagram")} },
        { type: 'functionButton', content: 'Twitter', onclick:() => {generateDialog("socialTwitter")} }
    ],
    socialYoutube:[
        { content: 'Youtube Channel URL', type: 'label' },
        { type: 'val', name: 'SocialID',value:(() => {return window.pageData.socials.Youtube.SocialID}) },
        { type: 'input', inputType: 'text', name: 'URL', value:() => {return window.pageData.socials.Youtube.URL} },
        { type: 'button', content: 'Update', endpointURL: '/updateSocial', endpointSuccess:() => {location.reload()} }
    ],
    socialGithub:[
        { content: 'Github URL', type: 'label' },
        { type: 'val', name: 'SocialID',value:(() => {return window.pageData.socials.Github.SocialID}) },
        { type: 'input', inputType: 'text', name: 'URL', value:() => {return window.pageData.socials.Github.URL} },
        { type: 'button', content: 'Update', endpointURL: '/updateSocial', endpointSuccess:() => {location.reload()} }
    ],
    socialInstagram:[
        { content: 'Instagram URL', type: 'label' },
        { type: 'val', name: 'SocialID',value:(() => {return window.pageData.socials.Instagram.SocialID}) },
        { type: 'input', inputType: 'text', name: 'URL', value:() => {return window.pageData.socials.Instagram.URL} },
        { type: 'button', content: 'Update', endpointURL: '/updateSocial', endpointSuccess:() => {location.reload()} }
    ],
    socialTwitter:[
        { content: 'Twitter URL', type: 'label' },
        { type: 'val', name: 'SocialID',value:(() => {return window.pageData.socials.Twitter.SocialID}) },
        { type: 'input', inputType: 'text', name: 'URL', value:() => {return window.pageData.socials.Twitter.URL} },
        { type: 'button', content: 'Update', endpointURL: '/updateSocial', endpointSuccess:() => {location.reload()} }
    ],
    profilePic:[
        { content: 'Profile Picture', type: 'label' },
        { type: 'val', name: 'type',value:(() => {return "ProfilePicURL"}) },
        { type: 'file', name: 'ProfilePic'},
        { type: 'button', file:true, content: 'Update', endpointURL: '/updateProfilePic', endpointSuccess:() => {location.reload()} }
    ],
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

            case 'Question':
                newElement = document.createElement('label');
                newElement.textContent = element.content;
                newElement.classList.add("dialogQuestion")
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

            case 'file':
                newElement = document.createElement('input');
                newElement.setAttribute('type', "file");
                newElement.setAttribute('name', element.name);
                newElement.setAttribute('placeholder', element.placeholder || '');
                newElement.classList.add('dialogInput');
                newElement.classList.add('lightBorder');
                newElement.addEventListener('change', function () {
                    console.log(this.files[0])
                    formData[element.name] = this.files[0]; // Update formData on input change
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
                    newElement.classList.add("tagifyElem")
                    newElement.classList.add('lightBorder');
                    if(element.value){
                        newElement.value = element.value()
                        formData[element.name] = newElement.value
                    }
                    newElement.addEventListener('input', function () {
                        formData[element.name] = newElement.value; // Update formData on textarea change
                    });
                    break;

            case 'button':
                newElement = document.createElement('button');
                newElement.setAttribute('type', 'button'); // Change type to 'button'
                newElement.innerHTML = element.content || 'Submit';
                newElement.classList.add('dialogBtn');
                newElement.classList.add('themedBtn');
                newElement.addEventListener('click', function () {
                    if(!element.file){
                        sendDataToEndpoint(formData, element.endpointURL, element.endpointSuccess);
                    }else{
                        sendDataToEndpoint(formData, element.endpointURL, element.endpointSuccess, true);
                    }
                });
                break;

            case 'functionButton':
                newElement = document.createElement('button');
                newElement.setAttribute('type', 'button'); // Change type to 'button'
                newElement.textContent = element.content || 'Submit';
                newElement.classList.add('dialogBtn');
                newElement.classList.add('functionButton');
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
                        whitelist: element.values().all,
                        maxTags: 10,
                        dropdown: {
                          maxItems: 20,          
                          classname: "tags-look",
                          enabled: 0,            
                          closeOnSelect: false   
                        }
                    });

                    if(element.values().selected){
                        let selectedTags = element.values().selected
                        tagify.addTags(selectedTags)
                    }
                    
                    tagify.on("add", () => {
                        formData[element.name] = tagify.value.map(skill => {return {id:skill.id, value:skill.value}});
                    })
                    tagify.on("remove", () => {
                        formData[element.name] = tagify.value.map(skill => {return {id:skill.id, value:skill.value}});
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
function sendDataToEndpoint(data, endpointURL, endpointSuccess, isfile = false) {
    const headersObj = {

    }
    if(!isfile){
        headersObj['Content-Type'] = 'application/json'
        let newData = JSON.stringify(data)
        data = newData

    }else{
        let formData = new FormData();
        for(let key in data){
            console.log(data[key])
            formData.append(key, data[key]);
        }
        data = formData
    }
    console.log(data)
    fetch(endpointURL, {
        method: 'POST',
        headers:headersObj,
        body: data // Sending data as JSON
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
