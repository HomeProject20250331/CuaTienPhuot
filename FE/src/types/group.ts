export interface Group {
  id: string;
  name: string;
  description?: string;
  currency: string;
  createdBy: string;
  members: GroupMember[];
  settings: GroupSettings;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "member";
  joinedAt: string;
}

export interface GroupSettings {
  defaultCurrency: string;
  allowMemberInvite: boolean;
  requireApprovalForExpense: boolean;
  notificationSettings: {
    email: boolean;
    push: boolean;
  };
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  currency: string;
  memberEmails?: string[];
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  currency?: string;
  settings?: Partial<GroupSettings>;
}

export interface InviteMemberRequest {
  email: string;
  role?: "admin" | "member";
}
