import { NextApiRequest, NextApiResponse } from "next";
import { type Context } from ".keystone/types";

export async function serviceItemDuplicateAPI(
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
    const item = await context.sudo().query.ServiceItem.findOne({
      where: { id: req.query.id },
      query: "name qty type { id } period service { id } unitPrice description",
    });
    if (!item) {
      return res
        .status(404)
        .json({ error: `Service item ${req.query.id} not found` });
    }
    const newItem = await context.sudo().query.ServiceItem.createOne({
      data: {
        name: `${item.name} - Duplicated`,
        qty: item.qty,
        type: { connect: { id: item.type.id } },
        period: item.period,
        services: { connect: { id: item.service.id } },
        unitPrice: item.unitPrice,
        description: item.description,
      },
      query: "id",
    });
    res.status(201).json({ data: { id: newItem.id } });
  } catch (e) {
    console.log("[serviceItemDuplicateAPI]", e);
    res.status(418).json({ error: e });
  }
}
