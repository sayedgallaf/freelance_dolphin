const dashboardJobsBody = document.getElementById("dashboardJobsBody")
const capitalize = s => s && s[0].toUpperCase() + s.slice(1)
function getShortDateFormat(date) {
    date = new Date(date);
    date = new Date(date.getTime() - ( date.getTimezoneOffset() * 60000 ) );
    const twoDigitYear = date.getFullYear().toString().slice(-2); // Extract the last two digits of the year

    const day = String(date.getDate()).padStart(2, '0'); // Ensure leading zero for single-digit days
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure leading zero for single-digit months

    return `${day}/${month}/${twoDigitYear}`;
}
let selectedJob = {};
function generateDashboardJobElement(job, user) {
    const div = document.createElement('div');
    div.classList.add('dashboardJob', 'lightBorder');
    div.Status = job.Status;

    div.onclick = () => {
        let selectedDashboardJobs = document.querySelectorAll(".dashboardJob.themedBtn")
        screen.width <= 900 ? document.getElementById("rightBottomHalfDrawer").click() : undefined;

        for(let a = 0; a< selectedDashboardJobs.length; a++){
            selectedDashboardJobs[a].classList.remove("themedBtn")
        }
        div.classList.add("themedBtn")
        fillJobDetails(job.Title,`Posted At ${getShortDateFormat(job.Timestamp)} By ${job.FullName}`,job.Description)
        selectedJob.JobID = job.JobID
    }

    const titleSpan = document.createElement('span');
    titleSpan.classList.add('dashboardJobTitle');
    titleSpan.textContent = `${capitalize(job.Status)}: ${job.Title}`;

    const userSpan = document.createElement('span');
    userSpan.classList.add('dashboardJobUser');
    user ? userSpan.innerHTML = `${capitalize(user.UserType)}: <a href="/profile/${user.UserID}">${capitalize(user.FullName)}</a>` : userSpan.innerHTML = "Job is unassigned";

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('dashboardJobTime');
    job.contract ? timeSpan.textContent = `Started At: ${getShortDateFormat(job.contract.Timestamp)} - Deadline: ${job.contract.Deadline ? getShortDateFormat(job.contract.Deadline) : "Undeclared"}` : timeSpan.textContent = "Job listed on "+getShortDateFormat(job.Timestamp);

    div.appendChild(titleSpan);
    div.appendChild(userSpan);
    div.appendChild(timeSpan);

    dashboardJobsBody.appendChild(div);
}

// Assuming you have the generateDashboardJobElement function available

const iterateJobs = async () => {
    if(window.pageData.jobs.length > 0){
        while(dashboardJobsBody.lastElementChild){
            dashboardJobsBody.lastElementChild.remove()
        }
        const jobs = window.pageData.jobs
        for(let a =0; a < jobs.length; a++){
            generateDashboardJobElement(jobs[a],jobs[a].contract ? jobs[a].contract.user : null)
        }
        setTimeout(() => {
            let firstJob = document.querySelector(".dashboardJob")
            if(firstJob){
                firstJob.click()
            }else{
                screen.width <= 900 ? document.getElementById("leftBottomHalfDrawer").click() : undefined;
            }
        }, 100);
    }
};

// Call the function to fetch user contracts
iterateJobs();

function filterByStatus(selectedStatus, button) {
    const jobs = document.getElementsByClassName('dashboardJob');
    const dashboardJobsHeaderBtn = document.querySelectorAll(".dashboardJobsHeaderBtn.themedBtn")
    for(let a =0; a < dashboardJobsHeaderBtn.length; a++){
        dashboardJobsHeaderBtn[a].classList.remove("themedBtn")
    }
    button.classList.add("themedBtn")
    
    for (let a = 0; a < jobs.length; a++) {
        const status = jobs[a].Status; // Assuming you have 'data-status' attribute
        if(selectedStatus == "all"){
            jobs[a].classList.remove('hide');

        }else if (status !== selectedStatus) {
            jobs[a].classList.add('hide');
        } else {
            jobs[a].classList.remove('hide');
        }
    }
}

if(location.href.includes("?createJob")){
    generateDialog("createJob")
}