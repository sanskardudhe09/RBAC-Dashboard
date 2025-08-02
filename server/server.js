const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/data");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(cors());
app.use(express.json());

console.log("✅ Mock data server is ready");
console.log("📋 Available users:");
console.log("   - admin@site.com / admin123 (admin)");
console.log("   - editor@site.com / editor123 (editor)");
console.log("   - viewer@site.com / viewer123 (viewer)");

// Routes
app.use("/api", authRoutes);
app.use("/api", dataRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running with mock data" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 