// app/lib/api/subscription.ts
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SubscriptionStatus {
  success: boolean;
  subscription: "None" | "Basic" | "Diamond" | "Infinity" | "Script";
  features: string[];
}

export interface UpdateSubscriptionResponse {
  success: boolean;
  message: string;
  subscription: string;
}

export interface ScheduleDowngradeResponse {
  success: boolean;
  message: string;
  scheduledDowngrade: {
    targetSubscription: string;
    effectiveDate: string;
    currentSubscription: string;
  };
}

export interface CancelDowngradeResponse {
  success: boolean;
  message: string;
}

// Get subscription status
export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  const token = Cookies.get("token");

  if (!token || token.trim() === "") {
    throw new Error("No authentication token found - please login");
  }

  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/subscription/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Get subscription status error:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;

      if (status === 401) {
        throw new Error("Authentication failed - please login again");
      }
      if (status === 404) {
        throw new Error("User not found");
      }
      if (status && status >= 500) {
        throw new Error("Server error - please try again later");
      }

      throw new Error(
        `API Error: ${status} - ${responseData?.message || error.message}`
      );
    }

    throw error;
  }
};

// Update subscription
export const updateSubscription = async (
  subscription: "None" | "Basic" | "Diamond" | "Infinity" | "Script"
): Promise<UpdateSubscriptionResponse> => {
  const token = Cookies.get("token");

  if (!token || token.trim() === "") {
    throw new Error("No authentication token found - please login");
  }

  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  try {
    const res = await axios.put(
      `${API_BASE_URL}/subscription/update`,
      { subscription },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Update subscription error:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;

      if (status === 400) {
        throw new Error(responseData?.message || "Invalid subscription level");
      }
      if (status === 401) {
        throw new Error("Authentication failed - please login again");
      }
      if (status === 403) {
        throw new Error("Access denied - insufficient permissions");
      }
      if (status === 404) {
        throw new Error("User not found");
      }
      if (status && status >= 500) {
        throw new Error("Server error - please try again later");
      }

      throw new Error(
        `API Error: ${status} - ${responseData?.message || error.message}`
      );
    }

    throw error;
  }
};
