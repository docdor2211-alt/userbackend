const mongoose =
  require("mongoose");



const userChatMessageSchema =
  new mongoose.Schema({

    // ✅ CONVERSATION
    conversationId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref:
        "UserChatConversation",

      required: true,

    },



    // ✅ SENDER
    senderId: {

      type:
        mongoose.Schema.Types.ObjectId,

      required: true,

    },



    // ✅ SENDER TYPE
    senderType: {

      type: String,

      enum: [

        "user",

        "doctor",

      ],

      required: true,

    },



    // ✅ MESSAGE
    message: {

      type: String,

      default: "",

    },



    // ✅ TYPE
    messageType: {

      type: String,

      enum: [

        "text",

        "image",

        "file",

      ],

      default: "text",

    },



    // ✅ FILE URL
    fileUrl: {

      type: String,

      default: "",

    },



    // ✅ SEEN
    isSeen: {

      type: Boolean,

      default: false,

    },



    // ✅ DELETE
    isDeleted: {

      type: Boolean,

      default: false,

    },

  },

  {
    timestamps: true,
  }
);





module.exports =
  mongoose.model(

    "UserChatMessage",

    userChatMessageSchema

  );