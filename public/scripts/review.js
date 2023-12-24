const reviewContainer = document.getElementById('review');

function getShortDateFormat(date) {
    date = new Date(date);
    date = new Date(date.getTime() - ( date.getTimezoneOffset() * 60000 ) );
    const twoDigitYear = date.getFullYear().toString().slice(-2); // Extract the last two digits of the year

    const day = String(date.getDate()).padStart(2, '0'); // Ensure leading zero for single-digit days
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure leading zero for single-digit months

    return `${day}/${month}/${twoDigitYear}`;
}
function createReview(review) {
    while(reviewContainer.lastElementChild){
        reviewContainer.lastElementChild.remove()
    }
    if(!review[0]){
        return;
    }
    review = review[0]
    const reviewDiv = document.createElement('div');
    reviewDiv.classList.add('review', 'lightBorder');
    const reviewTitle = document.createElement('span');
    reviewTitle.classList.add('reviewTitle');
    reviewTitle.textContent = `Review from ${review.UserType}`;

    const reviewDate = document.createElement('span');
    reviewDate.classList.add('reviewDate');
    reviewDate.textContent = getShortDateFormat(review.Timestamp)

    const reviewShortDesc = document.createElement('p');
    reviewShortDesc.classList.add('reviewShortDesc');
    reviewShortDesc.textContent = review.Comment;

    const reviewProfileLink = document.createElement('a');
    reviewProfileLink.href = '/profile/'+review.UserID;
    reviewProfileLink.classList.add("reviewProfile")

    const reviewProfileImg = document.createElement('img');
    reviewProfileImg.src = review.ProfilePicURL;
    reviewProfileImg.classList.add('reviewProfilePicture');

    const reviewProfileName = document.createElement('span');
    reviewProfileName.classList.add('reviewProfileName');
    reviewProfileName.textContent = review.FullName;

    const reviewSettingsBtn = document.createElement('button');
    reviewSettingsBtn.classList.add('reviewSettings');
    reviewSettingsBtn.onclick = () => {
        generateDialog("reviewSettings")
    }

    const reviewSettingsImg = document.createElement('img');
    reviewSettingsImg.src = '/assets/dots.svg';

    // Construct the structure
    reviewProfileLink.appendChild(reviewProfileImg);
    reviewProfileLink.appendChild(reviewProfileName);

    reviewSettingsBtn.appendChild(reviewSettingsImg);

    reviewDiv.appendChild(reviewTitle);
    reviewDiv.appendChild(reviewDate);
    reviewDiv.appendChild(reviewShortDesc);
    reviewDiv.appendChild(reviewProfileLink);
    reviewDiv.appendChild(reviewSettingsBtn);

    // Append the review to #review element
    reviewContainer.appendChild(reviewDiv);
}
