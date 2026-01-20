export class UserSettings {
  constructor({
    id,
    userId,
    defaultWalletId,
    defaultExpenseCategoryId,
    defaultIncomeCategoryId,
    defaultTransferCategoryId,
    jsonPreferences,
  }) {
    this.id = id;
    this.userId = userId;
    this.defaultWalletId = defaultWalletId;
    this.defaultExpenseCategoryId = defaultExpenseCategoryId;
    this.defaultIncomeCategoryId = defaultIncomeCategoryId;
    this.defaultTransferCategoryId = defaultTransferCategoryId;
    this.jsonPreferences = jsonPreferences;
  }
}
