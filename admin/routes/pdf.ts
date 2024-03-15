import { NextApiRequest, NextApiResponse } from "next";
import { type Context } from ".keystone/types";
import { pdfFromUrl } from "../helpers/pdf";
import { KS_PORT } from "../../src/lib/variables";

export async function pdfAPI(
  req: NextApiRequest,
  res: NextApiResponse,
  context: Context,
) {
  if (!context.session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!req.query.path) {
    return res.status(400).json({ error: "Missing path" });
  }
  if (!req.query.id) {
    return res.status(400).json({ error: "Missing id" });
  }
  try {
    const pdfBuffer = await pdfFromUrl(
      `http://localhost:${KS_PORT}/view/${req.query.path}?id=${req.query.id}`,
    );
    res
      .setHeader("Content-Type", "application/pdf")
      .status(200)
      .send(pdfBuffer);
  } catch (e) {
    console.log("[]", e);
    res.status(418).json({ error: e });
  }
}
