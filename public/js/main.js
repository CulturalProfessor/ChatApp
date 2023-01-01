const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');

//Get Username and room for url
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

console.log(username,room);

const socket=io();

//Join chatroom
socket.emit('joinroom',{
    username,room
});

//Get room users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

//Message from server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    //Scroll Down
    chatMessages.scrollTop=chatMessages.scrollHeight;
})

//Message Submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //Get message text
    const msg=e.target.elements.msg.value
    console.log(msg);
    //Emitting message to server
    socket.emit('chatMessage',msg)
    //Clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});

//Output Message to Dom
function outputMessage(message){
    const div=document.createElement('div')
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName(room){
    roomName.innerText=room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }