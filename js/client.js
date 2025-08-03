const socket = io("http://localhost:8000");

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.getElementById('container');

const welcomeScreen = document.getElementById('welcome-screen');
const joinBtn = document.getElementById('joinBtn');
const usernameInput = document.getElementById('usernameInput');

var audio = new Audio('1_second_tone.mp3');

// 👇 Join button click event
joinBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (name !== "") {
        welcomeScreen.style.display = "none";
        form.style.display = "flex";
        messageContainer.style.display = "block";
        socket.emit('new-user-joined', name);
    }
});

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'left');
});
