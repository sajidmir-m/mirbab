
import SectionHeading from '@/components/ui/SectionHeading';
import Image from 'next/image';

export const metadata = {
  title: 'About Us - Mir Baba Tour and Travels',
  description: 'Learn more about Mir Baba Tour and Travels, our mission, vision, and commitment to providing the best Kashmir travel experience.',
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Header */}
      <div className="bg-teal-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
        <p className="text-xl max-w-2xl mx-auto opacity-90">Your trusted partner for exploring the paradise on earth.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Mir Baba Tour and Travels</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We are a premier travel agency based in the heart of Kashmir, Srinagar. With years of experience in the tourism industry, we specialize in crafting unforgettable journeys for travelers from around the world.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our deep-rooted connection to the land allows us to offer authentic experiences that go beyond the typical tourist trails. Whether you are looking for a romantic honeymoon, a fun-filled family vacation, or an adventurous trek, we have the perfect package for you.
            </p>
            <p className="text-gray-600 leading-relaxed">
              At Mir Baba Tour and Travels, we believe in transparency, quality, and hospitality. Our team of local experts is dedicated to ensuring your comfort and safety throughout your trip.
            </p>
          </div>
          <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=2070&auto=format&fit=crop"
              alt="Kashmir Landscape"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-teal-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-teal-800 mb-4">Our Mission</h3>
            <p className="text-gray-700">
              To provide world-class travel services that showcase the true beauty and culture of Kashmir while ensuring sustainable and responsible tourism practices. We aim to create lifelong memories for our guests through personalized care and attention to detail.
            </p>
          </div>
          <div className="bg-teal-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-teal-800 mb-4">Our Vision</h3>
            <p className="text-gray-700">
              To be the most trusted and preferred travel partner for Kashmir tourism, known for our integrity, excellence, and commitment to customer satisfaction. We strive to put Kashmir on the global map as a top travel destination.
            </p>
          </div>
        </div>

        <SectionHeading title="Why We Are Different" center={true} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl font-bold text-teal-600 mb-2">10+</div>
            <div className="text-gray-900 font-semibold mb-2">Years of Experience</div>
            <p className="text-gray-500 text-sm">Serving happy customers with dedication.</p>
          </div>
          <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl font-bold text-teal-600 mb-2">50+</div>
            <div className="text-gray-900 font-semibold mb-2">Tour Packages</div>
            <p className="text-gray-500 text-sm">Customizable options for every budget.</p>
          </div>
          <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl font-bold text-teal-600 mb-2">24/7</div>
            <div className="text-gray-900 font-semibold mb-2">Support</div>
            <p className="text-gray-500 text-sm">We are always here to help you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
