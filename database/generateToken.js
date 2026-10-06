import jwt from "jsonwebtoken";

const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
    

    return res
        .status(200)
        .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        })
        .json({
           success: true,
            message,
            user,
  });
};

export default generateToken;
