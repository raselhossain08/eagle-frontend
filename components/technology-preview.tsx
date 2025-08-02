import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Code, Zap, TrendingUp, Bot, CheckCircle, Star } from "lucide-react"
import Image from "next/image"

export function TechnologyPreview() {
  return (
    <section className="relative bg-slate-900 py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-full px-6 py-3 mb-6">
            <Code className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-semibold uppercase tracking-wide text-sm">Technology Suite</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Advanced Trading
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent">
              Technology
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional-grade trading scripts and AI-powered tools designed to enhance your trading workflow and
            decision-making process.
          </p>
        </div>

        {/* Featured Scripts Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">Standalone Trading Scripts</h3>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">$47/month</Badge>
                  <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                    Included in Infinity
                  </Badge>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-lg mb-6">
              Access our complete library of professional trading scripts designed for TradingView and other platforms.
              These automated tools help identify opportunities and manage risk across multiple markets.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Multi-timeframe analysis scripts</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Risk management calculators</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Custom indicator combinations</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Automated alert systems</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/technology">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 text-lg font-semibold rounded-xl">
                  View All Scripts
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-6 py-3 text-lg font-semibold rounded-xl bg-transparent"
                >
                  Get Infinity Access
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
              <Image
                src="/images/trading-scripts-overview.png"
                alt="Trading Scripts Overview"
                width={600}
                height={400}
                className="rounded-2xl w-full h-auto"
              />
            </div>
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              20+ Scripts
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              Auto-Updates
            </div>
          </div>
        </div>

        {/* Technology Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Market Analysis Tools</CardTitle>
              <CardDescription className="text-gray-400">
                Advanced charting and technical analysis scripts for comprehensive market evaluation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white text-xl">AI-Powered Insights</CardTitle>
              <CardDescription className="text-gray-400">
                Machine learning algorithms that analyze patterns and provide intelligent trading suggestions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-green-500/50 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Premium Integration</CardTitle>
              <CardDescription className="text-gray-400">
                Seamless integration with popular trading platforms and real-time data feeds.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Pricing Highlight */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Get Complete Technology Access</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Choose standalone script access for $47/month, or get everything included with our Infinity plan for
            comprehensive trading support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
              <div className="text-purple-400 font-semibold mb-1">Standalone Scripts</div>
              <div className="text-2xl font-bold text-white">
                $47<span className="text-lg text-gray-400">/month</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4">
              <div className="text-cyan-400 font-semibold mb-1">Infinity Plan</div>
              <div className="text-2xl font-bold text-white">
                Everything<span className="text-lg text-gray-400"> Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
