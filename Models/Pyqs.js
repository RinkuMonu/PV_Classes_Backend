// const mongoose = require('mongoose');

// const PYQSchema = new mongoose.Schema({
//     exam: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//     },
//     description: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     pdfUrl: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     status: {
//         type: String,
//         enum: ["free", "paid"],
//         default: "free",
//         required: false
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('PYQ', PYQSchema);




const mongoose = require('mongoose');

const PYQSchema = new mongoose.Schema({
    exam: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    pdfUrl: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["free", "paid"],
        default: "free",
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number, // in percentage
        default: 0,
    },
    finalPrice: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

// Auto calculate finalPrice before save
PYQSchema.pre("save", function (next) {
    if (this.status === "paid") {
        let discounted = this.price;
        if (this.discount > 0) {
            discounted = this.price - (this.price * this.discount / 100);
        }
        this.finalPrice = Math.round(discounted);
    } else {
        this.price = 0;
        this.discount = 0;
        this.finalPrice = 0;
    }
    next();
});

module.exports = mongoose.model('PYQ', PYQSchema);
