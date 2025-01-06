const UserM = require("../model/UseModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  console.log("Cookies:", req.cookies); 
  const token = req.cookies.token
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      console.log("middleware:", data);

      const user = await UserM.findById(data.id);

      if (user) return res.json({ status: true, user: user.username })
      else return res.json({ status: false })
    }
  })
}