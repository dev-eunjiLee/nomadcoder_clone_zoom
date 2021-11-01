const socket = io(); // 알아서 socket.io를 실행하고 있는 서버를 찾는다.

const welcome = document.getElementById("welcome");
const form = welcome.querySelector('form');
const room = document.getElementById("room");

// * 처음에는 html에서 ROOM 부분은 안보여주기
room.hidden = true;

let roomName;

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName}`
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

// websocket으로 구현한 내용
// const messageList = document.querySelector("ul");
// const messageForm = document.querySelector("#message");
// const nickForm = document.querySelector("#nick");
// const userNickname = document.querySelector("#userNickname")
//
// const socket = new WebSocket(`ws://${window.location.host}`);
//
// function makeMessage(type, payload){
//   const msg = {type, payload}
//   return JSON.stringify(msg)
// }
//
// function handleOpen() {
//   console.log("Connected To Server 🐱‍🏍");
// }
//
// // * socket이 connection을 open 했을 때 발생
// socket.addEventListener("open", handleOpen);
//
// socket.addEventListener("message", (message) => {
//
//
//   /** 은지 셀프 작업 10/18
//    const li = document.createElement('li');
//
//    const {type, payload} = JSON.parse(message.data);
//
//   if(type === "new_message"){
//     li.innerText = payload;
//     messageList.append(li)
//   } else if(type === "nickname"){
//     userNickname.innerHTML = payload
//   }
//    */
//
//   const li = document.createElement('li');
//   li.innerText = message.data;
//   messageList.append(li)
// });
//
// // * 서버와 연결이 끊겼을 때 출력
// socket.addEventListener("close", () => {
//   console.log("Discoonected from Server XX");
// });
//
// // * 일정 시간(여기서는 10초)이 지난 후(setTimeout) 백엔드로 메세지 보내기
// // setTimeout(()=>{
// //     socket.send("hello from the browser!")
// // }, 10000)
//
// function handleSubmit(event) {
//   // * sunmit 일시 정지
//   event.preventDefault();
//
//   // * input 태그의 내용물 가져오기
//   const input = messageForm.querySelector("input");
//
//   // * input 태그에 입력된 내용을 백엔드로 전달
//   socket.send(makeMessage("new_message", input.value));
//
//   const li = document.createElement('li');
//   li.innerText = `You: ${input.value}`;
//   messageList.append(li)
//
//   // * input 태그에 입력한 내용 지우기
//   input.value = "";
// }
//
// function handleNickSubmit(event){
//   event.preventDefault();
//   const input = nickForm.querySelector("input");
//   // socket.send(input.value);
//   // * 원래는 위와 같은 형태였으나, message와의 구분을 위해 json 형태로 전송
//   socket.send(makeMessage("nickname", input.value))
//   input.value = "";
//
// }
//
// messageForm.addEventListener("submit", handleSubmit);
// nickForm.addEventListener("submit", handleNickSubmit);
