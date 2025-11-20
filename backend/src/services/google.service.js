const { google } = require("googleapis");

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

exports.getGoogleLoginURL = () => {
  const oauth2Client = getOAuthClient();

  const scopes = [
    "profile",
    "email"
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes
  });
};

exports.getGoogleUser = async (code) => {
  const oauth2Client = getOAuthClient();

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });

  const { data } = await oauth2.userinfo.get();

  return {
    name: data.name,
    email: data.email,
    picture: data.picture,
    verified: data.verified_email
  };
};
