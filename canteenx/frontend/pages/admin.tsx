import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CheckCircle, XCircle, Clock, UserCheck, MessageSquare, Mail, Trash2, Phone, Building2, GraduationCap, Eye, X, Image } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
  college_id?: string;
  phone?: string;
  department?: string;
  position?: string;
  id_card_photo_url?: string;
  is_approved: boolean;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  college_name?: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

// Admin Dashboard - Only for user approval/rejection
export default function Admin() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    approvedUsers: 0,
    students: 0,
    teachers: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      window.location.href = '/';
      return;
    }
    fetchUsers();
    fetchContactMessages();
  }, [user]);

  const fetchContactMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setContactMessages(data);
        setStats(prev => ({
          ...prev,
          unreadMessages: data.filter((m: ContactMessage) => m.status === 'unread').length,
        }));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessageAsRead = async (id: string) => {
    await supabase.from('contact_messages').update({ status: 'read' }).eq('id', id);
    fetchContactMessages();
  };

  const deleteMessage = async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id);
    fetchContactMessages();
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch from profiles table instead of admin API
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['student', 'teacher'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
        return;
      }

      const users = data || [];
      const pending = users.filter((u) => !u.is_approved);
      const approved = users.filter((u) => u.is_approved);

      setPendingUsers(pending);
      setAllUsers(users);

      setStats(prev => ({
        ...prev,
        totalUsers: users.length,
        pendingApprovals: pending.length,
        approvedUsers: approved.length,
        students: users.filter((u) => u.role === 'student').length,
        teachers: users.filter((u) => u.role === 'teacher').length,
      }));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: true })
        .eq('id', userId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      const event = new CustomEvent('toast', {
        detail: { message: 'User approved successfully!', type: 'success' },
      });
      window.dispatchEvent(event);
      
      fetchUsers();
    } catch (error: any) {
      console.error('Error approving user:', error);
      alert('Error approving user: ' + (error?.message || 'RLS policy may be blocking. Check Supabase policies.'));
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm('Are you sure you want to reject this user? This will remove their approval.')) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: false })
        .eq('id', userId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      const event = new CustomEvent('toast', {
        detail: { message: 'User rejected.', type: 'success' },
      });
      window.dispatchEvent(event);
      
      fetchUsers();
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      alert('Error rejecting user: ' + (error?.message || 'RLS policy may be blocking. Check Supabase policies.'));
    }
  };

  const handleRevokeApproval = async (userId: string) => {
    if (!confirm('Are you sure you want to revoke approval for this user?')) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: false })
        .eq('id', userId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      const event = new CustomEvent('toast', {
        detail: { message: 'Approval revoked successfully!', type: 'success' },
      });
      window.dispatchEvent(event);
      
      fetchUsers();
    } catch (error: any) {
      console.error('Error revoking approval:', error);
      alert('Error revoking approval: ' + (error?.message || 'RLS policy may be blocking. Check Supabase policies.'));
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage user registrations and approvals</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
            { label: 'Pending', value: stats.pendingApprovals, icon: Clock, color: 'text-yellow-500' },
            { label: 'Approved', value: stats.approvedUsers, icon: CheckCircle, color: 'text-green-500' },
            { label: 'Students', value: stats.students, icon: UserCheck, color: 'text-purple-500' },
            { label: 'Teachers', value: stats.teachers, icon: UserCheck, color: 'text-indigo-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending ({stats.pendingApprovals})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Users className="w-4 h-4" />
            All Users ({stats.totalUsers})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-food-tomato text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Messages ({contactMessages.length})
            {stats.unreadMessages > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {stats.unreadMessages}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            {/* Pending Users Tab */}
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingUsers.length === 0 ? (
                  <div className="card p-12 text-center">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">All caught up!</h3>
                    <p className="text-gray-600 dark:text-gray-400">No pending approvals at the moment.</p>
                  </div>
                ) : (
                  pendingUsers.map((u, i) => (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="card p-6"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* User Photo & Basic Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-16 h-16 bg-gradient-to-br from-food-mustard to-food-tomato rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {(u.name || u.email)?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl mb-1">{u.name || 'No Name'}</h3>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4" /> {u.email}
                              </p>
                              {u.phone && (
                                <p className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" /> {u.phone}
                                </p>
                              )}
                              {u.college_id && (
                                <p className="flex items-center gap-2">
                                  <Building2 className="w-4 h-4" /> College ID: {u.college_id}
                                </p>
                              )}
                              {u.department && (
                                <p className="flex items-center gap-2">
                                  <GraduationCap className="w-4 h-4" /> {u.department} {u.position && `• ${u.position}`}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                u.role === 'student' 
                                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                              }`}>
                                {u.role?.toUpperCase()}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                                Applied: {new Date(u.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* ID Card Photo Preview */}
                        <div className="lg:w-64">
                          {u.id_card_photo_url ? (
                            <div 
                              className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 cursor-pointer group"
                              onClick={() => { setSelectedUser(u); setShowUserModal(true); }}
                            >
                              <img 
                                src={u.id_card_photo_url} 
                                alt="College ID" 
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="w-6 h-6 text-white" />
                              </div>
                              <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded-lg flex items-center gap-1">
                                <Image className="w-3 h-3" /> View ID Card
                              </span>
                            </div>
                          ) : (
                            <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 h-32 flex items-center justify-center text-gray-400">
                              <div className="text-center">
                                <Image className="w-8 h-8 mx-auto mb-1 opacity-50" />
                                <p className="text-xs">No ID Card Photo</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex lg:flex-col gap-2 lg:justify-center">
                          <button
                            onClick={() => { setSelectedUser(u); setShowUserModal(true); }}
                            className="btn bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => handleApprove(u.id)}
                            className="btn bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(u.id)}
                            className="btn bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* All Users Tab */}
            {activeTab === 'all' && (
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">ID Card</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {allUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                              <span className="font-bold text-primary-600 dark:text-primary-400">
                                {(u.name || u.email)?.[0]?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold">{u.name || 'No Name'}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            u.role === 'student'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {u.department || '-'}
                        </td>
                        <td className="px-6 py-4">
                          {u.id_card_photo_url ? (
                            <button
                              onClick={() => { setSelectedUser(u); setShowUserModal(true); }}
                              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-semibold"
                            >
                              <Eye className="w-4 h-4" /> View
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">No photo</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {u.is_approved ? (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              Approved
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setSelectedUser(u); setShowUserModal(true); }}
                              className="text-blue-500 hover:text-blue-600 text-sm font-semibold"
                            >
                              Details
                            </button>
                            {u.is_approved ? (
                              <button
                                onClick={() => handleRevokeApproval(u.id)}
                                className="text-red-500 hover:text-red-600 text-sm font-semibold"
                              >
                                Revoke
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleApprove(u.id)}
                                  className="text-green-500 hover:text-green-600 text-sm font-semibold"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(u.id)}
                                  className="text-red-500 hover:text-red-600 text-sm font-semibold"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {allUsers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No users found</p>
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                {contactMessages.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm">
                    <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No contact messages yet.</p>
                  </div>
                ) : (
                  contactMessages.map((msg, i) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 ${
                        msg.status === 'unread' ? 'border-food-tomato' : 'border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{msg.name}</h3>
                            {msg.status === 'unread' && (
                              <span className="bg-food-tomato text-white text-xs px-2 py-0.5 rounded-full">New</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> {msg.email}
                          </p>
                          {msg.phone && (
                            <p className="text-sm text-gray-500">📱 {msg.phone}</p>
                          )}
                          {msg.college_name && (
                            <p className="text-sm text-gray-500">🏫 {msg.college_name}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(msg.created_at).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${
                            msg.subject === 'support' ? 'bg-blue-100 text-blue-700' :
                            msg.subject === 'partnership' ? 'bg-green-100 text-green-700' :
                            msg.subject === 'feedback' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {msg.subject}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        {msg.status === 'unread' && (
                          <button
                            onClick={() => markMessageAsRead(msg.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" /> Mark as Read
                          </button>
                        )}
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                          className="px-4 py-2 bg-food-mustard text-white rounded-lg text-sm font-semibold hover:bg-food-mustard/90 transition-colors flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" /> Reply
                        </a>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-food-mustard to-food-tomato p-6 rounded-t-3xl">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                      {(selectedUser.name || selectedUser.email)?.[0]?.toUpperCase()}
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold">{selectedUser.name || 'No Name'}</h2>
                      <p className="opacity-80">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* User Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Role</p>
                    <p className="font-bold text-lg flex items-center gap-2">
                      {selectedUser.role === 'student' ? '🎓' : '👨‍🏫'} {selectedUser.role?.toUpperCase()}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
                    <p className={`font-bold text-lg ${selectedUser.is_approved ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedUser.is_approved ? '✅ Approved' : '⏳ Pending'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">College ID</p>
                    <p className="font-bold text-lg">{selectedUser.college_id || 'Not provided'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Phone</p>
                    <p className="font-bold text-lg">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Department</p>
                    <p className="font-bold text-lg">{selectedUser.department || 'Not provided'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Applied On</p>
                    <p className="font-bold text-lg">
                      {new Date(selectedUser.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {selectedUser.position && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 col-span-2">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Position</p>
                      <p className="font-bold text-lg">{selectedUser.position}</p>
                    </div>
                  )}
                </div>

                {/* College ID Card Photo */}
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Image className="w-5 h-5" /> College ID Card Photo
                  </h3>
                  {selectedUser.id_card_photo_url ? (
                    <div className="rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                      <img 
                        src={selectedUser.id_card_photo_url} 
                        alt="College ID Card" 
                        className="w-full max-h-96 object-contain bg-gray-100 dark:bg-gray-800"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
                      <Image className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">No ID card photo uploaded</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {!selectedUser.is_approved ? (
                    <>
                      <button
                        onClick={() => { handleApprove(selectedUser.id); setShowUserModal(false); }}
                        className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" /> Approve User
                      </button>
                      <button
                        onClick={() => { handleReject(selectedUser.id); setShowUserModal(false); }}
                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <XCircle className="w-5 h-5" /> Reject User
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { handleRevokeApproval(selectedUser.id); setShowUserModal(false); }}
                      className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <XCircle className="w-5 h-5" /> Revoke Approval
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
