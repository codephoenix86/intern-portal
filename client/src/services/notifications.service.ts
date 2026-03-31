import api from "@/lib/axios";
import type { Notification } from "@/types/student.types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

type ApiNotification = {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type?: "success" | "info" | string;
};

const toUiNotification = (n: ApiNotification): Notification => ({
  id: Number(n.id),
  message: n.message,
  time: n.time,
  read: n.read,
});

export const notificationsService = {
  listStudent: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{ items: Notification[]; unreadCount: number }> => {
    const { data } = await api.get<
      ApiEnvelope<{
        notifications: ApiNotification[];
        unreadCount: number;
      }>
    >("/student/notifications", { params });

    return {
      items: data.data.notifications.map(toUiNotification),
      unreadCount: data.data.unreadCount,
    };
  },

  listRecruiter: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{ items: Notification[]; unreadCount: number }> => {
    const { data } = await api.get<
      ApiEnvelope<{
        notifications: ApiNotification[];
        unreadCount: number;
      }>
    >("/recruiter/notifications", { params });

    return {
      items: data.data.notifications.map(toUiNotification),
      unreadCount: data.data.unreadCount,
    };
  },

  markStudentRead: async (id: number): Promise<void> => {
    await api.patch(`/student/notifications/${id}/read`);
  },

  markRecruiterRead: async (id: number): Promise<void> => {
    await api.patch(`/recruiter/notifications/${id}/read`);
  },
};

