// src/admin/pages/contact/ContactMessages.jsx
import { useState, useCallback, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Mail, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function ContactMessages() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // This key forces DataTable to re-fetch after actions
  const [refreshKey, setRefreshKey] = useState(0);

  const handleView = useCallback(async (message) => {
    setSelectedMessage(message);
    setModalOpen(true);

    if (!message.is_read) {
      await markAsRead(message.id);
      // Update local modal state
      setSelectedMessage(prev => ({ ...prev, is_read: true }));
      // Trigger list refresh
      setRefreshKey(prev => prev + 1);
    }
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setMessageToDelete(id);
    setConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!messageToDelete) return;
    try {
      await adminApi.delete(`/contact/messages/${messageToDelete}/`);
      // Trigger refresh after delete
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete message');
    } finally {
      setConfirmOpen(false);
      setMessageToDelete(null);
    }
  }, [messageToDelete]);

  const markAsRead = useCallback(async (id) => {
    try {
      await adminApi.patch(`/contact/messages/${id}/`, { is_read: true });
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('Mark read failed:', err);
    }
  }, []);

  const markAsReplied = useCallback(async (id) => {
    try {
      await adminApi.patch(`/contact/messages/${id}/`, { replied: true });
      setRefreshKey(prev => prev + 1);
      // Update modal if open
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => ({ ...prev, replied: true }));
      }
    } catch (err) {
      console.error('Mark replied failed:', err);
      alert('Failed to mark as replied');
    }
  }, [selectedMessage]);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    {
      key: 'created_at',
      label: 'Received',
      render: (item) => new Date(item.created_at).toLocaleString(),
    },
    {
      key: 'is_read',
      label: 'Read',
      render: (item) => item.is_read ? (
        <CheckCircle className="text-green-600" size={20} />
      ) : (
        <XCircle className="text-red-600" size={20} />
      ),
    },
    {
      key: 'replied',
      label: 'Replied',
      render: (item) => item.replied ? (
        <CheckCircle className="text-blue-600" size={20} />
      ) : (
        <XCircle className="text-gray-400" size={20} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Mail size={32} className="text-blue-600" />
          Contact Messages
        </h1>
      </div>

      <DataTable
        key={refreshKey}                      // ← this forces re-mount / re-fetch
        endpoint="/contact/messages"
        columns={columns}
        onRowClick={handleView}           // ← new: whole row opens details
        onEdit={handleView}
        onDelete={handleDeleteClick}
      />

      {/* View Message Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Message Details"
        submitText={selectedMessage?.replied ? "Close" : "Mark as Replied"}
        onSubmit={(e) => {
          e.preventDefault();
          if (selectedMessage && !selectedMessage.replied) {
            markAsReplied(selectedMessage.id);
          } else {
            setModalOpen(false);
          }
        }}
      >
        {selectedMessage ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">From</label>
                <p className="mt-1 font-medium text-gray-900">{selectedMessage.name}</p>
                <p className="text-sm text-gray-600 break-all">{selectedMessage.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <p className="mt-1 font-medium text-gray-900">
                  {selectedMessage.subject || '(No subject)'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Received</label>
              <p className="mt-1 text-gray-700">
                {new Date(selectedMessage.created_at).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <div className="mt-2 p-5 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-wrap text-gray-800 max-h-60 overflow-y-auto">
                {selectedMessage.message || '(No message content)'}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Read Status:</span>
                {selectedMessage.is_read ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    <CheckCircle size={16} /> Read
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    <XCircle size={16} /> Unread
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Replied:</span>
                {selectedMessage.replied ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    <CheckCircle size={16} /> Yes
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    <XCircle size={16} /> No
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t">
              {!selectedMessage.is_read && (
                <button
                  onClick={() => markAsRead(selectedMessage.id)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle size={18} />
                  Mark as Read
                </button>
              )}

              {!selectedMessage.replied && (
                <button
                  onClick={() => markAsReplied(selectedMessage.id)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <CheckCircle size={18} />
                  Mark as Replied
                </button>
              )}

              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 py-8 text-center">No message selected</div>
        )}
      </FormModal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Message?"
        message="This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}