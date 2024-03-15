import { NextApiRequest, NextApiResponse } from "next";
import { type Context } from ".keystone/types";
import { pdfFromUrl } from "../helpers/pdf";

export async function demoAPI(
  req: NextApiRequest,
  res: NextApiResponse,
  context: Context,
) {
  if (!context.session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  // if (!req.query.id) {
  //   return res.status(400).json({ error: "Missing id" });
  // }
  try {
    const pdfBuffer = await pdfFromUrl("http://localhost:3000/view/quote");
    res
      .setHeader("Content-Type", "application/pdf")
      .status(200)
      .send(pdfBuffer);
  } catch (e) {
    console.log("[]", e);
    res.status(418).json({ error: e });
  }
}
