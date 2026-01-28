
import SectionHeading from '@/components/ui/SectionHeading';
import Image from 'next/image';

export const metadata = {
  title: 'About Us - Mir Baba Tour & Travels',
  description:
    'Learn more about Mir Baba Tour & Travels, our founders, mission, vision, and commitment to providing the best Kashmir travel experience.',
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#3C0D2B] via-[#4E1438] to-[#22071A] text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Mir Baba Tour & Travels</h1>
        <p className="text-xl max-w-2xl mx-auto opacity-90">
          Your trusted partner from Srinagar for exploring the paradise on earth – Kashmir.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Locally owned. Personally managed.</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Mir Baba Tour & Travels is a Srinagar-based travel company run by a passionate local family. We
              specialize in crafting unforgettable Kashmir experiences – from houseboat stays on Dal Lake to
              snow adventures in Gulmarg and serene escapes in Pahalgam and Sonmarg.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Being from Kashmir, we know every season, every shortcut, and every hidden viewpoint. This helps
              us design honest, value-for-money itineraries that balance sightseeing, comfort, and local culture.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe in transparency, safety, and genuine hospitality. From your first WhatsApp message till
              you board your return flight, our team stays with you like a local guardian in Kashmir.
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

        {/* Founders Section */}
        <div className="mb-20">
          <SectionHeading title="Our Founders & Leadership" center={true} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div className="border border-rose-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow bg-rose-50/40">
              <h3 className="text-xl font-bold text-[#3C0D2B] mb-1">Mubashir Nazir</h3>
              <p className="text-sm font-semibold text-[#8B1430] mb-3">
                Founder & Owner – Mir Baba Tour & Travels
              </p>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                Mubashir personally oversees guest experience, hotel selection, and on-ground operations. His
                focus is to ensure every guest feels safe, cared for, and treated like family while in Kashmir.
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Phone (Primary):</span>{' '}
                <a href="tel:6005107475" className="text-[#8B1430] font-semibold">
                  +91 6005107475
                </a>
              </p>
            </div>

            <div className="border border-violet-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow bg-violet-50/50">
              <h3 className="text-xl font-bold text-[#2C0D3C] mb-1">Sajid Nazir</h3>
              <p className="text-sm font-semibold text-violet-800 mb-3">
                Technical Head & Managing Director
              </p>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                Sajid looks after the digital presence, booking systems, and overall planning. He ensures that
                your enquiries, confirmations, and itineraries are handled smoothly and professionally.
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">WhatsApp (Support):</span>{' '}
                <a href="https://wa.me/919906646113" target="_blank" rel="noopener noreferrer" className="text-violet-800 font-semibold">
                  +91 9906646113
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-rose-50 p-8 rounded-xl border border-rose-100">
            <h3 className="text-2xl font-bold text-[#3C0D2B] mb-4">Our Mission</h3>
            <p className="text-gray-700">
              To provide honest, transparent, and memorable Kashmir travel experiences that feel like visiting
              a local friend rather than a tour operator. We aim to showcase the real Kashmir – its people,
              culture, food, and landscapes – while maintaining safety and comfort for every guest.
            </p>
          </div>
          <div className="bg-violet-50 p-8 rounded-xl border border-violet-100">
            <h3 className="text-2xl font-bold text-[#2C0D3C] mb-4">Our Vision</h3>
            <p className="text-gray-700">
              To be one of the most trusted names in Kashmir tourism, known for integrity, warm hospitality, and
              value-driven packages. We want every guest of Mir Baba Tour & Travels to become a lifelong
              ambassador for Kashmir.
            </p>
          </div>
        </div>

        <SectionHeading title="Why We Are Different" center={true} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl font-bold text-[#8B1430] mb-2">10+</div>
            <div className="text-gray-900 font-semibold mb-2">Years of Experience</div>
            <p className="text-gray-500 text-sm">Serving happy customers with dedication and honesty.</p>
          </div>
          <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl font-bold text-[#8B1430] mb-2">50+</div>
            <div className="text-gray-900 font-semibold mb-2">Tour Packages</div>
            <p className="text-gray-500 text-sm">Customizable options for couples, families, and groups.</p>
          </div>
          <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl font-bold text-[#8B1430] mb-2">24/7</div>
            <div className="text-gray-900 font-semibold mb-2">Support</div>
            <p className="text-gray-500 text-sm">A local team in Srinagar always available on call or WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
