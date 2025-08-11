import { ContractData } from "../types";

/**
 * Generates a PDF contract based on the contract data and package type
 * @param data Contract data including customer info and package details
 * @returns Promise with the path to the generated PDF
 */
export async function generateContractPDF(data: {
  contractData: {
    name: string;
    date: Date;
    signature: string;
    email: string;
    price: string;
    productName: string;
  };
  packageType: string;
}) {
  try {
    const response = await fetch("/api/contracts/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to generate PDF contract");
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating PDF contract:", error);
    throw error;
  }
}

/**
 * Signs a contract and stores it in the database
 * @param contractData Contract data to be stored
 * @returns Promise with the signed contract data including ID
 */
export async function signContract(contractData: ContractData) {
  try {
    const response = await fetch("/api/contracts/sign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contractData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to sign contract");
    }

    return await response.json();
  } catch (error) {
    console.error("Error signing contract:", error);
    throw error;
  }
}

/**
 * Gets a signed contract by ID
 * @param contractId ID of the contract to retrieve
 * @returns Promise with the contract data
 */
export async function getContract(contractId: string) {
  try {
    const response = await fetch(`/api/contracts/${contractId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get contract");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting contract:", error);
    throw error;
  }
}
