/**
 * Utility functions for handling PDF contracts with Cloudinary support
 */

export interface ContractPDFInfo {
  url: string;
  isCloudinary: boolean;
  downloadName?: string;
}

/**
 * Get the appropriate PDF URL for displaying or downloading
 * Prioritizes Cloudinary URLs over local paths
 */
export function getContractPDFUrl(contract: {
  cloudinaryUrl?: string;
  pdfUrl?: string;
  pdfPath?: string;
  productType?: string;
  _id?: string;
}): ContractPDFInfo {
  // Prioritize Cloudinary URL if available
  if (contract.cloudinaryUrl) {
    return {
      url: contract.cloudinaryUrl,
      isCloudinary: true,
      downloadName: `contract-${contract._id || 'download'}.pdf`,
    };
  }

  // Fall back to pdfUrl (legacy)
  if (contract.pdfUrl) {
    return {
      url: contract.pdfUrl,
      isCloudinary: false,
      downloadName: `contract-${contract._id || 'download'}.pdf`,
    };
  }

  // Fall back to pdfPath with base URL (legacy)
  if (contract.pdfPath) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return {
      url: `${baseUrl}/${contract.pdfPath}`,
      isCloudinary: false,
      downloadName: `contract-${contract._id || 'download'}.pdf`,
    };
  }

  // Default to empty (no PDF available)
  return {
    url: '',
    isCloudinary: false,
    downloadName: 'contract.pdf',
  };
}

/**
 * Download a contract PDF
 */
export async function downloadContractPDF(contract: {
  cloudinaryUrl?: string;
  pdfUrl?: string;
  pdfPath?: string;
  productType?: string;
  _id?: string;
}): Promise<void> {
  const pdfInfo = getContractPDFUrl(contract);
  
  if (!pdfInfo.url) {
    throw new Error('No PDF URL available for this contract');
  }

  try {
    // For Cloudinary URLs, we can download directly
    if (pdfInfo.isCloudinary) {
      // Add download transformation to Cloudinary URL
      const downloadUrl = pdfInfo.url.includes('?') 
        ? `${pdfInfo.url}&fl_attachment`
        : `${pdfInfo.url}?fl_attachment`;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = pdfInfo.downloadName || 'contract.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For local URLs, download normally
      const link = document.createElement('a');
      link.href = pdfInfo.url;
      link.download = pdfInfo.downloadName || 'contract.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download contract PDF');
  }
}

/**
 * Check if a contract has a valid PDF URL
 */
export function hasValidPDFUrl(contract: {
  cloudinaryUrl?: string;
  pdfUrl?: string;
  pdfPath?: string;
}): boolean {
  return !!(contract.cloudinaryUrl || contract.pdfUrl || contract.pdfPath);
}

/**
 * Get PDF display URL for iframe or embed
 * This might need different handling for Cloudinary vs local URLs
 */
export function getPDFDisplayUrl(contract: {
  cloudinaryUrl?: string;
  pdfUrl?: string;
  pdfPath?: string;
}): string {
  const pdfInfo = getContractPDFUrl(contract);
  
  if (pdfInfo.isCloudinary) {
    // For Cloudinary PDFs, we might need to add viewing parameters
    return pdfInfo.url;
  }
  
  return pdfInfo.url;
}
