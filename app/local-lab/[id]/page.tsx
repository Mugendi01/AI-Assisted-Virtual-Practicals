'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import Link from 'next/link';
import { ExperimentService } from '@/services/experimentService';

export default function LocalLabPage() {
  const params = useParams();
  const experiment = ExperimentService.getExperimentById(params.id as string);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [showPathway, setShowPathway] = useState(false);

  const availableMaterials = ExperimentService.getAvailableMaterials();
  const labMaterials = ExperimentService.getLabMaterials();
  const localLabSteps = ExperimentService.getLocalLabSteps();

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

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterials(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
    setShowPathway(false);
  };

  const handleContinue = () => {
    if (selectedMaterials.length > 0) {
      setShowPathway(true);
    }
  };

  const pathway = ExperimentService.generateLocalLabPathway(selectedMaterials);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href={`/mode-selection/${params.id}`} className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
              ← Back to Mode Selection
            </Link>
            <div className="flex items-center justify-between mt-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Local Lab</h1>
                <p className="text-lg text-gray-600">Let's work with what you have.</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Experiment</p>
                <p className="font-semibold text-gray-900">{experiment.title}</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <ProgressBar current={1} total={4} label="Material Selection" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Material Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Available Materials */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What materials are available to you?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableMaterials.map((material) => (
                    <button
                      key={material.id}
                      onClick={() => toggleMaterial(material.id)}
                      className={`
                        p-4 rounded-lg border-2 transition-all
                        ${selectedMaterials.includes(material.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="text-3xl mb-2">{material.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{material.name}</div>
                      {selectedMaterials.includes(material.id) && (
                        <div className="mt-2 text-xs text-blue-600 font-medium">✓ Selected</div>
                      )}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Standard Lab Materials (Reference) */}
              <Card className="p-6 opacity-60">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Standard Lab Materials</h2>
                <p className="text-sm text-gray-500 mb-4">These are typically used in well-equipped laboratories:</p>
                <div className="grid grid-cols-3 gap-4">
                  {labMaterials.map((material) => (
                    <div key={material.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="text-3xl mb-2">{material.icon}</div>
                      <div className="text-sm font-medium text-gray-700">{material.name}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* AI Pathway */}
              {showPathway && (
                <Card className="p-6 border-2 border-green-200 bg-green-50">
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">🤖</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">AI Suggested Pathway</h3>
                      <p className="text-gray-700">{pathway}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {!showPathway ? (
                  <Button 
                    onClick={handleContinue}
                    disabled={selectedMaterials.length === 0}
                    className="flex-1"
                  >
                    Continue
                  </Button>
                ) : (
                  <>
                    <Link href={`/virtual-lab/${params.id}`} className="flex-1">
                      <Button className="w-full">Start Local Practical</Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPathway(false)}
                      className="flex-1"
                    >
                      Modify Selection
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Learning Path */}
            <div className="space-y-6">
              {/* Learning Path */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Learning Path</h2>
                <div className="space-y-4">
                  {localLabSteps.map((step, index) => (
                    <div key={step.id} className="flex items-start space-x-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                      `}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Safety Notice */}
              <Card className="p-6 border-2 border-yellow-200 bg-yellow-50">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">⚠️</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Safety Notice</h3>
                    <p className="text-sm text-gray-700">
                      Always work with adult supervision. Use only materials that are safe and appropriate for your learning environment.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Why This Works */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Why this works</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Natural indicators like turmeric and hibiscus contain compounds that change color based on pH levels, just like laboratory indicators. This lets you explore acid-base chemistry using safe, locally available materials.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
