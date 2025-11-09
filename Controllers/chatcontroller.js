const express = require("express");
const router = express.Router();
const Chat = require("../models/chatModel");
const mongoose = require("mongoose");
// إنشاء محادثة
// POST /api/chat/create
// إنشاء محادثة
// إنشاء محادثة
const createChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (senderId === receiverId)
      return res.status(400).json({ message: "لا يمكنك التحدث مع نفسك" });

    let chat = await Chat.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = await Chat.create({
        members: [senderId, receiverId],
        messages: [],
      });
    }

    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create chat" });
  }
};

// قائمة المحادثات
const getChatList = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ members: userId });

    const chatList = chats.map((chat) => {
      const otherUserId = chat.members.find((id) => id !== userId);
      return {
        chatId: chat._id,
        otherUserId,
        otherUserName: "اسم المستخدم", // لاحقاً جلبه من User collection
        lastMessage: chat.messages.length
          ? chat.messages[chat.messages.length - 1].text
          : "",
      };
    });

    res.json(chatList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// إرسال رسالة
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { senderId, senderModel, text } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "المحادثة غير موجودة" });

    chat.messages.push({ sender: senderId, onModel: senderModel, text });
    await chat.save();

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// جلب الرسائل
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "المحادثة غير موجودة" });

    res.json(chat.messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  createChat,
  sendMessage,
  getChatList,
  getMessages,
};
