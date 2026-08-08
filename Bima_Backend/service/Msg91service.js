const axios = require("axios");

const verifyAccessToken = async (accessToken) => {
  console.log("Verifying access token:", accessToken);
  const { data } = await axios.post(
    "https://control.msg91.com/api/v5/widget/verifyAccessToken",
    {
      authkey: process.env.MSG91_AUTH_KEY,
      "access-token": accessToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  return data;
};

module.exports = {
  verifyAccessToken
};