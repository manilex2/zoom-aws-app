import { ZoomMtg } from "@zoomus/websdk";

const valores = window.location.search;
var urlParams = new URLSearchParams(valores);

const meetingID = urlParams.get('meetingId');
const nameParam = urlParams.get('name');
const emailParam = urlParams.get('email');
const API_KEY = urlParams.get('apiKey');
const pwd = urlParams.get('pwd');

var meetingConfig = {};

const getData = async function () {
    const data = await fetch(`/zoom-data/${API_KEY}/meetingId/${meetingID}/pwd/${pwd}/name/${nameParam}/email/${emailParam}`)
    .then((res) => {
        return res.json();
    })
    .then((json) => {
        return json;
    })
    .catch((err) => {
        console.error(err);
    });
    return meetingConfig = {
			sdkKey: data.sdkKey,
			meetingNumber: data.meetingNumber,
			userName: data.userName,
			passWord: data.password,
			leaveUrl: `/thanks?apiKey=${API_KEY}`,
			role: data.role,
			userEmail: data.email,
			lang: data.lang,
			signature: data.signature || "",
			china: data.china === "1",
		};
}

console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

// it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

async function init() {
  await getData();
  await beginJoin(meetingConfig.signature);
}

async function beginJoin(signature) {
  ZoomMtg.init({
    leaveUrl: meetingConfig.leaveUrl,
    disableCORP: !window.crossOriginIsolated, // default true
    // disablePreview: false, // default false
    success: function () {
      console.log("signature", signature);
      ZoomMtg.i18n.load(meetingConfig.lang);
      ZoomMtg.i18n.reload(meetingConfig.lang);
      ZoomMtg.join({
        meetingNumber: meetingConfig.meetingNumber,
        userName: meetingConfig.userName,
        signature: signature,
        sdkKey: meetingConfig.sdkKey,
        userEmail: meetingConfig.userEmail,
        passWord: meetingConfig.passWord,
        success: function (res) {
          console.log("join meeting success");
          console.log("get attendeelist");
          ZoomMtg.getAttendeeslist({});
          ZoomMtg.getCurrentUser({
            success: function (res) {
              console.log("success getCurrentUser", res.result.currentUser);
            },
          });
        },
        error: function (res) {
          console.log(res);
        },
      });
    },
    error: function (res) {
      console.log(res);
    },
  });

  ZoomMtg.inMeetingServiceListener('onUserJoin', function (data) {
    console.log('inMeetingServiceListener onUserJoin', data);
  });

  ZoomMtg.inMeetingServiceListener('onUserLeave', function (data) {
    console.log('inMeetingServiceListener onUserLeave', data);
  });

  ZoomMtg.inMeetingServiceListener('onUserIsInWaitingRoom', function (data) {
    console.log('inMeetingServiceListener onUserIsInWaitingRoom', data);
  });

  ZoomMtg.inMeetingServiceListener('onMeetingStatus', function (data) {
    console.log('inMeetingServiceListener onMeetingStatus', data);
  });
  
}

init();