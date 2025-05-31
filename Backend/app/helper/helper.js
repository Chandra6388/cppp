import moment from "moment";

export const getDateRange = (filterType, startDate, endDate) => {
    let currentStart, currentEnd, previousStart, previousEnd;

    switch (filterType) {
        case "today":
            currentStart = moment().utc().startOf("day");
            currentEnd = moment().utc().endOf("day");
            previousStart = moment().utc().subtract(1, "day").startOf("day");
            previousEnd = moment().utc().subtract(1, "day").endOf("day");
            break;

        case "this_week":
            currentStart = moment().utc().startOf("week");
            currentEnd = moment().utc().endOf("week");
            previousStart = moment().utc().subtract(1, "week").startOf("week");
            previousEnd = moment().utc().subtract(1, "week").endOf("week");
            break;

        case "this_month":
            currentStart = moment().utc().startOf("month");
            currentEnd = moment().utc().endOf("month");
            previousStart = moment().utc().subtract(1, "month").startOf("month");
            previousEnd = moment().utc().subtract(1, "month").endOf("month");
            break;

        case "this_year":
            currentStart = moment().utc().startOf("year");
            currentEnd = moment().utc().endOf("year");
            previousStart = moment().utc().subtract(1, "year").startOf("year");
            previousEnd = moment().utc().subtract(1, "year").endOf("year");
            break;

        case "custom":
            if (!startDate || !endDate) return {};
            currentStart = moment.utc(startDate);
            currentEnd = moment.utc(endDate).endOf("day");
            const diff = currentEnd.diff(currentStart);
            previousStart = moment.utc(startDate).subtract(diff, "milliseconds");
            previousEnd = moment.utc(endDate).subtract(diff, "milliseconds");
            break;

        default:
            return {};
    }

    return {
        current: { $gte: currentStart.toDate(), $lte: currentEnd.toDate() },
        previous: { $gte: previousStart.toDate(), $lte: previousEnd.toDate() },
    };
};

export const getPercentChange = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return parseFloat(((current - previous) / previous) * 100).toFixed(2);
};