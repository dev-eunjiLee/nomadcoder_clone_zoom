const socket = io(); // 알아서 socket.io를 실행하고 있는 서버를 찾는다.

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

// * 처음에는 html에서 ROOM 부분은 안보여주기
room.hidden = true;

let roomName;

// * 메세지 출력 추가
function addMessage(message){
    console.log('addMessage: ', message)

    const ul = room.querySelector('ul');
    const li = document.createElement('li');

    li.innerText = message;
    ul.appendChild(li)
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input"); // * msg 폼 안에 있는 input을 가져온다.
    const value = input.value
    // * 백엔드로 new_message 이벤트를 보낸 후, 백에서는 addMessage 이벤트를 실행시킨다.
    socket.emit('new_message', input.value, roomName, ()=>{
        addMessage(`You: ${value}`)
    })
    input.value = "";
}

function handleNicknameSubmit(event){
    event.preventDefault();

    const input = room.querySelector('#name input'); // * name 폼 안에 있는 input을 가져온다.

    socket.emit('nickname', input.value)
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName}`

    const msgForm = room.querySelector('#msg');
    const nameForm = room.querySelector('#name');
    msgForm.addEventListener('submit', handleMessageSubmit);
    nameForm.addEventListener('submit',handleNicknameSubmit);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    // * 웹소켓은 string만 보낼 수 있지만 socketio는 객체도 전달 가능
    // * socket.emit(이벤트명, 보낼 객체, 콜백함수(서버에서 호출하면 프론트에서 실행))
    socket.emit('enter_room', input.value, showRoom)
    roomName = input.value;
    input.value = "" // 입력값 초기화
}

form.addEventListener("submit", handleRoomSubmit);

// * 새로운 사람이 채팅창에 입장했을 때, 서버에서 방출된 이벤트 잡아서 처리
socket.on('welcome', (user)=>{
    addMessage(`${user} JOINED!`);
})

// * 누군가가 방을 나갈 때,
socket.on('bye', (left) => {
    addMessage(`${left} exit`);
})

// * 누군가 새 메세지를 보냈을 때,
socket.on('new_message', (msg) => {
    addMessage(`${msg}`)
})

// * 새로운 public room 이 생겼다는 안내 메세지
socket.on('room_change', console.log) //* === socket.on('room_change', msg => {console.log()})