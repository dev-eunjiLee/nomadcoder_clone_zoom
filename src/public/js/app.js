const socket = new WebSocket(`ws://${window.location.host}`);

// * socket이 connection을 open 했을 때 발생
socket.addEventListener("open", ()=>{console.log("Connected To Browser 🐱‍🏍")})
