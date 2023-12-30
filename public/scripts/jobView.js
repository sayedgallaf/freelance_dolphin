function fillJobDetails(title, subtitle, bodyText, totalQuotes, skills) {
    // Fill in the job details in the HTML
    document.getElementById('jobViewHeaderInfoTitle').textContent = title;
    document.getElementById('jobViewHeaderInfoSubtitle').textContent = subtitle;
    document.getElementById('jobViewBodyText').textContent = bodyText;
    document.getElementById('totalQuotes').textContent = totalQuotes + " Quotes Submitted";
}