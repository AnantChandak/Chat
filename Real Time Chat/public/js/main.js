const socket = io();    //Which we have access to io because of the script tag that we added in chat.html
const chatMessages = document.querySelector('.chat-messages');

const {username} = Qs.parse(location.search,{
    ignoreQueryPrefix : true
});

socket.emit('join', {username});    //Emitting the username that we received from QS that we will catch on serverside

socket.on("message", message=>{

    //Function to print the message that user enters or the message from the server.
    outputmsg(message);

    //Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
});//To catch the message that is emitted from the server-side.

const chatForm = document.getElementById('chat-form');  //Selecting the message written by the user.
//Message submit
chatForm.addEventListener("submit", (e)=>{
    e.preventDefault(); //It will prevent the default behaviour
    //Now we want the value the client has written
    const msg = e.target.elements.msg.value;    //Will get the text msg from the text input of the chat-form

    //Emit message to server
    socket.emit('chatMessage', msg);

    //After send clearing the msg
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})

function outputmsg (message){
    const div = document.createElement('div');//Creating a div(message) every time the user enters the msg and append that div in chat-message div.
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


