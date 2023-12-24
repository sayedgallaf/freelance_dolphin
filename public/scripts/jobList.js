const jobList = document.getElementById("jobList")
let selectedJob;
function getShortDateFormat(date) {
    date = new Date(date);
    date = new Date(date.getTime() - ( date.getTimezoneOffset() * 60000 ) );
    const twoDigitYear = date.getFullYear().toString().slice(-2); // Extract the last two digits of the year

    const day = String(date.getDate()).padStart(2, '0'); // Ensure leading zero for single-digit days
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure leading zero for single-digit months

    return `${day}/${month}/${twoDigitYear}`;
}
function createJobListing(JobID, UserID, jobTitle, jobDate, jobDescription, profileImgSrc, profileName, totalQuotes, review) {
    // Create the necessary elements
    const jobListing = document.createElement('div');
    jobListing.classList.add('jobListing', 'lightBorder');
    jobListing.onclick = () => {
        selectedJob = {
            JobID,
            UserID,
            jobTitle,
            jobDate,
            jobDescription,
            profileImgSrc,
            profileName,
            totalQuotes,
        }

        screen.width <= 900 ? document.getElementById("rightBottomHalfDrawer").click() : undefined;

        let selectedJobs = document.querySelectorAll(".jobListing.selected")
        for(let a =0; a < selectedJobs.length; a++){
            selectedJobs[a].classList.remove("selected")
        }
        jobListing.classList.add("selected")
        fillJobDetails(jobTitle,`Posted At ${getShortDateFormat(jobDate)} By ${profileName}`,jobDescription,totalQuotes)
        review ? createReview(review) : null;
    }

    const titleSpan = document.createElement('span');
    titleSpan.classList.add('jobListingTitle');
    titleSpan.textContent = jobTitle;

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('jobListingDate');
    dateSpan.textContent = getShortDateFormat(jobDate);

    const shortDescP = document.createElement('p');
    shortDescP.classList.add('jobListingShortDesc');
    shortDescP.textContent = jobDescription;

    const profileLink = document.createElement('a');
    profileLink.href = '/profile/'+UserID;
    profileLink.classList.add('jobListingProfile');

    const profileImg = document.createElement('img');
    profileImg.src = profileImgSrc;
    profileImg.classList.add('jobListingProfilePicture');

    const profileNameSpan = document.createElement('span');
    profileNameSpan.classList.add('jobListingProfileName');
    profileNameSpan.textContent = profileName;

    const settingsButton = document.createElement('button');
    settingsButton.classList.add('jobListingSettings');
    settingsButton.onclick = () => {
        generateDialog('jobListingSettings')
    }
    const settingsImg = document.createElement('img');
    settingsImg.src = '/assets/dots.svg';

    // Append elements accordingly
    profileLink.appendChild(profileImg);
    profileLink.appendChild(profileNameSpan);

    settingsButton.appendChild(settingsImg);

    jobListing.appendChild(titleSpan);
    jobListing.appendChild(dateSpan);
    jobListing.appendChild(shortDescP);
    jobListing.appendChild(profileLink);
    jobListing.appendChild(settingsButton);

    // Append the created jobListing to the jobList
    jobList.appendChild(jobListing);
}

