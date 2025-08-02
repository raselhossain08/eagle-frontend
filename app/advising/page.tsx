"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Calendar,
  MessageCircle,
  TrendingUp,
  Star,
  Crown,
  Gem,
  CheckCircle,
  ShoppingCart,
  X,
  Plus,
  Minus,
} from "lucide-react";
import SubscriptionManager from "@/components/subscription-manager";
import { useAuth } from "@/context/authContext";
import toast from "react-hot-toast";

interface CartItem {
  id: string;
  name: string;
  price: string;
  memberPrice: string;
  quantity: number;
}

export default function AdvisingPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();

  // Refresh profile data when component mounts to ensure we have latest contract information
  useEffect(() => {
    if (user && refreshProfile) {
      refreshProfile();
    }
  }, [user, refreshProfile]);

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
        "8 Hours of 1on1 Sessions",
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
        "3 Hours of 1on1 Sessions",
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
        "3 Hours of 1on1 Sessions",
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

  const advisingServices = [
    {
      icon: Users,
      title: "Personal Trading Coach",
      description: "One-on-one sessions with experienced trading professionals",
      features: [
        "Personalized trading strategy",
        "Risk assessment",
        "Performance review",
        "Goal setting",
      ],
    },
    {
      icon: Calendar,
      title: "Scheduled Consultations",
      description: "Regular meetings to track progress and adjust strategies",
      features: [
        "Weekly/monthly sessions",
        "Flexible scheduling",
        "Progress tracking",
        "Strategy refinement",
      ],
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description: "Direct access to advisors for immediate guidance",
      features: [
        "Priority support",
        "Quick responses",
        "Market insights",
        "Trade validation",
      ],
    },
    {
      icon: TrendingUp,
      title: "Portfolio Analysis",
      description: "Comprehensive review of your trading performance",
      features: [
        "Performance metrics",
        "Risk analysis",
        "Optimization suggestions",
        "Diversification advice",
      ],
    },
  ];

  const mentorshipAreas = [
    "Investing - Active & Passive Investing",
    "Day Trading & Scalping - Active Trading",
    "Swing Trading (Options, Stocks and More) - Active Trading",
    "Buying Option Premium - Intraday, Multi-Day & Leaps",
    "Selling Premium & Multi-Leg Option Strategies - Speculation + Hedging",
  ];

  // Check if a mentorship package has already been purchased
  const isPackagePurchased = (packageId: string) => {
    if (!profile?.contracts) return false;

    return profile.contracts.some((contract) => {
      // Check if contract matches this package or is a general mentorship-package
      const isMatchingProduct =
        contract.productType === packageId ||
        contract.productType === "mentorship-package";

      if (!isMatchingProduct) return false;

      // For completed contracts, check if subscription is still active
      if (contract.status === "completed") {
        const now = new Date();
        const endDate = contract.subscriptionEndDate
          ? new Date(contract.subscriptionEndDate)
          : null;

        // If there's an end date, check if it's in the future
        if (endDate) {
          return endDate > now;
        }

        // If no end date, assume it's active (shouldn't happen but just in case)
        return true;
      }

      // Also consider active, signed, or payment_pending as purchased
      return (
        contract.status === "active" ||
        contract.status === "signed" ||
        contract.status === "payment_pending"
      );
    });
  };

  // Check if any mentorship package has been purchased
  const hasAnyMentorshipPackage = () => {
    if (!profile?.contracts) return false;

    const mentorshipProductTypes = [
      "eagle-ultimate",
      "investment-advising",
      "trading-tutor",
      "mentorship-package", // Include the general mentorship package type
    ];

    return profile.contracts.some((contract) => {
      if (!mentorshipProductTypes.includes(contract.productType)) return false;

      // For completed contracts, check if subscription is still active
      if (contract.status === "completed") {
        const now = new Date();
        const endDate = contract.subscriptionEndDate
          ? new Date(contract.subscriptionEndDate)
          : null;

        // If there's an end date, check if it's in the future
        if (endDate) {
          return endDate > now;
        }

        // If no end date, assume it's active
        return true;
      }

      // Also consider active, signed, or payment_pending as purchased
      return (
        contract.status === "active" ||
        contract.status === "signed" ||
        contract.status === "payment_pending"
      );
    });
  };

  const addToCart = (pkg: (typeof mentorshipPackages)[0]) => {
    console.log("Adding to cart:", pkg.name); // Debug log

    // Check if user already has this package or any other mentorship package
    if (isPackagePurchased(pkg.id)) {
      toast.error("You have already purchased this mentorship package.");
      return;
    }

    if (hasAnyMentorshipPackage()) {
      toast.error(
        "You already have a mentorship package. Contact support if you need to change packages."
      );
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

    // Open cart modal after adding item
    setIsCartOpen(true);

    toast.success(`${pkg.name} has been added to your basket!`);
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
      toast.error(
        "Please add items to your cart before proceeding to checkout"
      );
      return;
    }

    // Save cart to localStorage for checkout page
    localStorage.setItem("checkout-cart", JSON.stringify(cart));

    // Close cart modal
    setIsCartOpen(false);

    // Navigate to checkout
    router.push("/checkout");
  };

  const currentSubscription = user?.subscription || "None";

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

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
              {/* Debug Info */}
              <div className="bg-gray-100 p-2 rounded text-sm">
                <p>Cart Items: {cart.length}</p>
                <p>Is Cart Open: {isCartOpen ? "Yes" : "No"}</p>
              </div>
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

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full px-6 py-3 mb-6">
            <Star className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-semibold uppercase tracking-wide text-sm">
              1 ON 1 ADVISING PACKAGES
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              1 on 1 Sessions
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Investment Advice
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Trading Advice
            </span>
          </h1>

          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Ishaan is a seasoned professional with an eleven-year track record
              in stock and commodities markets. He believes that thorough
              research, technical analysis and thoughtful trading are the key
              skills needed to become a successful investor. Ishaan's expertise
              spans various sectors and strategies:
            </p>

            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Mentorships:
              </h3>
              <div className="space-y-3">
                {mentorshipAreas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                    <span className="text-gray-300 text-lg">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mentorship Packages */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Mentorship Packages
            </h2>
            <p className="text-xl text-gray-300">
              Choose the perfect mentorship program for your investment journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
                        <div className="text-gray-400 text-sm">
                          Regular Price
                        </div>
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

                    {/* Show purchase status or add to cart button */}
                    {isPackagePurchased(pkg.id) ? (
                      <Button
                        disabled
                        className="w-full py-4 text-lg font-semibold rounded-xl bg-green-600 text-white cursor-not-allowed opacity-75"
                      >
                        ✓ Already Purchased
                      </Button>
                    ) : hasAnyMentorshipPackage() ? (
                      <Button
                        disabled
                        className="w-full py-4 text-lg font-semibold rounded-xl bg-gray-600 text-white cursor-not-allowed opacity-75"
                      >
                        You already have a mentorship package
                      </Button>
                    ) : (
                      <Button
                        onClick={() => addToCart(pkg)}
                        className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
                          pkg.popular
                            ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg hover:shadow-yellow-500/25"
                            : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25"
                        }`}
                      >
                        Add to basket
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Our Advisory Services
            </h2>
            <p className="text-xl text-gray-300">
              Comprehensive support for your investment journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {advisingServices.map((service, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-white text-xl">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-3xl p-12 border border-slate-600/50 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Take your investment skills to the next level with personalized
            1-on-1 mentorship from our experienced professionals. Choose the
            package that fits your goals and start your journey today.
          </p>
          <div className="flex justify-center">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
              Join Our Platform
            </Button>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="mt-12 bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <p className="text-gray-400 text-sm text-center">
            <strong className="text-white">
              Investment Advisory Disclosure:
            </strong>{" "}
            All mentorship and advisory services involve risk and may not be
            suitable for all investors. Past performance does not guarantee
            future results. Please review our{" "}
            <a
              href="/disclosures"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              disclosures
            </a>{" "}
            before engaging our services.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
