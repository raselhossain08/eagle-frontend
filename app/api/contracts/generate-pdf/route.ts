//app/api/contracts/generate-pdf/route.ts
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
// Remove the React DOM server import
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
// We'll replace the direct component usage with HTML templates
// import DiamondContract from "@/components/contracts/DiamondContract";

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
      // Create Diamond contract HTML template directly
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="text-align: center; color: #333;">Diamond Membership Agreement</h1>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="/eagle-logo.png" alt="Eagle Investors Logo" style="max-width: 150px; height: auto;" />
          </div>
          <p style="text-align: right;">Date: ${new Date(contractData.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p><strong>BETWEEN:</strong> Eagle Investors ("Provider")</p>
          <p><strong>AND:</strong> ${contractData.name} ("Client")</p>
          
          <h2 style="margin-top: 30px; color: #333;">1. SERVICES</h2>
          <p>Eagle Investors agrees to provide the Client with access to the Diamond membership package including:</p>
          <ul>
            <li>Premium trading signals and alerts</li>
            <li>Advanced market analysis tools</li>
            <li>Educational resources and training materials</li>
            <li>Priority customer support</li>
            <li>Access to members-only webinars and events</li>
          </ul>
          
          <h2 style="margin-top: 30px; color: #333;">2. TERM & PAYMENT</h2>
          <p>The Client agrees to pay $${contractData.price} on a monthly basis. The membership will continue until cancelled by either party.</p>
          
          <h2 style="margin-top: 30px; color: #333;">3. CONFIDENTIALITY</h2>
          <p>The Client agrees not to share, distribute, or resell any content or materials provided as part of the Diamond membership.</p>
          
          <h2 style="margin-top: 30px; color: #333;">4. DISCLAIMER</h2>
          <p>All investment and trading decisions are the responsibility of the Client. Eagle Investors does not guarantee any specific results or returns. Trading involves risk and past performance is not indicative of future results.</p>
          
          <div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px;">
            <p>Client Signature:</p>
            <div style="border: 1px solid #ccc; padding: 10px; min-height: 80px;">
              <img src="${contractData.signature}" alt="Signature" style="max-width: 100%; max-height: 100px;" />
            </div>
            <p style="margin-top: 20px;">${contractData.name}</p>
            <p>Date: ${new Date(contractData.date).toLocaleDateString()}</p>
          </div>
        </div>
      `;
    } else if (packageType === "infinity") {
      // Create Infinity contract HTML template directly
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="text-align: center; color: #333;">Infinity Membership Agreement</h1>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="/eagle-logo.png" alt="Eagle Investors Logo" style="max-width: 150px; height: auto;" />
          </div>
          <p style="text-align: right;">Date: ${new Date(contractData.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p><strong>BETWEEN:</strong> Eagle Investors ("Provider")</p>
          <p><strong>AND:</strong> ${contractData.name} ("Client")</p>
          
          <h2 style="margin-top: 30px; color: #333;">1. SERVICES</h2>
          <p>Eagle Investors agrees to provide the Client with access to the Infinity membership package including:</p>
          <ul>
            <li>Standard trading signals and alerts</li>
            <li>Basic market analysis tools</li>
            <li>Educational resources</li>
            <li>Regular customer support</li>
          </ul>
          
          <h2 style="margin-top: 30px; color: #333;">2. TERM & PAYMENT</h2>
          <p>The Client agrees to pay $${contractData.price} on a monthly basis. The membership will continue until cancelled by either party.</p>
          
          <h2 style="margin-top: 30px; color: #333;">3. CONFIDENTIALITY</h2>
          <p>The Client agrees not to share, distribute, or resell any content or materials provided as part of the Infinity membership.</p>
          
          <h2 style="margin-top: 30px; color: #333;">4. DISCLAIMER</h2>
          <p>All investment and trading decisions are the responsibility of the Client. Eagle Investors does not guarantee any specific results or returns. Trading involves risk and past performance is not indicative of future results.</p>
          
          <div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px;">
            <p>Client Signature:</p>
            <div style="border: 1px solid #ccc; padding: 10px; min-height: 80px;">
              <img src="${contractData.signature}" alt="Signature" style="max-width: 100%; max-height: 100px;" />
            </div>
            <p style="margin-top: 20px;">${contractData.name}</p>
            <p>Date: ${new Date(contractData.date).toLocaleDateString()}</p>
          </div>
        </div>
      `;
    } else if (packageType === "academy") {
      // Create Academy contract HTML template directly
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="text-align: center; color: #333;">Academy Membership Agreement</h1>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="/eagle-academy-logo.jpeg" alt="Eagle Academy Logo" style="max-width: 150px; height: auto;" />
          </div>
          <p style="text-align: right;">Date: ${new Date(contractData.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p><strong>BETWEEN:</strong> Eagle Investors ("Provider")</p>
          <p><strong>AND:</strong> ${contractData.name} ("Client")</p>
          
          <h2 style="margin-top: 30px; color: #333;">1. SERVICES</h2>
          <p>Eagle Investors agrees to provide the Client with access to the Academy membership package including:</p>
          <ul>
            <li>Educational courses and materials</li>
            <li>Trading methodology training</li>
            <li>Market analysis techniques</li>
            <li>Access to recorded webinars and tutorials</li>
          </ul>
          
          <h2 style="margin-top: 30px; color: #333;">2. TERM & PAYMENT</h2>
          <p>The Client agrees to pay $${contractData.price} on a monthly basis. The membership will continue until cancelled by either party.</p>
          
          <h2 style="margin-top: 30px; color: #333;">3. CONFIDENTIALITY</h2>
          <p>The Client agrees not to share, distribute, or resell any content or materials provided as part of the Academy membership.</p>
          
          <h2 style="margin-top: 30px; color: #333;">4. DISCLAIMER</h2>
          <p>All investment and trading decisions are the responsibility of the Client. Eagle Investors does not guarantee any specific results or returns. Trading involves risk and past performance is not indicative of future results.</p>
          
          <div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px;">
            <p>Client Signature:</p>
            <div style="border: 1px solid #ccc; padding: 10px; min-height: 80px;">
              <img src="${contractData.signature}" alt="Signature" style="max-width: 100%; max-height: 100px;" />
            </div>
            <p style="margin-top: 20px;">${contractData.name}</p>
            <p>Date: ${new Date(contractData.date).toLocaleDateString()}</p>
          </div>
        </div>
      `;
    } else {
      // Generic template for any other contract types
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="text-align: center; color: #333;">${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Membership Agreement</h1>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="/eagle-logo.png" alt="Eagle Investors Logo" style="max-width: 150px; height: auto;" />
          </div>
          <p style="text-align: right;">Date: ${new Date(contractData.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p><strong>BETWEEN:</strong> Eagle Investors ("Provider")</p>
          <p><strong>AND:</strong> ${contractData.name} ("Client")</p>
          
          <h2 style="margin-top: 30px; color: #333;">1. SERVICES</h2>
          <p>Eagle Investors agrees to provide the Client with access to the ${packageType.charAt(0).toUpperCase() + packageType.slice(1)} membership package.</p>
          
          <h2 style="margin-top: 30px; color: #333;">2. TERM & PAYMENT</h2>
          <p>The Client agrees to pay $${contractData.price} on a monthly basis. The membership will continue until cancelled by either party.</p>
          
          <h2 style="margin-top: 30px; color: #333;">3. DISCLAIMER</h2>
          <p>All investment and trading decisions are the responsibility of the Client. Eagle Investors does not guarantee any specific results or returns. Trading involves risk and past performance is not indicative of future results.</p>
          
          <div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px;">
            <p>Client Signature:</p>
            <div style="border: 1px solid #ccc; padding: 10px; min-height: 80px;">
              <img src="${contractData.signature}" alt="Signature" style="max-width: 100%; max-height: 100px;" />
            </div>
            <p style="margin-top: 20px;">${contractData.name}</p>
            <p>Date: ${new Date(contractData.date).toLocaleDateString()}</p>
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
