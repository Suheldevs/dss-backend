import userProfileModel from "../../models/vendor.model/profile.Model.js";



export const createUserProfile = async (req, res) => {
  try {
     console.log("FILES RECEIVED >>>", req.files);
    // console.log("BODY RECEIVED >>>", req.body);
   
    console.log("req.files.photo:", req.files?.photo);
console.log("req.files.contract:", req.files?.contract);
console.log("req.headers =>", req.headers['content-type']);

    const { body, files, user } = req;

     const photoUrl = files?.photo?.[0]?.path || undefined;
    const contractUrl = files?.contract?.[0]?.path;
    const contractName = files?.contract?.[0]?.originalname;

    const profileData = {
      ...body,
      userId: body.userId,
      createdBy: user._id,
      photo:photoUrl,
      contract: {
        name: contractName || "DSS Vendor Agreement.pdf",
        url: contractUrl || "/DSS_Vendor_Agreement.pdf",
      },
    };

    const existing = await userProfileModel.findOne({ userId: body.userId });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists." });
    }

    const newProfile = new userProfileModel(profileData);
    await newProfile.save();

    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ message: "Failed to create profile", error: error.message });
  }
};


  