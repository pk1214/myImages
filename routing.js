const express = require("express");
const router = express.Router();
const AuthService = require("../service/authService");
const ArtworkService = require("../service/artworkService");
const authMiddleware = require("../utilities/authMiddleware");
const artistService = require("../service/artistService");
const userService = require("../service/userService");
const upload = require("../utilities/uploadMiddleware");
const orderService = require("../service/orderService");
const User = require("../model/Users");
const Artist = require("../model/Artists");
const CommissionService = require("../service/commissionService");
// In your artist routes (e.g., in routing.js or artistRoutes.js)
router.get("/artist/all", async (req, res, next) => {
  try {
    const ArtistService = require("../service/artistService");
    const artists = await ArtistService.getAllArtists();
    res.json(artists);
  } catch (error) {
    next(error);
  }
});

// Commission submission by user
router.post("/commission/submit", authMiddleware, async (req, res, next) => {
  try {
    // Attach user from token
    req.body.user = req.user.id;
    // Map artistId to artist (required by schema)
    if (!req.body.artist && req.body.artistId) {
      req.body.artist = req.body.artistId;
    }
    if (!req.body.artist) {
      return res.status(400).json({ message: "Artist is required." });
    }
    const commission = await CommissionService.submitCommissionRequest(
      req.body
    );
    res
      .status(201)
      .json({ message: "Commission request submitted", commission });
  } catch (error) {
    next(error);
  }
});

// Get commission requests for artist
router.get("/commission/artist", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== "artist") {
      return res.status(403).json({ message: "Access denied" });
    }
    const commissions = await CommissionService.getCommissionRequestsForArtist(
      req.user.id
    );
    res.json(commissions);
  } catch (error) {
    next(error);
  }
});

// Get commission requests for user
router.get("/commission/user", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied" });
    }
    const commissions = await CommissionService.getCommissionRequestsForUser(
      req.user.id
    );
    res.json(commissions);
  } catch (error) {
    next(error);
  }
});

// Update commission request (for both user and artist decisions)
router.put("/commission/update/:id", authMiddleware, async (req, res, next) => {
  try {
    const commissionId = req.params.id;
    const updateData = req.body; // e.g., { status: "price proposed", price: <number> }
    const updatedCommission = await CommissionService.updateCommission(
      commissionId,
      updateData
    );
    res.json({ message: "Commission updated", updatedCommission });
  } catch (error) {
    next(error);
  }
});

// User Signup
router.post("/user/signup", async (req, res, next) => {
  try {
    const userData = new User(req.body); // Create an instance of the User class
    const response = await AuthService.userSignup(userData);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Artist Signup
router.post("/artist/signup", async (req, res, next) => {
  try {
    const artistData = new Artist(req.body); // Create an instance of the Artist class
    const response = await AuthService.artistSignup(artistData);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Login for both User and Artist
router.post("/:role/login", async (req, res, next) => {
  const { email, password } = req.body;
  const role = req.params.role; // will be 'user' or 'artist'

  try {
    const response = await AuthService.login(email, password, role);
    console.log(response);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// route for all artworks for user home page
router.get("/user/home", authMiddleware, async (req, res, next) => {
  try {
    const artworks = await ArtworkService.getAllArtworks();
    // console.log("first")
    res.json(artworks);
  } catch (error) {
    next(error);
  }
});

//Get Artwork Details by ID
router.get("/artwork/details/:id", authMiddleware, async (req, res, next) => {
  try {
    const artworkId = req.params.id;
    const artwork = await ArtworkService.getArtworkDetailsById(artworkId);
    res.json(artwork);
  } catch (error) {
    next(error);
  }
});

// Route for fetching artworks uploaded by a specific artist (protected route)
router.get("/artist/dashboard", authMiddleware, async (req, res, next) => {
  try {
    const artistId = req.query.artistId;
    // console.log(artistId)

    if (!artistId) {
      return res.status(400).json({ message: "Artist ID is required" });
    }

    if (req.user.role !== "artist" && req.query.artistId) {
      return res.status(403).json({ message: "Access denied for non-artists" });
    }

    const artworks = await ArtworkService.getArtworksByArtist(artistId);
    res.json(artworks);
  } catch (error) {
    next(error);
  }
});

// GET Artist Profile - protected route
router.get("/artist/profile", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== "artist") {
      return res.status(403).json({ message: "Access denied" });
    }
    const artistProfile = await artistService.getArtistProfile(req.user.id);
    res.json(artistProfile);
  } catch (error) {
    next(error);
  }
});

// PUT Update Artist Profile - protected route
router.put("/artist/profile", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== "artist") {
      return res.status(403).json({ message: "Access denied" });
    }
    const updatedArtist = await artistService.updateArtistProfile(
      req.user.id,
      req.body
    );
    res.json({ message: "Profile updated successfully", updatedArtist });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/artist/upload",
  authMiddleware,
  upload.single("image"),
  async (req, res, next) => {
    console.log("Inside ");
    try {
      req.body.artistId = req.user.id;
      console.log("req user body", req.body);
      const response = await ArtworkService.uploadArtwork(req.body, req.file);
      res
        .status(201)
        .json({ message: "Artwork uploaded successfully", response });
    } catch (error) {
      next(error);
    }
  }
);

// Add artwork to favorites for a user
router.post("/user/favorites", authMiddleware, async (req, res, next) => {
  try {
    // Extract artworkId from the request body.
    const { artworkId } = req.body;
    // console.log("Inside routes", artworkId)
    // Get the current user's id from the token payload.
    const userId = req.user.id;
    if (!artworkId) {
      return res.status(400).json({ message: "Artwork ID is required." });
    }
    const updatedUser = await userService.addToFavorites(userId, artworkId);
    res.json({ message: "Artwork added to favorites", updatedUser });
  } catch (error) {
    next(error);
  }
});

//Get favorites for a user
router.get("/user/favorites", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const favorites = await userService.getFavorites(userId);
    res.json(favorites);
  } catch (error) {
    next(error);
  }
});

//Remove favorite artwork for a user
router.delete(
  "/user/favorites/:artworkId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.user.id; // from token
      const artworkId = req.params.artworkId;
      if (!artworkId) {
        return res.status(400).json({ message: "Artwork ID is required." });
      }
      const updatedUser = await userService.removeFromFavorites(
        userId,
        artworkId
      );
      res.json({ message: "Artwork removed from favorites", updatedUser });
    } catch (error) {
      next(error);
    }
  }
);

// Purchase artwork route (for users)
router.post("/user/purchase", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id; // from token
    const { artworkId, address, phoneNumber, paymentMethod } = req.body;

    if (!artworkId) {
      return res.status(400).json({ message: "Artwork ID is required." });
    }

    // Option 1: Update user's purchase_history field in the Users schema
    const updatedUser = await userService.purchaseArtwork(userId, artworkId, {
      address,
      phoneNumber,
      paymentMethod,
    });

    // Option 2: Create a new order document in the Orders collection
    const orderData = {
      user: userId,
      artwork: artworkId,
      address,
      phoneNumber,
      paymentMethod,
      // purchaseDate is set automatically by the schema's default value
    };
    const newOrder = await orderService.createOrder(orderData);

    res.json({ message: "Purchase successful", updatedUser, newOrder });
  } catch (error) {
    next(error);
  }
});

// Purchase History Route (for users)
router.get("/user/purchase-history", authMiddleware, async (req, res, next) => {
  try {
    // Get the current user's ID from the token payload
    const userId = req.user.id;

    // Retrieve orders for the user (populated with artwork details)
    const orders = await orderService.getOrdersByUser(userId);

    // Return the orders as JSON
    // console.log(orders)
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// DELETE artwork route (for artists)
router.delete("/artist/artwork/:id", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== "artist") {
      return res.status(403).json({ message: "Access denied" });
    }
    const artworkId = req.params.id;
    const deletedArtwork = await ArtworkService.deleteArtwork(artworkId);
    if (!deletedArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }
    res.json({ message: "Artwork deleted successfully", deletedArtwork });
  } catch (error) {
    next(error);
  }
});

// PUT promote artwork route (for artists)
router.put(
  "/artist/artwork/promote/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      if (req.user.role !== "artist") {
        return res.status(403).json({ message: "Access denied" });
      }
      const artworkId = req.params.id;
      const promotedArtwork = await ArtworkService.promoteArtwork(artworkId);
      if (!promotedArtwork) {
        return res.status(404).json({ message: "Artwork not found" });
      }
      res.json({ message: "Artwork promoted successfully", promotedArtwork });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

// router.get("/setupdb", async (req, res, next) => {
//   try {
//     let response = await setupdb();
//     res.json(response);
//   } catch (err) {
//     next(err);
//   }
// });

// router.get("/arts", async (req, res, next) => {
//   try {
//     // Fetch artworks from the ArtworkService
//     let artworks = await ArtworkService.getAllArtworks();

//     // If artworks exist, send them back as JSON
//     if (artworks) {
//       res.json(artworks);
//     } else {
//       res.status(404).json({ message: "No artworks found" });
//     }
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;
