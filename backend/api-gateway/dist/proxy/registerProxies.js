// import { Express, Request } from "express";
// import { createProxyMiddleware } from "http-proxy-middleware";
// import { ClientRequest } from "http";
// import { SERVICES } from "../config/services.js";
import { createProxyMiddleware } from "http-proxy-middleware";
import { SERVICES } from "../config/services.js";
import { authenticate } from "../middlewares/authenticate.js";
const protectedServices = ["profile", "wishlist", "booking"];
export function registerProxies(app) {
    Object.entries(SERVICES).forEach(([service, target]) => {
        if (!target) {
            console.warn(`Service ${service} has no target URL`);
            return;
        }
        console.log(`Proxy registered: /api/v1/${service} → ${target}`);
        const middlewares = [];
        // 🔐 Apply auth only to protected services
        if (protectedServices.includes(service)) {
            middlewares.push(authenticate);
        }
        middlewares.push(createProxyMiddleware({
            target,
            changeOrigin: true,
            // Modern logging
            logger: console,
            pathRewrite: (path) => `/api/v1/${service}${path.replace(`/api/v1/${service}`, "")}`,
            //  NEW SYNTAX (IMPORTANT)
            on: {
                proxyReq: (proxyReq, req) => {
                    // ✅ Forward body
                    if (req.body && ["POST", "PUT", "PATCH"].includes(req.method)) {
                        const bodyData = JSON.stringify(req.body);
                        proxyReq.setHeader("Content-Type", "application/json");
                        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
                        proxyReq.write(bodyData);
                    }
                    // ✅ Forward user info
                    if (req.headers["x-user-id"]) {
                        proxyReq.setHeader("x-user-id", req.headers["x-user-id"]);
                    }
                },
            },
        }));
        app.use(`/api/v1/${service}`, ...middlewares);
    });
}
//# sourceMappingURL=registerProxies.js.map