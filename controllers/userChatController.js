

// controllers/userChatController.js

const UserChatConversation =
  require(
    "../models/userChatConversationModel"
  );

const UserChatMessage =
  require(
    "../models/userChatMessageModel"
  );

const Appointment =
  require(
    "../models/appointmentModel"
  );





/* =====================================================
   💬 START CHAT
===================================================== */

exports.startChat =
  async (req, res) => {

    try {

      const {
        appointmentId
      } = req.body;



      // ✅ CHECK APPOINTMENT
      const appointment =
        await Appointment.findById(
          appointmentId
        );



      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",

        });

      }



      // ✅ CHECK EXISTING CHAT
      let conversation =
        await UserChatConversation.findOne({

          appointmentId,

        });



      // ✅ CREATE CHAT
      if (!conversation) {

        conversation =
          await UserChatConversation.create({

            appointmentId,

            userId:
              appointment.userId,

            doctorId:
              appointment.doctorId,

            lastMessage:
              "",

          });

      }



      res.status(200).json({

        success: true,

        message:
          "Chat started successfully",

        data:
          conversation,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =====================================================
   📩 SEND MESSAGE
===================================================== */

exports.sendMessage =
  async (req, res) => {

    try {

      const {

        conversationId,

        message,

        messageType,

        fileUrl,

        senderType,

      } = req.body;



      // ✅ FIND CONVERSATION
      const conversation =
        await UserChatConversation.findById(
          conversationId
        );



      if (!conversation) {

        return res.status(404).json({

          success: false,

          message:
            "Conversation not found",

        });

      }



      // ✅ SECURITY CHECK
      if (

        senderType === "user" &&

        conversation.userId.toString() !==

        req.user._id.toString()

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Unauthorized User",

        });

      }



      if (

        senderType === "doctor" &&

        conversation.doctorId.toString() !==

        req.user._id.toString()

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Unauthorized Doctor",

        });

      }



      // ✅ CREATE MESSAGE
      const newMessage =
        await UserChatMessage.create({

          conversationId,

          senderId:
            req.user._id,

          senderType,

          message,

          messageType:
            messageType || "text",

          fileUrl:
            fileUrl || "",

        });



      // ✅ UPDATE LAST MESSAGE
      conversation.lastMessage =
        message;

      conversation.lastMessageTime =
        new Date();



      // ✅ UPDATE UNREAD COUNT
      if (

        senderType === "user"

      ) {

        conversation.unreadDoctorCount += 1;

      } else {

        conversation.unreadUserCount += 1;

      }



      await conversation.save();



      // ✅ SOCKET REALTIME
      const io =
        req.app.get("io");



      io.to(
        conversationId
      ).emit(

        "receive_message",

        newMessage

      );



      res.status(201).json({

        success: true,

        message:
          "Message sent successfully",

        data:
          newMessage,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =====================================================
   📨 GET MESSAGES
===================================================== */

exports.getMessages =
  async (req, res) => {

    try {

      // ✅ FIND CONVERSATION
      const conversation =
        await UserChatConversation.findById(

          req.params.conversationId

        );



      if (!conversation) {

        return res.status(404).json({

          success: false,

          message:
            "Conversation not found",

        });

      }



      // ✅ CHECK USER / DOCTOR
      const isUser =

        conversation.userId.toString() ===

        req.user._id.toString();



      const isDoctor =

        conversation.doctorId.toString() ===

        req.user._id.toString();




      // ✅ SECURITY
      if (

        !isUser && !isDoctor

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Unauthorized",

        });

      }



      // ✅ GET ALL MESSAGES
      const messages =
        await UserChatMessage.find({

          conversationId:
            req.params.conversationId,

        })

        .sort({

          createdAt: 1,

        });



      // ✅ MARK AS SEEN
      if (isUser) {

        await UserChatMessage.updateMany(

          {

            conversationId:
              req.params.conversationId,

            senderType:
              "doctor",

            isSeen:
              false,

          },

          {

            isSeen:
              true,

          }

        );



        conversation.unreadUserCount =
          0;

      } else {

        await UserChatMessage.updateMany(

          {

            conversationId:
              req.params.conversationId,

            senderType:
              "user",

            isSeen:
              false,

          },

          {

            isSeen:
              true,

          }

        );



        conversation.unreadDoctorCount =
          0;

      }



      await conversation.save();



      res.status(200).json({

        success: true,

        count:
          messages.length,

        data:
          messages,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =====================================================
   👤 USER CHATS
===================================================== */

exports.getMyChats =
  async (req, res) => {

    try {

      const chats =
        await UserChatConversation.find({

          userId:
            req.user._id,

        })

        .populate(

          "doctorId",

          "name speciality doctorImagePath"

        )

        .sort({

          updatedAt: -1,

        });



      res.status(200).json({

        success: true,

        count:
          chats.length,

        data:
          chats,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =====================================================
   🩺 DOCTOR CHATS
===================================================== */

exports.getDoctorChats =
  async (req, res) => {

    try {

      const chats =
        await UserChatConversation.find({

          doctorId:
            req.user._id,

        })

        .populate(

          "userId",

          "name profileImage"

        )

        .sort({

          updatedAt: -1,

        });



      res.status(200).json({

        success: true,

        count:
          chats.length,

        data:
          chats,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };







/* =====================================================
   ❌ DELETE CHAT
===================================================== */

exports.deleteChat =
  async (req, res) => {

    try {

      const conversation =
        await UserChatConversation.findById(
          req.params.id
        );



      if (!conversation) {

        return res.status(404).json({

          success: false,

          message:
            "Chat not found",

        });

      }



      // ✅ SECURITY
      const isUser =

        conversation.userId.toString() ===

        req.user._id.toString();



      const isDoctor =

        conversation.doctorId.toString() ===

        req.user._id.toString();



      if (

        !isUser && !isDoctor

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Unauthorized",

        });

      }



      // ✅ DELETE ALL MESSAGES
      await UserChatMessage.deleteMany({

        conversationId:
          conversation._id,

      });



      // ✅ DELETE CHAT
      await conversation.deleteOne();



      res.status(200).json({

        success: true,

        message:
          "Chat deleted successfully",

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };