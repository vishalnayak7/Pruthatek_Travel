// import { Express, Request } from "express";
// import { createProxyMiddleware, Options } from "http-proxy-middleware";
// import { ClientRequest } from "http";
// import { SERVICES } from "../config/services.js";
import { createProxyMiddleware } from "http-proxy-middleware";
import { SERVICES } from "../config/services.js";
export function registerProxies(app) {
    Object.entries(SERVICES).forEach(([service, target]) => {
        if (!target) {
            console.warn(`Service ${service} has no target URL`);
            return;
        }
        console.log(`Proxy registered: /api/v1/${service} → ${target}`);
        const proxyOptions = {
            target,
            changeOrigin: true,
            logLevel: "debug",
            headers: {
                "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET,
            },
            pathRewrite: (path) => `/api/v1/${service}${path.replace(`/api/v1/${service}`, "")}`,
            onProxyReq(proxyReq, req) {
                if (req.body && ["POST", "PUT", "PATCH"].includes(req.method)) {
                    const bodyData = JSON.stringify(req.body);
                    proxyReq.setHeader("Content-Type", "application/json");
                    proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
                    proxyReq.write(bodyData);
                }
            },
        };
        app.use(`/api/v1/${service}`, createProxyMiddleware(proxyOptions));
    });
}
//# sourceMappingURL=registerProxies.js.map