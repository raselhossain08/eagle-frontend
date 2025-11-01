"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getPublicPlans } from '@/lib/services/api/plan';
import { getSubscriptionStatus } from '@/lib/services/api/subscription';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function APITestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results: any[] = [];

    // Test 1: Public Plans API
    try {
      const plans = await getPublicPlans();
      results.push({
        name: 'Get Public Plans',
        status: 'success',
        data: `Found ${plans.length} plans`,
        details: plans.slice(0, 3).map(p => p.name || p.displayName),
      });
    } catch (error) {
      results.push({
        name: 'Get Public Plans',
        status: 'error',
        error: (error as Error).message,
      });
    }

    // Test 2: Subscription Status (may fail if not logged in)
    try {
      const status = await getSubscriptionStatus();
      results.push({
        name: 'Get Subscription Status',
        status: 'success',
        data: `Current subscription: ${status.subscription}`,
        details: [`Features: ${status.features.length}`],
      });
    } catch (error) {
      results.push({
        name: 'Get Subscription Status',
        status: 'warning',
        error: (error as Error).message,
        note: 'This is expected if not logged in',
      });
    }

    // Test 3: API Base URL Test
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      results.push({
        name: 'API Configuration',
        status: 'success',
        data: `API URL: ${apiUrl}`,
      });
    } else {
      results.push({
        name: 'API Configuration',
        status: 'error',
        error: 'NEXT_PUBLIC_API_URL not configured',
      });
    }

    setTestResults(results);
    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Connection Test</h1>
        <p className="text-muted-foreground">
          Test the connection between frontend and backend services
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connection Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runTests} 
            disabled={testing}
            className="w-full"
          >
            {testing ? 'Running Tests...' : 'Run API Tests'}
          </Button>

          {testResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Test Results:</h3>
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.name}</span>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                  
                  {result.data && (
                    <p className="text-sm text-green-700 mb-2">{result.data}</p>
                  )}
                  
                  {result.error && (
                    <p className="text-sm text-red-700 mb-2">{result.error}</p>
                  )}
                  
                  {result.note && (
                    <p className="text-xs text-gray-600 mb-2 italic">{result.note}</p>
                  )}
                  
                  {result.details && result.details.length > 0 && (
                    <ul className="text-sm text-gray-600 list-disc ml-4">
                      {result.details.map((detail: string, i: number) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Expected Results:</strong>
          <ul className="list-disc ml-4 mt-2">
            <li><strong>Get Public Plans:</strong> Should succeed and return available plans</li>
            <li><strong>Get Subscription Status:</strong> May fail if not logged in (this is normal)</li>
            <li><strong>API Configuration:</strong> Should show the backend URL</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <span className="font-medium">API URL:</span> 
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded">
                {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}
              </code>
            </div>
            <div>
              <span className="font-medium">Environment:</span> 
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded">
                {process.env.NODE_ENV || 'Unknown'}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}