import { Request, Response } from "express";
import {
  createConversation,
  createConversationMessage,
  isExistingConversation,
} from "../services/conversation.service";
import { log } from "../logger";
import { convertionsRelations } from "../db/schema";

export async function createConversationHandler(req: Request, res: Response) {
  try {
    const exits = await isExistingConversation(req.body.usersId);
    if (exits) {
      res.json({ message: "Conversation already exits" });
      return;
    }

    await createConversation(req.body);

    res.status(201).json({ message: "Conversation created successfully" });
  } catch (err: any) {
    log.error(`Database error: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createConversationMessageHandler(
  req: Request,
  res: Response
) {
  const body = req.body;
  const { conversationId } = req.params;
  const userId = res.locals.user.id as string;

  if (!conversationId) {
    res.json({ message: "Conversation id not provided" });
    return;
  }
  await createConversationMessage(body, conversationId, userId);

  res.status(201).json({ message: "Message created successfully" });
}
