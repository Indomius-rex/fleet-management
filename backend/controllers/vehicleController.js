const Vehicle = require("../models/Vehicle");

// Create a new vehicle
const createVehicle = async (req, res) => {
  try {
    const {
        make,
        model,
        year,
        vehicleType,
        color,
        vin,
        mileage,
        fuelType,
        status,
        price,
    } = req.body;

    // Check if vehicle with same VIN already exists
    const existingVehicle = await Vehicle.findOne({ vin });
    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: "Vehicle with this VIN already exists",
      });
    }

    // Create new vehicle
    const vehicle = await Vehicle.create({
        make,
        model,
        year,
        vehicleType,
        color,
        vin,
        mileage,
        fuelType,
        status,
        price,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      vehicle,
    });
  } catch (error) {
    // Handle duplicate key error (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Vehicle with this VIN already exists",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    console.error("Create vehicle error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error creating vehicle",
    });
  }
};

// Get all vehicles with search, sorting, and pagination
const getVehicles = async (req, res) => {
  try {
    // Extract query parameters
    const { search, sort, page = 1, limit = 10 } = req.query;

    // Build filter object for search
    let filter = {};
    if (search) {
      // Search in make or model fields (case-insensitive)
      filter = {
        $or: [
          { make: { $regex: search, $options: "i" } },
          { model: { $regex: search, $options: "i" } },
          { color: { $regex: search, $options: "i" } },
          { vin: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Get total count of matching vehicles
    const totalVehicles = await Vehicle.countDocuments(filter);

    // Calculate pagination
    const pageNumber = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNumber - 1) * pageLimit;
    const totalPages = Math.ceil(totalVehicles / pageLimit);

    // Build sort object
    let sortObj = {};
    if (sort) {
      // Handle ascending/descending sort (e.g., "year" or "-year")
      if (sort.startsWith("-")) {
        sortObj[sort.slice(1)] = -1; // Descending order
      } else {
        sortObj[sort] = 1; // Ascending order
      }
    }

    // Fetch vehicles with filters, sorting, and pagination
    const vehicles = await Vehicle.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(pageLimit);

    res.status(200).json({
      success: true,
      count: vehicles.length,
      totalVehicles,
      currentPage: pageNumber,
      totalPages,
      vehicles,
    });
  } catch (error) {
    console.error("Get vehicles error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching vehicles",
    });
  }
};

// Get a single vehicle by ID
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find vehicle by ID
    const vehicle = await Vehicle.findById(id);

    // Return error if vehicle not found
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    // Handle invalid MongoDB ID format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID format",
      });
    }

    console.error("Get vehicle error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching vehicle",
    });
  }
};

// Update a vehicle by ID
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
   const {
        make,
        model,
        year,
        vehicleType,
        color,
        vin,
        mileage,
        fuelType,
        status,
        price,
    } = req.body;

    // Find and update vehicle
    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      {
        make,
        model,
        year,
        vehicleType,
        color,
        vin,
        mileage,
        fuelType,
        status,
        price,
      },
      { new: true, runValidators: true } // Return updated document and run schema validators
    );

    // Return error if vehicle not found
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    // Handle duplicate key error (unique constraint on VIN)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Vehicle with this VIN already exists",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    // Handle invalid MongoDB ID format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID format",
      });
    }

    console.error("Update vehicle error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error updating vehicle",
    });
  }
};

// Delete a vehicle by ID
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete vehicle
    const vehicle = await Vehicle.findByIdAndDelete(id);

    // Return error if vehicle not found
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      vehicle,
    });
  } catch (error) {
    // Handle invalid MongoDB ID format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID format",
      });
    }

    console.error("Delete vehicle error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error deleting vehicle",
    });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
