import { WalletType } from "./enums.js";

export class Wallet {
  constructor({
    id,
    user_id,
    name,
    type,
    initial_balance,
    balance,
    include_net_worth = true,
    archived = false,
    annual_budget = null,
    goal = null,
    color = null,
    icon = null,
  }) {
    this.id = id;
    this.userId = user_id;
    this.name = name;
    this.type = type.toUpperCase() in WalletType ? type : WalletType.EXPENSE;
    this.initialBalance = Number(initial_balance);
    this.balance = Number(balance);
    this.includeNetWorth = include_net_worth;
    this.archived = archived;
    this.annualBudget = annual_budget !== null ? Number(annual_budget) : null;
    this.goal = goal !== null ? Number(goal) : null;
    this.color = color;
    this.icon = icon;
  }
}
