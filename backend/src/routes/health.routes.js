import { Router } from "express";

export const healthRouter = Router();

function getHealthStatus() {
  return {
    status: "healthy",
    service: "revio-backend-api",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: "0.1.0",
  };
}

healthRouter.get("/health", (req, res) => {
  res.status(200).json(getHealthStatus());
});

healthRouter.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: getHealthStatus(),
  });
});
