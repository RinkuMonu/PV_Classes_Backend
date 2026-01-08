const {
  RtcTokenBuilder,
  RtcRole,
  RtmTokenBuilder,
  RtmRole,
} = require("agora-access-token");

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERT = process.env.AGORA_APP_CERTIFICATE;

const getRtcToken = ({ channelName, uid, role, expire = 3600 }) => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expire;

  const rtcRole =
    role === "teacher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  return RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERT,
    channelName,
    uid,
    rtcRole,
    exp
  );
};

const getRtmToken = ({ uid, expire = 3600 }) => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expire;

  return RtmTokenBuilder.buildToken(
    APP_ID,
    APP_CERT,
    uid.toString(),
    RtmRole.Rtm_User,
    exp
  );
};

module.exports = { getRtcToken, getRtmToken };
