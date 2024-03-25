import { NextApiRequest, NextApiResponse } from "next";
import { type Context } from ".keystone/types";

export type SignatureRequest = {
  signature?: string;
  reset?: boolean;
};

export async function signatureAPI(
  req: NextApiRequest,
  res: NextApiResponse,
  context: Context,
) {
  if (!req.query.id || typeof req.query.id !== "string") {
    return res.status(400).json({ error: "Missing contract id (string)" });
  }
  const id = req.query.id;
  try {
    const data = JSON.parse(req.read().toString()) as SignatureRequest;
    const reset = context.session !== void 0 && (data?.reset ?? false);

    const updated = (await context.sudo().query.Contract.updateOne({
      where: { id },
      data: {
        signature: reset ? "" : data.signature,
        signedAt: reset ? null : new Date(),
      },
      query: "id signedAt",
    })) as { id: string; signedAt: string };

    res.send(updated);
  } catch (e) {
    console.log("[signatureAPI]", e);
    res.status(418).json({ error: e });
  }
}
