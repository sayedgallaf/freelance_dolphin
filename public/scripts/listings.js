const selectedSkills = [];
let pageNumber = 1;
let resetListings = true;
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

window.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        searchBtn.click()
    }
})
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
        if(jobs.length < 5){
            loadMoreBtn.style.display = "none"
        }else{
            loadMoreBtn.style.display = "block"
        }
        for(let a =0; a < jobs.length; a++){
            const {JobID, UserID, Title, Description, Timestamp, FullName, ProfilePicURL, totalQuotes} = jobs[a]
            createJobListing(JobID,UserID,Title,Timestamp,Description,ProfilePicURL ? ProfilePicURL : "assets/pfp.png",FullName, totalQuotes, null)
        }
        jobList.appendChild(loadMoreBtn)
        jobList.firstElementChild.click()

        resetListings = false;

    } catch (error) {
        console.error('Error searching and filtering jobs:', error);
    }
}

async function getAllSkills() {
    try {
        const response = await fetch('/getAllSkills', {method: 'POST'}); // Replace '/getAllSkills' with your backend endpoint
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const { skills } = await response.json();
        const skillsDiv = document.getElementById('skillsDiv');
        
        // Clear any existing buttons
        while (skillsDiv.lastElementChild) {
            skillsDiv.lastElementChild.remove();
        }
        
        // Append skill buttons
        skills.forEach(skill => {
            const skillButton = document.createElement('button');
            skillButton.classList.add('skill', 'lightBorder');
            skillButton.textContent = skill.SkillName;
            skillButton.addEventListener('click', () => {
                skillButton.classList.toggle('selected');
                const skillIndex = selectedSkills.indexOf(skill.SkillID);
                if (skillIndex === -1) {
                    selectedSkills.push(skill.SkillID); // Add to selectedSkills array if not present
                } else {
                    selectedSkills.splice(skillIndex, 1); // Remove from selectedSkills array if already present
                }
            });
            skillsDiv.appendChild(skillButton);
        });
    } catch (error) {
        console.error('Error fetching skills:', error);
    }
}
getAllSkills()

searchJobs()