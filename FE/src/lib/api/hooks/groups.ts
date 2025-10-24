/**
 * Groups API Hooks
 * Custom hooks cho Groups sử dụng React Query
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Group, GroupMember, GroupSettings } from "../../../types/api";
import type { ApiResponse, PaginationResponse } from "../axios-client";
import { apiClient } from "../axios-client";
import { API_CONFIG } from "../config";
import { queryKeys, queryUtils } from "../query-client";

// Re-export types for backward compatibility
export type { Group, GroupMember, GroupSettings };

export interface CreateGroupRequest {
  name: string;
  description?: string;
  avatar?: string;
  currency?: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  avatar?: string;
  currency?: string;
}

export interface UpdateGroupSettingsRequest {
  allowMemberInvite?: boolean;
  requireApprovalForExpense?: boolean;
  defaultCurrency?: string;
  notificationSettings?: {
    newExpense?: boolean;
    newMember?: boolean;
    settlement?: boolean;
  };
}

export interface AddMemberRequest {
  email: string;
  role?: "admin" | "member";
}

export interface GroupInviteLink {
  link: string;
  expiresAt: string;
  maxUses?: number;
}

// API functions
const groupsApi = {
  // Get groups list
  getGroups: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
  }): Promise<PaginationResponse<Group>> => {
    const response = await apiClient.get<PaginationResponse<Group>>(
      API_CONFIG.ENDPOINTS.GROUPS.LIST,
      { params }
    );
    return response.data;
  },

  // Get group detail
  getGroup: async (id: string): Promise<ApiResponse<Group>> => {
    const response = await apiClient.get<ApiResponse<Group>>(
      API_CONFIG.ENDPOINTS.GROUPS.DETAIL(id)
    );
    return response.data;
  },

  // Create group
  createGroup: async (
    data: CreateGroupRequest
  ): Promise<ApiResponse<Group>> => {
    const response = await apiClient.post<ApiResponse<Group>>(
      API_CONFIG.ENDPOINTS.GROUPS.CREATE,
      data
    );
    return response.data;
  },

  // Update group
  updateGroup: async (
    id: string,
    data: UpdateGroupRequest
  ): Promise<ApiResponse<Group>> => {
    const response = await apiClient.put<ApiResponse<Group>>(
      API_CONFIG.ENDPOINTS.GROUPS.UPDATE(id),
      data
    );
    return response.data;
  },

  // Delete group
  deleteGroup: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.GROUPS.DELETE(id)
    );
    return response.data;
  },

  // Get group members
  getGroupMembers: async (id: string): Promise<ApiResponse<GroupMember[]>> => {
    const response = await apiClient.get<ApiResponse<GroupMember[]>>(
      API_CONFIG.ENDPOINTS.GROUPS.MEMBERS(id)
    );
    return response.data;
  },

  // Add member to group
  addMember: async (
    id: string,
    data: AddMemberRequest
  ): Promise<ApiResponse<GroupMember>> => {
    const response = await apiClient.post<ApiResponse<GroupMember>>(
      API_CONFIG.ENDPOINTS.GROUPS.MEMBERS(id),
      data
    );
    return response.data;
  },

  // Remove member from group
  removeMember: async (
    groupId: string,
    userId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API_CONFIG.ENDPOINTS.GROUPS.MEMBERS(groupId)}/${userId}`
    );
    return response.data;
  },

  // Get invite link
  getInviteLink: async (id: string): Promise<ApiResponse<GroupInviteLink>> => {
    const response = await apiClient.get<ApiResponse<GroupInviteLink>>(
      API_CONFIG.ENDPOINTS.GROUPS.INVITE(id)
    );
    return response.data;
  },

  // Update group settings
  updateGroupSettings: async (
    id: string,
    data: UpdateGroupSettingsRequest
  ): Promise<ApiResponse<GroupSettings>> => {
    const response = await apiClient.put<ApiResponse<GroupSettings>>(
      `${API_CONFIG.ENDPOINTS.GROUPS.DETAIL(id)}/settings`,
      data
    );
    return response.data;
  },

  // Leave group
  leaveGroup: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.GROUPS.LEAVE(id)
    );
    return response.data;
  },
};

// Custom hooks
export function useGroups(params?: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: [...queryKeys.groups.all, params],
    queryFn: () => groupsApi.getGroups(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: queryKeys.groups.detail(id),
    queryFn: () => groupsApi.getGroup(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useGroupMembers(id: string) {
  return useQuery({
    queryKey: queryKeys.groups.members(id),
    queryFn: () => groupsApi.getGroupMembers(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupsApi.createGroup,
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate groups list
        queryUtils.invalidateGroups();

        // Add new group to cache
        if (response.data) {
          queryClient.setQueryData(
            queryKeys.groups.detail(response.data.id),
            response
          );
        }
      }
    },
    onError: (error) => {
      console.error("Create group failed:", error);
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGroupRequest }) =>
      groupsApi.updateGroup(id, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Update group in cache
        queryClient.setQueryData(
          queryKeys.groups.detail(variables.id),
          response
        );

        // Invalidate groups list
        queryUtils.invalidateGroups();
      }
    },
    onError: (error) => {
      console.error("Update group failed:", error);
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupsApi.deleteGroup,
    onSuccess: (response, groupId) => {
      if (response.success) {
        // Remove group from cache
        queryClient.removeQueries({
          queryKey: queryKeys.groups.detail(groupId),
        });

        // Invalidate groups list
        queryUtils.invalidateGroups();
      }
    },
    onError: (error) => {
      console.error("Delete group failed:", error);
    },
  });
}

export function useAddMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: AddMemberRequest;
    }) => groupsApi.addMember(groupId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate group members
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.members(variables.groupId),
        });

        // Invalidate group detail
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.detail(variables.groupId),
        });
      }
    },
    onError: (error) => {
      console.error("Add member failed:", error);
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      groupsApi.removeMember(groupId, userId),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate group members
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.members(variables.groupId),
        });

        // Invalidate group detail
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.detail(variables.groupId),
        });
      }
    },
    onError: (error) => {
      console.error("Remove member failed:", error);
    },
  });
}

export function useInviteLink(groupId: string) {
  return useQuery({
    queryKey: [...queryKeys.groups.detail(groupId), "invite-link"],
    queryFn: () => groupsApi.getInviteLink(groupId),
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateGroupSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: UpdateGroupSettingsRequest;
    }) => groupsApi.updateGroupSettings(groupId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate group detail
        queryClient.invalidateQueries({
          queryKey: queryKeys.groups.detail(variables.groupId),
        });
      }
    },
    onError: (error) => {
      console.error("Update group settings failed:", error);
    },
  });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupsApi.leaveGroup,
    onSuccess: (response, groupId) => {
      if (response.success) {
        // Remove group from cache
        queryClient.removeQueries({
          queryKey: queryKeys.groups.detail(groupId),
        });

        // Invalidate groups list
        queryUtils.invalidateGroups();
      }
    },
    onError: (error) => {
      console.error("Leave group failed:", error);
    },
  });
}
