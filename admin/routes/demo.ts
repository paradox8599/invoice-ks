import { NextApiRequest, NextApiResponse } from "next";
import { type Context } from ".keystone/types";

export async function demoAPI(
  req: NextApiRequest,
  res: NextApiResponse,
  context: Context,
) {
  if (!context.session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!req.query.id) {
    return res.status(400).json({ error: "Missing id" });
  }
  try {
    res.status(201).json({ data: {} });
  } catch (e) {
    console.log("[]", e);
    res.status(418).json({ error: e });
  }
}
