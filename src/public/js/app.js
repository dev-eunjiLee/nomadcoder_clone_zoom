const socket = new WebSocket(`ws://${window.location.host}`);

// * socket이 connection을 open 했을 때 발생
socket.addEventListener("open", ()=>{console.log("Connected To Server 🐱‍🏍")})

socket.addEventListener("message", (message) => {
    console.log('New Message: ', message.data)
})

// * 서버와 연결이 끊겼을 때 출력
socket.addEventListener("close", () => {
    console.log('Discoonected from Server XX')
})

// * 일정 시간(여기서는 10초)이 지난 후(setTimeout) 백엔드로 메세지 보내기
setTimeout(()=>{
    socket.send("hello from the browser!")
}, 10000)