const users=[];

function userJoin(id, username){
    const user = {id, username};
    users.push(user);
    return user;
}

function toGetCurrUser(id){
    return users.find(user => user.id === id);
}

module.exports={
    userJoin,
    toGetCurrUser
};