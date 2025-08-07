import ClientBriefingModel from "../../models/leads/sales.client.briefing.model.js";
import AppError from "../../util/appError.js";
import cloudinary from "cloudinary"
import mongoose from "mongoose";
// import axios from "axios";
import { uploadFilesToCloudinary } from "../../middlewares/file.upload/upload.middleware.js";
import { generateProjectId } from "../../util/unique/unique.id.js";
import leadModel from "../../models/leads/leadModel.js";
import registrationModel from "../../models/registration/registration.model.js";
import empIdModel from "../../models/unique/unique.empId.js";


//location find
// const getLocationFromCoordinates = async (latitude, longitude) => {
//   try {
//     const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
//       params: {
//         latlng: `${latitude},${longitude}`,
//         key: 'AIzaSyAfgvheqFqmVpddM0NNcJen3NhMfmxza7M',
//         region: 'IN',
//       },
//     });

//     console.log("🔍 Google API Full Response:", JSON.stringify(response.data, null, 2)); // Add this line

//     if (response.data && response.data.results.length > 0) {
//       return response.data.results[0].formatted_address;
//     } else {
//       throw new Error('Location not found for given coordinates');
//     }
//   } catch (error) {
//     console.error('❌ Error fetching address from coordinates:', error.message);
//     return null;
//   }
// };

//create
export const createClientBriefing = async (req, res, next) => {
  try {

    const {
      leadId,
      clientName,
      companyName,
      projectName,
      productName,
      clientProfile,
      clientBehaviour,
      discussionDone,
      instructionRecce,
      instructionDesign,
      instructionInstallation,
      instructionOther,
      requirement,
      address,
      userId,
      siteLocation
    } = req.body;

    if (!leadId||!userId) {
      return next(new AppError("Lead ID and user Id is required", 400));
    }
    const leadData=await leadModel.findOne({_id:leadId});
      if(!leadData) return next(new AppError("Invalidate LeadId",400))
    const data = await ClientBriefingModel.findOne({ leadId: leadId });

    if (data) {
      return next(new AppError("Record all ready exist", 404));
    }

    //  688c83d7ee7889fb8dbd030d
    // let locationArray;
    // try {
    //   locationArray = JSON.parse(siteLocation); // Now it's an actual array
    // } catch (error) {
    //   console.error("Invalid siteLocation format");
    // }

    // const lat = locationArray[0].lat;
    // const long = locationArray[1].long;

    // console.log("Parsed lat:", lat, typeof lat);
    // console.log("Parsed long:", long, typeof long);

    // const location = await getLocationFromCoordinates(lat, long);
    // console.log("locationaa", location);

    // return

    if (!leadId) {
      return next(new AppError("Lead ID is required", 400));
    }
    const objectLeadId = new mongoose.Types.ObjectId(leadId);
    
    console.log("req.body", req.body);
    console.log("req.files", req.files);
    
    const documentUpload = req.files?.length > 0
      ? await uploadFilesToCloudinary(req.files, "client-briefings")
      : [];

    console.log("documentUpload", documentUpload);

    // return
    const projectId = await generateProjectId();
    console.log("projectId", projectId);
    // return
    const result = await ClientBriefingModel.create({
      leadId: objectLeadId,
      clientName,
      companyName,
      projectName,
      productName,
      clientProfile,
      clientBehaviour,
      discussionDone,
      instructionRecce,
      instructionDesign,
      instructionInstallation,
      instructionOther,
      requirement,
      address,
      userId,
      salesTLId:leadData.salesTLId,
      projectId: projectId,
      documentUpload
    });

    res.status(201).json({
      success: true,
      message: "Add Sales Client Briefing successfully",
      data: { result }
    });

  } catch (error) {
    next(new AppError(error.message, 500));
  }
};


//update
export const updateClientBriefing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      clientName,
      companyName,
      projectName,
      productName,
      clientProfile,
      clientBehaviour,
      discussionDone,
      instructionRecce,
      instructionDesign,
      instructionInstallation,
      instructionOther,
      requirement,
      address,
      salesManagementStep,
    } = req.body;

    if (!id) {
      return next(new AppError("Client Briefing ID is required", 400));
    }
    // File upload logic (optional, if new files are sent)
    const existingBriefing = await ClientBriefingModel.findById(id);
    if (!existingBriefing) {
      return next(new AppError("Client Briefing not found", 404));
    }

    let documentUpload = [...(existingBriefing.documentUpload || [])];

    if (req.files?.length > 0) {
      const newUploads = await uploadFilesToCloudinary(req.files, "client-briefings");
      documentUpload = [...documentUpload, ...newUploads]
    }

    const updatedBriefing = await ClientBriefingModel.findByIdAndUpdate(
      id,
      {
        clientName,
        companyName,
        projectName,
        productName,
        clientProfile,
        clientBehaviour,
        discussionDone,
        instructionRecce,
        requirement,
        address,
        instructionDesign,
        instructionInstallation,
        instructionOther,
        salesManagementStep,
        ...(documentUpload.length > 0 && { documentUpload }) // only update files if new ones provided
      },
      { new: true, runValidators: true }
    );

    if (!updatedBriefing) {
      return next(new AppError("Client Briefing not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Client Briefing updated successfully",
      data: { updatedBriefing }
    });

  } catch (error) {
    next(new AppError(error.message, 500));
  }
};



//All lead single client
// export const clientBriefingView = async (req, res, next) => {
//   try {
//     const { leadId } = req.query;
//     const result = await ClientBriefingModel.find({ leadId });

//     if (!result || result.length === 0) {
//       return next(new AppError("Data not found", 404));
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Client briefing data fetched successfully",
//       data: { result },
//     });
//   } catch (error) {
//     return next(new AppError(error.message, 500));
//   }
// };

//All data
export const clientBriefingAllData = async (req, res, next) => {
  try {
    const result = await ClientBriefingModel.find().sort({ createdAt: -1 });;

    if (!result || result.length === 0) {
      return next(new AppError("Data not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "All Client Briefing Data",
      data: result,
    });

  } catch (error) {
    next(new AppError(error.message, 500));
  }
};


export const salesFromData = async (req, res, next) => {
  try {
    const allData = await ClientBriefingModel.find().populate("leadId").sort({ createdAt: -1 });;

    if (!allData || allData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found"
      });
    }
    const result = await Promise.all(
      allData.map(async (item) => {
        const salesPerson = await registrationModel.findById(item.leadId.saleEmployeeId);
        const salesAssistant = await registrationModel.findById(item.leadId.salesTLId);
        console.log("itm", item);

        return {
          timestamp: item.createdAt,
          _id: item._id,
          leadId: item.leadId._id,
          salesAssistant: salesPerson?.fullName || salesPerson?.name || "",
          impanelledBy: salesAssistant?.fullName || salesAssistant?.name || "",
          // salesPerson: item.impanelledBy || "",

          projectCode: item.projectId || "",
          salesType: item.leadId.leadType || "",

          projectName: item.projectName || "",
          projectDetail: item.leadId.projectDetail || "",

          clientName: item.clientName || "",
          clientProfile: item.clientProfile || "",

          concernPersonDesignation: item.leadId.concernPersonDesignation || "",
          companyName: item.companyName || "",

          phone: item.leadId?.phone || "",
          altPhone: item.leadId?.altPhone || "",

          fullAddress: item.leadId.address || "",
          locationLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.leadId.address)}`
        };
      })
    );
    return res.status(200).json({
      success: true,
      message: "Formatted sales data",
      data: { result }
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};


export const getProjectByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(id);
    
    // return
    const result = await ClientBriefingModel.findById(id).sort({ createdAt: -1 });;

    if (!result) {
      return next(new AppError("Project not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { result },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const getAllProject=async (req,res,next)=>{
  try {
       const{id}=req.params;
         const registration=await registrationModel.findById(id);
         
         const leadData=await leadModel.findById(id).sort({ createdAt: -1 });;
         console.log(leadData);
         const data=await empIdModel(leadData.employeeleadsAccept)
         const result=await ClientBriefingModel.find()
      
  } catch (error) {
    return next(new AppError(error.message,400));
  }
}

//export default....

export const getOureProject=async(req,res,next)=>{
       try {
          const {id}=req.params

    const allData = await ClientBriefingModel.find({$or:[{userId:id},{salesTLId:id}]}).populate("leadId");

    if (!allData || allData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found"
      });
    }
    const result = await Promise.all(
      allData.map(async (item) => {
        const salesPerson = await registrationModel.findById(item.leadId.saleEmployeeId);
        const salesAssistant = await registrationModel.findById(item.leadId.salesTLId);
        console.log("itm", item);

        return {
          timestamp: item.createdAt,
          _id: item._id,
          leadId: item.leadId._id,
          salesAssistant: salesPerson?.fullName || salesPerson?.name || "",
          impanelledBy: salesAssistant?.fullName || salesAssistant?.name || "",
          // salesPerson: item.impanelledBy || "",

          projectCode: item.projectId || "",
          salesType: item.leadId.leadType || "",

          projectName: item.projectName || "",
          projectDetail: item.leadId.projectDetail || "",

          clientName: item.clientName || "",
          clientProfile: item.clientProfile || "",

          concernPersonDesignation: item.leadId.concernPersonDesignation || "",
          companyName: item.companyName || "",

          phone: item.leadId?.phone || "",
          altPhone: item.leadId?.altPhone || "",

          fullAddress: item.leadId.address || "",
          locationLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.leadId.address)}`
        };
      })
    );
    return res.status(200).json({
      success: true,
      message: "Our nproject",
      data: { result }
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
}


// sent to recce

export const sendToRecce = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { recceStatus } = req.body;
    const result = await ClientBriefingModel.findByIdAndUpdate(
      id,
      { recceStatus },
      { new: true }
    );
    console.log("result",result);
    // return;
    
    if (!result) {
      return next(new AppError("Project not forwarded to recce department", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Send to Recce Successfully",
      data: { result },
    });

  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};



