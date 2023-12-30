const dicussionMessages = document.getElementById('dicussionMessages');
const messageInput = document.getElementById("messageInput")
const discussionInput = document.getElementById("discussionInput")
const actionBtns = {
    cancelNegotiationsBtn: document.getElementById("cancelNegotiationsBtn"),
    createContractBtn: document.getElementById("createContractBtn"),
    finishJobBtn: document.getElementById("finishJobBtn"),
    createDisputeBtn: document.getElementById("createDisputeBtn"),
    resolveDisputeBtn: document.getElementById("resolveDisputeBtn"),
    createReviewBtn: document.getElementById("createReviewBtn")
}

const showActionBtns = (chosenActionBtns = []) => {
    for (let actionBtn in actionBtns) {
        actionBtns[actionBtn].style.display = "none"
    }
    for (let a = 0; a < chosenActionBtns.length; a++) {
        if (actionBtns[chosenActionBtns[a]]) {
            actionBtns[chosenActionBtns[a]].style.display = "block"
        }
    }
}
const socket = io(location.origin);

let selectedDiscussion = {}
if(location.href.includes("#job=")){
    selectedDiscussion.JobID = location.href.split("#job=")[1]
}

function getShortDateFormat(date) {
    date = new Date(date);
    date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const twoDigitYear = date.getFullYear().toString().slice(-2); // Extract the last two digits of the year

    const day = String(date.getDate()).padStart(2, '0'); // Ensure leading zero for single-digit days
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure leading zero for single-digit months

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure leading zero for single-digit minutes

    // Convert hours to 12-hour format and determine AM/PM
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Adjust hours to 12-hour format

    return `${day}/${month}/${twoDigitYear}`;
}
const createMessage = (message) => {
    const data = {
        DiscussionID: selectedDiscussion.DiscussionID,
        UserID: window.pageData.authData.UserID,
        MessageContent: message
    };

    fetch('/createMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            // Handle response from the server if needed
            console.log('Message sent successfully');
        })
        .catch(error => {
            // Handle error if the message fails to send
            console.error('Error sending message:', error);
        });
};

const sendMessage = () => {
    const message = messageInput.value
    if (!message) {
        return;
    }
    if (!selectedDiscussion.DiscussionID) {
        return;
    }
    socket.emit("message", {
        room: selectedDiscussion.DiscussionID,
        by: window.pageData.authData.FullName,
        UserID: window.pageData.authData.UserID,
        content: message
    });
    messageInput.placeholder = "Loading..."
    createMessage(message)
    messageInput.value = ""
};


window.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        sendMessage()
    }
})

function createDiscussionElement(discussion) {
    // Create the div element
    const discussionDiv = document.createElement('div');
    discussionDiv.classList.add('discussion', 'lightBorder');
    discussionDiv.discussion = discussion
    discussionDiv.onclick = () => {
        if(selectedDiscussion.DiscussionID){
            socket.emit("leaveRoom", discussion.DiscussionID)
        }
        fetch("/getDiscussion", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ DiscussionID: discussion.DiscussionID })
        })
            .then(response => response.json())
            .then(discussionData => {

                if (discussion.DiscussionStatus == "Quote") {
                    generateQuote(discussionData, discussion)
                    showActionBtns()
                    discussionInput.style.display = "none"
                } else {
                    while (dicussionMessages.lastElementChild) {
                        dicussionMessages.lastElementChild.remove()
                    }
                    for (let a = 0; a < discussionData.length; a++) {
                        if(discussionData[a].MessageID){
                            createMessageElement(discussionData[a].FullName, discussionData[a].MessageContent, discussionData[a].UserID)
                        }else if(discussionData[a].MediaID){
                            createMessageElement(discussionData[a].FullName, discussionData[a].MediaURL, discussionData[a].UserID,true)
                        }
                        
                    }
                    if (discussion.DiscussionStatus == "Negotiation") {
                        if (window.pageData.authData.UserType != "freelancer") {
                            showActionBtns(["cancelNegotiationsBtn", "createContractBtn"])
                        } else {
                            showActionBtns(["cancelNegotiationsBtn"])
                        }
                        document.getElementById("discussionBoardSubtitle").innerText = ""
                        discussionInput.style.display = "flex"
                    } else if (discussion.DiscussionStatus == "Hired") {
                        if (window.pageData.authData.UserType != "freelancer") {
                            showActionBtns(["finishJobBtn", "createDisputeBtn"])
                        } else {
                            showActionBtns(["createDisputeBtn"])
                        }
                        discussionInput.style.display = "flex"
                        document.getElementById("discussionBoardSubtitle").innerText = "Held in escrow: BHD" + discussion.EscrowAmount
                    }else if (discussion.DiscussionStatus == "Dispute") {
                        showActionBtns()
                        discussionInput.style.display = "none"
                        document.getElementById("discussionBoardSubtitle").innerText = "Held in escrow: BHD" + discussion.EscrowAmount
                        createMessageElement("Dispute",discussion.DisputeDescription || "A dispute has been started, wait for an admin to resolve the situation.")
                        if(window.pageData.authData.UserType == "admin"){
                            showActionBtns(["resolveDisputeBtn"])
                        }
                    } else if (discussion.DiscussionStatus == "Archived") {
                        document.getElementById("discussionBoardSubtitle").innerText = ""
                        if(!discussion.ReviewID){
                            showActionBtns(["createReviewBtn"])
                        }else{
                            showActionBtns()
                        }

                        discussionInput.style.display = "none"
                    }else{
                        document.getElementById("discussionBoardSubtitle").innerText = ""
                        showActionBtns()
                        discussionInput.style.display = "none"
                    }
                }
            })
            .catch(error => console.error('Fetch error:', error));
        document.getElementById("discussionBoardTitle").innerText = "Discussion: " + discussion.JobTitle
        let prevSelected = document.querySelector(".discussion.themedBtn")
        if (prevSelected) {
            prevSelected.classList.remove("themedBtn")
        }
        discussionDiv.classList.add("themedBtn")
        selectedDiscussion = discussion
        socket.emit("joinRoom", discussion.DiscussionID)

        const rightBottomHalf = document.getElementById("rightBottomHalf")
        const computedStyles = window.getComputedStyle(rightBottomHalf);
        const isClosed = computedStyles.right != `0px`;
        window.innerWidth <= 900 && isClosed ? document.getElementById("rightBottomHalfDrawer").click() : undefined;
        location.hash = "job="+discussion.JobID
    }

    // Create and append the span elements
    const discussionTitleSpan = document.createElement('span');
    discussionTitleSpan.classList.add('discussionTitle');
    discussionTitleSpan.textContent = `${discussion.DiscussionStatus}: ${discussion.JobTitle}`;
    discussionDiv.appendChild(discussionTitleSpan);

    const discussionInfoSpan = document.createElement('span');
    discussionInfoSpan.classList.add('discussionInfo');
    if(discussion.DiscussionStatus == "Quote"){
        discussionInfoSpan.textContent = `Job Created: ${getShortDateFormat(discussion.JobTimestamp)}`;

    }else if(discussion.DiscussionStatus == "Negotiation"){
        discussionInfoSpan.textContent = `Job Created: ${getShortDateFormat(discussion.JobTimestamp)}`;

    }else if(discussion.DiscussionStatus == "Hired"){
        discussionInfoSpan.textContent = `Hired at: ${getShortDateFormat(discussion.ContractTimestamp)} - Deadline: ${getShortDateFormat(discussion.ContractDeadline)}`;

    }else if(discussion.DiscussionStatus == "Archived"){
        discussionInfoSpan.textContent = `Job Finished`;

    }
    discussionDiv.appendChild(discussionInfoSpan);

    // Append the created element to #discussions
    const discussionsContainer = document.getElementById('discussions');
    discussionsContainer.appendChild(discussionDiv);

    if(selectedDiscussion.JobID == discussion.JobID){
        discussionDiv.click()
    }

}


function createMessageElement(messageBy, messageContent, UserID, media = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    // Create and append the span elements
    const messageBySpan = document.createElement('span');
    messageBySpan.classList.add('messageBy');
    messageBySpan.innerHTML = `<a href="/profile/${UserID}">${messageBy}</a>: `;
    messageDiv.appendChild(messageBySpan);

    const messageContentSpan = document.createElement('span');
    messageContentSpan.classList.add('messageContent');
    if(!media){
        messageContentSpan.textContent = messageContent;

    }else{
        messageContentSpan.innerHTML = `<a href="/media/${selectedDiscussion.DiscussionID}/${messageContent}" target="_blank">${messageContent}</a>`
    }
    messageDiv.appendChild(messageContentSpan);

    dicussionMessages.appendChild(messageDiv);
    setTimeout(() => {
        dicussionMessages.scrollTop = 100000000
    }, 10);
}

function generateQuote(quote, discussion) {
    while (dicussionMessages.lastElementChild) {
        dicussionMessages.lastElementChild.remove()
    }
    // Create elements
    const quoteDiv = document.createElement('div');
    quoteDiv.id = 'quoteDiv';

    const quoteContent = document.createElement('span');
    quoteContent.id = 'quoteContent';
    quoteContent.innerHTML = `<a href="/profile/${quote.UserID}">${quote.FullName}</a> sent you a quote: ${quote.QuoteAmount}BHD, ${quote.QuoteMessage}`;

    const quoteBtnsDiv = document.createElement('div');
    quoteBtnsDiv.id = 'quoteBtns';

    const interestedBtn = document.createElement('button');
    interestedBtn.className = 'quoteBtn lightBorder';
    interestedBtn.textContent = 'Interested';

    const notInterestedBtn = document.createElement('button');
    notInterestedBtn.className = 'quoteBtn lightBorder';
    notInterestedBtn.textContent = 'Not Interested';

    interestedBtn.addEventListener('click', () => {
        const data = {
            UserID: quote.UserID,
            DiscussionID: discussion.DiscussionID
        };
        fetch('/interested', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                location.reload()
                console.log('Added discussion user:', response);
            })
            .catch(error => {
                console.error('Error adding discussion user:', error);
            });
    });

    notInterestedBtn.addEventListener('click', () => {
        fetch('/deleteDiscussion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                UserID: quote.UserID,
                DiscussionID: discussion.DiscussionID
            })
        })
            .then(response => {
                location.reload()
                console.log('Deleted discussion:', response);
            })
            .catch(error => {
                console.error('Error deleting discussion:', error);
            });
    });

    // Append elements
    quoteBtnsDiv.appendChild(interestedBtn);
    quoteBtnsDiv.appendChild(notInterestedBtn);

    quoteDiv.appendChild(quoteContent);
    quoteDiv.appendChild(quoteBtnsDiv);

    // Append to #discussionBoard
    dicussionMessages.appendChild(quoteDiv);
}

function filterDiscussions(btn) {
    let prevSelected = document.querySelector(".discussionPanelHeaderBtn.selected")
    if (prevSelected.classList) {
        prevSelected.classList.remove("selected")
    }
    const status = btn.innerText
    btn.classList.add("selected")
    const discussions = document.querySelectorAll('.discussion');

    discussions.forEach(discussion => {
        const discussionStatus = discussion.discussion.DiscussionStatus;

        if (status === 'All' || discussionStatus === status) {
            discussion.style.display = 'flex';
        } else {
            discussion.style.display = 'none';
        }
    });
}

for (let a = 0; a < window.pageData.discussions.length; a++) {
    createDiscussionElement(window.pageData.discussions[a])
}

const mediaFileInput = document.getElementById('mediaFileInput');
const uploadMediaBtn = document.getElementById('uploadMediaBtn');

// Trigger file selection when the "Upload File" button is clicked
uploadMediaBtn.addEventListener('click', () => {
    mediaFileInput.click(); // Programmatically trigger file input click event
});

// Listen for file selection in the hidden file input
mediaFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (!file) {
        console.error('No file selected');
        return;
    }

    sendMediaToServer(file);
});

function sendMediaToServer(file) {
    const formData = new FormData();

    formData.append('DiscussionID', selectedDiscussion.DiscussionID);
    formData.append('UserID', window.pageData.authData.UserID);
    formData.append('MediaType', 'file');
    formData.append('mediaFile', file);
    messageInput.placeholder = "Loading..."
    fetch('/uploadMedia', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            // Handle the response from the server if needed
            messageInput.placeholder = "message"
            console.log('Media uploaded successfully');
        })
        .catch(error => {
            // Handle error if media upload fails
            console.error('Error uploading media:', error);
        });
}

const firstDiscussion = document.querySelector(".discussion")
socket.on('connect', () => {
    if (firstDiscussion && !selectedDiscussion.JobID) {
        firstDiscussion.click()
    }
});
socket.on('message', (message) => {
    messageInput.placeholder = "message"
    createMessageElement(message.by, message.content, message.UserID)
});

socket.on('media', (message) => {
    messageInput.placeholder = "message"
    createMessageElement(message.by, message.media, message.UserID, true)
});