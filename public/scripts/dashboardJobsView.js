function fillJobDetails(title, subtitle, bodyText) {
    // Fill in the job details in the HTML
    document.getElementById('dashboardJobViewHeaderInfoTitle').textContent = title;
    document.getElementById('dashboardJobViewHeaderInfoSubtitle').textContent = subtitle;
    document.getElementById('dashboardJobViewBodyText').textContent = bodyText;
    document.getElementById("dashboardJobViewBtns").style.display = "flex"
}