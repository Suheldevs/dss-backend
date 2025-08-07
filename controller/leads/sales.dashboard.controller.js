import moment from "moment";
import leadModel from "../../models/leads/leadModel.js";
import registrationModel from "../../models/registration/registration.model.js";
import ClientBriefingModel from "../../models/leads/sales.client.briefing.model.js";

export const dashboardData = async (req, res, next) => {
    try {
        const { id } = req.params;

        let totalLead = 0;
        let thisMonthLead = 0;
        let ThisMonthPendingLead = 0;
        let recceProjectWine = 0;

        console.log("aaaa", id);


        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();

        const regData = await registrationModel.findById(id);
        if (!regData) {
            return res.status(404).json({ message: "User not found" });
        }

        // ===== SaleHOD =====
        if (regData.role === "SaleHOD") {
          totalLead = await leadModel.countDocuments();

          thisMonthLead = await leadModel.countDocuments({
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth
            }
          });

          ThisMonthPendingLead = await leadModel.countDocuments({
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth
            },
            leadStatus: "Pending"
          });

          recceProjectWine = await ClientBriefingModel.countDocuments({
            recceStatus: "Win" // Adjust this as per your schema value
          });
        }

        // ===== SalesTL =====
        if (regData.role === "SalesTL") {
          totalLead = await leadModel.countDocuments();

          thisMonthLead = await leadModel.countDocuments({
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth
            }
          });

          ThisMonthPendingLead = await leadModel.countDocuments({
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth
            },
            leadStatus: "Pending"
          });

        //   recceProjectWine = await ClientBriefingModel.countDocuments({
        //     recceStatus: true
        //   });
        }

        // ===== SaleEmployee =====
        if (regData.role === "SaleEmployee") {
            totalLead = await leadModel.countDocuments({
                $or: [{ saleEmployeeId: id }, { saleEmployeeId2: id }]
            });

            thisMonthLead = await leadModel.countDocuments({
                createdAt: {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                },
                $or: [{ saleEmployeeId: id }, { saleEmployeeId2: id }]
            });

            ThisMonthPendingLead = await leadModel.countDocuments({
                createdAt: {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                },
                employeeleadsAccept: {
                    $elemMatch: {
                        status: true
                    }
                },
                $or: [{ saleEmployeeId: id }, { saleEmployeeId2: id }]
            });

            recceProjectWine = 5;
        }
          const result={
             totalLead,
            thisMonthLead,
            ThisMonthPendingLead,
            recceProjectWine
          }
        // ===== Response =====
        return res.status(200).json({
            success:true,
            message:"Dashboard Data",
           data:{result},

        });

    } catch (error) {
        console.error("Dashboard Data Error:", error);
        return next(error);
    }
};
