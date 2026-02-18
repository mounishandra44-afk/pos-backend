import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5,
  message: "You can do maximum of 5 login requests in a minute"
})