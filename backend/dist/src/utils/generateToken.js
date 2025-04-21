import jwt from 'jsonwebtoken';
const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d"
    });
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milisecond
        httpOnly: true, //prevent XSS cross-site scripting attacks
        sameSite: "strict", // CSRF attack cross-site request forgery protection
        secure: process.env.NODE_ENV !== "development", // Set to true if using HTTPS
    });
    return token;
};
export default generateToken;
