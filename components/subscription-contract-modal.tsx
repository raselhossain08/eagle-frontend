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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Pen, CreditCard, ShoppingCart, Sparkles } from "lucide-react";
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

type Step = "review" | "contract" | "signature" | "payment" | "complete";

const steps = [
  { id: 1, title: "Review Package", icon: ShoppingCart, key: "review" },
  { id: 2, title: "Sign Contract", icon: FileText, key: "contract" },
  { id: 3, title: "Contact Info", icon: Pen, key: "signature" },
  { id: 4, title: "Payment", icon: CreditCard, key: "payment" },
  { id: 5, title: "Complete", icon: Sparkles, key: "complete" },
];

function SubscriptionContractModal({
  isOpen,
  onClose,
  subscriptionType,
  packageType,
  onPaymentSuccess,
  upgradeMode = false,
}: SubscriptionContractModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
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

  // Helper function to get package price
  const getPackagePrice = () => {
    const prices = {
      diamond: subscriptionType === 'monthly' ? 200 : 2000,
      script: subscriptionType === 'monthly' ? 50 : 500,
      infinity: subscriptionType === 'monthly' ? 100 : 1000,
      basic: subscriptionType === 'monthly' ? 25 : 250
    };
    return prices[packageType as keyof typeof prices] || 97;
  };

  const resetModal = () => {
    setCurrentStep(1);
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
        setCurrentStep(4);
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

      setCurrentStep(4); // Payment step
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
        setCurrentStep(4);
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
    setCurrentStep(5);
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

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl text-center text-white">
            {upgradeMode ? "Upgrade to" : "Subscribe to"} {packageType.charAt(0).toUpperCase() + packageType.slice(1)} Plan
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      isCompleted
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500 text-white"
                        : isCurrent
                          ? "border-purple-500 text-purple-400 bg-purple-500/10"
                          : "border-slate-600 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-2 ${
                        isCompleted ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-slate-600"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs">
            {steps.map((step) => (
              <span key={step.id} className={`${currentStep >= step.id ? "text-purple-400" : "text-slate-400"} text-center max-w-[80px]`}>
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {currentStepData && (
                <>
                  <currentStepData.icon className="w-6 h-6 text-purple-400" />
                  Step {currentStep}: {currentStepData.title}
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Review Package */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      {packageType.charAt(0).toUpperCase() + packageType.slice(1)} Subscription
                    </h3>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      Premium Package
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 text-slate-300 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Premium market analysis and insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Exclusive investment opportunities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Advanced trading strategies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Personalized portfolio recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>24/7 premium support</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-600 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Subscription Type:</span>
                      <span className="text-white font-semibold capitalize">{subscriptionType}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-slate-300">Total:</span>
                      <span className="text-2xl font-bold text-white">
                        ${getPackagePrice().toLocaleString()}
                        <span className="text-sm text-slate-400 ml-1">
                          /{subscriptionType === "yearly" ? "year" : "month"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(2)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex-1"
                  >
                    Continue to Contract
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Sign Contract */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Contract Agreement</h3>
                  <div className="max-h-64 overflow-y-auto bg-slate-800 p-4 rounded border border-slate-600">
                    {getContractComponent()}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    Back
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex-1"
                  >
                    I Agree - Continue to Sign
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Contact Info & Signature */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Contact Information & Signature</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label htmlFor="name" className="text-slate-300">Full Name *</Label>
                      <Input
                        id="name"
                        value={signatureData.name}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        required
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-slate-300">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={signatureData.email}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email address"
                        required
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">Digital Signature *</Label>
                    <div className="mt-2 bg-slate-800 p-2 rounded border border-slate-600">
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

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    Back
                  </Button>
                  <Button 
                    onClick={handleSignContract}
                    disabled={isLoading || !signatureData.name || !signatureData.email || !signatureData.signature}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex-1"
                  >
                    {isLoading ? "Signing Contract..." : "Sign Contract & Continue"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Complete Your Payment</h3>
                  <p className="text-slate-300 mb-4">
                    Complete your payment to activate your {packageType} subscription.
                  </p>
                  
                  <div className="bg-slate-800 p-4 rounded border border-slate-600 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Package:</span>
                      <span className="text-white font-medium">{packageType.charAt(0).toUpperCase() + packageType.slice(1)} Subscription</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-slate-300">Billing:</span>
                      <span className="text-white font-medium capitalize">{subscriptionType}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-slate-300">Total:</span>
                      <span className="text-xl font-bold text-white">${getPackagePrice().toLocaleString()}</span>
                    </div>
                  </div>

                  <PaymentMethodSelector
                    amount={getPackagePrice().toString()}
                    subscriptionType={subscriptionType}
                    contractId={contractId}
                    productName={`${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Subscription`}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Complete */}
            {currentStep === 5 && (
              <div className="text-center py-12">
                <div className="bg-slate-700/50 rounded-lg p-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Subscription Activated!
                  </h3>
                  <p className="text-slate-300 mb-2 text-lg">
                    Welcome to {packageType.charAt(0).toUpperCase() + packageType.slice(1)}! Your subscription is now active.
                  </p>
                  <p className="text-slate-400 text-sm">
                    This window will close automatically in a few seconds...
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

// Export both default and named export for compatibility
export { SubscriptionContractModal };
export default SubscriptionContractModal;
