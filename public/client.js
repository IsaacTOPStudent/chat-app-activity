const socket = io()

const form = document.querySelector('.form-chat');
const input = document.querySelector('.input-form-chat');
const messages = document.querySelector('.messages');

const username = prompt('Introduce your name: ');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if(input.value && username) {
        addMessage(input.value, 'my-message', 'you');

        socket.emit('chat message', {
            text: input.value,
            name: username
        });
        
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    addMessage(msg.text, 'other-message', msg.name);
})

function addMessage(msg, type, name){
    const item = document.createElement('li');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = name;
    nameSpan.className = 'message-name';

    const textSpan = document.createElement('span');
    textSpan.textContent = msg;
    textSpan.className = 'message-text';

    item.appendChild(nameSpan);
    item.appendChild(textSpan);

    item.classList.add(type);
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}