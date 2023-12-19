const userID = 'your_user_id_here'; // Replace 'your_user_id_here' with the actual user ID

const requestData = {
    userID: userID
};

for(let a = 0; a < window.pageData.jobs.length; a++){
    const {JobID, UserID, Title, Description, Timestamp, FullName, ProfilePicURL, totalQuotes} = window.pageData.jobs[a]
    console.log(FullName)
    createJobListing(JobID,UserID,Title,Timestamp.split("T")[0].replace(/20/, ''),Description,ProfilePicURL ? ProfilePicURL : "/assets/pfp.png",FullName, totalQuotes)
}
jobList.querySelector(".jobListing").click()

