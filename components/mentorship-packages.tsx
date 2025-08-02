"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  TrendingUp,
  Gem,
  CheckCircle,
  Star,
  ShoppingCart,
  X,
  Plus,
  Minus,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SubscriptionManager from "@/components/subscription-manager";
import { useAuth } from "@/context/authContext";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

interface CartItem {
  id: string;
  name: string;
  price: string;
  memberPrice: string;
  quantity: number;
}

interface ActiveSubscription {
  productType: string;
  status: string;
  subscriptionEndDate: string;
  autoRenew: boolean;
}

export function MentorshipPackages() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    ActiveSubscription[]
  >([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const { user, refreshProfile } = useAuth();
  const router = useRouter();

  const mentorshipPackages = [
    {
      id: "eagle-ultimate",
      name: "Eagle Ultimate",
      price: "$2,497",
      memberPrice: "$1,827",
      description:
        "Comprehensive 8-hour mentorship program with premium access",
      icon: Crown,
      gradient: "from-yellow-500 to-orange-600",
      features: [
        "8 Hours of 1-on-1 Sessions",
        "1 Year Diamond ($1,164 value)",
        "All Inclusive Package",
        "8 Hours of Trading Tutor OR 8 Hours of Advising",
        "Personalized strategy development",
        "Complete portfolio review",
        "Advanced risk management techniques",
        "Long-term mentorship relationship",
      ],
      popular: true,
      savings: "$1,164",
    },
    {
      id: "investment-advising",
      name: "Investment Advising",
      price: "$987",
      memberPrice: "$786",
      description:
        "Focus on long-term investment strategies and portfolio building",
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-600",
      features: [
        "3 Hours of 1-on-1 Sessions",
        "3 Months Diamond",
        "Setup Tax Advantaged Account",
        "Learn How To Invest",
        "Financial Plan Creation",
        "Portfolio optimization strategies",
        "Tax-efficient investing guidance",
        "Retirement planning assistance",
      ],
      popular: false,
      savings: "$201",
    },
    {
      id: "trading-tutor",
      name: "Trading Tutor",
      price: "$987",
      memberPrice: "$786",
      description: "Master active trading strategies and market timing",
      icon: Gem,
      gradient: "from-blue-500 to-purple-600",
      features: [
        "3 Hours of 1-on-1 Sessions",
        "3 Months Diamond",
        "Learn to day trade/swing trade + options trade",
        "Tune your trading strategy",
        "Risk management for active trading",
        "Technical analysis mastery",
        "Entry and exit timing strategies",
        "Psychology of trading",
      ],
      popular: false,
      savings: "$201",
    },
  ];

  // Check for active subscriptions
  useEffect(() => {
    const checkActiveSubscriptions = async () => {
      if (!user) {
        setIsLoadingSubscriptions(false);
        return;
      }

      try {
        const token = Cookies.get("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Check for active mentorship packages
          const activeContracts =
            data.user?.contracts?.filter(
              (contract: any) =>
                contract.productType === "mentorship-package" &&
                contract.status === "completed" &&
                new Date(contract.subscriptionEndDate) > new Date()
            ) || [];

          setActiveSubscriptions(activeContracts);
        }
      } catch (error) {
        console.error("Error fetching active subscriptions:", error);
      } finally {
        setIsLoadingSubscriptions(false);
      }
    };

    checkActiveSubscriptions();
  }, [user]);

  // Function to refresh subscription data - can be called externally
  const refreshSubscriptions = async () => {
    if (!user) return;

    setIsLoadingSubscriptions(true);
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const activeContracts =
          data.user?.contracts?.filter(
            (contract: any) =>
              [
                "eagle-ultimate",
                "investment-advising",
                "trading-tutor",
                "mentorship-package",
              ].includes(contract.productType) &&
              contract.status === "completed" &&
              new Date(contract.subscriptionEndDate) > new Date()
          ) || [];

        setActiveSubscriptions(activeContracts);

        // Also refresh the auth profile to update user subscription status
        await refreshProfile();

        // Show success message if new subscriptions are found
        const newSubscriptionCount = activeContracts.length;
        if (newSubscriptionCount > activeSubscriptions.length) {
          toast({
            title: "Subscription Updated!",
            description: "Your new mentorship package is now active.",
          });
        }
      }
    } catch (error) {
      console.error("Error refreshing subscriptions:", error);
    } finally {
      setIsLoadingSubscriptions(false);
    }
  };

  // Auto-refresh when page becomes visible (user returns from checkout)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        // Small delay to ensure backend has processed the payment
        setTimeout(() => {
          refreshSubscriptions();
        }, 1000);
      }
    };

    const handleFocus = () => {
      if (user) {
        setTimeout(() => {
          refreshSubscriptions();
        }, 1000);
      }
    };

    // Listen for page visibility and focus events
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    // Listen for custom payment success events
    const handlePaymentSuccess = () => {
      setTimeout(() => {
        refreshSubscriptions();
      }, 2000);
    };

    window.addEventListener("mentorship-payment-success", handlePaymentSuccess);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener(
        "mentorship-payment-success",
        handlePaymentSuccess
      );
    };
  }, [user, activeSubscriptions.length]);

  // Helper function to check if user has active subscription for a package
  const hasActiveSubscription = (packageId: string) => {
    // Map frontend package IDs to backend product types
    const productTypeMap: { [key: string]: string } = {
      "eagle-ultimate": "eagle-ultimate",
      "investment-advising": "investment-advising",
      "trading-tutor": "trading-tutor",
    };

    const productType = productTypeMap[packageId];
    if (!productType) return false;

    return activeSubscriptions.some(
      (sub) =>
        sub.productType === productType &&
        sub.status === "completed" &&
        new Date(sub.subscriptionEndDate) > new Date() // Check if subscription is not expired
    );
  };

  const addToCart = (pkg: (typeof mentorshipPackages)[0]) => {
    // Check if user already has an active subscription
    if (hasActiveSubscription(pkg.id)) {
      toast({
        title: "Already Subscribed",
        description:
          "You already have an active subscription for this mentorship package.",
        variant: "destructive",
      });
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === pkg.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === pkg.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...prevCart,
          {
            id: pkg.id,
            name: pkg.name,
            price: pkg.price,
            memberPrice: pkg.memberPrice,
            quantity: 1,
          },
        ];
      }
    });

    toast({
      title: "Added to basket!",
      description: `${pkg.name} has been added to your basket.`,
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (useMemberPrice: boolean = false) => {
    return cart.reduce((total, item) => {
      const price = parseFloat(
        (useMemberPrice ? item.memberPrice : item.price).replace(/[,$]/g, "")
      );
      return total + price * item.quantity;
    }, 0);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart Empty",
        description:
          "Please add items to your cart before proceeding to checkout",
        variant: "destructive",
      });
      return;
    }

    // Save cart to localStorage for checkout page
    localStorage.setItem("cart", JSON.stringify(cart));

    // Close cart modal
    setIsCartOpen(false);

    // Navigate to checkout
    router.push("/checkout");
  };

  const currentSubscription = user?.subscription || "None";

  return (
    <section className="py-20 bg-slate-900">
      {/* Shopping Cart Button - Hidden */}
      <div className="fixed top-4 right-4 z-50 hidden">
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogTrigger asChild>
            <Button className="relative bg-cyan-600 hover:bg-cyan-700 text-white rounded-full p-4 shadow-lg">
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-6 h-6 text-xs">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Your Basket ({getTotalItems()} items)</DialogTitle>
              <DialogDescription>
                Review your selected mentorship packages
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Cart Items */}
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Your basket is empty
                </p>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              Regular: {item.price} | Member: {item.memberPrice}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 0)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="min-w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Price Summary */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Regular Total:</span>
                      <span className="font-semibold">
                        ${getTotalPrice(false).toLocaleString()}
                      </span>
                    </div>
                    {currentSubscription !== "None" && (
                      <div className="flex justify-between text-green-600">
                        <span>Member Total:</span>
                        <span className="font-semibold">
                          ${getTotalPrice(true).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {currentSubscription !== "None" && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>You Save:</span>
                        <span className="font-semibold">
                          $
                          {(
                            getTotalPrice(false) - getTotalPrice(true)
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={proceedToCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCart([])}
                      size="lg"
                    >
                      Clear Basket
                    </Button>
                  </div>
                </>
              )}

              {/* Subscription Manager */}
              {currentSubscription === "None" && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Get Member Pricing
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Activate a subscription to get member discounts on all
                    mentorship packages.
                  </p>
                  <SubscriptionManager
                    currentSubscription={currentSubscription as any}
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full px-6 py-3 mb-6">
            <Star className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-semibold uppercase tracking-wide text-sm">
              1 ON 1 MENTORSHIP
            </span>
          </div>

          {/* Refresh Button */}
          <Button
            onClick={refreshSubscriptions}
            disabled={isLoadingSubscriptions}
            variant="outline"
            size="sm"
            className="absolute top-0 right-0 bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${
                isLoadingSubscriptions ? "animate-spin" : ""
              }`}
            />
            {isLoadingSubscriptions ? "Updating..." : "Refresh Status"}
          </Button>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Personalized
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Mentorship Programs
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Take your investment skills to the next level with personalized
            1-on-1 mentorship from our experienced professionals. Choose the
            perfect program for your investment journey.
          </p>
        </div>

        {/* Mentorship Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {mentorshipPackages.map((pkg, index) => (
            <div key={index} className="relative group">
              {pkg.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Comprehensive
                  </div>
                </div>
              )}

              <Card
                className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 flex flex-col h-full transition-all duration-500 hover:border-cyan-500/50 hover:transform hover:scale-105 ${
                  pkg.popular
                    ? "ring-2 ring-yellow-400/50 shadow-2xl shadow-yellow-500/20"
                    : ""
                }`}
              >
                <CardHeader className="text-center pb-8 pt-12">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${pkg.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <pkg.icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-white mb-2">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg mb-6">
                    {pkg.description}
                  </CardDescription>

                  <div className="space-y-3">
                    <div className="flex flex-col items-center">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-4xl font-bold text-white">
                          {pkg.price}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">Regular Price</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-cyan-400">
                          {pkg.memberPrice}
                        </span>
                        <span className="text-gray-300">for Members</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 mt-2">
                        Save {pkg.savings}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col flex-grow justify-between space-y-6 pb-8">
                  <ul className="space-y-3 flex-grow">
                    {pkg.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-300 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {hasActiveSubscription(pkg.id) ? (
                    <div className="space-y-3">
                      <Button
                        disabled
                        className="w-full py-4 text-lg font-semibold rounded-xl bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed"
                      >
                        ✓ Active Subscription
                      </Button>
                      <p className="text-sm text-green-600 text-center">
                        You have an active subscription for this package
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(pkg)}
                      disabled={isLoadingSubscriptions}
                      className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
                        pkg.popular
                          ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg hover:shadow-yellow-500/25"
                          : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25"
                      } ${
                        isLoadingSubscriptions
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isLoadingSubscriptions ? "Checking..." : "Add to basket"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
