"use client";

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, MessageCircle, TrendingUp, Star, Crown, Gem, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdvisingPage() {
  const router = useRouter();
  const mentorshipPackages = [
    {
      name: "Eagle Ultimate",
      price: "$2,497",
      memberPrice: "$1,827",
      description: "Comprehensive 8-hour mentorship program with premium access",
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
      name: "Investment Advising",
      price: "$987",
      memberPrice: "$786",
      description: "Focus on long-term investment strategies and portfolio building",
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
  ]

  const advisingServices = [
    {
      icon: Users,
      title: "Personal Trading Coach",
      description: "One-on-one sessions with experienced trading professionals",
      features: ["Personalized trading strategy", "Risk assessment", "Performance review", "Goal setting"],
    },
    {
      icon: Calendar,
      title: "Scheduled Consultations",
      description: "Regular meetings to track progress and adjust strategies",
      features: ["Weekly/monthly sessions", "Flexible scheduling", "Progress tracking", "Strategy refinement"],
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description: "Direct access to advisors for immediate guidance",
      features: ["Priority support", "Quick responses", "Market insights", "Trade validation"],
    },
    {
      icon: TrendingUp,
      title: "Portfolio Analysis",
      description: "Comprehensive review of your trading performance",
      features: ["Performance metrics", "Risk analysis", "Optimization suggestions", "Diversification advice"],
    },
  ]

  const mentorshipAreas = [
    "Investing - Active & Passive Investing",
    "Day Trading & Scalping - Active Trading",
    "Swing Trading (Options, Stocks and More) - Active Trading",
    "Buying Option Premium - Intraday, Multi-Day & Leaps",
    "Selling Premium & Multi-Leg Option Strategies - Speculation + Hedging",
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

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
              Ishaan is a seasoned professional with an eleven-year track record in stock and commodities markets. He
              believes that thorough research, technical analysis and thoughtful trading are the key skills needed to
              become a successful investor. Ishaan's expertise spans various sectors and strategies:
            </p>

            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50">
              <h3 className="text-2xl font-semibold text-white mb-6">Mentorships:</h3>
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
            <h2 className="text-4xl font-bold text-white mb-4">Mentorship Packages</h2>
            <p className="text-xl text-gray-300">Choose the perfect mentorship program for your investment journey</p>
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
                  className={`relative my-box ${pkg.popular ? "ring-2 ring-yellow-400/50 shadow-2xl shadow-yellow-500/20" : ""}`}
                >
                  <CardHeader className="text-center pb-8 pt-12">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${pkg.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <pkg.icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-white mb-2">{pkg.name}</CardTitle>
                    <CardDescription className="text-gray-300 text-lg mb-6">{pkg.description}</CardDescription>

                    <div className="space-y-3">
                      <div className="flex flex-col items-center">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-4xl font-bold text-white">{pkg.price}</span>
                        </div>
                        <div className="text-gray-400 text-sm">Regular Price</div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl font-bold text-cyan-400">{pkg.memberPrice}</span>
                          <span className="text-gray-300">for Members</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 mt-2">Save {pkg.savings}</Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-grow justify-between space-y-6 pb-8">
                    <ul className="space-y-3 flex-grow">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-300 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => {
                        // Create cart item from the package
                        const cartItem = {
                          id: pkg.name.toLowerCase().replace(/\s+/g, '-'),
                          name: pkg.name,
                          price: pkg.price.replace('$', ''),
                          memberPrice: pkg.memberPrice.replace('$', ''),
                          description: pkg.description,
                          features: pkg.features,
                          type: "mentorship-package"
                        };
                        
                        // Save to localStorage
                        localStorage.setItem('cart', JSON.stringify([cartItem]));
                        
                        // Navigate to checkout using Next.js router
                        router.push('/checkout');
                      }}
                      className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${pkg.popular ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg hover:shadow-yellow-500/25" : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25"}`}
                    >
                      Add to basket
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Advisory Services</h2>
            <p className="text-xl text-gray-300">Comprehensive support for your investment journey</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {advisingServices.map((service, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-gray-300">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Trading?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Take your investment skills to the next level with personalized 1-on-1 mentorship from our experienced
            professionals. Choose the package that fits your goals and start your journey today.
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              Join Our Platform
            </Button>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="mt-12 bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <p className="text-gray-400 text-sm text-center">
            <strong className="text-white">Investment Advisory Disclosure:</strong> All mentorship and advisory services
            involve risk and may not be suitable for all investors. Past performance does not guarantee future results.
            Please review our{" "}
            <a href="/disclosures" className="text-cyan-400 hover:text-cyan-300 underline">
              disclosures
            </a>{" "}
            before engaging our services.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
