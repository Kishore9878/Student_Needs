import Student from "../../models/Referrals/StudentModel.js";
import { calculateProfileCompleteness } from "../../utils/Referrals/calculateProfileScore.js";

// Validation helper for LinkedIn URL
const validateLinkedInUrl = (url) => {
  const pattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i;
  return pattern.test(url.trim());
};

// Add LinkedIn URL
export const addLinkedInUrl = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { linkedinUrl } = req.body;

    if (!linkedinUrl) {
      return res.status(400).json({
        success: false,
        message: "LinkedIn URL is required",
      });
    }

    const trimmedUrl = linkedinUrl.trim();

    if (!validateLinkedInUrl(trimmedUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid LinkedIn URL format. Example: https://linkedin.com/in/username",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.linkedinUrl) {
      return res.status(400).json({
        success: false,
        message: "LinkedIn URL already exists. Use update endpoint to change it.",
      });
    }

    student.linkedinUrl = trimmedUrl;
    student.profileCompleteness = calculateProfileCompleteness(student);

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        linkedinUrl: student.linkedinUrl,
        profileCompleteness: student.profileCompleteness,
      },
      message: "LinkedIn URL added successfully",
    });
  } catch (error) {
    console.error("Add LinkedIn URL Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to add LinkedIn URL",
    });
  }
};

// Update LinkedIn URL (Used by both POST upload stubs and URL updates)
export const updateLinkedInUrl = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { linkedinUrl } = req.body;

    if (!linkedinUrl) {
      return res.status(400).json({
        success: false,
        message: "LinkedIn URL is required",
      });
    }

    const trimmedUrl = linkedinUrl.trim();

    if (!validateLinkedInUrl(trimmedUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid LinkedIn URL format. Example: https://linkedin.com/in/username",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    student.linkedinUrl = trimmedUrl;
    student.profileCompleteness = calculateProfileCompleteness(student);

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        linkedinUrl: student.linkedinUrl,
        profileCompleteness: student.profileCompleteness,
      },
      message: "LinkedIn URL updated successfully",
    });
  } catch (error) {
    console.error("Update LinkedIn URL Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update LinkedIn URL",
    });
  }
};

// Get LinkedIn URL
export const getLinkedInUrl = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.linkedinUrl) {
      return res.status(404).json({
        success: false,
        message: "LinkedIn URL not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        linkedinUrl: student.linkedinUrl,
      },
      message: "LinkedIn URL retrieved successfully",
    });
  } catch (error) {
    console.error("Get LinkedIn URL Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve LinkedIn URL",
    });
  }
};

// Delete LinkedIn URL
export const deleteLinkedInUrl = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    student.linkedinUrl = undefined;
    student.profileCompleteness = calculateProfileCompleteness(student);

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        profileCompleteness: student.profileCompleteness,
      },
      message: "LinkedIn URL deleted successfully",
    });
  } catch (error) {
    console.error("Delete LinkedIn URL Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete LinkedIn URL",
    });
  }
};