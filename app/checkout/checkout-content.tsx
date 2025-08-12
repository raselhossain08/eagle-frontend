"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle,
  CreditCard,
  FileText,
  User,
  ShoppingCart,
  Sparkles,
  Pen,
} from "lucide-react";
import { PaymentMethodSelector } from "@/components/payment-method-selector";
import SignatureCanvas from "@/components/signature-canvas";
import { toast } from "@/hooks/use-toast";
import {
  signContract,
  updatePaymentStatus,
  getUserContracts,
  generateContractPDF,
} from "@/lib/api/contracts";
import { useAuth } from "@/context/authContext";
import { mockUser } from "@/lib/data";
import DiamondContract from "@/components/contracts/DiamondContract";
import InfinityContract from "@/components/contracts/InfinityContract";
import BasicContract from "@/components/contracts/BasicContract";
import ScriptContract from "@/components/contracts/ScriptContract";
import TradingTutorContract from "@/components/contracts/TradingTutorContract";
import UltimateContract from "@/components/contracts/UltimateContract";
import InvestmentAdvisingContract from "@/components/contracts/InvestmentAdvisingContract";

interface CartItem {
  id: string;
  name: string;
  price: string | number;
  memberPrice?: string | number;
  quantity?: number;
  type?: string;
  description?: string;
  features?: string[];
  originalPrice?: number;
  savings?: number;
}

const steps = [
  { id: 1, title: "Review Order", icon: ShoppingCart },
  { id: 2, title: "Contact Info", icon: User },
  { id: 3, title: "Sign Contract", icon: FileText },
  { id: 4, title: "Payment", icon: CreditCard },
  { id: 5, title: "Complete", icon: Sparkles },
];

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [contractId, setContractId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    contactInfo: {
      name: mockUser.name || "",
      email: mockUser.email || "",
      phone: "",
      company: "",
    },
    contractAccepted: false,
    paymentMethod: "card",
  });
  
  const [signatureData, setSignatureData] = useState({
    customerName: mockUser.name || "",
    customerEmail: mockUser.email || "",
    signature: "",
  });

  // Ensure contactInfo and signatureData are in sync
  useEffect(() => {
    if (user) {
      // Set form data based on available user information
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          // Use mockUser as fallback since the user object might not have name/email
          name: mockUser.name || prev.contactInfo.name,
          email: mockUser.email || prev.contactInfo.email,
        }
      }));
      
      setSignatureData(prev => ({
        ...prev,
        customerName: mockUser.name || prev.customerName,
        customerEmail: mockUser.email || prev.customerEmail,
      }));
    }
  }, [user]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateContactInfo = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
    
    // Keep signature data in sync with contact info
    if (field === "name") {
      setSignatureData(prev => ({
        ...prev,
        customerName: value
      }));
    } else if (field === "email") {
      setSignatureData(prev => ({
        ...prev,
        customerEmail: value
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    // Load cart data from localStorage
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));

      // Check for existing contracts that might be pending payment
      checkForExistingContract(JSON.parse(savedCart));
    } else {
      // If no cart data, redirect back
      router.push("/advising");
    }
  }, [router]);

  // Check for existing contracts that are signed but pending payment
  const checkForExistingContract = async (cartData: CartItem[]) => {
    try {
      const contracts = await getUserContracts();

      // Determine product type from cart data
      const firstItem = cartData[0];
      if (!firstItem) return;

      let productType = "mentorship-package";

      // Handle subscription upgrades
      if (
        firstItem.id.includes("subscription-") ||
        firstItem.type?.includes("subscription")
      ) {
        if (
          firstItem.id.includes("diamond") ||
          firstItem.name?.toLowerCase().includes("diamond")
        ) {
          productType = "diamond-subscription";
        } else if (
          firstItem.id.includes("infinity") ||
          firstItem.name?.toLowerCase().includes("infinity")
        ) {
          productType = "infinity-subscription";
        } else {
          productType = "subscription-upgrade";
        }
      }

      // Look for any contract with this product type
      const existingContract = contracts.find(
        (contract: any) => contract.productType === productType
      );

      if (existingContract) {
        // Check if it's an active completed subscription
        if (existingContract.status === "completed") {
          const now = new Date();
          const endDate = existingContract.subscriptionEndDate
            ? new Date(existingContract.subscriptionEndDate)
            : null;

          if (endDate && endDate > now) {
            // Active subscription found - redirect immediately
            toast({
              title: "Active Subscription Found",
              description:
                "You already have an active subscription for this product. Redirecting to your subscription dashboard...",
              variant: "destructive",
            });

            setTimeout(() => {
              router.push("/hub");
            }, 2000);
            return;
          }
        }

        // Check for signed or payment_pending contracts
        if (
          existingContract.status === "signed" ||
          existingContract.status === "payment_pending"
        ) {
          // Found an existing contract, skip to payment step
          setContractId(existingContract._id);
          setCurrentStep(4); // Adjust to match new step index for payment

          toast({
            title: "Existing Contract Found",
            description:
              "Using your existing signed contract. Proceeding to payment.",
          });
        }
      }
    } catch (error) {
      console.error("Error checking for existing contracts:", error);
      // Don't show error to user, just proceed normally
    }
  };

  const currentSubscription = user?.subscription || "None";
  const useMemberPrice = currentSubscription !== "None";

  const getTotalPrice = (useMemberPrice: boolean = false) => {
    return cartItems.reduce((total: number, item: CartItem) => {
      let priceValue =
        useMemberPrice && item.memberPrice ? item.memberPrice : item.price;

      // Handle both string and number types
      if (typeof priceValue === "string") {
        priceValue = parseFloat(priceValue.replace(/[,$]/g, ""));
      } else if (typeof priceValue === "number") {
        priceValue = priceValue;
      } else {
        priceValue = 0;
      }

      const quantity = item.quantity || 1;
      return total + priceValue * quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total: number, item: CartItem) => total + (item.quantity || 1), 0);
  };

  const isDiamondPackage = () => {
    const firstItem = cartItems[0];
    if (!firstItem) return false;
    
    return (
      firstItem.id.includes("diamond") || 
      (firstItem.name && firstItem.name.toLowerCase().includes("diamond")) ||
      (firstItem.type && firstItem.type.toLowerCase().includes("diamond"))
    );
  };
  
  const isInfinityPackage = () => {
    const firstItem = cartItems[0];
    if (!firstItem) return false;
    
    return (
      firstItem.id.includes("infinity") || 
      (firstItem.name && firstItem.name.toLowerCase().includes("infinity")) ||
      (firstItem.type && firstItem.type.toLowerCase().includes("infinity"))
    );
  };
  
  const isBasicPackage = () => {
    const firstItem = cartItems[0];
    if (!firstItem) return false;
    
    return (
      firstItem.id.includes("basic") || 
      (firstItem.name && firstItem.name.toLowerCase().includes("basic")) ||
      (firstItem.type && firstItem.type.toLowerCase().includes("basic"))
    );
  };
  
  const isTradingTutorPackage = () => {
    const firstItem = cartItems[0];
    if (!firstItem) return false;
    
    return (
      firstItem.id.includes("trading-tutor") || 
      (firstItem.name && firstItem.name.toLowerCase().includes("trading tutor")) ||
      (firstItem.type && firstItem.type.toLowerCase().includes("trading tutor"))
    );
  };
  
  const isUltimatePackage = () => {
    const firstItem = cartItems[0];
    if (!firstItem) return false;
    
    return (
      firstItem.id.includes("ultimate") || 
      (firstItem.name && firstItem.name.toLowerCase().includes("ultimate")) ||
      (firstItem.type && firstItem.type.toLowerCase().includes("ultimate"))
    );
  };
  
  const getProductType = () => {
    // Map cart items to product type based on ID patterns
    const firstItem = cartItems[0];
    if (!firstItem) return "mentorship-package";

    // Handle subscription upgrades
    if (
      firstItem.id.includes("subscription-") ||
      firstItem.type?.includes("subscription")
    ) {
      if (
        firstItem.id.includes("diamond") ||
        firstItem.name?.toLowerCase().includes("diamond")
      ) {
        return "diamond-subscription";
      } else if (
        firstItem.id.includes("infinity") ||
        firstItem.name?.toLowerCase().includes("infinity")
      ) {
        return "infinity-subscription";
      } else if (
        firstItem.id.includes("basic") ||
        firstItem.name?.toLowerCase().includes("basic")
      ) {
        return "basic-subscription";
      }
    }

    // Handle upgrade packages
    if (firstItem.id.includes("upgrade-")) {
      if (firstItem.id.includes("diamond")) {
        return "diamond-subscription";
      } else if (firstItem.id.includes("infinity")) {
        return "infinity-subscription";
      }
    }

    // Handle specific mentorship packages first
    if (firstItem.id === "eagle-ultimate") {
      return "eagle-ultimate";
    } else if (firstItem.id === "investment-advising") {
      return "investment-advising";
    } else if (firstItem.id === "trading-tutor") {
      return "trading-tutor";
    }

    // Handle general mentorship packages
    if (
      firstItem.id.includes("mentorship-") ||
      firstItem.type === "mentorship-package"
    ) {
      return "mentorship-package";
    }

    // Handle product purchases
    if (firstItem.id.includes("product-")) {
      return firstItem.type || "product-purchase";
    }

    // Default fallback
    return "mentorship-package";
  };

  const handleSignContract = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signatureData.signature.trim()) {
      toast({
        title: "Signature Required",
        description: "Please draw your digital signature",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to continue",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const productType = getProductType();
      const isDiamond = isDiamondPackage();
      const isInfinity = isInfinityPackage();
      const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Generate PDF data
      const pdfData = {
        contractData: {
          name: signatureData.customerName,
          date: new Date(),
          signature: signatureData.signature,
          email: signatureData.customerEmail,
          price: getTotalPrice(useMemberPrice).toLocaleString(),
          productName: cartItems[0]?.name || "Mentorship Package",
        },
        packageType: isDiamond ? "diamond" : 
                    isInfinity ? "infinity" : 
                    productType === "basic-subscription" ? "basic" :
                    productType === "trading-tutor" ? "trading-tutor" :
                    productType === "eagle-ultimate" ? "ultimate" :
                    productType === "investment-advising" ? "investment-advising" :
                    productType.includes("script") ? "script" : productType,
      };
      
      // Try to generate PDF first if needed
      let pdfPath = `contracts/${productType}-${signatureData.customerEmail}-${Date.now()}.pdf`;
      let cloudinaryUrl = "";
      
      // Always try to generate a PDF regardless of contract type
      try {
        const pdfResult = await generateContractPDF(pdfData);
        pdfPath = pdfResult.pdfPath;
        cloudinaryUrl = pdfResult.cloudinaryUrl || pdfResult.pdfUrl;
      } catch (pdfError) {
        console.error("PDF generation error:", pdfError);
        // Continue with default path if PDF generation fails
      }
      
      const contractData = {
        name: signatureData.customerName,
        email: signatureData.customerEmail,
        signature: signatureData.signature,
        productType,
        pdfPath,
        pdfUrl: cloudinaryUrl, // Add the Cloudinary URL
        subscriptionType: "monthly" as const,
        amount: getTotalPrice(useMemberPrice), // Remove toLocaleString() to keep as number
        isDiamondContract: isDiamond ? true : undefined,
        contractDate: formattedDate,
        productName: cartItems[0]?.name || "Mentorship Package",
      };

      const signedContract = await signContract(contractData);
      setContractId(signedContract._id);

      // Update step progress
      setCurrentStep(4); // Move to Payment step (index 4 in the new flow)

      // Check if this was an existing contract
      if (signedContract.isExisting) {
        toast({
          title: "Contract Ready",
          description:
            signedContract.status === "payment_pending"
              ? "Your contract is signed and ready for payment."
              : "Using your existing contract for this package. Proceeding to payment.",
        });
      } else {
        toast({
          title: "Contract Signed Successfully",
          description: "You can now proceed with payment",
        });
      }
    } catch (error: any) {
      console.error("Contract signing error:", error);

      // Handle active subscription error
      if (error.hasActiveSubscription) {
        toast({
          title: "Active Subscription Found",
          description:
            "You already have an active subscription for this product. Please check your subscription dashboard.",
          variant: "destructive",
        });

        // Redirect to subscription dashboard after a delay
        setTimeout(() => {
          router.push("/hub/subscription");
        }, 3000);
        return;
      }

      // Handle legacy error response for existing contracts or signed contracts with pending payment
      if (error.existingContract || 
          error.message === "Contract already exists for this product" ||
          error.message === "Contract signed but payment pending") {
        
        // Contract exists and is ready for payment, no error to show
        if (error.existingContract) {
          setContractId(error.existingContract._id);
        }
        
        setCurrentStep(4); // Move to Payment step (index 4 in the new flow)

        toast({
          title: "Contract Ready",
          description: "Your contract is ready for payment. Proceeding to checkout.",
        });
      } else {
        // Show error only for actual failures, not for existing contracts
        toast({
          title: "Contract Signing Failed",
          description: error.message || "Failed to sign contract",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      // Update payment status in backend
      await updatePaymentStatus(contractId, {
        paymentId: paymentData.paymentId,
        paymentProvider: paymentData.paymentProvider,
        status: "completed",
      });

      // Update step progress
      setCurrentStep(5);

      // Clear cart
      localStorage.removeItem("cart");

      // Dispatch custom event to notify other components
      window.dispatchEvent(
        new CustomEvent("mentorship-payment-success", {
          detail: { paymentData, contractId },
        })
      );

      toast({
        title: "Payment Successful!",
        description: "Your order has been completed successfully",
      });

      // Redirect to success page after delay
      setTimeout(() => {
        router.push("/hub");
      }, 2000);
    } catch (error: any) {
      console.error("Payment update error:", error);
      toast({
        title: "Payment Update Failed",
        description: "Payment was successful but failed to update status",
        variant: "destructive",
      });
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="max-w-md bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-white">No Items to Checkout</h2>
            <p className="text-gray-400 mb-4">
              Your cart is empty. Please add items before proceeding to
              checkout.
            </p>
            <Button 
              onClick={() => router.push("/advising")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Browse Packages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8">
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
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    isCompleted
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500 text-white"
                      : isCurrent
                        ? "border-purple-500 text-purple-400 bg-purple-500/10"
                        : "border-slate-600 text-slate-400"
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      isCompleted ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-slate-600"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-sm">
          {steps.map((step) => (
            <span key={step.id} className={`${currentStep >= step.id ? "text-purple-400" : "text-slate-400"}`}>
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "w-6 h-6 text-purple-400" })}
            Step {currentStep}: {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Review Order */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {cartItems[0]?.name || "Mentorship Package"}
                  </h3>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {getTotalItems() > 1 ? `${getTotalItems()} Items` : "Premium Package"}
                  </Badge>
                </div>
                <div className="space-y-2 text-slate-300">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>{item.name} {item.quantity && item.quantity > 1 ? `(x${item.quantity})` : ""}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total:</span>
                    <div className="text-right">
                      {useMemberPrice && (
                        <div className="text-sm text-slate-400 line-through">
                          ${getTotalPrice(false).toLocaleString()}
                        </div>
                      )}
                      <span className="text-2xl font-bold text-white">
                        ${getTotalPrice(useMemberPrice).toLocaleString()}
                        {useMemberPrice && (
                          <Badge className="ml-2 bg-green-500/20 text-green-400">
                            Member Price
                          </Badge>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Read Contact */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-slate-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.contactInfo.name}
                    onChange={(e) => updateContactInfo("name", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => updateContactInfo("email", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-slate-300">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.contactInfo.phone}
                    onChange={(e) => updateContactInfo("phone", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-slate-300">
                    Company (Optional)
                  </Label>
                  <Input
                    id="company"
                    value={formData.contactInfo.company}
                    onChange={(e) => updateContactInfo("company", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Sign Contract */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {(() => {
                // Format the current date for all contracts
                const formattedDate = new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                
                // Common props for all contract components
                const contractProps = {
                  customerName: signatureData.customerName || "[Client Name]",
                  contractDate: formattedDate,
                  price: getTotalPrice(useMemberPrice).toLocaleString(),
                  preview: true
                };
                
                // Get the product type
                const productType = getProductType();
                
                // Determine which contract to show based on product type
                if (isDiamondPackage()) {
                  return (
                    <div className="bg-slate-700/50 rounded-lg p-6 max-h-[400px] overflow-y-auto">
                      <DiamondContract {...contractProps} />
                    </div>
                  );
                } else if (isInfinityPackage()) {
                  return (
                    <div className="bg-slate-700/50 rounded-lg p-6 max-h-[400px] overflow-y-auto">
                      <InfinityContract {...contractProps} />
                    </div>
                  );
                } else if (productType === "basic-subscription") {
                  return (
                    <div className="bg-slate-700/50 rounded-lg p-6 max-h-[400px] overflow-y-auto">
                      <BasicContract {...contractProps} />
                    </div>
                  );
                } else if (productType === "trading-tutor") {
                  return (
                    <div className="bg-slate-700/50 rounded-lg p-6 max-h-[400px] overflow-y-auto">
                      <TradingTutorContract {...contractProps} />
                    </div>
                  );
                } else if (productType === "eagle-ultimate") {
                  return (
                    <div className="bg-slate-700/50 rounded-lg p-6 max-h-[400px] overflow-y-auto">
                      <UltimateContract {...contractProps} />
                    </div>
                  );
                } else if (productType === "investment-advising") {
                  return (
                    <div className="bg-slate-700/50 rounded-lg p-6 max-h-[400px] overflow-y-auto">
                      <InvestmentAdvisingContract {...contractProps} />
                    </div>
                  );
                } else if (productType.includes("script")) {
                  return (
                    <div className="bg-slate-700/50 rounded-lg p-6 max-h-[400px] overflow-y-auto">
                      <ScriptContract {...contractProps} />
                    </div>
                  );
                } else {
                  // Fallback for any other product types
                  return (
                    <div className="bg-slate-700/50 rounded-lg p-6 max-h-64 overflow-y-auto">
                      <h3 className="text-lg font-semibold text-white mb-4">Service Agreement</h3>
                      <div className="text-slate-300 text-sm space-y-2">
                        <p>By subscribing to our {cartItems[0]?.name || "Mentorship Package"}, you agree to the following terms:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Monthly subscription fee of ${getTotalPrice(useMemberPrice).toLocaleString()} will be charged automatically</li>
                          <li>Access to all trading scripts and AI-powered tools</li>
                          <li>24/7 customer support and regular updates</li>
                          <li>30-day money-back guarantee for new subscribers</li>
                          <li>You may cancel your subscription at any time</li>
                          <li>All trading involves risk - past performance doesn't guarantee future results</li>
                        </ul>
                        <p className="mt-4">For complete terms and conditions, please visit our website.</p>
                      </div>
                    </div>
                  );
                }
              })()}
              
              <div>
                <Label htmlFor="signature" className="text-white">
                  Digital Signature
                </Label>
                <SignatureCanvas
                  onSignatureChange={(signature) =>
                    setSignatureData((prev) => ({
                      ...prev,
                      signature,
                    }))
                  }
                  className="bg-slate-700 border-slate-600 rounded-md min-h-[120px] w-full"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Please draw your signature above to agree to the terms
                  and conditions
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contract"
                  checked={formData.contractAccepted}
                  onCheckedChange={(checked) => updateFormData("contractAccepted", checked)}
                  className="bg-slate-700 border-slate-600 text-purple-500 focus:ring-purple-500"
                />
                <Label htmlFor="contract" className="text-slate-300">
                  I have read and agree to the service agreement
                </Label>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <div className="space-y-4">
              {contractId ? (
                <PaymentMethodSelector
                  contractId={contractId}
                  amount={getTotalPrice(useMemberPrice).toString()}
                  productName={`${getTotalItems()} ${cartItems[0]?.name || "Mentorship Package"}${
                    getTotalItems() > 1 ? "s" : ""
                  }`}
                  subscriptionType="monthly"
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="cardNumber" className="text-slate-300">
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName" className="text-slate-300">
                      Cardholder Name
                    </Label>
                    <Input id="cardName" placeholder="John Doe" className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="expiry" className="text-slate-300">
                      Expiry Date
                    </Label>
                    <Input id="expiry" placeholder="MM/YY" className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-slate-300">
                      CVV
                    </Label>
                    <Input id="cvv" placeholder="123" className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                </div>
              )}
              
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">{cartItems[0]?.name || "Mentorship Package"} {useMemberPrice ? "(Member Price)" : "(Monthly)"}</span>
                  <span className="text-white font-semibold">${getTotalPrice(useMemberPrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-600">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-xl font-bold text-white">${getTotalPrice(useMemberPrice).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Order Complete!</h3>
              <p className="text-slate-300">Welcome to Eagle Investors! Your {cartItems[0]?.name || "Mentorship Package"} is now active.</p>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-slate-300 text-sm">
                  You'll receive an email confirmation shortly with your login credentials and access instructions.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={currentStep === 3 && contractId === "" ? handleSignContract : handleNext}
                disabled={
                  (currentStep === 2 && (!formData.contactInfo.name || !formData.contactInfo.email)) ||
                  (currentStep === 3 && (!formData.contractAccepted || !signatureData.signature))
                }
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {currentStep === 3 && contractId === "" ? "Sign Contract" : 
                 currentStep === 4 && contractId === "" ? "Complete Payment" : "Next"}
              </Button>
            ) : (
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                onClick={() => router.push("/hub")}
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
