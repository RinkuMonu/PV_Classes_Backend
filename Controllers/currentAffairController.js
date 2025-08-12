const CurrentAffair = require("../Models/CurrentAffair");
const CurrentAffairCategory = require("../Models/CurrentAffairCategory");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const category = new CurrentAffairCategory(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await CurrentAffairCategory.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Blog Post
exports.createCurrentAffair = async (req, res) => {
  try {
    const post = new CurrentAffair(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Blogs (with filters)
exports.getCurrentAffairs = async (req, res) => {
  try {
    const { category, search, latest, limit, status } = req.query;
    let filter = {};

    // Optional status filter
    if (status) {
      filter.status = status;
    }

    if (category) {
      const cat = await CurrentAffairCategory.findOne({ slug: category });
      if (cat) filter.category = cat._id;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    let query = CurrentAffair.find(filter).populate("category", "name slug");

    if (latest === "true") {
      query = query.sort({ publishDate: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    if (limit) {
      query = query.limit(Number(limit));
    }

    const posts = await query.exec();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Single Blog Detail
exports.getCurrentAffairBySlug = async (req, res) => {
  try {
    const post = await CurrentAffair.findOne({ slug: req.params.slug, status: "published" })
      .populate("category", "name slug");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
