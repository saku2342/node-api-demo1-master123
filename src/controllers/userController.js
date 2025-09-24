const User = require("../models/userModel");
const { getS3, getAwsConfig } = require("../config/s3");
const { v4: uuidv4 } = require("uuid");

// Create User with Image
const createUser = async (req, res) => {
    try {
        let imageUrl = null;

        if (req.file) {
            const s3 = await getS3();
            const awsConfig = await getAwsConfig();

            // Confirm config
            console.log("AWS Config:", awsConfig);

            if (!awsConfig.bucketName) {
                throw new Error("Bucket name is missing! Check SecretsManager or .env");
            }

            const params = {
                Bucket: awsConfig.bucketName,
                Key: `users/${uuidv4()}_${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                // ACL: "public-read" // enable if public access needed
            };

            const uploadedImage = await s3.upload(params).promise();
            imageUrl = uploadedImage.Location;
        }

        const user = await User.create({
            ...req.body,
            imageUrl,
        });

        res.status(201).json(user);
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(400).json({ error: err.message });
    }
};

// Read all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Read one user
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(404).json({ error: "User not found" });
    }
};

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser };
