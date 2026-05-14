import Notification from "../../models/Expenses/notificationModel.js";
import { success, error } from "../../utils/Expenses/handler.js";

export const updateSettings = async (req, res) => {
  try {
    const {
      userId,
      reminderEnabled,
      reminderType,
      reminderTime,
      monthlyReportEnabled,
    } = req.body;

    const settings = await Notification.findOneAndUpdate(
      { userId },
      {
        reminderEnabled,
        reminderType,
        reminderTime,
        monthlyReportEnabled,
      },
      { upsert: true, new: true },
    );

    const response = success(200, settings);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};