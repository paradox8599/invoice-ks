import { type Lists } from ".keystone/types";

import { Client } from "./Client";
import { Contract } from "./Contract";
import { Invoice } from "./Invoice";
import { Quote } from "./Quote";
import { Service } from "./Service";
import { ServiceItem } from "./ServiceItem";
import { ServiceType } from "./ServiceType";
import { User } from "./User";
import { MailTemplate } from "./MailTemplate";
import { FeesTemplate } from "./FeesTemplate";

export const lists: Lists = {
  User,
  Client,
  MailTemplate,
  FeesTemplate,
  ServiceType,
  ServiceItem,
  Service,
  Quote,
  Contract,
  Invoice,
};
