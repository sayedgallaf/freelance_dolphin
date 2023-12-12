const selectedSkills = [];
let pageNumber = 1;
let resetListings = false;
const applyFilterBtn = document.getElementById("applyFilterBtn")
const searchBtn = document.getElementById("searchBtn")
const loadMoreBtn = document.getElementById("loadMoreBtn")

let keyword = "";
let sortBy = "newest";
let totalQuotesMin = "";
let totalQuotesMax = "";

applyFilterBtn.onclick = () => {
    sortBy = document.getElementById('sortBy').value;
    totalQuotesMin = document.getElementById('quotesFilterMin').value;
    totalQuotesMax = document.getElementById('quotesFilterMax').value;
    pageNumber = 1;
    resetListings = true
    searchJobs();
}
searchBtn.onclick = () => {
    keyword = document.getElementById("jobSearch").value;
    resetListings = true
    pageNumber = 1;
    searchJobs();
}
loadMoreBtn.onclick = () => {
    pageNumber++;
    searchJobs();
}
async function searchJobs() {
    try {

        const filterOptions = {
            skills: selectedSkills,
            totalQuotesMin: totalQuotesMin !== '' ? parseInt(totalQuotesMin) : undefined,
            totalQuotesMax: totalQuotesMax !== '' ? parseInt(totalQuotesMax) : undefined,
            sortBy: sortBy
        };
        
        const requestBody = {
            keyword: keyword,
            filterOptions: filterOptions,
            pageNumber: pageNumber
        };
        console.log(requestBody)
        const response = await fetch('/searchJobs', {
            method: 'POST', // Assuming you're using POST method in your backend
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const {jobs} = await response.json();
        if(resetListings){
            while(jobList.lastElementChild){
                jobList.lastElementChild.remove()
            }
        }
        for(let a =0; a < jobs.length; a++){
            console.log(jobs[a])
            const {JobID, UserID, Title, Description, Timestamp, FullName, ProfilePicURL, totalQuotes} = jobs[a]
            createJobListing(Title,Timestamp.split("T")[0].replace(/20/, ''),Description,ProfilePicURL ? ProfilePicURL : "assets/pfp.png",FullName, totalQuotes)
        }
        jobList.appendChild(loadMoreBtn)
        resetListings = false;

    } catch (error) {
        console.error('Error searching and filtering jobs:', error);
    }
}

searchJobs()