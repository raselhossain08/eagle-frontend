"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  updateSubscription,
  getSubscriptionStatus,
} from "@/lib/services/api/subscription";
import { useAuth } from "@/context/authContext";
import { toast } from "@/hooks/use-toast";
import toast_old from "react-hot-toast";

interface SubscriptionManagerProps {
  currentSubscription: "None" | "Basic" | "Diamond" | "Infinity" | "Script";
}

const subscriptionInfo = {
  None: {
    color: "secondary",
    description: "No subscription",
    price: "Free",
    originalPrice: null,
  },
  Basic: {
    color: "default",
    description: "Basic features",
    price: "Free",
    originalPrice: null,
  },
  Diamond: {
    color: "default",
    description: "Premium features",
    price: "$76",
    originalPrice: "$97",
  },
  Infinity: {
    color: "default",
    description: "All features + AI",
    price: "$127",
    originalPrice: "$187",
  },
  Script: {
    color: "default",
    description: "Script access",
    price: "$47",
    originalPrice: "$67",
  },
};

export default function SubscriptionManager({
  currentSubscription,
}: SubscriptionManagerProps) {
  const [selectedSubscription, setSelectedSubscription] =
    useState<string>(currentSubscription);
  const [isUpdating, setIsUpdating] = useState(false);
  const { refreshProfile } = useAuth();
  const router = useRouter();

  const handleSubscriptionPurchase = (subscriptionType: string) => {
    if (subscriptionType === currentSubscription) {
      toast({
        title: "Already Subscribed",
        description: "You already have this subscription",
        variant: "destructive",
      });
      return;
    }

    if (subscriptionType === "None" || subscriptionType === "Basic") {
      // Free options - handle without payment
      handleUpdateSubscription();
      return;
    }

    // Create cart item for paid subscriptions
    const subInfo =
      subscriptionInfo[subscriptionType as keyof typeof subscriptionInfo];
    const subscriptionItem = {
      id: subscriptionType.toLowerCase(),
      name: `${subscriptionType} Monthly Subscription`,
      price: subInfo.originalPrice || subInfo.price,
      memberPrice: subInfo.price,
      quantity: 1,
      subscriptionType: "monthly",
      productType: subscriptionType.toLowerCase(),
    };

    // Save to localStorage and navigate to checkout
    localStorage.setItem("cart", JSON.stringify([subscriptionItem]));

    toast({
      title: "Added to Cart",
      description: `${subscriptionItem.name} has been added to your cart`,
    });

    router.push("/checkout");
  };

  const handleUpdateSubscription = async () => {
    if (selectedSubscription === currentSubscription) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a different subscription",
      });
      return;
    }

    setIsUpdating(true);

    const loadingToast = toast({
      title: "Updating subscription...",
      description: "Please wait while we update your subscription.",
    });

    try {
      await updateSubscription(selectedSubscription as any);

      // Refresh profile to get updated subscription
      await refreshProfile();

      toast({
        title: "Success!",
        description: "Subscription updated successfully!",
      });

      // Small delay then reload to show new dashboard
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Subscription update error:", errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Subscription Management
          <Badge variant={subscriptionInfo[currentSubscription].color as any}>
            {currentSubscription}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {subscriptionInfo[currentSubscription].description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Change Subscription</label>
          <Select
            value={selectedSubscription}
            onValueChange={setSelectedSubscription}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Diamond">Diamond</SelectItem>
              <SelectItem value="Infinity">Infinity</SelectItem>
              <SelectItem value="Script">Script</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleUpdateSubscription}
          disabled={isUpdating || selectedSubscription === currentSubscription}
          className="w-full"
        >
          {isUpdating ? "Updating..." : "Update Subscription"}
        </Button>

        <div className="text-xs text-muted-foreground">
          <p>
            • Changing subscription will redirect you to the appropriate
            dashboard
          </p>
          <p>
            • Make sure you have purchased the subscription before activating
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
