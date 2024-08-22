import jwt from 'jsonwebtoken';
import { getDbConnection } from '../db';

export const refreshTokenRoute = {
  path: "/api/refresh-token",
  method: "post",
  handler: async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    // You might want to verify the refresh token in a more secure manner
    // This example assumes a simplified check

    try {
      // Verify the refresh token (assuming it was stored in the database)
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      const db = getDbConnection("react-auth-db");
      const user = await db.collection("users").findOne({ _id: decoded.id });

      if (!user) return res.status(401).json({ message: "Invalid refresh token" });

      // Generate a new access token
      const newToken = jwt.sign(
        { id: user._id, isVerified: user.isVerified, email: user.email, info: user.info },
        process.env.JWT_SECRET,
        { expiresIn: "2m" } // Access token expiration
      );

      res.status(200).json({ message: "Token refreshed", token: newToken });
    } catch (err) {
      res.status(403).json({ message: "Invalid or expired refresh token" });
    }
  },
};
