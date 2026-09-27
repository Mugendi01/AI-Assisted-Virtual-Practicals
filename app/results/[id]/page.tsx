'use client';

import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { ExperimentService } from '@/services/experimentService';

export default function ResultsPage() {
  const params = useParams();
  const experiment = ExperimentService.getExperimentById(params.id as string);

  // Mock result data - in production this would come from the experiment service
  const result = {
    prediction: 8,
    observation: 9,
    explanation: 8,
    overall: 8.3,
    feedback: "Great work! You've successfully identified the acidic and basic properties of the substances. Your observations showed clear understanding of how indicators work.",
    reflection: "Think about how this experiment could be applied in real life. Where else might you use pH indicators in everyday situations?"
  };

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <span className="text-4xl">✓</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Experiment Complete</h1>
            <p className="text-xl text-gray-600">You've successfully completed the practical!</p>
          </div>

          {/* Results Card */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Prediction</div>
                <div className="text-3xl font-bold text-blue-600">{result.prediction}/10</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Observation</div>
                <div className="text-3xl font-bold text-green-600">{result.observation}/10</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Explanation</div>
                <div className="text-3xl font-bold text-purple-600">{result.explanation}/10</div>
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Overall Score</div>
              <div className="text-5xl font-bold text-blue-600">{result.overall}/10</div>
            </div>
          </Card>

          {/* Feedback Card */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What did you discover?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{result.feedback}</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Think Like a Scientist</h3>
              <p className="text-gray-700">{result.reflection}</p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/virtual-lab/${params.id}`}>
              <Button variant="outline" className="flex-1">Try Again</Button>
            </Link>
            <Link href="/experiments">
              <Button variant="outline" className="flex-1">Explore Another Experiment</Button>
            </Link>
            <Link href="/">
              <Button className="flex-1">Return Home</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
