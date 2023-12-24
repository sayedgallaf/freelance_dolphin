const socket = io('http://localhost:3000');

socket.on('message', (message) => {
    createMessageElement(message.by,message.content)
});

let selectedDiscussion = {}

const sendMessage = (message) => {
    socket.emit("message", {room:selectedDiscussion.discussionID, by:window.pageData.authData, content:message})
}

const messageInput = document.getElementById("messageInput")

window.addEventListener("keydown", (e) => {
    if(e.key == "Enter"){
        sendMessage(messageInput.value)
    }
})

function createDiscussionElement(discussion, job) {
    // Create the div element
    const discussionDiv = document.createElement('div');
    discussionDiv.classList.add('discussion', 'lightBorder');

    // Create and append the span elements
    const discussionTitleSpan = document.createElement('span');
    discussionTitleSpan.classList.add('discussionTitle');
    discussionTitleSpan.textContent = `${discussion.Status}: ${job.Title}`;
    discussionDiv.appendChild(discussionTitleSpan);

    const discussionInfoSpan = document.createElement('span');
    discussionInfoSpan.classList.add('discussionInfo');
    discussionInfoSpan.textContent = `${discussion.info}`;
    discussionDiv.appendChild(discussionInfoSpan);

    // Create and append the button element
    const discussionSettingsButton = document.createElement('button');
    discussionSettingsButton.classList.add('discussionSettings');
    const img = document.createElement('img');
    img.src = '/assets/dots.svg';
    discussionSettingsButton.appendChild(img);
    discussionDiv.appendChild(discussionSettingsButton);

    // Append the created element to #discussions
    const discussionsContainer = document.getElementById('discussions');
    if (discussionsContainer) {
        discussionsContainer.appendChild(discussionDiv);
    } else {
        console.error('Element with ID "discussions" not found.');
    }
}


function createMessageElement(messageBy, messageContent) {
    // Create the div element
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    // Create and append the span elements
    const messageBySpan = document.createElement('span');
    messageBySpan.classList.add('messageBy');
    messageBySpan.textContent = messageBy;
    messageDiv.appendChild(messageBySpan);

    const messageContentSpan = document.createElement('span');
    messageContentSpan.classList.add('messageContent');
    messageContentSpan.textContent = messageContent;
    messageDiv.appendChild(messageContentSpan);

    // Append the created element to #discussionMessages
    const discussionMessagesContainer = document.getElementById('discussionMessages');
    if (discussionMessagesContainer) {
        discussionMessagesContainer.appendChild(messageDiv);
    } else {
        console.error('Element with ID "discussionMessages" not found.');
    }
}


