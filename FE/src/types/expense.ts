export interface Expense {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  paidBy: string;
  splitType: SplitType;
  splitDetails: SplitDetail[];
  receipt?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SplitDetail {
  userId: string;
  amount: number;
  percentage?: number;
}

export type ExpenseCategory =
  | "food"
  | "transport"
  | "accommodation"
  | "entertainment"
  | "shopping"
  | "other";

export type SplitType = "equal" | "proportional" | "item-based" | "custom";

export interface CreateExpenseRequest {
  groupId: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  paidBy: string;
  splitType: SplitType;
  splitDetails: SplitDetail[];
  receipt?: File;
  tags?: string[];
}

export interface UpdateExpenseRequest {
  title?: string;
  description?: string;
  amount?: number;
  category?: ExpenseCategory;
  splitType?: SplitType;
  splitDetails?: SplitDetail[];
  tags?: string[];
}

export interface ExpenseFilters {
  category?: ExpenseCategory;
  dateFrom?: string;
  dateTo?: string;
  memberId?: string;
  minAmount?: number;
  maxAmount?: number;
}
