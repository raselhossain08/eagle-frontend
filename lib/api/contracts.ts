import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface SignedContractData {
  name: string;
  email: string;
  signature: string;
  productType: string;
  pdfPath: string;
  subscriptionType?: "monthly" | "yearly";
}

export interface ContractData {
  name: string;
  date: Date;
  signature: string;
}

export interface GenerateContractPDFRequest {
  packageType: string;
  contractData: ContractData;
}

export interface GenerateContractPDFResponse {
  pdfPath: string;
  pdfUrl: string;
}

export interface SignedContract {
  _id: string;
  userId: string;
  name: string;
  email: string;
  signature: string;
  productType: string;
  pdfPath: string;
  signedDate: string;
  status: "signed" | "payment_pending" | "completed" | "cancelled";
  paymentId?: string;
  paymentProvider?: "paypal" | "stripe";
  subscriptionEndDate?: string; // Add subscription end date
  subscriptionStartDate?: string; // Add subscription start date
  createdAt: string;
  updatedAt: string;
  isExisting?: boolean; // Flag to indicate if this was an existing contract
}

// Sign contract
export const signContract = async (
  contractData: SignedContractData
): Promise<SignedContract> => {
  const token = Cookies.get("token");

  const response = await fetch(`${API_URL}/contracts/sign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(contractData),
  });

  const data = await response.json();

  if (!response.ok) {
    // Special handling for "Contract already exists" case (legacy error handling)
    if (
      data.message === "Contract already exists for this product" &&
      data.data
    ) {
      // Create a custom error that includes the existing contract data
      const error = new Error(data.message) as any;
      error.existingContract = data.data;
      throw error;
    }

    // Special handling for active subscription error
    if (
      data.message ===
      "You already have an active subscription for this product"
    ) {
      const error = new Error(data.message) as any;
      error.hasActiveSubscription = true;
      error.existingContract = data.data;
      throw error;
    }

    throw new Error(data.message || "Failed to sign contract");
  }

  // Check if this is an existing contract response
  if (data.existingContract) {
    // For existing contracts, we still return the contract data
    // but we can add a flag to indicate it was existing
    const contract = data.data;
    contract.isExisting = true;
    return contract;
  }

  return data.data;
};

// Update payment status
export const updatePaymentStatus = async (
  contractId: string,
  paymentData: {
    paymentId: string;
    paymentProvider: "paypal" | "stripe";
    status: "completed" | "cancelled";
  }
): Promise<SignedContract> => {
  const token = Cookies.get("token");

  const response = await fetch(`${API_URL}/contracts/${contractId}/payment`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update payment status");
  }

  return data.data;
};

// Get user contracts
export const getUserContracts = async (): Promise<SignedContract[]> => {
  const token = Cookies.get("token");

  const response = await fetch(`${API_URL}/contracts/my-contracts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch contracts");
  }

  return data.data;
};

// Get contract by ID
export const getContractById = async (
  contractId: string
): Promise<SignedContract> => {
  const token = Cookies.get("token");

  const response = await fetch(`${API_URL}/contracts/${contractId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch contract");
  }

  return data.data;
};

// Generate PDF for contract
export const generateContractPDF = async (
  request: GenerateContractPDFRequest
): Promise<GenerateContractPDFResponse> => {
  const token = Cookies.get("token");

  const response = await fetch(`${API_URL}/contracts/generate-pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to generate PDF");
  }

  return data.data;
};
