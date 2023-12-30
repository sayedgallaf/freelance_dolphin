function fillJobDetails(title, subtitle, bodyText, JobID) {
    // Fill in the job details in the HTML
    document.getElementById('dashboardJobViewHeaderInfoTitle').textContent = title;
    document.getElementById('dashboardJobViewHeaderInfoSubtitle').textContent = subtitle;
    document.getElementById('dashboardJobViewBodyText').textContent = bodyText;
    document.getElementById("dashboardJobViewBtns").style.display = "flex"
    document.getElementById("discussionBtn").onclick = () => {
        if(window.pageData.authData.UserType != "admin"){
            location.href = "/discussion#job="+JobID
        }else{
            location.href = "/watchroomDiscussions#job="+JobID
        }
    }
}