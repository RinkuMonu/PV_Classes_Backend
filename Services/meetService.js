const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const KEYFILEPATH = path.join(__dirname, "../google-service-account.json");

async function createGoogleMeet(title, start, end) {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const calendar = google.calendar({ version: "v3", auth: await auth.getClient() });
  console.log("ASdfas = ",calendar);

  const event = {
    summary: title,
    start: { dateTime: start },
    end: { dateTime: end },
    conferenceData: {
      createRequest: {
        requestId: uuidv4(), // unique request ID every time
        conferenceSolutionKey: { type: "hangoutsMeet" }, // must be exactly this
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });
    return {
      link: response.data.hangoutLink,
      roomCode: response.data.conferenceData?.conferenceId || null,
    };
  } catch (err) {
    console.error("Google Meet creation error full:", err.response?.data || err);
    throw new Error("Failed to create Google Meet link");
  }
}

module.exports = { createGoogleMeet };