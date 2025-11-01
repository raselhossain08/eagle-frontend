"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getUserContracts, type SignedContract } from "@/lib/services/api/contracts";
import { getContractPDFUrl, downloadContractPDF, hasValidPDFUrl } from "@/lib/utils/pdf-utils";

export function ContractsManager() {
  const [contracts, setContracts] = useState<SignedContract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      setLoading(true);
      const userContracts = await getUserContracts();
      setContracts(userContracts);
    } catch (error) {
      console.error("Error loading contracts:", error);
      toast({
        title: "Error",
        description: "Failed to load contracts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (contract: SignedContract) => {
    try {
      await downloadContractPDF(contract);
      toast({
        title: "Success",
        description: "Contract downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading contract:", error);
      toast({
        title: "Error",
        description: "Failed to download contract",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/30">Active</Badge>;
      case "payment_pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">Pending Payment</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/30">Cancelled</Badge>;
      case "signed":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30">Signed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatProductType = (productType: string) => {
    return productType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading contracts...</p>
        </div>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Contracts Found</h3>
          <p className="text-muted-foreground">
            You haven't signed any contracts yet. Subscribe to a package to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Contracts</h2>
        <Badge variant="secondary">{contracts.length} Contract{contracts.length !== 1 ? 's' : ''}</Badge>
      </div>

      <div className="grid gap-4">
        {contracts.map((contract) => {
          const pdfInfo = getContractPDFUrl(contract);
          
          return (
            <Card key={contract._id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {formatProductType(contract.productType)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Contract ID: {contract._id}
                    </p>
                  </div>
                  {getStatusBadge(contract.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Customer</p>
                    <p className="text-sm">{contract.name}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-sm">{contract.email}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Signed Date
                    </p>
                    <p className="text-sm">{formatDate(contract.signedDate)}</p>
                  </div>
                  
                  {contract.amount && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        Amount
                      </p>
                      <p className="text-sm">${contract.amount}</p>
                    </div>
                  )}
                </div>

                {contract.subscriptionType && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Subscription:</span>
                    <Badge variant="outline" className="capitalize">
                      {contract.subscriptionType}
                    </Badge>
                    {contract.subscriptionStartDate && contract.subscriptionEndDate && (
                      <span className="text-muted-foreground">
                        {formatDate(contract.subscriptionStartDate)} - {formatDate(contract.subscriptionEndDate)}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {pdfInfo.isCloudinary ? (
                      <span className="flex items-center gap-1">
                        ☁️ Stored in Cloud
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        💾 Local Storage
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {hasValidPDFUrl(contract) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(contract)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
