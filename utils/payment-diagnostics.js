/**
 * Payment Diagnostic Script
 * Run this to test frontend payment integration
 */

console.log("🔍 Payment System Diagnostic");
console.log("============================");

// Test environment variables
console.log("\n📊 Environment Variables:");
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL || "❌ Not set");
console.log(
  "PayPal Client ID:",
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? "✅ Set" : "❌ Not set"
);
console.log(
  "Stripe Key:",
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Not set"
);

// Test API connectivity
async function testAPIConnectivity() {
  console.log("\n🌐 API Connectivity Test:");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/paypal/contracts/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractId: "test-123",
          subscriptionType: "monthly",
        }),
      }
    );

    const data = await response.json();
    console.log("API Response Status:", response.status);
    console.log("API Response:", data);

    if (response.status === 401) {
      console.log(
        "✅ API is responding (401 means auth middleware is working)"
      );
    } else {
      console.log("❌ Unexpected API response");
    }
  } catch (error) {
    console.log("❌ API Connection Error:", error.message);
  }
}

// Test PayPal SDK loading
function testPayPalSDK() {
  console.log("\n💳 PayPal SDK Test:");

  const script = document.createElement("script");
  script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
  script.onload = () => {
    console.log("✅ PayPal SDK loaded successfully");
    console.log("PayPal object available:", !!window.paypal);
  };
  script.onerror = () => {
    console.log("❌ PayPal SDK failed to load");
  };
  document.head.appendChild(script);
}

// Test Stripe SDK loading
function testStripeSDK() {
  console.log("\n🔧 Stripe SDK Test:");

  const script = document.createElement("script");
  script.src = "https://js.stripe.com/v3/";
  script.onload = () => {
    try {
      window.Stripe = window.Stripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );
      console.log("✅ Stripe SDK loaded successfully");
      console.log("Stripe object available:", !!window.Stripe);
    } catch (error) {
      console.log("❌ Stripe SDK initialization error:", error.message);
    }
  };
  script.onerror = () => {
    console.log("❌ Stripe SDK failed to load");
  };
  document.head.appendChild(script);
}

// Test authentication
function testAuthentication() {
  console.log("\n🔐 Authentication Test:");

  const token = localStorage.getItem("token");
  console.log("Token present:", !!token);

  if (token) {
    console.log("Token length:", token.length);
    // Don't log actual token for security
  } else {
    console.log("❌ No authentication token found");
  }
}

// Run all tests
function runDiagnostics() {
  testAuthentication();
  testAPIConnectivity();
  testPayPalSDK();
  testStripeSDK();
}

// Export for use in components
if (typeof window !== "undefined") {
  window.paymentDiagnostics = runDiagnostics;
  console.log(
    "\n🚀 Run 'paymentDiagnostics()' in console to test payment integration"
  );
}

export { runDiagnostics as paymentDiagnostics };
