export interface IUsre {
  id: string;
  email: string;
}

export interface IEvent {
  name: "open" | "click" | "purchase"; // Adjust if you allow custom events
  state: "pending" | "completed";
}

export interface IBranch {
  event: string;
  next: string;
}

export type NodeType = "SendEmail" | "Wait" | "Condition" | "End";

export interface IBaseNode {
  id: string;
  type: NodeType;
  level: number;
  events: IEvent[];
}

export interface ISendEmailNode extends IBaseNode {
  type: "SendEmail";
  emailTemplateId: string;
  next: string;
}

export interface IWaitNode extends IBaseNode {
  type: "Wait";
  duration: string;
  next: string;
}

export interface IConditionNode extends IBaseNode {
  type: "Condition";
  dependentOn: string;
  hasRemainder: boolean;
  branches: IBranch[];
}

export interface IEndNode extends IBaseNode {
  type: "End";
}

export type CampaignNode =
  | ISendEmailNode
  | IWaitNode
  | IConditionNode
  | IEndNode;

export interface ICampaign {
  _id?: string;
  name: string;
  customerEmail?: string;
  state: "default" | "active" | "paused" | "ended";
  visitedNodes: string[];
  nodes: CampaignNode[];
}
