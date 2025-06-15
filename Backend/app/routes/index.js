
module.exports = function (app) {
    app.use(require("./authRoutes"));
    app.use(require("./signatureRoutes"));
    app.use(require("./templates.routes"));
    app.use(require("./signatureDashboardRoutes"));
    app.use(require("./supportRoutes"));
    app.use(require("./employee/dashbaordRoutes"));
    app.use(require("./employee/ticketRoutes"));
    app.use(require("./user/settingRoutes"));
    app.use(require("./user/notificationRoutes"));
    app.use(require("./imageUploadRoutes"));
    app.use(require("./admin/blogsRoutes"))
    app.use(require("./user/contactUsRoutes"))





};