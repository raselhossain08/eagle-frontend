"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, FileText, Pen, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PaymentMethodSelector } from "@/components/payment-method-selector";
import {
  signContract,
  getUserContracts,
  type SignedContractData,
} from "@/lib/api/contracts";
import DiamondContract from "@/components/contracts/DiamondContract";
import InfinityContract from "@/components/contracts/InfinityContract";
import BasicContract from "@/components/contracts/BasicContract";
import SignatureCanvas from "@/components/signature-canvas";

interface SubscriptionContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionType: "monthly" | "yearly";
  packageType: "diamond" | "infinity" | "basic" | string;
  onPaymentSuccess?: (paymentData: any) => void;
  upgradeMode?: boolean;
}

interface SignatureData {
  name: string;
  email: string;
  signature: string;
}

interface PaymentData {
  paymentMethod: "stripe" | "paypal";
  amount: number;
  subscriptionType: "monthly" | "yearly";
}

type Step = "contract" | "signature" | "payment" | "complete";

export default function SubscriptionContractModal({
  isOpen,
  onClose,
  subscriptionType,
  packageType,
  onPaymentSuccess,
  upgradeMode = false,
}: SubscriptionContractModalProps) {
  const [step, setStep] = useState<Step>("contract");
  const [signatureData, setSignatureData] = useState<SignatureData>({
    name: "",
    email: "",
    signature: "",
  });
  const [paymentData, setPaymentData] = useState<PaymentData>({
    paymentMethod: "stripe",
    amount: subscriptionType === "yearly" ? 997 : 97,
    subscriptionType,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [contractId, setContractId] = useState<string>("");
  const [existingContract, setExistingContract] = useState<any>(null);

  const resetModal = () => {
    setStep("contract");
    setSignatureData({ name: "", email: "", signature: "" });
    setContractId("");
    setExistingContract(null);
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    } else {
      // Check if user already has a contract for this product
      checkExistingContract();
    }
  }, [isOpen]);

  const checkExistingContract = async () => {
    try {
      const contracts = await getUserContracts();
      const existing = contracts.find((contract) => 
        contract.productType === packageType && 
        contract.status !== "cancelled"
      );
      
      if (existing) {
        setExistingContract(existing);
        setContractId(existing._id);
        // For existing contracts, skip to payment
        setStep("payment");
      }
    } catch (error) {
      // If there's an error fetching contracts, just proceed normally
      console.log("Could not check existing contracts:", error);
    }
  };

  const handleSignContract = async () => {
    if (!signatureData.name || !signatureData.email || !signatureData.signature) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and provide a signature.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Store the signed contract (no PDF generation needed)
      const signedContractData: SignedContractData = {
        name: signatureData.name,
        email: signatureData.email,
        signature: signatureData.signature,
        productType: packageType,
        subscriptionType,
      };

      const result = await signContract(signedContractData);
      setContractId(result._id);

      if (result.isExisting) {
        toast({
          title: "Existing Contract Found",
          description:
            "Using your existing contract for this package. Proceeding to payment.",
        });
      } else {
        toast({
          title: "Success",
          description: "Contract signed successfully",
        });
      }

      setStep("payment");
    } catch (error: any) {
      console.error("Error signing contract:", error);

      // Handle existing contract errors
      if (error.message === "Contract already exists for this product" && error.existingContract) {
        setExistingContract(error.existingContract);
        setContractId(error.existingContract._id);
        
        toast({
          title: "Contract Found",
          description: "Using your existing contract. Proceeding to payment.",
        });
        setStep("payment");
        return;
      }

      // Handle active subscription error
      if (error.hasActiveSubscription || error.message === "You already have an active subscription for this product") {
        toast({
          title: "Active Subscription",
          description:
            "You already have an active subscription for this product.",
          variant: "destructive",
        });
        onClose();
        return;
      }

      toast({
        title: "Error",
        description: error.message || "Failed to sign contract",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (data: any) => {
    setStep("complete");
    toast({
      title: "Payment Successful!",
      description: "Your subscription is now active.",
    });

    if (onPaymentSuccess) {
      onPaymentSuccess(data);
    }

    // Close modal after a delay
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const getContractComponent = () => {
    const contractProps = {
      customerName: signatureData.name || "Customer Name",
      contractDate: new Date().toLocaleDateString(),
      price: paymentData.amount.toString(),
    };

    switch (packageType.toLowerCase()) {
      case "diamond":
        return <DiamondContract {...contractProps} />;
      case "infinity":
        return <InfinityContract {...contractProps} />;
      case "basic":
        return <BasicContract {...contractProps} />;
      default:
        return <BasicContract {...contractProps} />;
    }
  };

  const getStepIcon = (stepName: Step, currentStep: Step, completedSteps: Step[]) => {
    if (completedSteps.includes(stepName) || (currentStep === "complete" && stepName !== "complete")) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    
    if (currentStep === stepName) {
      return getDefaultIcon(stepName, "text-blue-500");
    }
    
    return getDefaultIcon(stepName, "text-gray-400");
  };

  const getDefaultIcon = (stepName: Step, className: string) => {
    switch (stepName) {
      case "contract":
        return <FileText className={`h-5 w-5 ${className}`} />;
      case "signature":
        return <Pen className={`h-5 w-5 ${className}`} />;
      case "payment":
        return <CreditCard className={`h-5 w-5 ${className}`} />;
      case "complete":
        return <CheckCircle className={`h-5 w-5 ${className}`} />;
      default:
        return <FileText className={`h-5 w-5 ${className}`} />;
    }
  };

  const completedSteps: Step[] = [];
  if (step === "signature" || step === "payment" || step === "complete") {
    completedSteps.push("contract");
  }
  if (step === "payment" || step === "complete") {
    completedSteps.push("signature");
  }
  if (step === "complete") {
    completedSteps.push("payment");
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            {upgradeMode ? "Upgrade Subscription" : "Subscribe to"} {packageType.charAt(0).toUpperCase() + packageType.slice(1)} Plan
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-8 mb-6">
          <div className="flex items-center space-x-2">
            {getStepIcon("contract", step, completedSteps)}
            <span className={`text-sm ${step === "contract" ? "text-blue-500 font-medium" : completedSteps.includes("contract") ? "text-green-500" : "text-gray-400"}`}>
              Review Contract
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getStepIcon("signature", step, completedSteps)}
            <span className={`text-sm ${step === "signature" ? "text-blue-500 font-medium" : completedSteps.includes("signature") ? "text-green-500" : "text-gray-400"}`}>
              Sign Contract
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getStepIcon("payment", step, completedSteps)}
            <span className={`text-sm ${step === "payment" ? "text-blue-500 font-medium" : completedSteps.includes("payment") ? "text-green-500" : "text-gray-400"}`}>
              Payment
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getStepIcon("complete", step, completedSteps)}
            <span className={`text-sm ${step === "complete" ? "text-green-500 font-medium" : "text-gray-400"}`}>
              Complete
            </span>
          </div>
        </div>

        {/* Step Content */}
        {step === "contract" && (
          <div>
            <Card className="mb-4">
              <CardContent className="p-6">
                {getContractComponent()}
              </CardContent>
            </Card>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep("signature")}>
                I Agree - Continue to Sign
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "signature" && (
          <div>
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={signatureData.name}
                    onChange={(e) => setSignatureData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={signatureData.email}
                    onChange={(e) => setSignatureData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Digital Signature *</Label>
                <div className="mt-2">
                  <SignatureCanvas
                    onSignatureChange={(signature) => 
                      setSignatureData(prev => ({ ...prev, signature }))
                    }
                    width={400}
                    height={200}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("contract")}>
                Back
              </Button>
              <Button 
                onClick={handleSignContract}
                disabled={isLoading || !signatureData.name || !signatureData.email || !signatureData.signature}
              >
                {isLoading ? "Signing..." : "Sign Contract"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "payment" && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
              <p className="text-gray-600">
                Complete your payment to activate your {packageType} subscription.
              </p>
            </div>

            <PaymentMethodSelector
              amount={paymentData.amount.toString()}
              subscriptionType={subscriptionType}
              contractId={contractId}
              productName={`${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Subscription`}
              onPaymentSuccess={handlePaymentSuccess}
            />

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "complete" && (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-green-600 mb-2">
              Subscription Activated!
            </h3>
            <p className="text-gray-600 mb-4">
              Welcome to {packageType.charAt(0).toUpperCase() + packageType.slice(1)}! Your subscription is now active.
            </p>
            <p className="text-sm text-gray-500">
              This window will close automatically...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
