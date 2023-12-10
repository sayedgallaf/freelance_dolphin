//this script exists to make changes to pages if the user is logged in
if(window.pageData.authData){
    const user = window.pageData.authData
    const topHeaderLogin = document.getElementById("topHeaderLogin")

    if(topHeaderLogin){
        topHeaderLogin.innerHTML = user.FullName
        topHeaderLogin.onclick = () => {
            
        }
    }
}