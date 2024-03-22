import { NextApiRequest, NextApiResponse } from "next";
import { pdfFromUrl } from "../helpers/pdf";
import { KS_PORT } from "../../src/lib/variables";

export async function getPdf({
  path,
  id,
}: {
  path: "quote" | "contract" | "invoice";
  id: string;
}) {
  return await pdfFromUrl(`http://localhost:${KS_PORT}/view/${path}?id=${id}`);
}

export async function pdfAPI(
  req: NextApiRequest,
  res: NextApiResponse,
  // context: Context,
) {
  // if (!context.session) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }
  if (!req.query.path) {
    return res.status(400).json({ error: "Missing path (collection name)" });
  }
  if (
    typeof req.query.path !== "string" ||
    !(req.query.path in ["quote", "contract", "invoice"])
  ) {
    return res.status(400).json({
      error: "Invalid type of path (string, quote, contract, invoice)",
    });
  }
  if (!req.query.id) {
    return res.status(400).json({ error: "Missing id" });
  }
  if (typeof req.query.id !== "string") {
    return res.status(400).json({ error: "Invalid type of id (string)" });
  }
  try {
    const pdfBuffer = await getPdf({
      path: req.query.path as "quote" | "contract" | "invoice",
      id: req.query.id,
    });

    res
      .setHeader("Content-Type", "application/pdf")
      .status(200)
      .send(pdfBuffer);
  } catch (e) {
    console.log("[]", e);
    res.status(418).json({ error: e });
  }
}
