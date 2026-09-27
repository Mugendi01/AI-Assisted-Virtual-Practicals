'use client';

import Link from 'next/link';
import Button from './Button';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              Science practicals <span className="text-blue-600">shouldn't depend</span> on having a laboratory.
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              AI Lab combines AI-guided learning, local context adaptation and interactive virtual experiments to make practical science more accessible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/experiments">
                <Button size="lg">Start an Experiment</Button>
              </Link>
              <Link href="/#how-it-works">
                <Button variant="outline" size="lg">See How It Works</Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Virtual Lab Illustration */}
          <div className="relative animate-slide-up">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              {/* Virtual Lab Mockup */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-500">Virtual Lab</span>
                </div>

                {/* Lab Visualization */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 space-y-4">
                  {/* Beakers */}
                  <div className="flex justify-center space-x-8">
                    <div className="text-center">
                      <div className="w-16 h-24 bg-blue-200 rounded-b-lg border-2 border-blue-300 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-blue-400 opacity-60"></div>
                      </div>
                      <span className="text-xs text-gray-600 mt-2 block">Beaker A</span>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-24 bg-yellow-200 rounded-b-lg border-2 border-yellow-300 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-yellow-400 opacity-60"></div>
                      </div>
                      <span className="text-xs text-gray-600 mt-2 block">Beaker B</span>
                    </div>
                  </div>

                  {/* pH Display */}
                  <div className="bg-white rounded-lg p-3 text-center">
                    <span className="text-sm text-gray-500">pH Level</span>
                    <div className="text-2xl font-bold text-blue-600">7.0</div>
                  </div>

                  {/* AI Assistant Bubble */}
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg p-4 text-white">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-blue-600">⚗️</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Good prediction! Let's test it by running the experiment.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experiment Data Panel */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-500">Temperature</span>
                    <div className="text-lg font-semibold text-gray-900">25°C</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-500">Time</span>
                    <div className="text-lg font-semibold text-gray-900">2:30</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-cyan-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
