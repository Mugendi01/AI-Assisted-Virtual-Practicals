'use client';

import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { ExperimentService } from '@/services/experimentService';

export default function ModeSelectionPage() {
  const params = useParams();
  const experiment = ExperimentService.getExperimentById(params.id as string);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href={`/experiment/${params.id}`} className="text-blue-600 hover:text-blue-700">
              ← Back to Experiment
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">How would you like to learn?</h1>
            <p className="text-xl text-gray-600">Choose the learning mode that works best for you.</p>
          </div>

          {/* Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Local Lab Mode */}
            <Card hover className="p-8">
              <div className="text-5xl mb-4">🌍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Local Lab</h2>
              <p className="text-gray-600 mb-6">
                Explore how practical concepts can be demonstrated using appropriate locally available materials.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Context-aware guidance
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Material alternatives
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Step-by-step instructions
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Observation guidance
                </li>
              </ul>
              <Link href={`/local-lab/${params.id}`}>
                <Button variant="outline" className="w-full">Choose Local Lab</Button>
              </Link>
            </Card>

            {/* Virtual Lab Mode */}
            <Card hover className="p-8 border-2 border-blue-200">
              <div className="text-5xl mb-4">🧪</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Virtual Lab</h2>
              <p className="text-gray-600 mb-6">
                Perform an interactive simulation and explore what happens when you change experimental conditions.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Interactive experiment
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Variable selection
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Simulated observations
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  AI-guided questions
                </li>
              </ul>
              <Link href={`/virtual-lab/${params.id}`}>
                <Button className="w-full">Enter Virtual Lab</Button>
              </Link>
            </Card>
          </div>

          {/* Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-800">
              <span className="font-medium">Note:</span> Both modes are designed around the same learning objective.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
