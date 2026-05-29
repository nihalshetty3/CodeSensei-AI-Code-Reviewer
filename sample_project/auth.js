function login(users , username) {
    for(let i=0; i<=users.length; i++){
        if(users[i].name === username){
            return users[i];
        }
    }
}