
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
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PACKAGES } from '@/data/packages';
import AdminPackageModal from '@/components/admin/AdminPackageModal';
import AdminFAQModal from '@/components/admin/AdminFAQModal';
import AdminInquiryModal from '@/components/admin/AdminInquiryModal';

export default function AdminPanel() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
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
    
    // Try Supabase
    const { data: inqData, error: inqError } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (inqData) allInquiries = [...inqData];
    
    // Try LocalStorage (Fallback)
    if (typeof window !== 'undefined') {
      const localInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
      // Merge unique inquiries
      const existingIds = new Set(allInquiries.map(i => i.id));
      const newLocal = localInquiries.filter((i: any) => !existingIds.has(i.id));
      allInquiries = [...allInquiries, ...newLocal];
    }
    
    // Sort by date desc
    allInquiries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setInquiries(allInquiries);

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

    // 4. Fetch Users
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

    // Try deleting from Supabase
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    
    // Also delete from LocalStorage if present
    const localInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    const updatedLocal = localInquiries.filter((i: any) => i.id !== id);
    localStorage.setItem('inquiries', JSON.stringify(updatedLocal));

    // Update State
    setInquiries(prev => prev.filter(i => i.id !== id));
  };

  const toggleInquiryStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'read' : 'pending';
    
    // Update Supabase
    await supabase.from('inquiries').update({ status: newStatus }).eq('id', id);

    // Update LocalStorage
    const localInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    const updatedLocal = localInquiries.map((i: any) => i.id === id ? { ...i, status: newStatus } : i);
    localStorage.setItem('inquiries', JSON.stringify(updatedLocal));

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

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    const { error } = await supabase.from('chatbot_faqs').delete().eq('id', id);
    if (error) {
      alert('Error deleting FAQ: ' + error.message);
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
      {/* Sidebar */}
      <aside className="w-72 bg-teal-900 text-white flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tight">Mir Baba Admin</h1>
          <p className="text-teal-400 text-sm mt-1">Management Console</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
            { id: 'packages', label: 'Tour Packages', icon: Package },
            { id: 'faqs', label: 'Chatbot FAQs', icon: HelpCircle },
            { id: 'users', label: 'Users', icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          
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
