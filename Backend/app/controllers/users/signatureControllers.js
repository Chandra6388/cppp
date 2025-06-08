const db = require('../../models')
const SignatureDb = db.SignatureDb
const TrackBtnClickedDB = db.TrackBtnClickedDB;
const SignatureSendRecordDb = db.SignatureSendRecordDB;
const SignatureViewDB = db.SignatureViewDB;
const { v4: uuidv4 } = require("uuid");
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
require("dotenv").config();
const UAParser = require('ua-parser-js');
const UnreadSupportChat = db.UnreadSupportChat

class Signature {

  async AddSignature(req, res) {
    try {
      const { details, Templates_Id, SignatureName, userId } = req.body;

      const missingFields = [];
      if (!details) missingFields.push("details");
      if (!Templates_Id) missingFields.push("Templates_Id");
      if (!userId) missingFields.push("userId");
      if (!SignatureName) missingFields.push("SignatureName");

      if (missingFields.length > 0) {
        return res.send({
          status: false,
          message: `Missing required field(s): ${missingFields.join(", ")}`
        });
      }

      const existing = await SignatureDb.findOne({ SignatureName, userId }).lean();
      if (existing) {
        return res.send({
          status: false,
          message: "Signature name already exists"
        });
      }

      const newSignature = new SignatureDb({
        SignatureName,
        Templates_Id,
        userId,
        details
      });

      const savedSignature = await newSignature.save();

      let updatedHtml = details?.html;
      if (typeof updatedHtml === "string" && updatedHtml.includes("__SIGNATURE_ID__")) {
        updatedHtml = updatedHtml.replace(/__SIGNATURE_ID__/g, savedSignature._id.toString());

        await SignatureDb.findByIdAndUpdate(savedSignature._id, {
          "details.html": updatedHtml
        }, { new: false });
      }

      return res.send({
        status: true,
        message: "Signature added successfully",
        data: {
          ...savedSignature.toObject(),
          details: {
            ...details,
            html: updatedHtml
          }
        }
      });

    } catch (error) {
      console.error("❌ Error in AddSignature:", error);
      return res.send({
        status: false,
        message: "Internal server error",
        error: error?.message || "Unexpected error"
      });
    }
  }

  async updateSignature(req, res) {
    try {
      const { id, details, Templates_Id, SignatureName } = req.body;


      const missingFields = [];
      if (!id) missingFields.push("id");
      if (!details) missingFields.push("details");
      if (!Templates_Id) missingFields.push("Templates_Id");
      if (!SignatureName) missingFields.push("SignatureName");

      if (missingFields.length > 0) {
        return res.send({
          status: false,
          message: `Missing required field(s): ${missingFields.join(", ")}`,
          data: []
        });
      }

      const existing = await SignatureDb.findById(id);
      if (!existing) {
        return res.send({
          status: false,
          message: "Signature not found with the provided ID",
          data: []
        });
      }

      const nameExists = await SignatureDb.findOne({
        SignatureName,
        _id: { $ne: id }
      }).lean();

      if (nameExists) {
        return res.send({
          status: false,
          message: "Signature name already exists",
          data: []
        });
      }

      const updatedDetails = { ...details };
      if (typeof updatedDetails.html === "string" && updatedDetails.html.includes("__SIGNATURE_ID__")) {
        updatedDetails.html = updatedDetails.html.replace(/__SIGNATURE_ID__/g, id);
      }

      const updatedSignature = await SignatureDb.findByIdAndUpdate(
        id,
        {
          SignatureName,
          Templates_Id,
          details: updatedDetails
        },
        { new: true, runValidators: true }
      );

      return res.send({
        status: true,
        message: "Signature updated successfully",
        data: updatedSignature
      });

    } catch (error) {
      console.error("❌ Error in updateSignature:", error);
      return res.send({
        status: false,
        message: "Internal server error",
        error: error?.message || "Unexpected error"
      });
    }
  }

  async getAllSignature(req, res) {
    try {
      const { userId } = req.body;

      // ✅ Validate input
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.send({
          status: false,
          message: "Valid userId is required",
          data: []
        });
      }

      // ✅ Perform aggregation with optional template data
      const signatures = await SignatureDb.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(userId), isDeleted: false }
        },
        {
          $lookup: {
            from: "templates",
            localField: "Templates_Id",
            foreignField: "_id",
            as: "templateInfo"
          }
        },
        {
          $unwind: {
            path: "$templateInfo",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            Templates_Id: 1,
            SignatureName: 1,
            createdAt: 1,
            usageCount: 1,
            details: 1,
            "templateInfo._id": 1,
            "templateInfo.TemplatesName": 1
          }
        }
      ]);

      return res.send({
        status: true,
        message: signatures.length === 0 ? "No signature found" : "All signatures retrieved successfully",
        data: signatures
      });

    } catch (error) {
      console.error("❌ Error in getAllSignature:", error);
      return res.send({
        status: false,
        message: "Internal server error",
        error: error?.message || "Unexpected error",
        data: []
      });
    }
  }

  async getAllRecycleBinSignature(req, res) {
    try {
      const { userId } = req.body;

      // ✅ Validate input
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.send({
          status: false,
          message: "Valid userId is required",
          data: []
        });
      }

      // ✅ Perform aggregation with optional template data
      const signatures = await SignatureDb.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(userId), isDeleted: true }
        },
        {
          $lookup: {
            from: "templates",
            localField: "Templates_Id",
            foreignField: "_id",
            as: "templateInfo"
          }
        },
        {
          $unwind: {
            path: "$templateInfo",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            Templates_Id: 1,
            SignatureName: 1,
            createdAt: 1,
            usageCount: 1,
            details: 1,
            "templateInfo._id": 1,
            "templateInfo.TemplatesName": 1
          }
        }
      ]);

      return res.send({
        status: true,
        message: signatures.length === 0 ? "No signature found" : "All signatures retrieved successfully",
        data: signatures
      });

    } catch (error) {
      console.error("❌ Error in getAllSignature:", error);
      return res.send({
        status: false,
        message: "Internal server error",
        error: error?.message || "Unexpected error",
        data: []
      });
    }
  }

  async getSignatureById(req, res) {
    try {
      const { id } = req.body;

      // ✅ Validate ID format
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.send({
          status: false,
          message: "A valid signature ID is required",
          data: []
        });
      }

      // ✅ Perform aggregation to get full signature details with template info
      const signatureData = await SignatureDb.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) }
        },
        {
          $lookup: {
            from: "templates",
            localField: "Templates_Id",
            foreignField: "_id",
            as: "templateInfo"
          }
        },
        {
          $unwind: {
            path: "$templateInfo",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            Templates_Id: 1,
            SignatureName: 1,
            createdAt: 1,
            usageCount: 1,
            details: 1,
            "templateInfo._id": 1,
            "templateInfo.TemplatesName": 1
          }
        }
      ]);

      if (!signatureData || signatureData.length === 0) {
        return res.send({
          status: false,
          message: "No signature found with the provided ID",
          data: []
        });
      }

      return res.send({
        status: true,
        message: "Signature retrieved successfully",
        data: signatureData
      });

    } catch (error) {
      console.error("❌ Error in getSignatureById:", error);
      return res.send({
        status: false,
        message: "Internal server error",
        error: error?.message || "Unexpected error",
        data: []
      });
    }
  }

  async deleteSignature(req, res) {
    try {
      const { id } = req.body;

      // ✅ Validate ID
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.send({
          status: false,
          message: "A valid signature ID is required",
          data: []
        });
      }

      // ✅ Check existence first
      const signature = await SignatureDb.findById(id);
      if (!signature) {
        return res.send({
          status: false,
          message: "Signature not found",
          data: []
        });
      }

      // ✅ Proceed with deletion
      await SignatureDb.findByIdAndUpdate(id, { isDeleted: true }, { new: false });

      return res.send({
        status: true,
        message: "Signature deleted successfully",
        data: []
      });

    } catch (error) {
      console.error("❌ Error in deleteSignature:", error);
      return res.send({
        status: false,
        message: "Internal server error",
        error: error?.message || "Unexpected error",
        data: []
      });
    }
  }

  async restoreSignature(req, res) {
    try {
      const { id } = req.body;


      console.log("Restore Signature ID:", id);
      // ✅ Validate ID
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.send({
          status: false,
          message: "A valid signature ID is required",
          data: []
        });
      }

      // ✅ Check existence first
      const signature = await SignatureDb.findById(id);
      if (!signature) {
        return res.send({
          status: false,
          message: "Signature not found",
          data: []
        });
      }

      // ✅ Proceed with deletion
      await SignatureDb.findByIdAndUpdate(id, { isDeleted: false }, { new: false });

      return res.send({
        status: true,
        message: "Signature deleted successfully",
        data: []
      });

    } catch (error) {
      console.error("❌ Error in deleteSignature:", error);
      return res.send({
        status: false,
        message: "Internal server error",
        error: error?.message || "Unexpected error",
        data: []
      });
    }
  }

  async deleteSignatureFromArchive(req, res) {
    try {
      const { id } = req.body;

      // ✅ Validate ID
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.send({
          status: false,
          message: "A valid signature ID is required",
          data: []
        });
      }

      // ✅ Check existence first
      const signature = await SignatureDb.findById(id);
      if (!signature) {
        return res.send({
          status: false,
          message: "Signature not found",
          data: []
        });
      }

      // ✅ Proceed with deletion
      await SignatureDb.findByIdAndDelete(id);

      return res.send({
        status: true,
        message: "Signature deleted successfully",
        data: []
      });

    } catch (error) {
      console.error("❌ Error in deleteSignature:", error);
      return res.send({
        status: false,
        message: "Internal server error",
        error: error?.message || "Unexpected error",
        data: []
      });
    }
  }

  async signatureSendByMails(req, res) {
    let { email, html, signatureId, userId } = req.body;

    const base64Match = html.match(/<img[^>]+src="data:image\/[^;]+;base64,([^"]+)"/);
    const base64Data = base64Match ? base64Match[1] : null;

    html = html.replace(
      /<img src="https:\/\/loanofficersupport\.s3\.amazonaws\.com\/pimgs\/18140800618image_6809d9cce7e92\.png"[^>]*>/,
      `<img src="https://loanofficersupport.s3.amazonaws.com/pimgs/18140800618image_6809d9cce7e92.png" width="120" height="120" style="border-radius: 50%; border: 3px solid #64b5f6;" alt="Wade Warren" />`
    );

    let updatedHtml = base64Data
      ? html.replace(/<img[^>]+src="data:image\/[^;]+;base64,[^"]+"/, '<img src="cid:user-profile-img"')
      : html;

    const trackingId = uuidv4();

    const closingTableIndex = updatedHtml.lastIndexOf('</table>');
    if (closingTableIndex !== -1) {
      updatedHtml = `
                ${updatedHtml.slice(0, closingTableIndex)}
                <tr>
                    <td>
                        <img 
                            src=${`${process.env.base_url}signature/view/${signatureId}?trackId=${trackingId}&t=${Date.now()}&userId=${userId}`} 
                            width="1" 
                            height="1" 
                            style="width:1px; height:1px; opacity:0; visibility:hidden;" 
                            alt=""
                        />
                    </td>
                </tr>
                ${updatedHtml.slice(closingTableIndex)}
            `;
    }


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Signature Card",
      html: updatedHtml,
      attachments: base64Data
        ? [{
          filename: "profile.png",
          content: base64Data,
          encoding: "base64",
          cid: "user-profile-img",
        }]
        : [],
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Email Error:", error);
        return res.status(500).send({ status: false, message: "Failed to send email" });
      }
      try {
        const signature = await SignatureDb.findById(signatureId);
        if (!signature) {
          console.warn("Signature not found with ID:", signatureId);
          return;
        }
        signature.usageCount = (signature.usageCount || 0) + 1;
        signature.lastUsed = new Date().toISOString()
        await signature.save();
        const newSignatureSendRecord = new SignatureSendRecordDb({ userId, signatureId })
        await newSignatureSendRecord.save()
      } catch (err) {
        console.warn("Failed to update usage count after email sent:", err);
      }
      res.send({
        status: true,
        message: "Signature sent to user successfully",
      });
    });
  }

  async signatureViewHandler(req, res) {
    const { signatureId } = req.params;
    const { trackId, userId } = req.query;
    if (!trackId) {
      return res.status(400).json({ status: false, message: "Tracking ID is required" });
    }

    try {
      const signature = await SignatureDb.findById(signatureId);
      if (!signature) {
        return res.status(404).json({ status: false, message: "Signature not found" });
      }



      const userAgent = req.headers['user-agent'];
      const parser = new UAParser(userAgent);
      const result = parser.getResult();

      let deviceType = result.device?.type ?? 'unknown';
      if ((deviceType === 'unknown' || deviceType === 'desktop') && userAgent.includes("Android") && !userAgent.includes("Mobile")) {
        deviceType = 'tablet';
      } else if (deviceType === 'unknown') {
        deviceType = 'desktop';
      }

      const os = result.os?.name || 'Unknown OS';
      const browser = result.browser?.name || 'Unknown Browser';

      const newData = new SignatureViewDB({
        userId: userId,
        signatureId: signatureId,
        viewedAt: new Date(),
        deviceType,
        os,
        browser
      });

      await newData.save();


      signature.totalSignatureView += 1;
      await signature.save();


      const pixel = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9UwZb3cAAAAASUVORK5CYII=",
        "base64"
      );
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": pixel.length
      });
      res.end(pixel);
    } catch (err) {
      console.error("Error in tracking handler:", err);
      res.status(500).end(); // no JSON for image request
    }

  }


  async trackClick(req, res) {
    try {
      const { url, btnName, userId, linkType, signatureId } = req.query;
  
      if (!url || !btnName) {
        return res.send({ status: false, message: 'Missing URL or Button Name' });
      }
  
      // Device info parsing
      const userAgent = req.headers['user-agent'];
      const parser = new UAParser(userAgent);
      const result = parser.getResult();
  
      let deviceType = result.device?.type ?? 'unknown';
      if ((deviceType === 'unknown' || deviceType === 'desktop') && userAgent.includes("Android") && !userAgent.includes("Mobile")) {
        deviceType = 'tablet';
      } else if (deviceType === 'unknown') {
        deviceType = 'desktop';
      }
  
      const os = result.os?.name || 'Unknown OS';
      const browser = result.browser?.name || 'Unknown Browser';
  
      // Normalize and validate URL
      let finalUrl = decodeURIComponent(url);
      const isTelOrMail = /^tel:|^mailto:/i.test(finalUrl);
  
      // Add https:// only for non-special URLs
      if (!/^https?:\/\//i.test(finalUrl) && !isTelOrMail) {
        finalUrl = `https://${finalUrl}`;
      }
   
      try {
        if (!isTelOrMail) {
          new URL(finalUrl);
        }
      } catch (err) {
        return res.send({ status: false, message: 'Invalid final URL format' });
      }
  
      // Save click tracking data
      await TrackBtnClickedDB.create({
        BtnName: btnName,
        ClickCount: 1,
        userId,
        signatureId,
        linkType,
        deviceType,
        os,
        browser
      });
  
      // Redirect to the intended link
      return res.redirect(finalUrl);
  
    } catch (error) {
      console.error('Error tracking button click:', error);
      return res.status(500).send({
        status: false,
        message: 'Internal Server Error',
        error: error.message
      });
    }
  }
}

module.exports = new Signature();
