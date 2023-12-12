const jobList = document.getElementById("jobList")
let selectedJob;

function createJobListing(jobTitle, jobDate, jobDescription, profileImgSrc, profileName, totalQuotes) {
    // Create the necessary elements
    const jobListing = document.createElement('div');
    jobListing.classList.add('jobListing', 'lightBorder');
    jobListing.onclick = () => {
        selectedJob = {
            jobTitle,
            jobDate,
            jobDescription,
            profileImgSrc,
            profileName,
            totalQuotes,
        }
        let selectedJobs = document.querySelectorAll(".jobListing.selected")
        for(let a =0; a < selectedJobs.length; a++){
            selectedJobs[a].classList.remove("selected")
        }
        jobListing.classList.add("selected")
        fillJobDetails(jobTitle,`Posted At ${jobDate} By ${profileName}`,jobDescription,totalQuotes)
    }

    const titleSpan = document.createElement('span');
    titleSpan.classList.add('jobListingTitle');
    titleSpan.textContent = jobTitle;

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('jobListingDate');
    dateSpan.textContent = jobDate;

    const shortDescP = document.createElement('p');
    shortDescP.classList.add('jobListingShortDesc');
    shortDescP.textContent = jobDescription;

    const profileLink = document.createElement('a');
    profileLink.href = '/';
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
    settingsImg.src = 'assets/dots.svg';

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

