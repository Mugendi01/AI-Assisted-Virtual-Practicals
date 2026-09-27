import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />

        {/* Two Ways to Learn Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">One practical. Two ways to learn.</h2>
              <p className="text-xl text-gray-600">Choose the approach that works best for your learning environment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              {/* Local Lab Card */}
              <Card hover className="p-8">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Local Lab</h3>
                <p className="text-gray-600 mb-6">Adapt learning to your environment using appropriate locally available materials.</p>
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
                </ul>
                <Link href="/experiments">
                  <Button variant="outline" className="w-full">Explore Local Lab</Button>
                </Link>
              </Card>

              {/* Virtual Lab Card */}
              <Card hover className="p-8">
                <div className="text-5xl mb-4">🧪</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Virtual Lab</h3>
                <p className="text-gray-600 mb-6">Experiment without physical equipment through interactive simulations.</p>
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
                    AI-guided questions
                  </li>
                </ul>
                <Link href="/experiments">
                  <Button className="w-full">Try Virtual Lab</Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">From Question to Discovery</h2>
              <p className="text-xl text-gray-600">Your journey from curiosity to understanding</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { step: 'Ask', icon: '❓', desc: 'Choose a practical' },
                { step: 'Adapt', icon: '🌍', desc: 'Select your mode' },
                { step: 'Experiment', icon: '🧪', desc: 'Perform the activity' },
                { step: 'Observe', icon: '👁️', desc: 'Make observations' },
                { step: 'Learn', icon: '🎓', desc: 'Get AI feedback' }
              ].map((item, index) => (
                <div key={item.step} className="text-center">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.step}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  {index < 4 && (
                    <div className="hidden md:block text-center text-gray-300 text-2xl mt-2">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Designed for classrooms where resources are limited — but curiosity isn't.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '🎯', title: 'Low-resource friendly', desc: 'Works with basic materials' },
                { icon: '🎮', title: 'Interactive experimentation', desc: 'Hands-on learning experience' },
                { icon: '🤖', title: 'AI-guided learning', desc: 'Personalized feedback' },
                { icon: '🛡️', title: 'Safety-aware', desc: 'Approved learning scenarios' }
              ].map((item) => (
                <Card key={item.title} className="p-6 text-center">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to enter the lab?</h2>
            <p className="text-xl text-blue-100 mb-8">Start your first practical experiment today.</p>
            <Link href="/experiments">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Your First Practical
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
