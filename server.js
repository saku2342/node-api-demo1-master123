const app = require("./src/app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

dotenv.config(); // load .env if available



async function getDbUri() {
  if (process.env.MONGO_URI) {
    // local dev
    return process.env.MONGO_URI;
  } else {
    // production (App Runner)
    const client = new SecretsManagerClient({ region: "ap-south-1" });
    const command = new GetSecretValueCommand({ SecretId: "mongoDbSecret" });
    const response = await client.send(command);
    return JSON.parse(response.SecretString).MONGO_URI;
  }
}

(async () => {  
  try {
    const mongoUri = await getDbUri();
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server", err);
  }
})();
