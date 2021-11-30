const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras")

// * 컴퓨터 미디어 객체
let myStream;

// * mute, camera에 대한 디폴트 값
let muted = false;
let cameraOff = false;

async function getCameras(){
    try {
        const devices = await navigator.mediaDevices.enumerateDevices(); // * 유저의 장치를 얻는다.
        const cameras = devices.filter((device) =>
            device.kind === "videoinput" // * 해당 디바이스 카메라인 경우만을 모아서 새로운 배열 생성
        );
        const currentCamera = myStream.getVideoTracks()[0];
        // * 나는 카메라가 1개 밖에 없어서 임의의 값을 하나 추가했다.
        const option = document.createElement("option");
        option.value = "dummyDeviceId";
        option.innerText = "dummyCameraLabel"
        camerasSelect.appendChild(option);

        // * 실제 카메라 목록 출력
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label
            if(currentCamera.label === camera.label){
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        })

    } catch (e){
        console.log(e)
    }
}

async function getMedia(deviceId){
    const initialConstraints = {
        audio: true,
        video: {facingMode: "user"} // * 전면 카메라
    }
    const cameraConstraints = {
        audio: true,
        video: {deviceId: {exact: deviceId}}
    }
    try {
        // * 현재 연결된 미디어 입력장치에 접근할 수 있는 MediaDevices 객체를 반환
        // * deviceId가 있는 경우 특정 ID값으로 셋팅해서 getUserMedia던짐
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId? cameraConstraints : initialConstraints
        )
        myFace.srcObject = myStream;
        if(!deviceId){ await getCameras();}
    } catch(e){
        console.log(e);
    }
}



function handleMuteClick() {
    myStream.getAudioTracks().forEach((track) => {
        // * enabled가 true였으면 false, false였으면 true가 된다.
        track.enabled = !track.enabled;
    })
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
    console.log('handleCameraChange: ', handleCameraChange)
    myStream.getVideoTracks().forEach((track) => {
        // * enabled가 true였으면 false, false였으면 true가 된다.
        track.enabled = !track.enabled;
    })
    if(cameraOff){
        cameraBtn.innerText = "Turn Camera Off"
        cameraOff = false
    } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true
    }
}

async function handleCameraChange(){
    console.log(camerasSelect.value);
    // * getMedia를 한 번 더 호출해 STREAM을 변경해준다.(카메라 변경을 위해)
    await getMedia(camerasSelect.value);
}

getMedia();
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handlCameraClick);
camerasSelect.addEventListener('input', handleCameraChange);
