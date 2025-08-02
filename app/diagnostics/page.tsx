"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DiagnosticsPage() {
  useEffect(() => {
    // Auto-run diagnostics when page loads
    import("../../utils/payment-diagnostics").then(({ paymentDiagnostics }) => {
      paymentDiagnostics();
    });
  }, []);

  const runManualDiagnostics = () => {
    import("../../utils/payment-diagnostics").then(({ paymentDiagnostics }) => {
      paymentDiagnostics();
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Payment System Diagnostics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ol className="text-sm space-y-1 list-decimal ml-4">
              <li>Open browser developer console (F12)</li>
              <li>Look for diagnostic messages</li>
              <li>Check for any errors or missing configurations</li>
              <li>Run manual test if needed</li>
            </ol>
          </div>

          <div className="space-y-2">
            <Button onClick={runManualDiagnostics} className="w-full">
              Run Manual Diagnostics
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Results will appear in the browser console
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Common Issues:</h3>
            <ul className="text-sm space-y-1 list-disc ml-4">
              <li>Environment variables not set correctly</li>
              <li>Backend server not running on port 5000</li>
              <li>CORS issues with API calls</li>
              <li>PayPal/Stripe SDK loading failures</li>
              <li>Authentication token missing</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Next Steps:</h3>
            <p className="text-sm">
              If diagnostics show issues, check the browser console for specific
              error messages. Common fixes include restarting servers, checking
              environment variables, and ensuring proper authentication.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
