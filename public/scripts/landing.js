const FAQElem = document.getElementById("FAQ")

let FAQObj = [
    {
        question:"Who can use Freelance Dolphin?",
        answer:"Freelance Dolphin is available for both employers and freelancers in Bahrain. Employers can post jobs, while freelancers can submit quotes for these jobs."
    },
    {
        question:"How does the job posting process work for employers?",
        answer:"Employers can post job listings on the platform without specifying the price. Once posted, freelancers can submit quotes for the job. Employers then review these quotes in their discussion board and choose to express interest or disinterest in each quote."
    },
    {
        question:"Is there a cost associated with submitting quotes for jobs?",
        answer:"Yes, freelancers incur a nominal fee of 100 fils (0.1 BHD) for each quote they submit on a job."
    },
    {
        question:"When and how can reviews be posted?",
        answer:"Reviews can only be created after the job is completed. Both employers and freelancers can post their reviews in the discussion board of the specific job."
    },
    {
        question:"How are disputes managed on Freelance Dolphin?",
        answer:"Disputes are handled by our platform administrators and may take up to 24 hours to be resolved. We aim to ensure fair and just resolutions for both parties involved."
    },
    {
        question:"What payment gateway is used for transactions?",
        answer:"Payments on Freelance Dolphin are facilitated through the BenefitPay gateway, ensuring secure and efficient transactions."
    }
]

const setupFAQ = () => {
    const answers = []
    for(let a =0; a < FAQObj.length; a++){

        const FAQ = document.createElement("div");
        FAQ.classList.add("FAQ")
        FAQ.classList.add("lightBorder")

        const question = document.createElement("span");
        question.classList.add("question")
        question.innerHTML = FAQObj[a].question

        const answer = document.createElement("span");
        answer.classList.add("answer")
        answer.innerHTML = FAQObj[a].answer


        FAQ.appendChild(question)
        FAQ.appendChild(answer)
        answers.push(answer)
        console.log(FAQ)
        FAQ.onclick = () => {
            for(let b = 0; b < answers.length; b++){
                answers[b].style.display = "none";
            }
            answer.style.display = "block";
        }

        FAQElem.appendChild(FAQ)
    }
}

setupFAQ()


const createJob = () => {
    if(window.pageData.authData){
        if(window.pageData.authData.UserType == "employer"){
            location.href = "/dashboard/jobs?createJob"
        }else{
            location.href = "/listings"
        }
    }else{
        generateDialog("login")
    }
}