const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config(); // load .env if available

let cachedSecrets = null;

async function getAwsConfig() {
    try {
        // Fetch from Secrets Manager if not already cached
        if (!cachedSecrets) {
            const sm = new AWS.SecretsManager({ region: process.env.AWS_REGION || "ap-south-1" });
            const secretId = process.env.AWS_SECRET_NAME || "s3bucket-secret";

            const secretData = await sm.getSecretValue({ SecretId: secretId }).promise();
            cachedSecrets = JSON.parse(secretData.SecretString);

            console.log("Fetched S3 secrets from Secrets Manager:", cachedSecrets);
        }

        return {
            accessKeyId: cachedSecrets.AWS_ACCESS_KEY_ID,
            secretAccessKey: cachedSecrets.AWS_SECRET_ACCESS_KEY,
            region: cachedSecrets.AWS_REGION,
            bucketName: cachedSecrets.AWS_BUCKET_NAME,
        };
    } catch (err) {
        console.warn("Secrets Manager not available, falling back to .env", err);

        // Fallback to .env
        return {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
            bucketName: process.env.AWS_BUCKET_NAME,
        };
    }
}

async function getS3() {
    const config = await getAwsConfig();

    // Check if config is valid
    if (!config.accessKeyId || !config.secretAccessKey || !config.bucketName) {
        throw new Error("S3 configuration is missing. Check SecretsManager or .env");
    }

    return new AWS.S3({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        region: config.region,
    });
}

module.exports = { getS3, getAwsConfig };
