const mongoose = require("mongoose");

// const Websitelist = require("../models/Website.model.js");
const Banner = require("../Models/Banner.js");

// Create a single banner
exports.createBanner = async (req, res) => {
    try {
        const {
            bannerName,
            deviceType = "both",
            description,
            position,
        } = req.body;
        console.log(req.file);

        let imageArray = [];

        if (req.file) {
            imageArray = [req.file.filename];
        }

        const banner = new Banner({
            bannerName,
            description,
            images: imageArray,
            position: position || "homepage-top",
            addedBy: req.user?.id?.toString(),
            deviceType,
        });

        await banner.save();

        res.status(200).json({ message: "Banner added successfully", banner });
    } catch (error) {
        res.status(500).json({ message: "Failed to add banner", error: error.message });
    }
};

exports.getBannersByWebsiteAndPosition = async (req, res) => {
    try {
        const { position } = req.query;

        const banners = await Banner.find({
            position,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Banners retrieved successfully",
            banners,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve banners",
            error: error.message,
        });
    }
};

// Create multiple banners
exports.createMultipleBanners = async (req, res) => {
    try {
        const { banners } = req.body;

        if (!Array.isArray(banners) || banners.length === 0) {
            return res.status(400).json({ message: "Provide an array of banners." });
        }

        const formattedBanners = banners.map((banner) => ({
            bannerName: banner.bannerName,
            description: banner.description,
            images: Array.isArray(banner.images) ? banner.images : [banner.images],
            position: banner.position || "homepage-top",
            addedBy: req.user?.id || "679c5cc89e0012636ffef9ed",
        }));

        const result = await Banner.insertMany(formattedBanners);

        res.status(200).json({
            message: `${result.length} banners added successfully`,
            banners: result,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to add banners", error: error.message });
    }
};

// Get banners with optional filters
exports.getBanners = async (req, res) => {
    try {
        const {
            position,
            sortBy = "createdAt",
            sortOrder = "desc",
            page = 1,
            limit = 20,
        } = req.query;

        const query = {};

        if (position) query.position = position;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const banners = await Banner.find(query)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalDocuments = await Banner.countDocuments(query);
        const totalPages = Math.ceil(totalDocuments / limit);

        res.status(200).json({
            message: "Banners retrieved successfully",
            banners,
            pagination: {
                totalDocuments,
                currentPage: parseInt(page),
                pageSize: parseInt(limit),
                totalPages,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve banners", error: error.message });
    }
};

// Get banner detail by ID
exports.getBannerDetail = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }
        res.status(200).json({ message: "Banner retrieved successfully", banner });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve banner", error: error.message });
    }
};

// Update a banner
exports.updateBanner = async (req, res) => {
    try {
        const { bannerName, description, position } = req.body;
        let imageArray = [];

        if (req.file) {
            imageArray = [req.file.path];
        } else if (req.files) {
            imageArray = req.files.map(file => file.path);
        }

        const updatedBanner = await Banner.findByIdAndUpdate(
            req.params.id,
            {
                bannerName,
                description,
                images: imageArray,
                position,
            },
            { new: true }
        );

        if (!updatedBanner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        res.status(200).json({ message: "Banner updated successfully", updatedBanner });
    } catch (error) {
        res.status(500).json({ message: "Failed to update banner", error: error.message });
    }
};

// Delete a banner
exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }
        res.status(200).json({ message: "Banner deleted successfully", banner });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete banner", error: error.message });
    }
};

// Get mobile banners
exports.getMobileBanners = async (req, res) => {
    try {
        const { position } = req.query;

        const query = {
            deviceType: { $in: ["mobile", "both"] },
        };

        if (position) query.position = position;

        const banners = await Banner.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Mobile banners fetched successfully",
            banners,
        });
    } catch (error) {
        console.error("Error fetching mobile banners:", error);
        return res.status(500).json({
            message: "Failed to fetch mobile banners",
            error: error.message,
        });
    }
};

// Get desktop banners
exports.getDestopBanners = async (req, res) => {
    try {
        const { position } = req.query;

        const query = {
            deviceType: { $in: ["desktop", "both"] },
        };

        if (position) query.position = position;

        const banners = await Banner.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Desktop banners fetched successfully",
            banners,
        });
    } catch (error) {
        console.error("Error fetching desktop banners:", error);
        return res.status(500).json({
            message: "Failed to fetch desktop banners",
            error: error.message,
        });
    }
};
