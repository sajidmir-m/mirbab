
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  MessageSquare, 
  HelpCircle, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  CheckCircle, 
  XCircle, 
  LayoutDashboard,
  Bell,
  Database,
  Users,
  Menu,
  X,
  Car,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PACKAGES } from '@/data/packages';
import { PLACES } from '@/data/places';
import { CAB_PLANS } from '@/data/cabs';
import { useToast } from '@/components/ui/Toast';
import AdminPackageModal from '@/components/admin/AdminPackageModal';
import AdminFAQModal from '@/components/admin/AdminFAQModal';
import AdminInquiryModal from '@/components/admin/AdminInquiryModal';
import AdminCabModal from '@/components/admin/AdminCabModal';
import AdminPlaceModal from '@/components/admin/AdminPlaceModal';

export default function AdminPanel() {
  const { showToast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [cabs, setCabs] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<any>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isCabModalOpen, setIsCabModalOpen] = useState(false);
  const [selectedCab, setSelectedCab] = useState<any>(null);
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mock Stats
  const stats = [
    { title: 'Total Inquiries', value: inquiries.length, icon: MessageSquare, color: 'bg-blue-500' },
    { title: 'Active Packages', value: packages.length, icon: Package, color: 'bg-teal-500' },
    { title: 'Pending Actions', value: inquiries.filter(i => i.status === 'pending').length, icon: Bell, color: 'bg-orange-500' },
  ];

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchData();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    // 1. Fetch Inquiries
    let allInquiries: any[] = [];
    let supabaseError: string | null = null;
    
    // Try Supabase
    const { data: inqData, error: inqError } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (inqError) {
      console.error('Error fetching inquiries from Supabase:', inqError);
      supabaseError = inqError.message;
      // Show error to admin if RLS is blocking
      if (inqError.message.includes('row-level security') || inqError.message.includes('permission')) {
        console.warn('RLS Policy Issue: Admin may not have proper permissions. Check if user has admin role in profiles table.');
      }
    }
    
    if (inqData) {
      allInquiries = [...inqData];
      console.log(`✅ Fetched ${inqData.length} inquiries from Supabase`);
    }
    
    // Try LocalStorage (Fallback)
    if (typeof window !== 'undefined') {
      const localInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
      console.log(`📦 Found ${localInquiries.length} inquiries in LocalStorage`);
      
      // Merge unique inquiries
      const existingIds = new Set(allInquiries.map(i => i.id));
      const newLocal = localInquiries.filter((i: any) => !existingIds.has(i.id));
      
      if (newLocal.length > 0) {
        console.warn(`⚠️ Found ${newLocal.length} inquiries in LocalStorage that are not in Supabase. These may have failed to save.`);
        // Add LocalStorage inquiries with a flag
        allInquiries = [...allInquiries, ...newLocal.map((i: any) => ({ ...i, _source: 'localStorage' }))];
      }
    }
    
    // Sort by date desc
    allInquiries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setInquiries(allInquiries);
    
    // Show warning if there are LocalStorage-only inquiries
    if (typeof window !== 'undefined' && allInquiries.some((i: any) => i._source === 'localStorage')) {
      const localOnlyCount = allInquiries.filter((i: any) => i._source === 'localStorage').length;
      if (localOnlyCount > 0) {
        setTimeout(() => {
          alert(`⚠️ Warning: ${localOnlyCount} inquiry/inquiries are stored locally but not in Supabase. This may indicate a database connection or RLS policy issue. Check your Supabase configuration.`);
        }, 500);
      }
    }

    // 2. Fetch Packages
    const { data: pkgData } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });
    
    let currentPackages = [];
    if (pkgData) currentPackages = pkgData;
    else {
      // Fallback for packages (Mock data if DB is empty)
       currentPackages = [
         { id: '1', title: 'Magical Kashmir Family Tour', duration: '6D/5N', price: 18500, created_at: new Date().toISOString() },
         { id: '2', title: 'Romantic Honeymoon Special', duration: '5D/4N', price: 24999, created_at: new Date().toISOString() }
       ];
    }
    setPackages(currentPackages);

    // 3. Fetch FAQs
    const { data: faqData } = await supabase
      .from('chatbot_faqs')
      .select('*')
      .order('category', { ascending: true });
    
    if (faqData) setFaqs(faqData);

    // 4. Fetch Cabs
    const { data: cabData } = await supabase
      .from('cabs')
      .select('*')
      .order('created_at', { ascending: false });

    if (cabData) setCabs(cabData);

    // 5. Fetch Places
    const { data: placeData } = await supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false });

    if (placeData && placeData.length > 0) setPlaces(placeData);
    else setPlaces(PLACES); // fallback to static list for now

    // 6. Fetch Users
    const { data: userData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (userData) setUsers(userData);
  };

  // Helper to get package details
  const getPackageDetails = (packageId: string) => {
    return packages.find(p => p.id === packageId);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const deleteInquiry = async (id: string) => {
    if(!confirm('Are you sure you want to delete this inquiry?')) return;

    setLoading(true);
    let deletedFromSupabase = false;
    let deletedFromLocal = false;
    let errorMessage = '';

    try {
      // Try deleting from Supabase first
      const { error, data } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase delete error:', error);
        errorMessage = error.message;
        
        // Check if it's an RLS/permission error
        if (error.message.includes('row-level security') || error.message.includes('permission')) {
          alert(`❌ Delete Failed: Permission denied!\n\nError: ${error.message}\n\nYou may not have delete permissions. Check RLS policies.\n\nRun this SQL in Supabase:\n\nCREATE POLICY "Admins can delete inquiries" ON inquiries FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));`);
          setLoading(false);
          return;
        }
      } else {
        deletedFromSupabase = true;
        console.log('✅ Deleted from Supabase:', id);
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      errorMessage = err.message || 'Unknown error';
    }
    
    // Also delete from LocalStorage if present
    try {
    const localInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    const updatedLocal = localInquiries.filter((i: any) => i.id !== id);
      if (updatedLocal.length < localInquiries.length) {
    localStorage.setItem('inquiries', JSON.stringify(updatedLocal));
        deletedFromLocal = true;
        console.log('✅ Deleted from LocalStorage:', id);
      }
    } catch (lsErr) {
      console.warn('LocalStorage delete error:', lsErr);
    }

    // Update State (always remove from UI)
    setInquiries(prev => prev.filter(i => i.id !== id));

    setLoading(false);

    // Show feedback
    if (deletedFromSupabase && deletedFromLocal) {
      showToast('Inquiry deleted successfully from both Supabase and LocalStorage.', 'success');
    } else if (deletedFromSupabase) {
      showToast('Inquiry deleted successfully from Supabase.', 'success');
    } else if (deletedFromLocal) {
      showToast('Inquiry deleted from LocalStorage only. Supabase delete failed.', 'warning');
      if (errorMessage) {
        console.error('Delete error details:', errorMessage);
      }
    } else {
      alert(`❌ Failed to delete inquiry!\n\nError: ${errorMessage || 'Unknown error'}\n\nThe inquiry was removed from the UI but may still exist in the database.`);
    }

    // Refresh data to ensure consistency
    fetchData();
  };

  const toggleInquiryStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'read' : 'pending';
    
    try {
    // Update Supabase
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Status update error:', error);
        if (error.message.includes('row-level security') || error.message.includes('permission')) {
          alert(`❌ Update Failed: Permission denied!\n\nError: ${error.message}\n\nCheck RLS policies.`);
          return;
        }
      } else {
        console.log('✅ Status updated in Supabase');
      }
    } catch (err: any) {
      console.error('Status update error:', err);
    }

    // Update LocalStorage
    try {
    const localInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    const updatedLocal = localInquiries.map((i: any) => i.id === id ? { ...i, status: newStatus } : i);
    localStorage.setItem('inquiries', JSON.stringify(updatedLocal));
    } catch (lsErr) {
      console.warn('LocalStorage update error:', lsErr);
    }

    // Update State
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
  };

  const handleSeedData = async () => {
    if(!confirm('Are you sure you want to seed the database? This will insert mock packages.')) return;
    setLoading(true);
    try {
        const { error } = await supabase.from('packages').insert(MOCK_PACKAGES.map(p => {
            // Remove ID to let Supabase generate UUID
            const { id, ...rest } = p; 
            return rest;
        }));
        
        if (error) throw error;
        alert('Database seeded successfully!');
        fetchData(); // Refresh
    } catch (err: any) {
        alert('Error seeding database: ' + err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (error) {
      alert('Error deleting package: ' + error.message);
    } else {
      fetchData();
    }
  };

  const handleSeedCabs = async () => {
    if (!confirm('Seed cab plans from defaults?')) return;
    setLoading(true);
    try {
      const payload = CAB_PLANS.map((c) => ({
        name: c.name,
        slug: c.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        description: c.description,
        duration: c.duration,
        starting_from: c.startingFrom,
        vehicle_type: c.vehicle_type || null,
        ideal_for: c.idealFor,
        routes: c.routes,
      }));
      const { error } = await supabase.from('cabs').insert(payload);
      if (error) throw error;
      alert('Cab plans seeded.');
      fetchData();
    } catch (err: any) {
      alert('Error seeding cab plans: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedPlaces = async () => {
    if (!confirm('Seed places from defaults?')) return;
    setLoading(true);
    try {
      const payload = PLACES.map((p) => ({
        name: p.name,
        slug: p.slug,
        tag: p.tag,
        location: p.location,
        description: p.description,
        highlights: p.highlights,
        best_time: p.bestTime,
        ideal_stay: p.idealStay,
        hero_image: p.heroImage || null,
        is_featured: false,
      }));
      const { error } = await supabase.from('places').insert(payload);
      if (error) throw error;
      alert('Places seeded.');
      fetchData();
    } catch (err: any) {
      alert('Error seeding places: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    const { error } = await supabase.from('chatbot_faqs').delete().eq('id', id);
    if (error) {
      alert('Error deleting FAQ: ' + error.message);
    } else {
      fetchData();
    }
  };

  const handleDeleteCab = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cab plan?')) return;
    const { error } = await supabase.from('cabs').delete().eq('id', id);
    if (error) {
      alert('Error deleting cab plan: ' + error.message);
    } else {
      fetchData();
    }
  };

  const handleDeletePlace = async (id: string) => {
    if (!confirm('Are you sure you want to delete this place?')) return;
    const { error } = await supabase.from('places').delete().eq('id', id);
    if (error) {
      alert('Error deleting place: ' + error.message);
    } else {
      fetchData();
    }
  };

  // Login Screen
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-teal-800">Admin Portal</h1>
            <p className="text-gray-500 mt-2">Sign in to manage your travels</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 disabled:opacity-70"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-teal-900 text-white rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-teal-900 text-white flex-shrink-0 flex-col fixed lg:static h-screen lg:h-auto z-50 transition-transform duration-300 flex ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tight">Mir Baba Admin</h1>
          <p className="text-teal-400 text-sm mt-1">Management Console</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
            { id: 'packages', label: 'Tour Packages', icon: Package },
            { id: 'places', label: 'Places', icon: MapPin },
            { id: 'cabs', label: 'Cabs', icon: Car },
            { id: 'faqs', label: 'Chatbot FAQs', icon: HelpCircle },
            { id: 'users', label: 'Users', icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left transition-all ${
                activeTab === item.id 
                  ? 'bg-teal-800 text-white shadow-lg' 
                  : 'text-teal-100 hover:bg-teal-800/50 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
              {item.id === 'inquiries' && inquiries.filter(i => i.status === 'pending').length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {inquiries.filter(i => i.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4">
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">

          {/* Mobile Navigation Tabs */}
          <div className="mb-6 flex lg:hidden gap-2 overflow-x-auto pb-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
              { id: 'packages', label: 'Tour Packages', icon: Package },
              { id: 'places', label: 'Places', icon: MapPin },
              { id: 'cabs', label: 'Cabs', icon: Car },
              { id: 'faqs', label: 'Chatbot FAQs', icon: HelpCircle },
              { id: 'users', label: 'Users', icon: Users },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === item.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {item.id === 'inquiries' && inquiries.filter(i => i.status === 'pending').length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {inquiries.filter(i => i.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
            </div>
          
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-opacity-20`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                 <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                 <p className="text-gray-500 text-sm">No recent activity to display.</p>
              </div>
            </motion.div>
          )}

          {/* Inquiries View */}
          {activeTab === 'inquiries' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h3 className="text-lg font-bold text-gray-900">Inquiries</h3>
                <div className="flex gap-2">
                  {inquiries.some((i: any) => i._source === 'localStorage') && (
                    <button
                      onClick={async () => {
                        const localOnly = inquiries.filter((i: any) => i._source === 'localStorage');
                        if (!confirm(`Sync ${localOnly.length} LocalStorage inquiry/inquiries to Supabase?\n\nThis will attempt to save them to the database.`)) return;
                        
                        setLoading(true);
                        let synced = 0;
                        let failed = 0;
                        const errors: string[] = [];
                        
                        for (const inquiry of localOnly) {
                          try {
                            // Safely extract fields with defaults
                            const cleanInquiry = {
                              name: inquiry?.name || 'Unknown',
                              email: inquiry?.email || '',
                              phone: inquiry?.phone || '',
                              message: inquiry?.message || null,
                              package_id: inquiry?.package_id || null,
                              status: inquiry?.status || 'pending',
                              created_at: inquiry?.created_at || new Date().toISOString()
                            };
                            
                            // Validate required fields
                            if (!cleanInquiry.name || !cleanInquiry.email || !cleanInquiry.phone) {
                              throw new Error('Missing required fields (name, email, or phone)');
                            }
                            
                            const { data, error } = await supabase
                              .from('inquiries')
                              .insert([cleanInquiry])
                              .select()
                              .single();
                            
                            if (error) {
                              console.error('Sync error:', error);
                              errors.push(`${cleanInquiry.name}: ${error.message}`);
                              failed++;
                              continue; // Skip to next inquiry instead of throwing
                            }
                            
                            synced++;
                            console.log(`✅ Synced inquiry for ${cleanInquiry.name}`);
                            
                            // Remove from LocalStorage after successful sync
                            try {
                              const localInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
                              const updated = localInquiries.filter((i: any) => i.id !== inquiry.id);
                              localStorage.setItem('inquiries', JSON.stringify(updated));
                            } catch (lsErr) {
                              console.warn('Failed to update LocalStorage:', lsErr);
                            }
                          } catch (err: any) {
                            console.error('Failed to sync inquiry:', err);
                            errors.push(`Inquiry sync failed: ${err.message || 'Unknown error'}`);
                            failed++;
                          }
                        }
                        
                        setLoading(false);
                        
                        let message = `Sync complete:\n✅ ${synced} synced successfully\n❌ ${failed} failed`;
                        if (errors.length > 0) {
                          message += `\n\nErrors:\n${errors.slice(0, 3).join('\n')}`;
                          if (errors.length > 3) message += `\n... and ${errors.length - 3} more`;
                        }
                        
                        alert(message);
                        fetchData();
                      }}
                      disabled={loading}
                      className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 transition-colors text-sm font-medium disabled:opacity-50"
                      title="Sync LocalStorage inquiries to Supabase"
                    >
                      <Database size={16} /> Sync to DB ({inquiries.filter((i: any) => i._source === 'localStorage').length})
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        
                        // First, test Supabase connection
                        const { data: connectionTest, error: connectionError } = await supabase
                          .from('packages')
                          .select('id')
                          .limit(1);
                        
                        if (connectionError) {
                          alert(`❌ Supabase Connection Failed!\n\nError: ${connectionError.message}\n\nPlease check:\n1. NEXT_PUBLIC_SUPABASE_URL in .env.local\n2. NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local\n3. Your internet connection\n4. Supabase project status`);
                          return;
                        }
                        
                        console.log('✅ Supabase connection OK');
                        
                        // Check admin permissions
                        const { data: { user }, error: userError } = await supabase.auth.getUser();
                        
                        if (userError) {
                          alert(`❌ Auth Error: ${userError.message}`);
                          return;
                        }
                        
                        if (!user) {
                          alert('⚠️ Not logged in! Please log in first.');
                          return;
                        }
                        
                        const { data: profile, error: profileError } = await supabase
                          .from('profiles')
                          .select('*')
                          .eq('id', user.id)
                          .single();
                        
                        if (profileError) {
                          console.error('Profile fetch error:', profileError);
                        }
                        
                        if (!profile) {
                          const sqlCommand = `INSERT INTO profiles (id, email, role)
VALUES ('${user.id}', '${user.email || 'unknown'}', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';`;
                          alert(`⚠️ No profile found!\n\nYour user ID: ${user.id}\nEmail: ${user.email || 'unknown'}\n\nRun this SQL in Supabase SQL Editor:\n\n${sqlCommand}`);
                          return;
                        }
                        
                        if (profile.role !== 'admin') {
                          const sqlCommand = `UPDATE profiles SET role = 'admin' WHERE id = '${user.id}';`;
                          alert(`⚠️ You don't have admin role!\n\nCurrent role: ${profile.role}\nEmail: ${user.email || 'unknown'}\n\nRun this SQL in Supabase SQL Editor:\n\n${sqlCommand}`);
                          return;
                        }
                        
                        // Test inquiry insert
                        const testInquiry = {
                          name: 'Test Admin Check',
                          email: user.email || 'test@example.com',
                          phone: '+91 0000000000',
                          message: 'This is a test inquiry to verify permissions',
                          status: 'pending'
                        };
                        
                        const { error: insertError } = await supabase
                          .from('inquiries')
                          .insert([testInquiry]);
                        
                        if (insertError) {
                          alert(`❌ Insert Test Failed!\n\nError: ${insertError.message}\n\nThis means inquiries cannot be saved. Check RLS policies.\n\nSee fix_inquiries_rls.sql for help.`);
                          return;
                        }
                        
                        // Test inquiry select
                        const { data: testData, error: selectError } = await supabase
                          .from('inquiries')
                          .select('*')
                          .eq('email', user.email || 'test@example.com')
                          .order('created_at', { ascending: false })
                          .limit(1);
                        
                        if (selectError) {
                          alert(`⚠️ Select Test Failed!\n\nError: ${selectError.message}\n\nYou may not be able to view inquiries.\n\nSee fix_inquiries_rls.sql for help.`);
                          return;
                        }
                        
                        // Clean up test inquiry
                        if (testData && testData.length > 0) {
                          await supabase.from('inquiries').delete().eq('id', testData[0].id);
                        }
                        
                        alert(`✅ All checks passed!\n\nRole: ${profile.role}\nCan insert: ✅\nCan read: ✅\n\nYour setup is correct!`);
                      } catch (err: any) {
                        console.error('Permission check error:', err);
                        alert(`❌ Error: ${err.message || 'Unknown error occurred'}`);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50"
                    title="Check admin permissions and database connection"
                  >
                    <CheckCircle size={16} /> Check Permissions
                  </button>
                  <button
                    onClick={fetchData}
                    className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors text-sm font-medium"
                    title="Refresh inquiries"
                  >
                    <Search size={16} /> Refresh
                  </button>
                </div>
              </div>
              
              {/* Warning for LocalStorage-only inquiries */}
              {inquiries.some((i: any) => i._source === 'localStorage') && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800">
                    <strong>⚠️ Warning:</strong> Some inquiries are stored locally but not in Supabase. 
                    Check your database connection and RLS policies.
                  </p>
                </div>
              )}
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-left">
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Info</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Package / Message</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {inquiries.length === 0 ? (
                         <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                               <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
                               <p>No inquiries found yet.</p>
                            </td>
                         </tr>
                      ) : (
                        inquiries
                        .filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.email.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((inq) => {
                          const pkgDetails = inq.package_id ? getPackageDetails(inq.package_id) : null;
                          return (
                          <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(inq.created_at).toLocaleDateString()}
                              <br/>
                              <span className="text-xs text-gray-400">{new Date(inq.created_at).toLocaleTimeString()}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                                  {inq.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-gray-900">{inq.name}</span>
                                  <span className="text-sm text-gray-500">{inq.email}</span>
                                  <span className="text-xs text-gray-400">{inq.phone}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {pkgDetails ? (
                                <div className="mb-2 p-2 bg-teal-50 rounded-lg border border-teal-100">
                                  <p className="text-sm font-bold text-teal-800">{pkgDetails.title}</p>
                                  <p className="text-xs text-teal-600 font-medium">{pkgDetails.duration}</p>
                                </div>
                              ) : inq.package_id ? (
                                <div className="mb-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                  <p className="text-sm font-bold text-gray-700">Package ID: {inq.package_id}</p>
                                  <p className="text-xs text-gray-500">Details not found</p>
                                </div>
                              ) : null}
                              <p className="text-sm text-gray-600 max-w-xs truncate" title={inq.message}>
                                {inq.message}
                              </p>
                              {inq._source === 'localStorage' && (
                                <span className="inline-block mt-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                  Local Only
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                inq.status === 'read' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {inq.status === 'read' ? 'Read' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                onClick={() => toggleInquiryStatus(inq.id, inq.status)}
                                className="text-teal-600 hover:text-teal-900 mr-3"
                                title="Toggle Status"
                              >
                                {inq.status === 'read' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedInquiry(inq);
                                  setIsInquiryModalOpen(true);
                                }}
                                className="text-blue-500 hover:text-blue-700 mr-3"
                                title="View Details"
                              >
                                <Search size={18} />
                              </button>
                              <button 
                                onClick={() => deleteInquiry(inq.id)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        )})
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Packages View */}
          {activeTab === 'packages' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Tour Packages</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={handleSeedData}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    <Database size={18} /> Seed Data
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedPackage(null);
                      setIsPackageModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 font-medium"
                  >
                    <Plus size={18} /> Add New Package
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all relative">
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPackage(pkg);
                          setIsPackageModalOpen(true);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-teal-600 hover:text-teal-800 shadow-sm"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePackage(pkg.id);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 hover:text-red-700 shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="h-48 bg-gray-200 relative">
                      {pkg.featured_image ? (
                        <img src={pkg.featured_image} alt={pkg.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <Package size={48} />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="font-bold text-lg text-gray-900 leading-tight">{pkg.title}</h3>
                         <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2 py-1 rounded-lg">{pkg.duration}</span>
                      </div>
                      <p className="text-xl font-bold text-teal-600 mb-4">₹{pkg.price?.toLocaleString()}</p>
                      <div className="flex flex-wrap gap-2">
                        {pkg.inclusions?.slice(0, 3).map((inc: string, i: number) => (
                          <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100">{inc}</span>
                        ))}
                        {pkg.inclusions?.length > 3 && (
                          <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100">+{pkg.inclusions.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Places View */}
          {activeTab === 'places' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Places</h3>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleSeedPlaces}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    <Database size={18} /> Seed Places
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlace(null);
                      setIsPlaceModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 font-medium"
                  >
                    <Plus size={18} /> Add New Place
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((pl) => (
                  <div key={pl.id || pl.slug} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all relative">
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlace(pl);
                          setIsPlaceModalOpen(true);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-teal-600 hover:text-teal-800 shadow-sm"
                      >
                        <Edit size={16} />
                      </button>
                      {pl.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePlace(pl.id);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 hover:text-red-700 shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="h-40 bg-gray-200 relative">
                      {pl.hero_image ? (
                        <img src={pl.hero_image} alt={pl.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <MapPin size={40} />
                        </div>
                      )}
                      {pl.tag && (
                        <span className="absolute top-3 left-3 bg-white/90 text-teal-700 text-xs font-semibold px-2 py-1 rounded-lg">
                          {pl.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{pl.name}</h3>
                        {(pl.best_time || pl.bestTime) && (
                          <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2 py-1 rounded-lg">
                            {pl.best_time || pl.bestTime}
                          </span>
                        )}
                      </div>
                      {pl.location && <p className="text-xs text-gray-500 mb-1">{pl.location}</p>}
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{pl.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {pl.highlights?.slice(0, 3).map((h: string, i: number) => (
                          <span key={i} className="text-[11px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md border border-gray-100">
                            {h}
                          </span>
                        ))}
                        {pl.highlights?.length > 3 && (
                          <span className="text-[11px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md border border-gray-100">
                            +{pl.highlights.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {places.length === 0 && (
                  <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-500">
                    <MapPin size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-medium mb-1">No places added yet.</p>
                    <p className="text-sm mb-4">Use &quot;Seed Places&quot; to insert defaults or add manually.</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      <button
                        onClick={handleSeedPlaces}
                        className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        <Database size={16} /> Seed Places
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPlace(null);
                          setIsPlaceModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors text-sm font-medium"
                      >
                        <Plus size={16} /> Add New Place
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Cabs View */}
          {activeTab === 'cabs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Cab Plans</h3>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleSeedCabs}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    <Database size={18} /> Seed Cabs
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCab(null);
                      setIsCabModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 font-medium"
                  >
                    <Plus size={18} /> Add New Cab Plan
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cabs.map((cab) => (
                  <div
                    key={cab.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all relative"
                  >
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCab(cab);
                          setIsCabModalOpen(true);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-teal-600 hover:text-teal-800 shadow-sm"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCab(cab.id);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 hover:text-red-700 shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="h-32 bg-gradient-to-r from-teal-600 to-emerald-500 flex items-center justify-center text-white">
                      <div className="flex flex-col items-center gap-1">
                        <Car size={32} />
                        <span className="text-xs uppercase tracking-wide opacity-80">
                          {cab.vehicle_type || "Private Cab"}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2 gap-3">
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 leading-tight">
                          {cab.name}
                        </h3>
                        {cab.duration && (
                          <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap">
                            {cab.duration}
                          </span>
                        )}
                      </div>
                      {cab.starting_from && (
                        <p className="text-sm font-semibold text-teal-600 mb-2">
                          From {cab.starting_from}
                        </p>
                      )}
                      {cab.ideal_for && (
                        <p className="text-xs text-gray-500 mb-2">Ideal for: {cab.ideal_for}</p>
                      )}
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{cab.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cab.routes?.slice(0, 3).map((r: string, i: number) => (
                          <span
                            key={i}
                            className="text-[11px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md border border-gray-100"
                          >
                            {r}
                          </span>
                        ))}
                        {cab.routes?.length > 3 && (
                          <span className="text-[11px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md border border-gray-100">
                            +{cab.routes.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {cabs.length === 0 && (
                  <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-500">
                    <Car size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-medium mb-1">No cab plans added yet.</p>
                    <p className="text-sm mb-4">
                      Use &quot;Add New Cab Plan&quot; to create your first cab package (day trips, airport
                      transfers, multi-day tours).
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCab(null);
                        setIsCabModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors text-sm font-medium"
                    >
                      <Plus size={16} /> Add New Cab Plan
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* FAQs View */}
          {activeTab === 'faqs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                 <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Knowledge Base</h3>
                 <p className="text-gray-500 mb-6">Manage the questions and answers for your AI Chatbot here.</p>
                 <button className="bg-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-700 transition-colors">
                    Add First FAQ
                 </button>
              </div>
            </motion.div>
          )}

          {/* FAQs View */}
          {activeTab === 'faqs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Chatbot FAQs</h3>
                <button 
                  onClick={() => {
                    setSelectedFAQ(null);
                    setIsFAQModalOpen(true);
                  }}
                  className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 font-medium"
                >
                  <Plus size={18} /> Add New FAQ
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-left">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Question</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Answer</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {faqs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          <HelpCircle size={48} className="mx-auto mb-3 text-gray-300" />
                          <p>No FAQs found yet.</p>
                        </td>
                      </tr>
                    ) : (
                      faqs
                      .filter(f => f.question.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((faq) => (
                        <tr key={faq.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{faq.question}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate" title={faq.answer}>{faq.answer}</td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg border border-blue-100">
                              {faq.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => {
                                setSelectedFAQ(faq);
                                setIsFAQModalOpen(true);
                              }}
                              className="text-teal-600 hover:text-teal-900 mr-3"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteFAQ(faq.id)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        {/* Users View */}
           {activeTab === 'users' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h3 className="text-lg font-bold text-gray-900 mb-6">Registered Users</h3>
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 <table className="w-full">
                   <thead>
                     <tr className="bg-gray-50 border-b border-gray-100 text-left">
                       <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                       <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                       <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                       <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {users.length === 0 ? (
                       <tr>
                         <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                           <Users size={48} className="mx-auto mb-3 text-gray-300" />
                           <p>No users found.</p>
                         </td>
                       </tr>
                     ) : (
                       users
                       .filter(u => (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
                       .map((user) => (
                         <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                           <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                                 {(user.email || 'U').charAt(0).toUpperCase()}
                               </div>
                               <div className="flex flex-col">
                                 <span className="font-semibold text-gray-900">{user.email || 'No Email'}</span>
                                 <span className="text-xs text-gray-400">ID: {user.id}</span>
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                               user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                             }`}>
                               {user.role || 'user'}
                             </span>
                           </td>
                           <td className="px-6 py-4 text-sm text-gray-500">
                             {new Date(user.created_at).toLocaleDateString()}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                             <button 
                               className="text-gray-400 hover:text-gray-600 transition-colors"
                               title="Details"
                               onClick={() => alert(`User Details:\nID: ${user.id}\nEmail: ${user.email}\nRole: ${user.role}`)}
                             >
                               <Search size={18} />
                             </button>
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
             </motion.div>
           )}

         </div>
       </main>

      {/* Modals */}
      <AdminPackageModal 
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        onSave={() => {
          fetchData();
          setIsPackageModalOpen(false);
        }}
        packageData={selectedPackage}
      />

      <AdminCabModal
        isOpen={isCabModalOpen}
        onClose={() => setIsCabModalOpen(false)}
        onSave={() => {
          fetchData();
          setIsCabModalOpen(false);
        }}
        cabData={selectedCab}
      />

      <AdminPlaceModal
        isOpen={isPlaceModalOpen}
        onClose={() => setIsPlaceModalOpen(false)}
        onSave={() => {
          fetchData();
          setIsPlaceModalOpen(false);
        }}
        placeData={selectedPlace}
      />
      
      <AdminFAQModal
        isOpen={isFAQModalOpen}
        onClose={() => setIsFAQModalOpen(false)}
        onSave={() => {
          fetchData();
          setIsFAQModalOpen(false);
        }}
        faqData={selectedFAQ}
      />

      <AdminInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        inquiry={selectedInquiry}
      />
    </div>
  );
}
