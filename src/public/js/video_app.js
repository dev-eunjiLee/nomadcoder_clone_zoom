const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");

// * 컴퓨터 미디어 객체
let myStream;

// * mute, camera에 대한 디폴트 값
let muted = false;
let cameraOff = false;

async function getMedia(){
    try {
        // * 현재 연결된 미디어 입력장치에 접근할 수 있는 MediaDevices 객체를 반환
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: false, // * 집 컴퓨터에서 소리가 울려서 임시로 꺼둠
            video: true
        })
        myFace.srcObject = myStream;
    } catch(e){
        console.log(e);
    }
}


getMedia();

function handleMuteClick() {
    if(!muted){
        // * 만약 음소거가 되어있지 않은 상태인데 해당 버튼을 누른 경우 => 음소거 처리 필요
        muteBtn.innerText = "UnMute";
        muted = true;
    } else {
        // * 만약 음소거 상태인데, 해당 버튼을 누른 경우 => 음소거 풀어야 한다.
        muteBtn.innerText = "Mute";
        muted = false;
    }
}
function handlCameraClick() {
    if(cameraOff){
        cameraBtn.innerText = "Turn Camera Off"
        cameraOff = false
    } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true
    }
}


muteBtn.addEventListener("click", handleMuteClick)
cameraBtn.addEventListener("click", handlCameraClick)
