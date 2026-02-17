import { useState, useEffect } from 'react';
import {
  EnvelopeIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftIcon,
  ChatBubbleLeftRightIcon,
  TrashIcon,
  UserIcon,
  CalendarIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function ContactMessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRead, setFilterRead] = useState('all');
  const [filterReplied, setFilterReplied] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact/messages/');
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.results)
          ? res.data.results
          : [];
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.subject && msg.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRead =
      filterRead === 'all' ||
      (filterRead === 'read' && msg.is_read) ||
      (filterRead === 'unread' && !msg.is_read);

    const matchesReplied =
      filterReplied === 'all' ||
      (filterReplied === 'replied' && msg.replied) ||
      (filterReplied === 'not-replied' && !msg.replied);

    return matchesSearch && matchesRead && matchesReplied;
  });

  const markAsRead = async (id, currentRead) => {
    try {
      await api.patch(`/contact/messages/${id}/`, { is_read: !currentRead });
      fetchMessages();
    } catch (err) {
      console.error('Mark read error:', err);
      alert('Failed to update read status.');
    }
  };

  const markAsReplied = async (id, currentReplied) => {
    try {
      await api.patch(`/contact/messages/${id}/`, { replied: !currentReplied });
      fetchMessages();
    } catch (err) {
      console.error('Mark replied error:', err);
      alert('Failed to update replied status.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message permanently?')) {
      try {
        await api.delete(`/contact/messages/${id}/`);
        fetchMessages();
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete message.');
      }
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;
  const repliedCount = messages.filter(m => m.replied).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-emerald-600 text-lg">Loading contact messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <EnvelopeIcon className="w-8 h-8 mr-3 text-emerald-600" />
            Contact Messages
          </h1>
          <p className="text-gray-600 mt-1">Manage and respond to contact form submissions</p>
        </div>
        
        {/* Stats Cards */}
        <div className="flex gap-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md px-4 py-2 border border-emerald-100">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold text-emerald-600">{messages.length}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md px-4 py-2 border border-yellow-100">
            <div className="text-sm text-gray-600">Unread</div>
            <div className="text-2xl font-bold text-yellow-600">{unreadCount}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md px-4 py-2 border border-blue-100">
            <div className="text-sm text-gray-600">Replied</div>
            <div className="text-2xl font-bold text-blue-600">{repliedCount}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 border border-emerald-100/50">
        <div className="flex items-center mb-3 text-sm font-medium text-gray-700">
          <FunnelIcon className="w-4 h-4 mr-2 text-emerald-600" />
          Filter Messages
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, subject, message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow"
            />
          </div>

          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white"
          >
            <option value="all">All Read Status</option>
            <option value="read">Read Only</option>
            <option value="unread">Unread Only</option>
          </select>

          <select
            value={filterReplied}
            onChange={(e) => setFilterReplied(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white"
          >
            <option value="all">All Reply Status</option>
            <option value="replied">Replied Only</option>
            <option value="not-replied">Not Replied Only</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setFilterRead('all');
              setFilterReplied('all');
            }}
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Message</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-emerald-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <EnvelopeIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No messages match your filters</p>
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg, index) => (
                  <tr 
                    key={msg.id} 
                    className="hover:bg-emerald-50/50 transition-colors group"
                    style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s both` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mr-3">
                          <UserIcon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{msg.name}</div>
                          <div className="text-sm text-gray-500">{msg.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {msg.subject || <span className="text-gray-400 italic">No subject</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-gray-600 line-clamp-2 text-sm">{msg.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4 mr-1 text-emerald-500" />
                        {new Date(msg.created_at).toLocaleDateString()}
                        <span className="ml-1 text-xs">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => markAsRead(msg.id, msg.is_read)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            msg.is_read 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                        >
                          {msg.is_read ? (
                            <>
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              Read
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="w-3 h-3 mr-1" />
                              Unread
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => markAsReplied(msg.id, msg.replied)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            msg.replied 
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {msg.replied ? (
                            <>
                              <ChatBubbleLeftRightIcon className="w-3 h-3 mr-1" />
                              Replied
                            </>
                          ) : (
                            <>
                              <ChatBubbleLeftIcon className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="inline-flex items-center text-red-600 hover:text-red-700 font-medium transition-colors group/delete"
                      >
                        <TrashIcon className="w-4 h-4 mr-1 group-hover/delete:scale-110 transition-transform" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}