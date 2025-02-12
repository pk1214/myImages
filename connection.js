const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  purchase_history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
    },
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
    },
  ],
});

const artistsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
  },
  social_media: [
    {
      platform: { type: String, required: true }, // e.g., "instagram", "twitter"
      link: { type: String, required: true }, // e.g., "https://instagram.com/username"
    },
  ],
  profile_picture: {
    type: String,
    default: "",
  },
});

const artworkSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: [
    {
      type: String,
      required: true,
    },
  ],
  isPromoted: { type: Boolean, default: false },
  medium: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    required: true,
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artists",
    required: true,
  },
});

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  artwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artwork",
    required: true,
  },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  purchaseDate: { type: Date, default: Date.now },
});

const commissionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artists",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number }, // Set by artist upon acceptance
  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "declined by artist",
      "price accepted",
      "declined by user",
      "in progress",
      "completed",
      "delivered",
    ],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

let collection = {};

const ArtworkDBURL = "mongodb://localhost:27017/artworkDB";

// Connection with async/await
const connectDatabase = async () => {
  try {
    await mongoose.connect(ArtworkDBURL);
    // console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

collection.getUsersCollection = async () => {
  try {
    await connectDatabase(); // Ensure connection is established
    let userModel = mongoose.model("Users", usersSchema); // Use mongoose.model
    return userModel;
  } catch (error) {
    throw new Error("Could not connect to Database for Users");
  }
};

collection.getArtistsCollection = async () => {
  try {
    await connectDatabase(); // Ensure connection is established
    let artistModel = mongoose.model("Artists", artistsSchema); // Use mongoose.model
    return artistModel;
  } catch (error) {
    throw new Error("Could not connect to Database for Artists");
  }
};

collection.getArtworksCollection = async () => {
  try {
    await connectDatabase(); // Ensure connection is established
    let artworkModel = mongoose.model("Artwork", artworkSchema); // Use mongoose.model
    console.log(artworkModel);
    return artworkModel;
  } catch (error) {
    throw new Error("Could not connect to Database for Artworks");
  }
};

// Get Orders Collection
collection.getOrdersCollection = async () => {
  try {
    await connectDatabase(); // Ensure connection is established
    // Check if the model is already registered; if not, register it.
    let orderModel = mongoose.model("Order", orderSchema);
    return orderModel;
  } catch (error) {
    throw new Error("Could not connect to Database for Orders");
  }
};

module.exports = collection;
