import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";

export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;

  const rateLimitKey = `otp:ratelimit:${email}`;

  const ratelimit = await redisClient.get(rateLimitKey);

  if (ratelimit) {
    res.status(429).json({
      message: "Too many Request,Please Wait before requesting new Otp",
    });
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, otp, {
    EX: 300,
  });

  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });

  const message = {
    to: email,
    subject: "Your otp code",
    body: `Your OTP is ${otp}.It is Valid for 5 Minutes`,
  };

  await publishToQueue("send-otp", message);

  res.status(200).json({
    message: "Otp send to Your mail",
  });
});
