import axios from "axios";
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const token = authHeader.split(" ")[1];
        // 🔥 Call auth-service
        const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/api/v1/auth/validate-token`, { token });
        req.headers["x-user-id"] = response.data.data.userId;
        next();
    }
    catch (err) {
        res.status(401).json({
            message: "Invalid or expired token.",
        });
    }
};
//# sourceMappingURL=authenticate.js.map