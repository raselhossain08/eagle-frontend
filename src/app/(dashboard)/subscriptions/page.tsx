import SubscriptionManager from '@/components/subscription/subscription-manager-enhanced';

export default function SubscriptionsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage your subscriptions, view usage, and upgrade or downgrade plans.
        </p>
      </div>
      
      <SubscriptionManager />
    </div>
  );
}