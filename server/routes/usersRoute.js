const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware.js");
const Inventory=require('../models/inventoryModal.js')
const mongoose=require('mongoose')
// function getSalt(rounds) {
//     return new Promise((resolve, reject) => {
//       bcrypt.getSalt(rounds, (error, salt) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(salt);
//         }
//       });
//     });
//   }

//register new user
router.post("/register", async (req, res) => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "User Already Exists",
      });
    }
   

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // Save user
    const user = new User(req.body);
    await user.save();

    return res.send({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//login user
router.post("/login", async (req, res) => {
  try {
    // Check if user already exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User Not Found",
      });
    }

    // check if userType matches
    if (user.userType !== req.body.userType) {
      return res.send({
        success: false,
        message: `User is not registered as a ${req.body.userType}`,
      });
    }


    // Compare passwords
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.send({
        success: false,
        message: "Invalid Password",
      });
    }

    //generate token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "8760h",
    });

    return res.send({
      success: true,
      message: "User LoggedIn Successfully",
      data: token,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});


//getCurrentUser
router.get("/get-current-user",authMiddleware,async(req,res)=>{
  try {
    const user= await User.findOne({_id:req.body.userId})

    
    return res.send({
      success:true,
      message:"User Fetched Successfully",
      data:user
    })
  } catch (error) {
    return res.send({
      success:false,
      message:error.message
    })
  }
})


// get all unique donors
router.get("/get-all-donars", authMiddleware, async (req, res) => {
  try {
    // get all unique donor ids from inventory
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueDonorIds = await Inventory.distinct("donar", {
      organization,
    });

    const donars = await User.find({
      _id: { $in: uniqueDonorIds },
    });

   
    return res.send({
      success: true,
      message: "Donars fetched successfully",
      data: donars,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all unique hospitals
router.get("/get-all-hospitals", authMiddleware, async (req, res) => {
  try {
    // get all unique hospital ids from inventory
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueHospitalIds = await Inventory.distinct("hospital", {
      organization,
    });

    const hospitals = await User.find({
      _id: { $in: uniqueHospitalIds },
    });

    return res.send({
      success: true,
      message: "Hospitals fetched successfully",
      data: hospitals,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all unique organizations for a donar
router.get(
  "/get-all-organizations-of-a-donar",
  authMiddleware,
  async (req, res) => {
    try {
      // get all unique hospital ids from inventory
      const donar = new mongoose.Types.ObjectId(req.body.userId);
      const uniqueOrganizationIds = await Inventory.distinct("organization", {
        donar,
      });

      const hospitals = await User.find({
        _id: { $in: uniqueOrganizationIds },
      });

      return res.send({
        success: true,
        message: "Hospitals fetched successfully",
        data: hospitals,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

// get all unique organizations for a hospital
router.get(
  "/get-all-organizations-of-a-hospital",
  authMiddleware,
  async (req, res) => {
    try {
      // get all unique organizations ids from inventory
      const hospital = new mongoose.Types.ObjectId(req.body.userId);
      const uniqueOrganizationIds = await Inventory.distinct("organization", {
        hospital,
      });

      const hospitals = await User.find({
        _id: { $in: uniqueOrganizationIds },
      });

      return res.send({
        success: true,
        message: "Hospitals fetched successfully",
        data: hospitals,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }
  }
);



module.exports = router;
