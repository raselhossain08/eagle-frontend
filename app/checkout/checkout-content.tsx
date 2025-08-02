"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  ShoppingCart,
  FileText,
  CreditCard,
  Pen,
} from "lucide-react";
import { PaymentMethodSelector } from "@/components/payment-method-selector";
import SignatureCanvas from "@/components/signature-canvas";
import { toast } from "@/hooks/use-toast";
import {
  signContract,
  updatePaymentStatus,
  getUserContracts,
} from "@/lib/api/contracts";
import { useAuth } from "@/context/authContext";
import { mockUser } from "@/lib/data";

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

interface CheckoutStep {
  id: number;
  title: string;
  completed: boolean;
}

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  // Get cart data from URL params or localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [contractId, setContractId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [signatureData, setSignatureData] = useState({
    customerName: mockUser.name,
    customerEmail: mockUser.email,
    signature: "",
  });

  const steps: CheckoutStep[] = [
    { id: 1, title: "Review Order", completed: false },
    { id: 2, title: "Sign Contract", completed: false },
    { id: 3, title: "Payment", completed: false },
    { id: 4, title: "Complete", completed: false },
  ];

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
        (contract) => contract.productType === productType
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
          setCurrentStep(3);

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
    return cartItems.reduce((total, item) => {
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
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
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
      const contractData = {
        name: signatureData.customerName,
        email: signatureData.customerEmail,
        signature: signatureData.signature,
        productType,
        pdfPath: `contracts/${productType}-${
          signatureData.customerEmail
        }-${Date.now()}.pdf`,
        subscriptionType: "monthly" as const,
      };

      const signedContract = await signContract(contractData);
      setContractId(signedContract._id);

      // Update step progress
      setCurrentStep(3); // Move to Payment step

      // Check if this was an existing contract
      if (signedContract.isExisting) {
        toast({
          title: "Existing Contract Found",
          description:
            "Using your existing contract for this product. Proceeding to payment.",
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

      // Handle legacy error response for existing contracts
      if (error.existingContract) {
        // Contract already exists, use existing contract
        setContractId(error.existingContract._id);
        setCurrentStep(3);

        toast({
          title: "Existing Contract Found",
          description:
            "Using your existing contract for this product. Proceeding to payment.",
        });
      } else {
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
      setCurrentStep(4);

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

  const proceedToSigning = () => {
    setCurrentStep(2);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Items to Checkout</h2>
            <p className="text-gray-600 mb-4">
              Your cart is empty. Please add items before proceeding to
              checkout.
            </p>
            <Button onClick={() => router.push("/advising")}>
              Browse Packages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8 text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step.id < currentStep
                      ? "bg-green-500 text-white"
                      : currentStep === step.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    step.id < currentStep
                      ? "text-green-400"
                      : currentStep === step.id
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-brand-bg-light border-brand-border sticky top-8">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{item.name}</h4>
                      <p className="text-sm text-gray-400">
                        Qty: {item.quantity || 1}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500">
                          $
                          {(() => {
                            const priceValue =
                              typeof item.price === "string"
                                ? parseFloat(item.price.replace(/[,$]/g, ""))
                                : item.price;
                            return priceValue.toLocaleString();
                          })()}
                        </span>
                        {useMemberPrice && item.memberPrice && (
                          <Badge
                            variant="secondary"
                            className="bg-green-500/20 text-green-400"
                          >
                            Member: $
                            {(() => {
                              const memberPriceValue =
                                typeof item.memberPrice === "string"
                                  ? parseFloat(
                                      item.memberPrice.replace(/[,$]/g, "")
                                    )
                                  : item.memberPrice;
                              return memberPriceValue.toLocaleString();
                            })()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Separator className="bg-brand-border" />

                <div className="space-y-2">
                  {!useMemberPrice && (
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>${getTotalPrice(false).toLocaleString()}</span>
                    </div>
                  )}

                  {useMemberPrice && (
                    <>
                      <div className="flex justify-between text-gray-400 line-through">
                        <span>Regular Total:</span>
                        <span>${getTotalPrice(false).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-green-400">
                        <span>Member Total:</span>
                        <span>${getTotalPrice(true).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-400">
                        <span>You Save:</span>
                        <span>
                          $
                          {(
                            getTotalPrice(false) - getTotalPrice(true)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}

                  <Separator className="bg-brand-border" />

                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total:</span>
                    <span>
                      ${getTotalPrice(useMemberPrice).toLocaleString()}
                    </span>
                  </div>
                </div>

                {useMemberPrice && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">
                        {currentSubscription}
                      </Badge>
                      <span className="text-sm text-green-400">
                        Member pricing applied!
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Review Order */}
            {currentStep === 1 && (
              <Card className="bg-brand-bg-light border-brand-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Review Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-gray-300">
                    <p className="mb-4">
                      You are purchasing {getTotalItems()} mentorship package
                      {getTotalItems() > 1 ? "s" : ""}
                      with a total value of $
                      {getTotalPrice(useMemberPrice).toLocaleString()}.
                    </p>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">
                        What's Next?
                      </h4>
                      <ul className="text-sm space-y-1 text-white">
                        <li>• You'll be asked to sign a digital contract</li>
                        <li>• Then you can choose your payment method</li>
                        <li>
                          • After payment, you'll receive access instructions
                        </li>
                      </ul>
                    </div>
                  </div>

                  <Button
                    onClick={proceedToSigning}
                    className="w-full bg-brand-primary hover:bg-brand-primary/90"
                    size="lg"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Continue to Contract Signing
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Contract Signing */}
            {currentStep === 2 && (
              <Card className="bg-brand-bg-light border-brand-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Digital Contract Signing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignContract} className="space-y-6">
                    <div className="text-gray-300 mb-6">
                      <p className="mb-4">
                        Please review and sign the digital contract for your
                        mentorship package by drawing your signature below.
                      </p>
                      <p className="text-sm">
                        The contract outlines the terms and conditions of your
                        mentorship program.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="customerName" className="text-white">
                          Full Name
                        </Label>
                        <Input
                          id="customerName"
                          type="text"
                          value={signatureData.customerName}
                          onChange={(e) =>
                            setSignatureData((prev) => ({
                              ...prev,
                              customerName: e.target.value,
                            }))
                          }
                          className="bg-brand-bg-dark border-brand-border text-white"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="customerEmail" className="text-white">
                          Email Address
                        </Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          value={signatureData.customerEmail}
                          onChange={(e) =>
                            setSignatureData((prev) => ({
                              ...prev,
                              customerEmail: e.target.value,
                            }))
                          }
                          className="bg-brand-bg-dark border-brand-border text-white"
                          required
                        />
                      </div>

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
                          className="bg-brand-bg-dark border-brand-border"
                        />
                        <p className="text-sm text-gray-400 mt-1">
                          Please draw your signature above to agree to the terms
                          and conditions
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-brand-cyan hover:bg-brand-cyan/90"
                      size="lg"
                      disabled={isLoading}
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      {isLoading ? "Processing..." : "Sign Contract & Continue"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && contractId && (
              <Card className="bg-brand-bg-light border-brand-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentMethodSelector
                    contractId={contractId}
                    amount={getTotalPrice(useMemberPrice).toString()}
                    productName={`${getTotalItems()} Mentorship Package${
                      getTotalItems() > 1 ? "s" : ""
                    }`}
                    subscriptionType="monthly"
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 4: Complete */}
            {currentStep === 4 && (
              <Card className="bg-brand-bg-light border-brand-border">
                <CardContent className="text-center py-12">
                  <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Order Complete!
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Thank you for your purchase. You will receive an email with
                    further instructions.
                  </p>
                  <Button
                    onClick={() => router.push("/hub")}
                    className="bg-brand-primary hover:bg-brand-primary/90"
                  >
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
