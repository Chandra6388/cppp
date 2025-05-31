const db = require('../../models');
const TemplatesDb = db.TemplatesDb;

class Templates {
    async addTemplates(req, res) {
        const { TemplatesName, htmlCode } = req.body;
        try {
            if (!TemplatesName) {
                return res.send({ status: false, message: "Template name is required", data: [] });
            }

            if (!htmlCode) {
                return res.send({ status: false, message: "Template text is required", data: [] });
            }

            const checkDuplicatesData = await TemplatesDb.findOne({ TemplatesName });

            if (checkDuplicatesData) {
                return res.send({ status: false, message: "Template name already exists.", data: [] });
            }

            const newTemplates = new TemplatesDb({
                TemplatesName,
                htmlCode
            });

            await newTemplates.save();

            return res.send({ status: true, message: "Template added successfully", data: newTemplates });

        } catch (error) {
            return res.send({ status: false, message: "Internal server error", error: error });
        }
    }
    async getAllTemplates(req, res) {
        try {
            const data = await TemplatesDb.find();

            if (data.length === 0) {
                return res.send({ status: false, message: "No templates found", data: [] });
            }

            return res.send({ status: true, message: "All templates retrieved successfully", data });

        } catch (error) {
            console.error(error);
            return res.send({ status: false, message: "Internal server error", error: error.message });
        }
    }

    async updateTemplate(req, res) {
        const { TemplatesName, htmlCode, id } = req.body;

        try {
            if (!TemplatesName && !htmlCode) {
                return res.send({ status: false, message: "No data provided for update", data: [] });
            }

            const templateToUpdate = await TemplatesDb.findById(id);

            if (!templateToUpdate) {
                return res.send({ status: false, message: "Template not found", data: [] });
            }

            if (TemplatesName) {
                templateToUpdate.TemplatesName = TemplatesName;
            }

            if (htmlCode) {
                templateToUpdate.htmlCode = htmlCode;
            }
            await templateToUpdate.save();
            return res.send({ status: true, message: "Template updated successfully", data: templateToUpdate });

        } catch (error) {
            return res.send({ status: false, message: "Internal server error", error: error });
        }
    }
    // Delete Template
    async deleteTemplate(req, res) {
        const { id } = req.body;

        if (!id) {
            res.send({ status: false, message: "Id is require", data: [] })
        }
        try {
            const templateToDelete = await TemplatesDb.findById(id);

            if (!templateToDelete) {
                return res.send({ status: false, message: "Template not found", data: [] });
            }

            await TemplatesDb.findByIdAndDelete(id);

            return res.send({ status: true, message: "Template deleted successfully", data: [] });

        } catch (error) {

            return res.send({ status: false, message: "Internal server error", error: error });
        }
    }
}


module.exports = new Templates();