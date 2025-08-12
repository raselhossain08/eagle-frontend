//app/api/contracts/generate-pdf/route.ts
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { renderToStaticMarkup } from "react-dom/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import DiamondContract from "@/components/contracts/DiamondContract";

// Ensure directory exists
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export async function POST(request: Request) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { packageType, contractData } = body;

    if (!packageType || !contractData) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate file path
    const publicDir = path.join(process.cwd(), "public");
    const contractsDir = path.join(publicDir, "contracts");
    ensureDirectoryExists(contractsDir);

    const timestamp = Date.now();
    const fileName = `${packageType}-${contractData.email || "user"}-${timestamp}.pdf`;
    const filePath = path.join(contractsDir, fileName);
    const relativePath = `contracts/${fileName}`;

    // Generate HTML content based on package type
    let htmlContent = "";
    if (packageType === "diamond") {
      // Render Diamond contract component to HTML
      const element = await DiamondContract({
        customerName: contractData.name,
        contractDate: new Date(contractData.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        price: contractData.price,
        signature: contractData.signature,
        preview: false
      });
      htmlContent = renderToStaticMarkup(element);
    } else {
      // Default contract for other package types
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="text-align: center; color: #333;">Service Agreement</h1>
          <p>Date: ${new Date().toLocaleDateString()}</p>
          <p>Customer: ${contractData.name}</p>
          <p>Package: ${packageType}</p>
          <p>By subscribing to our ${packageType} Package, you agree to the following terms:</p>
          <ul>
            <li>Monthly subscription fee of $${contractData.price} will be charged automatically</li>
            <li>Access to all trading scripts and AI-powered tools</li>
            <li>24/7 customer support and regular updates</li>
            <li>30-day money-back guarantee for new subscribers</li>
            <li>You may cancel your subscription at any time</li>
            <li>All trading involves risk - past performance doesn't guarantee future results</li>
          </ul>
          <div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px;">
            <p>Signature:</p>
            <div style="border: 1px solid #ccc; padding: 10px; min-height: 80px;">
              <img src="${contractData.signature}" alt="Signature" style="max-width: 100%; max-height: 100px;" />
            </div>
            <p style="margin-top: 20px;">${contractData.name}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      `;
    }

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.pdf({ path: filePath, format: "A4" });
    await browser.close();

    return NextResponse.json({
      message: "PDF generated successfully",
      data: {
        pdfPath: relativePath,
        pdfUrl: `/contracts/${fileName}`,
      },
    });
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { message: error.message || "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
