import { CategoryType } from "./enums.js";

export class CategoryGroup {
  constructor({ id, user_id, name, type, color }) {
    this.id = id;
    this.userId = user_id;
    this.name = name;
    this.type =
      type.toUpperCase() in CategoryType ? type : CategoryType.EXPENSE;
    this.color = color;
  }
}

export class Category {
  constructor({
    id,
    category_group_id,
    name,
    icon,
    color,
    group_type,
    exclude_from_overview = false,
  }) {
    this.id = id;
    this.categoryGroupId = category_group_id;
    this.name = name;
    this.icon = icon;
    this.color = color;
    this.type = group_type;
    this.excludeFromOverview = exclude_from_overview;
  }
}
