export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mirbabatourtravels.in';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Mir Baba Tour and Travels',
    description: 'Kashmir-based travel agency offering tour packages, hotel bookings, and transport services',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-6005107475',
      contactType: 'Customer Service',
      email: 'mirbabatourtravels@gmail.com',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Kashmiri'],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Srinagar',
      addressRegion: 'Jammu and Kashmir',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.instagram.com/exploring_kashmir____',
      'https://www.facebook.com/share/16kmY8pU6w/',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}

