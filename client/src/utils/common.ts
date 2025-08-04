import { ICampaign } from "../types";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const dummyCampaign: ICampaign = {
  _id: "1234",
  name: "MacBook Promo Sequence",
  userId: "12345",
  customerEmail: "customer@example.com",
  state: "default",
  visitedNodes: ["n1"],
  currentNodeId: "n1",
  unreachableNodes: ["n1"],
  nodes: [
    {
      id: "n1",
      type: "SendEmail",
      level: 1,
      emailTemplateId: "welcome_email",
      events: [
        {
          name: "open",
          state: "pending",
        },
      ],
      branches: [],
      next: "n2",
    },
    {
      id: "n2",
      type: "Wait",
      level: 2,
      duration: "2d",
      events: [],
      branches: [],
      next: "n3",
    },
    {
      id: "n3",
      type: "Condition",
      level: 3,
      dependentOn: "n1",
      hasRemainder: true,
      events: [],
      branches: [
        {
          event: "open",
          next: "n4",
        },
        {
          event: "default",
          next: "n5",
        },
        {
          event: "remainder",
          next: "n1",
        },
      ],
    },
    {
      id: "n4",
      type: "SendEmail",
      level: 4,
      emailTemplateId: "offer_email",
      events: [],
      branches: [],
      next: "n6",
    },
    {
      id: "n5",
      type: "End",
      level: 4,
      events: [],
      branches: [],
    },
    {
      id: "n6",
      type: "End",
      level: 5,
      events: [],
      branches: [],
    },
  ],
};
