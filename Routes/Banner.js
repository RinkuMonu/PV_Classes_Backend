import express from "express";
import {
    createBanner,
    createMultipleBanners,
    deleteBanner,
    getBannerDetail,
    getBanners,
    getBannersByWebsiteAndPosition,
    getDestopBanners,
    getMobileBanners,
    updateBanner,
} from "../Controllers/Banner.js";
import upload from "../middleware/upload.js";



const bannerRoutes = express.Router();
const uploadBanner = upload("banner");

// Create a single banner (admin only)
bannerRoutes.post(
    "/create",

    uploadBanner.single('images'), // upload max 5 images
    createBanner
);

// Create multiple banners (admin only)
bannerRoutes.post(
    "/bulk-create",

    uploadBanner.array('images', 5), // upload max 5 images
    createMultipleBanners
);
bannerRoutes.get("/by-website-and-position", getBannersByWebsiteAndPosition);

bannerRoutes.get("/mobile", getMobileBanners); // new
bannerRoutes.get("/desktop", getDestopBanners); // new
// Get banners (public or protected depending on app logic)
bannerRoutes.get("/", getBanners);

// Get a single banner by ID
bannerRoutes.get("/:id", getBannerDetail);

// Update a banner (admin only)
bannerRoutes.put(
    "/:id",

    uploadBanner.array("images", 5),
    updateBanner
);

// Delete a banner (admin only)
bannerRoutes.delete("/:id", deleteBanner);

export default bannerRoutes;