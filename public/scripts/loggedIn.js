//this script exists to make changes to pages if the user is logged in
if(window.pageData.authData){
    if(window.pageData.authData.UserType == "admin"){
        allDialogs["profileSettings"] = allDialogs["profileSettings3"]
    }
}else{
    allDialogs.quote = allDialogs.login
    allDialogs["reportJob"] = allDialogs.login
    allDialogs["reportUser"] = allDialogs.login

    

}