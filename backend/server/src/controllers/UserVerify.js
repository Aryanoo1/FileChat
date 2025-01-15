import bcryptjs from "bcryptjs";
import UserModel from "../../models/UserModel.js";

async function UserVerify(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    let user = await UserModel.findOne({ email });

    if (user) {
      const isPasswordCorrect = await bcryptjs.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User verified successfully.",
        data: user,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User does not exist.",
      });
    }
  } catch (error) {
    console.error("Error in userVerify:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      details: error.message,
    });
  }
}

export default UserVerify;
