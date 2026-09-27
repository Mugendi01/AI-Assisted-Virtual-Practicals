'use client';

import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { ExperimentService } from '@/services/experimentService';

export default function ExperimentDetailPage() {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/experiments" className="text-blue-600 hover:text-blue-700">
              ← Back to Experiments
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {experiment.category}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {experiment.level}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{experiment.title}</h1>
            <p className="text-xl text-gray-600">{experiment.objective}</p>
          </div>

          {/* Details Card */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
            <ul className="space-y-3 mb-8">
              {experiment.whatYoullLearn.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Estimated time</span>
                  <p className="text-lg font-semibold text-gray-900">{experiment.estimatedTime}</p>
                </div>
                <Link href={`/mode-selection/${experiment.id}`}>
                  <Button size="lg">Begin Practical</Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this practical</h2>
            <p className="text-gray-600 leading-relaxed">{experiment.description}</p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
