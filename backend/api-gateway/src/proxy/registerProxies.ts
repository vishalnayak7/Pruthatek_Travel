// import { Express, Request } from "express";
// import { createProxyMiddleware } from "http-proxy-middleware";
// import { ClientRequest } from "http";
// import { SERVICES } from "../config/services.js";

// export function registerProxies(app: Express): void {
//   Object.entries(SERVICES).forEach(([service, target]) => {
//     if (!target) {
//       console.warn(`Service ${service} has no target URL`);
//       return;
//     }

//     console.log(`Proxy registered: /api/v1/${service} → ${target}`);

//     const proxyOptions: any = {
//       target,
//       changeOrigin: true,
//       logLevel: "debug",

//       // Remove internal secret from gateway
//       // Internal headers should only be added in service-to-service calls

//       pathRewrite: (path: string) =>
//         `/api/v1/${service}${path.replace(`/api/v1/${service}`, "")}`,

//       onProxyReq(proxyReq: ClientRequest, req: Request) {
//         if (req.body && ["POST", "PUT", "PATCH"].includes(req.method)) {
//           const bodyData = JSON.stringify(req.body);
//           proxyReq.setHeader("Content-Type", "application/json");
//           proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
//           proxyReq.write(bodyData);
//         }
//       },
//     };

//     app.use(`/api/v1/${service}`, createProxyMiddleware(proxyOptions));
//   });
// }
import { Express, Request } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { ClientRequest } from "http";
import { SERVICES } from "../config/services.js";
import { authenticate } from "../middlewares/authenticate.js";

const protectedServices = ["profile", "wishlist", "booking"];

export function registerProxies(app: Express): void {
  Object.entries(SERVICES).forEach(([service, target]) => {
    if (!target) {
      console.warn(`Service ${service} has no target URL`);
      return;
    }

    console.log(`Proxy registered: /api/v1/${service} → ${target}`);

    const middlewares: any[] = [];

    // 🔐 Apply auth only to protected services
    if (protectedServices.includes(service)) {
      middlewares.push(authenticate);
    }

    middlewares.push(
      createProxyMiddleware({
        target,
        changeOrigin: true,

        // Modern logging
        logger: console,

        pathRewrite: (path: string) =>
          `/api/v1/${service}${path.replace(`/api/v1/${service}`, "")}`,

        //  NEW SYNTAX (IMPORTANT)
        on: {
          proxyReq: (proxyReq: ClientRequest, req: Request) => {
            // ✅ Forward body
            if (req.body && ["POST", "PUT", "PATCH"].includes(req.method)) {
              const bodyData = JSON.stringify(req.body);
              proxyReq.setHeader("Content-Type", "application/json");
              proxyReq.setHeader(
                "Content-Length",
                Buffer.byteLength(bodyData)
              );
              proxyReq.write(bodyData);
            }

            // ✅ Forward user info
            if (req.headers["x-user-id"]) {
              proxyReq.setHeader(
                "x-user-id",
                req.headers["x-user-id"] as string
              );
            }
          },
        },
      })
    );

    app.use(`/api/v1/${service}`, ...middlewares);
  });
}