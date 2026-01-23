import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { MOCK_PACKAGES } from '@/data/packages';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mirbabatourandtravels.com';

  let pkg: any = null;
  
  try {
    const { data } = await supabase
      .from('packages')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (data) {
      pkg = data;
    } else {
      pkg = MOCK_PACKAGES.find(p => p.slug === slug);
    }
  } catch (error) {
    pkg = MOCK_PACKAGES.find(p => p.slug === slug);
  }

  if (!pkg) {
    return {
      title: 'Package Not Found | Mir Baba Tour and Travels',
    };
  }

  return {
    title: `${pkg.title} | Mir Baba Tour and Travels`,
    description: pkg.description || `Book ${pkg.title} - ${pkg.duration} tour package starting from ₹${pkg.price.toLocaleString()}. Experience ${pkg.location} with Mir Baba Tour and Travels.`,
    keywords: `Kashmir tour, ${pkg.location}, ${pkg.title}, tour package, Kashmir travel`,
    openGraph: {
      title: pkg.title,
      description: pkg.description || `Experience ${pkg.location} with our ${pkg.duration} tour package.`,
      images: pkg.featured_image ? [pkg.featured_image] : [],
      url: `${baseUrl}/packages/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pkg.title,
      description: pkg.description || `Book ${pkg.title} tour package.`,
      images: pkg.featured_image ? [pkg.featured_image] : [],
    },
    alternates: {
      canonical: `${baseUrl}/packages/${slug}`,
    },
  };
}

