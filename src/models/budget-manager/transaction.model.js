import { TransactionType, RecurrenceType } from "./enums.js";

export class Transaction {
  constructor({
    id,
    user_id,
    category_id,
    type,
    amount,
    date,
    description = "",
    scheduled = false,
    recurrence,
    exclude_from_wallet = false,
    wallet_id = null,
    from_wallet_id = null,
    to_wallet_id = null,
    // Metadata
    category_name = null,
    category_icon = null,
    category_group_color = null,
    from_wallet_name = null,
    to_wallet_name = null,
    transfer_from = null,
    transfer_to = null,
  }) {
    this.id = id;
    this.userId = user_id;
    this.categoryId = category_id;
    this.type =
      type?.toUpperCase() in TransactionType ? type : TransactionType.EXPENSE;
    this.amount = Number(amount);
    this.date = new Date(date);
    this.description = description;
    this.scheduled = scheduled;
    this.recurrence =
      recurrence?.toUpperCase() in RecurrenceType
        ? recurrence
        : RecurrenceType.NONE;
    this.excludeFromWallet = exclude_from_wallet;

    this.walletId = wallet_id;
    this.fromWalletId = from_wallet_id || transfer_from;
    this.toWalletId = to_wallet_id || transfer_to;

    this.categoryName = category_name;
    this.categoryIcon = category_icon;
    this.categoryGroupColor = category_group_color;
    this.fromWalletName = from_wallet_name;
    this.toWalletName = to_wallet_name;
  }
}
