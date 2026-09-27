'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import AIAssistant from '@/components/AIAssistant';
import Link from 'next/link';
import { ExperimentService } from '@/services/experimentService';
import { AIService } from '@/services/aiService';

export default function VirtualLabPage() {
  const params = useParams();
  const experiment = ExperimentService.getExperimentById(params.id as string);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [substanceA, setSubstanceA] = useState('lemon-juice');
  const [indicator, setIndicator] = useState('turmeric');
  const [substanceB, setSubstanceB] = useState('baking-soda');
  const [prediction, setPrediction] = useState('');
  const [experimentRun, setExperimentRun] = useState(false);
  const [experimentResult, setExperimentResult] = useState<any>(null);
  const [aiContext, setAiContext] = useState('start');
  const [engineStatus, setEngineStatus] = useState<'Ready' | 'Simulating' | 'Complete'>('Ready');

  // Auto-advance to prediction step when components are selected
  useEffect(() => {
    if (currentStep === 1 && substanceA && indicator && substanceB) {
      setCurrentStep(2);
      setAiContext('start');
    }
  }, [substanceA, indicator, substanceB, currentStep]);

  const virtualLabSteps = ExperimentService.getVirtualLabSteps();

  if (!experiment) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Experiment not found</h1>
            <Link href="/experiments">
              <Button>Back to Experiments</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePrediction = (selectedPrediction: string) => {
    setPrediction(selectedPrediction);
    setCurrentStep(3);
    setAiContext('prediction');
  };

  const handleRunExperiment = () => {
    setExperimentRun(true);
    setCurrentStep(4);
    setAiContext('experiment');
    setEngineStatus('Simulating');

    // Simulate experiment result with progressive stages
    setTimeout(() => {
      const result = {
        observation: AIService.getExperimentExplanation(substanceA, substanceB, indicator),
        ph: Math.random() * 14,
        colorChange: indicator === 'turmeric' ? 'red' : 'green'
      };
      setExperimentResult(result);
      setCurrentStep(5);
      setAiContext('observation');
      setEngineStatus('Complete');
    }, 3000);
  };

  const handleComplete = () => {
    // Navigate to results page
    window.location.href = `/results/${params.id}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href={`/mode-selection/${params.id}`} className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
              ← Back to Mode Selection
            </Link>
            <div className="flex items-center justify-between mt-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Virtual Lab</h1>
                <p className="text-lg text-gray-600">{experiment.title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Level</p>
                <p className="font-semibold text-gray-900">{experiment.level}</p>
              </div>
            </div>
            {/* AI Lab Engine Status */}
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-gray-500">AI Lab Engine:</span>
              <span className={`text-sm font-medium ${engineStatus === 'Ready' ? 'text-green-600' : engineStatus === 'Simulating' ? 'text-blue-600' : 'text-green-600'}`}>
                {engineStatus}
              </span>
              {engineStatus === 'Simulating' && (
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <ProgressBar current={currentStep} total={5} label="Experiment Progress" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Controls */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Experiment Controls</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Substance A
                    </label>
                    <select
                      value={substanceA}
                      onChange={(e) => setSubstanceA(e.target.value)}
                      disabled={experimentRun}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="lemon-juice">Lemon Juice</option>
                      <option value="vinegar">Vinegar</option>
                      <option value="baking-soda">Baking Soda Solution</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Indicator
                    </label>
                    <select
                      value={indicator}
                      onChange={(e) => setIndicator(e.target.value)}
                      disabled={experimentRun}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="turmeric">Turmeric</option>
                      <option value="hibiscus">Hibiscus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Substance B
                    </label>
                    <select
                      value={substanceB}
                      onChange={(e) => setSubstanceB(e.target.value)}
                      disabled={experimentRun}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="baking-soda">Baking Soda Solution</option>
                      <option value="lemon-juice">Lemon Juice</option>
                      <option value="vinegar">Vinegar</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Safety Notice */}
              <Card className="p-4 border-2 border-yellow-200 bg-yellow-50">
                <div className="flex items-start space-x-2">
                  <span className="text-xl">⚠️</span>
                  <p className="text-xs text-gray-700">
                    Safety first: AI Lab only permits supported learning scenarios.
                  </p>
                </div>
              </Card>
            </div>

            {/* Center Column - Virtual Laboratory */}
            <div className="lg:col-span-6 space-y-6">
              <Card className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Virtual Laboratory</h2>
                
                {/* Lab Visualization */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 space-y-6">
                  {/* Beakers */}
                  <div className="flex justify-center space-x-12">
                    <div className="text-center">
                      <div className={`
                        w-20 h-32 rounded-b-lg border-2 relative overflow-hidden transition-all duration-500
                        ${experimentRun ? 'border-blue-400' : 'border-blue-300'}
                      `}>
                        <div className={`
                          absolute bottom-0 left-0 right-0 transition-all duration-500
                          ${experimentRun ? 'h-24 bg-blue-400 opacity-80' : 'h-20 bg-blue-300 opacity-60'}
                        `}></div>
                      </div>
                      <span className="text-sm text-gray-600 mt-2 block">Beaker A</span>
                      <span className="text-xs text-gray-500">{substanceA.replace('-', ' ')}</span>
                    </div>

                    <div className="text-center">
                      <div className={`
                        w-20 h-32 rounded-b-lg border-2 relative overflow-hidden transition-all duration-500
                        ${experimentRun ? 'border-yellow-400' : 'border-yellow-300'}
                      `}>
                        <div className={`
                          absolute bottom-0 left-0 right-0 transition-all duration-500
                          ${experimentRun 
                            ? `h-24 ${experimentResult?.colorChange === 'red' ? 'bg-red-400' : 'bg-green-400'} opacity-80`
                            : 'h-20 bg-yellow-300 opacity-60'
                          }
                        `}></div>
                      </div>
                      <span className="text-sm text-gray-600 mt-2 block">Beaker B</span>
                      <span className="text-xs text-gray-500">{substanceB.replace('-', ' ')}</span>
                    </div>
                  </div>

                  {/* Mixing Area */}
                  <div className="flex justify-center">
                    <div className={`
                      w-32 h-24 rounded-lg border-2 relative overflow-hidden transition-all duration-500
                      ${experimentRun ? 'border-purple-400' : 'border-purple-300'}
                    `}>
                      <div className={`
                        absolute bottom-0 left-0 right-0 transition-all duration-500
                        ${experimentRun 
                          ? `h-16 ${experimentResult?.colorChange === 'red' ? 'bg-red-300' : 'bg-green-300'} opacity-70`
                          : 'h-12 bg-purple-200 opacity-50'
                        }
                      `}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl">🧪</span>
                      </div>
                    </div>
                  </div>

                  {/* Result Display */}
                  {experimentResult && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-gray-500">pH Level</span>
                          <div className="text-2xl font-bold text-blue-600">{experimentResult.ph.toFixed(1)}</div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Indicator</span>
                          <div className="text-lg font-semibold text-gray-900 capitalize">{indicator}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Prediction Section */}
              {currentStep === 2 && !prediction && (
                <Card className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Make a Prediction</h2>
                  <p className="text-gray-600 mb-4">What do you predict will happen?</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'The solution becomes more acidic',
                      'The solution becomes more basic',
                      'There will be no significant change',
                      "I'm not sure"
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => handlePrediction(option)}
                        className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                      >
                        <span className="text-sm text-gray-700">{option}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              {/* Run Experiment Button */}
              {currentStep === 3 && !experimentRun && (
                <Button 
                  onClick={handleRunExperiment}
                  size="lg"
                  className="w-full"
                >
                  Run Experiment
                </Button>
              )}

              {/* Result Section */}
              {experimentResult && (
                <Card className="p-6 border-2 border-green-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Experiment Result</h2>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500">Observation</span>
                      <p className="text-gray-700">{experimentResult.observation}</p>
                    </div>
                    <Button onClick={handleComplete} className="w-full">
                      Complete Practical
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - AI Assistant */}
            <div className="lg:col-span-3">
              <AIAssistant context={aiContext} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
