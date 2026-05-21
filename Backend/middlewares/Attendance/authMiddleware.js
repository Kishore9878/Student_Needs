import jwt from "jsonwebtoken";
import User from "../../models/Attendance/User.js";
import ReferralStudent from "../../models/Referrals/StudentModel.js";


// ✅ PROTECT ROUTES MIDDLEWARE
const protect = async (req, res, next) => {
  let token;

  try {

    // CHECK AUTH HEADER
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      // GET TOKEN
      token = req.headers.authorization.split(" ")[1];

      // VERIFY TOKEN
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // GET ATTENDANCE USER WITHOUT PASSWORD
      const attendanceUser = await User.findById(decoded.id).select("-password");

      if (attendanceUser) {
        req.user = attendanceUser;
        return next();
      }

      if (decoded.accountType) {
        const referralStudent = await ReferralStudent.findById(decoded.id).select("-password");

        if (referralStudent) {
          req.user = {
            _id: referralStudent._id,
            id: referralStudent._id,
            name: `${referralStudent.firstName || ""} ${referralStudent.lastName || ""}`.trim(),
            email: referralStudent.email,
            role: referralStudent.accountType?.toLowerCase(),
            accountType: referralStudent.accountType,
            authSource: "referrals",
          };
          return next();
        }
      }

      return res.status(401).json({
        message: "User not found",
      });

    } else {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

  } catch (error) {
    return res.status(401).json({
      message: "Token failed",
    });
  }
};

export default protect;
