const express = require("express");
const {
  createBanner,
  createMultipleBanners,
  deleteBanner,
  getBannerDetail,
  getBanners,
  getBannersByWebsiteAndPosition,
  getDestopBanners,
  getMobileBanners,
  updateBanner,
} = require("../Controllers/Banner.js");
const upload = require("../middleware/upload.js");

const bannerRoutes = express.Router();
const uploadBanner = upload("banner");

// Create a single banner (admin only)
bannerRoutes.post(
  "/create",
  uploadBanner.single("images"),
  createBanner
);

// Create multiple banners (admin only)
bannerRoutes.post(
  "/bulk-create",
  uploadBanner.array("images", 5),
  createMultipleBanners
);

// Get banners by website and position
bannerRoutes.get("/by-website-and-position", getBannersByWebsiteAndPosition);

// Get mobile banners
bannerRoutes.get("/mobile", getMobileBanners);

// Get desktop banners
bannerRoutes.get("/desktop", getDestopBanners);

// Get all banners
bannerRoutes.get("/", getBanners);

// Get a single banner by ID
bannerRoutes.get("/:id", getBannerDetail);

// Update a banner
bannerRoutes.put(
  "/:id",
  uploadBanner.array("images", 5),
  updateBanner
);

// Delete a banner
bannerRoutes.delete("/:id", deleteBanner);

module.exports = bannerRoutes;
