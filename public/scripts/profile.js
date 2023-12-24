if(window.pageData.jobs.length > 0){
    while(jobList.lastElementChild){
        jobList.lastElementChild.remove()
    }
}
for(let a = 0; a < window.pageData.jobs.length; a++){
    const {JobID, UserID, Title, Description, Timestamp, FullName, ProfilePicURL, totalQuotes, review} = window.pageData.jobs[a]
    createJobListing(JobID,UserID,Title,Timestamp,Description,ProfilePicURL ? ProfilePicURL : "/assets/pfp.png",FullName, totalQuotes, review)
}

if(window.pageData.authData){
    if(window.pageData.authData.UserID == window.pageData.user.UserID){
        document.getElementById("profileBtn").onclick = () => {generateDialog("profileSettings2")}
    }
}
jobList.querySelector(".jobListing").click()