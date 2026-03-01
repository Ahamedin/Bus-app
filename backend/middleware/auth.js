import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { clerkClient } from "@clerk/clerk-sdk-node";

// 🔐 Verify login
export const requireAuth = ClerkExpressRequireAuth();

// 🔐 Verify admin role
export const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const user = await clerkClient.users.getUser(userId);

    if (!user.publicMetadata.isAdmin) {
      return res.status(403).json({ message: "Admin only" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Authorization failed" });
  }
};