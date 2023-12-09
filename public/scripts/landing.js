const FAQElem = document.getElementById("FAQ")

let FAQObj = [
    {
        question:"How do I get started as a freelancer on this platform?",
        answer:"Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah "
    },
    {
        question:"How can I post a job or project on this freelancing platform?",
        answer:"Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah "
    },
    {
        question:"How can I ensure the quality and reliability of freelancers on this platform?",
        answer:"Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah "
    },
    {
        question:"How can I negotiate and set my rates with clients?",
        answer:"Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah "
    },
    {
        question:"What measures are in place to protect against fraudulent activities or disputes on this freelancing platform?",
        answer:"Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah "
    },
    {
        question:"How can I negotiate and set my rates with clients?",
        answer:"Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah "
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