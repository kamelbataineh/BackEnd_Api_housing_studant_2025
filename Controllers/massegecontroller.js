const Message = require("../models/massege");

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    const message = new Message({ senderId, receiverId, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "خطأ في إرسال الرسالة" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000); //  24 ساعة

    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
      createdAt: { $gte: yesterday },
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب الرسائل" });
  }
};

module.exports = { sendMessage, getMessages };
