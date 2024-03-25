import { NextApiRequest, NextApiResponse } from "next";
import { type Context } from ".keystone/types";

export async function serviceDuplicateAPI(
  req: NextApiRequest,
  res: NextApiResponse,
  context: Context,
) {
  if (!context.session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (typeof req.query.id !== "string") {
    return res.status(400).json({ error: "Expected id string" });
  }
  try {
    const item = (await context.sudo().query.Service.findOne({
      where: { id: req.query.id },
      query: "name description items { id }",
    })) as { name: string; description: string; items: { id: string }[] };
    if (!item) {
      return res
        .status(404)
        .json({ error: `Service ${req.query.id} not found` });
    }
    const newItem = await context.sudo().query.Service.createOne({
      data: {
        name: `${item.name} - Duplicated`,
        description: item.description,
        items: { connect: item.items.map((i) => ({ id: i.id })) },
      },
      query: "id",
    });
    res.status(201).json({ data: { id: newItem.id } });
  } catch (e) {
    console.log("[serviceDuplicateAPI]", e);
    res.status(500).json({ error: e });
  }
}
