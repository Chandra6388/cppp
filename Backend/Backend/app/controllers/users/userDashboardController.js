const db = require('../../models')
const SignatureDb = db.SignatureDb
const SignatureViewDB = db.SignatureViewDB;
const TrackBtnClickedDB = db.TrackBtnClickedDB;
const SignatureSendRecordDB = db.SignatureSendRecordDB;
const mongoose = require('mongoose');
const { getDateRange, getPercentChange } = require("../../helper/helper")
require("dotenv").config();

class SignatureDashboard {
    async dashboardSummary(req, res) {
        const { userId, start_date, filter_type, end_date } = req.body;
    
        if (!userId) {
            return res.send({ status: false, message: "User Id is required", data: [] });
        }
    
        const ranges = getDateRange(filter_type, start_date, end_date);
    
        if (!ranges.current || !ranges.previous) {
            return res.send({ status: false, message: "Invalid filter_type or date range." });
        }
    
        const currentFilter = { createdAt: ranges.current, userId };
        const previousFilter = { createdAt: ranges.previous, userId };
    
        try {
            const [
                totalSignatures,
                prevTotalSignatures,
                totalSignatureViews,
                prevTotalSignatureViews,
                currentClickAgg,
                previousClickAgg
            ] = await Promise.all([
                SignatureDb.countDocuments(currentFilter),
                SignatureDb.countDocuments(previousFilter),
                SignatureViewDB.countDocuments(currentFilter),
                SignatureViewDB.countDocuments(previousFilter),
                TrackBtnClickedDB.aggregate([
                    { $match: currentFilter },
                    { $group: { _id: null, total: { $sum: "$ClickCount" } } }
                ]),
                TrackBtnClickedDB.aggregate([
                    { $match: previousFilter },
                    { $group: { _id: null, total: { $sum: "$ClickCount" } } }
                ])
            ]);
    
            const totalClicks = currentClickAgg[0]?.total || 0;
            const PrevTotalClicks = previousClickAgg[0]?.total || 0;
    
            return res.send({
                status: true,
                message: "Dashboard metrics fetched successfully",
                current: {
                    totalSignatures,
                    totalSignatureViews,
                    totalLinkClicks: totalClicks,
                    conversionRate: 0
                },
                percentage_change: {
                    totalSignatures: getPercentChange(totalSignatures, prevTotalSignatures),
                    totalSignatureViews: getPercentChange(totalSignatureViews, prevTotalSignatureViews),
                    totalLinkClicks: getPercentChange(totalClicks, PrevTotalClicks),
                    conversionRate: 0
                }
            });
        } catch (error) {
            console.error("Error in dashboardSummary:", error);
            return res.status(500).send({
                status: false,
                message: "Internal server error",
                data: []
            });
        }
    }
    
    async btnClickedGraphData(req, res) {
        const { userId, start_date, end_date, filter_type } = req.body;

        if (!userId) {
            return res.send({ status: false, message: "User Id is required" });
        }

        try {
            const matchStage = {
                userId: new mongoose.Types.ObjectId(userId)
            };

            // For today filter, override match with current day's range
            if (filter_type === "today") {
                const now = new Date();
                const startOfDay = new Date(now.setHours(0, 0, 0, 0));
                const endOfDay = new Date(now.setHours(23, 59, 59, 999));
                matchStage.createdAt = { $gte: startOfDay, $lte: endOfDay };
            } else if (start_date && end_date) {
                matchStage.createdAt = {
                    $gte: new Date(start_date),
                    $lte: new Date(end_date)
                };
            }

            // Define dynamic grouping logic
            let groupByField, labelMap = {}, labelFormatter;

            switch (filter_type) {
                case "today":
                    groupByField = "today"; // flag
                    break;

                case "this_month":
                case "custom":
                    groupByField = {
                        $dateToString: { format: "%d-%m-%Y", date: "$createdAt" }
                    };
                    labelFormatter = (val) => val;
                    break;

                case "this_year":
                    groupByField = { $month: "$createdAt" };
                    labelMap = {
                        1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
                        5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
                        9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
                    };
                    labelFormatter = (val) => labelMap[val] || `Month ${val}`;
                    break;

                case "this_week":
                default:
                    groupByField = { $dayOfWeek: "$createdAt" };
                    labelMap = {
                        1: "Sun", 2: "Mon", 3: "Tue", 4: "Wed",
                        5: "Thu", 6: "Fri", 7: "Sat"
                    };
                    labelFormatter = (val) => labelMap[val] || `${val}`;
                    break;
            }

            // Day name for today
            if (filter_type === "today") {
                const dayIndex = new Date().getDay(); // 0 (Sun) - 6 (Sat)
                const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                labelFormatter = () => dayMap[dayIndex];
            }

            // Dynamic group stage for aggregation
            const groupStage = filter_type === "today"
                ? [
                    {
                        $group: {
                            _id: {
                                period: "today",
                                btn: "$BtnName"
                            },
                            total: { $sum: "$ClickCount" }
                        }
                    },
                    {
                        $group: {
                            _id: "$_id.period",
                            clicks: {
                                $push: {
                                    btn: "$_id.btn",
                                    total: "$total"
                                }
                            }
                        }
                    }
                ]
                : [
                    {
                        $group: {
                            _id: {
                                period: groupByField,
                                btn: "$BtnName"
                            },
                            total: { $sum: "$ClickCount" }
                        }
                    },
                    {
                        $group: {
                            _id: "$_id.period",
                            clicks: {
                                $push: {
                                    btn: "$_id.btn",
                                    total: "$total"
                                }
                            }
                        }
                    }
                ];

            const result = await TrackBtnClickedDB.aggregate([
                { $match: matchStage },
                ...groupStage,
                { $sort: { _id: 1 } }
            ]);

            const buttonKeys = ["contact_us", "join_meeting", "visit_website", "book_meeting", "leave_review"];

            const formatted = result.map(entry => {
                const label = labelFormatter(entry._id);
                const row = { name: label };

                entry.clicks.forEach(c => {
                    row[c.btn] = c.total;
                });

                buttonKeys.forEach(btn => {
                    if (!row[btn]) row[btn] = 0;
                });

                return row;
            });

            return res.send({ status: true, message: "success", data: formatted });

        } catch (error) {
            console.log("error", error);
            return res.send({ status: false, message: "Internal server error", error: error.message });
        }
    }

    async audienceOverviewGraphData(req, res) {
        const { userId, start_date, filter_type, end_date } = req.body;

        try {
            if (!userId) {
                return res.send({ status: false, message: "User ID is required", data: [] });
            }

            const ranges = getDateRange(filter_type, start_date, end_date);

            if (!ranges.current || !ranges.previous) {
                return res.send({ status: false, message: "Invalid filter_type or date range." });
            }

            const currentFilter = { createdAt: ranges.current, userId: userId };

            const totalView = await SignatureViewDB.find(currentFilter);
            const totalClick = await TrackBtnClickedDB.find(currentFilter);

            // Filter by device type
            const desktopViews = totalView.filter(v => v.deviceType === "desktop" || !v.deviceType);
            const phoneViews = totalView.filter(v => v.deviceType === "mobile");
            const tabletViews = totalView.filter(v => v.deviceType === "tablet");

            const desktopClicks = totalClick.filter(v => v.deviceType === "desktop" || !v.deviceType);
            const phoneClicks = totalClick.filter(v => v.deviceType === "mobile");
            const tabletClicks = totalClick.filter(v => v.deviceType === "tablet");

            return res.send({
                status: true,
                message: "Device-wise data fetched successfully",
                data: [
                    { name: "Desktop", views: desktopViews.length, clicks: desktopClicks.length },
                    { name: "Mobile", views: phoneViews.length, clicks: phoneClicks.length },
                    { name: "Tablet", views: tabletViews.length, clicks: tabletClicks.length }
                ]
            });

        } catch (error) {
            console.error("Error in audienceOverviewGraphData:", error);
            return res.send({
                status: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    async signatureSendGraphData(req, res) {
        const { userId, start_date, end_date, filter_type } = req.body;

        if (!userId) {
            return res.send({ status: false, message: "User Id is required" });
        }

        try {
            const matchStage = {
                userId: new mongoose.Types.ObjectId(userId)
            };

            const ranges = getDateRange(filter_type, start_date, end_date);
            if (!ranges.current) {
                return res.send({ status: false, message: "Invalid filter_type or date range." });
            }

            matchStage.createdAt = ranges.current;
            let groupByField, labelMap = {}, labelFormatter;
            switch (filter_type) {
                case "today":
                    groupByField = "today";
                    break;

                case "this_month":
                case "custom":
                    groupByField = {
                        $dateToString: { format: "%d-%m-%Y", date: "$createdAt" }
                    };
                    labelFormatter = (val) => val;
                    break;

                case "this_year":
                    groupByField = { $month: "$createdAt" };
                    labelMap = {
                        1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
                        5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
                        9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
                    };
                    labelFormatter = (val) => labelMap[val] || `Month ${val}`;
                    break;

                case "this_week":
                default:
                    groupByField = { $dayOfWeek: "$createdAt" };
                    labelMap = {
                        1: "Sun", 2: "Mon", 3: "Tue", 4: "Wed",
                        5: "Thu", 6: "Fri", 7: "Sat"
                    };
                    labelFormatter = (val) => labelMap[val] || `${val}`;
                    break;
            }
            if (filter_type === "today") {
                const dayIndex = new Date().getDay();
                const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                labelFormatter = () => dayMap[dayIndex];
            }
            const groupStage = filter_type === "today"
                ? [
                    {
                        $group: {
                            _id: "today",
                            count: { $sum: 1 }
                        }
                    }
                ]
                : [
                    {
                        $group: {
                            _id: groupByField,
                            count: { $sum: 1 }
                        }
                    }
                ];

            const result = await SignatureSendRecordDB.aggregate([
                { $match: matchStage },
                ...groupStage,
                { $sort: { _id: 1 } }
            ]);

            const formatted = result.map(entry => ({
                name: labelFormatter(entry._id),
                usage: entry.count
            }));

            return res.send({
                status: true,
                message: "success",
                data: formatted
            });

        } catch (error) {
            console.log("error", error);
            return res.send({ status: false, message: "Internal server error", error: error.message });
        }
    }

    async sigantureUseAnalytics(req, res) {
        const { userId, filter_type, start_date, end_date } = req.body;

        try {
            if (!userId) {
                return res.send({ status: false, message: "User ID is required", data: [] });
            }

            let dateFilter = {};
            const now = new Date();

            if (filter_type === "today") {
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                dateFilter = { $gte: startOfDay, $lte: now };
            } else if (filter_type === "this_week") {
                const day = now.getDay();
                const diffToMonday = day === 0 ? 6 : day - 1;
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - diffToMonday);
                startOfWeek.setHours(0, 0, 0, 0);
                dateFilter = { $gte: startOfWeek, $lte: now };
            } else if (filter_type === "this_month") {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                dateFilter = { $gte: startOfMonth, $lte: now };
            } else if (filter_type === "this_year") {
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                dateFilter = { $gte: startOfYear, $lte: now };
            } else if (filter_type === "custom" && start_date && end_date) {
                dateFilter = {
                    $gte: new Date(start_date),
                    $lte: new Date(end_date),
                };
            }

            const data = await SignatureDb.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "trackbtns",
                        let: { signatureId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$signatureId", "$$signatureId"] },
                                    ...(filter_type ? { createdAt: dateFilter } : {})
                                }
                            }
                        ],
                        as: "Clicks"
                    }
                },
                {
                    $lookup: {
                        from: "viewcounts",
                        let: { signatureId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$signatureId", "$$signatureId"]
                                    },
                                    ...(filter_type ? { createdAt: dateFilter } : {})
                                }
                            }
                        ],
                        as: "Views"
                    }
                },
                {
                    $addFields: {
                        buttonClicks: {
                            $size: {
                                $filter: {
                                    input: "$Clicks",
                                    as: "click",
                                    cond: { $eq: ["$$click.linkType", "btn"] }
                                }
                            }
                        },
                        socialClicks: {
                            $size: {
                                $filter: {
                                    input: "$Clicks",
                                    as: "click",
                                    cond: { $eq: ["$$click.linkType", "social"] }
                                }
                            }
                        },
                        totalViews: { $size: "$Views" },

                    }
                },
                {
                    $project: {
                        _id: 1,
                        SignatureName: 1,
                        buttonClicks: 1,
                        socialClicks: 1,
                        totalViews: 1,
                        usageCount: 1,
                        lastUsed: 1
                    }
                }
            ]);

            return res.send({
                status: true,
                message: "Signature analytics fetched successfully",
                data: data
            });

        } catch (error) {
            console.error("Error in sigantureUseAnalytics:", error);
            return res.send({ status: false, message: "Internal server error", error: error.message });
        }
    }

    async signatureCreatedAnalytics(req, res){
        const { userId, filter_type, start_date, end_date } = req.body;
    
        try {
            if (!userId) {
                return res.send({ status: false, message: "User ID is required", data: [] });
            }
    
            const now = new Date();
            let dateFilter = {};
            let labelFormat = "%Y-%m-%d"; // default format
    
            if (filter_type === "today") {
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                dateFilter = { $gte: startOfDay, $lte: now };
            } else if (filter_type === "this_week") {
                const day = now.getDay();
                const diffToMonday = day === 0 ? 6 : day - 1;
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - diffToMonday);
                startOfWeek.setHours(0, 0, 0, 0);
                dateFilter = { $gte: startOfWeek, $lte: now };
            } else if (filter_type === "this_month") {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                dateFilter = { $gte: startOfMonth, $lte: now };
            } else if (filter_type === "this_year") {
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                dateFilter = { $gte: startOfYear, $lte: now };
                labelFormat = "%b"; // Jan, Feb, etc.
            } else if (filter_type === "custom") {
                if (!start_date || !end_date) {
                    return res.send({
                        status: false,
                        message: "Start and end dates are required for custom filter.",
                        data: []
                    });
                }
    
                dateFilter = {
                    $gte: new Date(start_date),
                    $lte: new Date(end_date)
                };
            }
    
            // MongoDB aggregation
            const rawData = await SignatureDb.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        createdAt: dateFilter
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: labelFormat, date: "$createdAt" } },
                        usage: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        usage: 1
                    }
                },
                {
                    $sort: { date: 1 }
                }
            ]);
    
            // Post-processing: convert dates to weekdays if filter_type is 'this_week'
            let formattedData;
    
            if (filter_type === "this_week") {
                const weekdayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                formattedData = rawData.map(entry => {
                    const day = new Date(entry.date).getDay();
                    return {
                        name: weekdayMap[day],
                        usage: entry.usage
                    };
                });
            } else {
                formattedData = rawData.map(entry => ({
                    name: entry.date,
                    usage: entry.usage
                }));
            }
    
            return res.send({
                status: true,
                message: "success",
                data: formattedData
            });
    
        } catch (error) {
            console.error("Error in signatureCreatedAnalytics:", error);
            return res.send({
                status: false,
                message: "Internal server error",
                error: error.message
            });
        }
    };
    
    async viewOpratingSystem(req, res) {
        const { userId, start_date, filter_type, end_date } = req.body;
        if (!userId) {
            return res.send({ status: false, message: "user id is require" });
        }

        try {
            const ranges = getDateRange(filter_type, start_date, end_date);
            if (!ranges.current || !ranges.previous) {
                return res.send({ status: false, message: "Invalid filter_type or date range." });
            }

            const currentFilter = { createdAt: ranges.current, userId: userId };
            const data = await SignatureViewDB.find(currentFilter);

            let Windows = 0;
            let iOS = 0;
            let Android = 0;
            let other = 0;

            data?.forEach(item => {
                const os = (item.os || '').toLowerCase();
                if (os === "windows") Windows++;
                else if (os === "ios") iOS++;
                else if (os === "android") Android++;
                else other++;
            });

            return res.send({
                status: true,
                message: "Operating system usage stats fetched successfully.",
                data: [
                    { name: "Windows", value: Windows },
                    { name: "iOS", value: iOS },
                    { name: "Android", value: Android },
                    { name: "other", value: other },
                ]
            });

        } catch (error) {
            return res.send({ status: false, message: "Internal server error", error: error.message });
        }
    }

}

module.exports = new SignatureDashboard();
