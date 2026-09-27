'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { experiments } from '@/data/experiments';

export default function ExperimentsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Science Experiments</h1>
            <p className="text-xl text-gray-600">Choose a practical and start exploring.</p>
          </div>

          {/* Experiments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map((experiment) => (
              <Card 
                key={experiment.id} 
                hover={experiment.status === 'available'}
                className={`p-6 ${experiment.status === 'coming-soon' ? 'opacity-60' : ''}`}
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {experiment.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{experiment.title}</h3>
                
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <p><span className="font-medium">Level:</span> {experiment.level}</p>
                  <p><span className="font-medium">Difficulty:</span> {experiment.difficulty}</p>
                  <p><span className="font-medium">Time:</span> {experiment.estimatedTime}</p>
                </div>

                <p className="text-gray-600 mb-4 text-sm">{experiment.objective}</p>

                {experiment.status === 'available' ? (
                  <Link href={`/experiment/${experiment.id}`}>
                    <Button className="w-full">Start Practical</Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full">Coming Soon</Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
