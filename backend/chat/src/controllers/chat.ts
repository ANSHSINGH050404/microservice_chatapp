import TryCatch from "../config/TryCatch";
import { AuthenticatedRequest } from "../middlewares/isAuth";
import { Chat } from "../models/Chat";

export const createNewChat = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      res.status(400).json({
        message: "Other userid is required",
      });

      return;
    }

    const existingChat = await Chat.findOne({
      users: { $all: [userId, otherUserId], $size: 2 },
    });

    if (existingChat) {
      res.json({
        message: "Chat already exits",
        chatId: existingChat._id,
      });
      return;
    }

    const newChat = await Chat.create({
      users: [userId, otherUserId],
    });

    res.json({
      message: "New Chat Created",
      chatId: newChat._id,
    });
  }
);



export const getAllChat = TryCatch(
  async (req: AuthenticatedRequest, res) => {

    const userId=req.body?._id;

    if(!userId){
      res.status(400).json({
        message:"UserId missing",
      });
      return;
    }


    const chats=await Chat.find({users:userId}).sort({updatedAt:-1})

    const chatWithUserData=await Promise.all(

      chats.map(async (chat) =>{

        const otherUserId=chat.users.find((id) =>id !== userId)

        
      })
    )


  }

)
