import { NextApiRequest, NextApiResponse } from "next";
import {
  EmailMetaData,
  getTemplateData,
  parseTemplate,
  resend,
} from "../lib/mail-template";

import { Context } from ".keystone/types";
import { getPdf } from "./pdf";

export async function mailPreviewAPI(
  req: NextApiRequest,
  res: NextApiResponse,
  context: Context,
) {
  if (!context.session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.query.quote && typeof req.query.quote !== "string") {
    return res.status(400).json({ error: "Invalid quote id (string)" });
  }

  try {
    const data = await getTemplateData({ quote: req.query.quote });
    const text = (await context.sudo().query.Quote.findOne({
      where: { id: req.query.quote },
      query: "emailTemplate { subject template format }",
    })) as {
      emailTemplate: { subject: string; template: string; format: string };
    };

    if (!text) return res.status(404).json({ error: "Quote not found" });

    const subject = parseTemplate({
      text: text.emailTemplate.subject ?? "",
      data: data,
    });

    const body = parseTemplate({
      text: text.emailTemplate.template ?? "",
      data: data,
    });

    res.send({ data: { subject, body, format: text.emailTemplate.format } });
  } catch (e) {
    console.log("[mailPreviewAPI]", e);
    res.status(418).json({ error: e });
  }
}

export async function mailAPI(
  req: NextApiRequest,
  res: NextApiResponse,
  context: Context,
) {
  if (!context.session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.query.quote && typeof req.query.quote !== "string") {
    return res.status(400).json({ error: "Invalid quote id (string)" });
  }
  if (req.query.contract && typeof req.query.contract !== "string") {
    return res.status(400).json({ error: "Invalid contract id (string)" });
  }
  if (req.query.invoice && typeof req.query.invoice !== "string") {
    return res.status(400).json({ error: "Invalid invoice id (string)" });
  }
  if (!req.query.quote || !req.query.contract || !req.query.invoice) {
    return res
      .status(400)
      .json({ error: "Missing id for quote/contract/invoice" });
  }

  try {
    type EmailTemplate = {
      subject: string;
      template: string;
      format: string;
      sender: string;
      local: string;
      domain: string;
    };
    const query =
      "id fullNumber client { email } emailTemplate { subject template format sender local domain }";

    const attachments: { filename: string; content: Buffer }[] = [];
    const meta: EmailMetaData = await getTemplateData({
      quote: req.query.quote,
      contract: req.query.contract,
      invoice: req.query.invoice,
    });
    type ItemData = {
      id: string;
      client: { email: string };
      fullNumber: string;
      emailTemplate: EmailTemplate;
    };

    let item: ItemData;

    //
    // quote
    //
    if (req.query.quote !== void 0) {
      item = (await context.sudo().query.Quote.findOne({
        where: { id: req.query.quote },
        query,
      })) as ItemData;
      if (!item) return res.status(404).json({ error: "Quote not found" });
      attachments.push({
        filename: `Quote-${item.fullNumber}.pdf`,
        content: await getPdf({ path: "quote", id: item.id }),
      });
    }
    //
    // contract
    //
    else if (req.query.contract !== void 0) {
      item = (await context.sudo().query.Contract.findOne({
        where: { id: req.query.contract },
        query,
      })) as ItemData;
      if (!item) return res.status(404).json({ error: "Contract not found" });
      attachments.push({
        filename: `Contract-${item.fullNumber}.pdf`,
        content: await getPdf({ path: "contract", id: item.id }),
      });
    }
    //
    // invoice
    //
    else if (req.query.invoice !== void 0) {
      item = (await context.sudo().query.Invoice.findOne({
        where: { id: req.query.invoice },
        query,
      })) as ItemData;
      if (!item) return res.status(404).json({ error: "Invoice not found" });
      attachments.push({
        filename: `Invoice-${item.fullNumber}.pdf`,
        content: await getPdf({ path: "invoice", id: item.id }),
      });
    }
    //
    // invalid path
    //
    else {
      return res
        .status(404)
        .json({ error: "Invalid path (quote, contract, invoice)" });
    }

    // construct email
    const subject = parseTemplate({
      text: item.emailTemplate.subject ?? "",
      data: meta,
    });
    const body = parseTemplate({
      text: item.emailTemplate.template ?? "",
      data: meta,
    });

    const { data, error } = await resend.emails.send({
      from: `${item.emailTemplate.sender} <${item.emailTemplate.local}@${item.emailTemplate.domain}>`,
      to: [item.client.email],
      subject,
      text: item.emailTemplate.format === "text" ? body : undefined,
      html: item.emailTemplate.format === "html" ? body : undefined,
      attachments: attachments,
    });

    res.send({ data, error });
  } catch (e) {
    console.log("[mailAPI]", e);
    res.status(418).json({ error: e });
  }
}
