// import { Express, Request } from "express";
// import { createProxyMiddleware, Options } from "http-proxy-middleware";
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
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { ClientRequest } from "http";
import { SERVICES } from "../config/services.js";

export function registerProxies(app: Express): void {
  Object.entries(SERVICES).forEach(([service, target]) => {
    if (!target) {
      console.warn(`Service ${service} has no target URL`);
      return;
    }

    console.log(`Proxy registered: /api/v1/${service} → ${target}`);

    const proxyOptions: any = {
      target,
      changeOrigin: true,
      logLevel: "debug",
        headers: {
        "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET!,
      },

      pathRewrite: (path: string) =>
        `/api/v1/${service}${path.replace(`/api/v1/${service}`, "")}`,
      onProxyReq(proxyReq: ClientRequest, req: Request) {
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
