// src/admin/pages/contact/ContactMessages.jsx
import { useState, useCallback } from 'react';
import adminApi from '../../services/adminApi';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Mail } from 'lucide-react';

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
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setMessageToDelete(id);
    setConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!messageToDelete) return;
    try {
      await adminApi.delete(`/contact/messages/${messageToDelete}/`);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete message');
    } finally {
      setConfirmOpen(false);
      setMessageToDelete(null);
    }
  }, [messageToDelete]);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    {
      key: 'created_at',
      label: 'Received',
      render: (item) => new Date(item.created_at).toLocaleString(),
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
        key={refreshKey}
        endpoint="/contact/messages"
        columns={columns}
        onRowClick={handleView}     // whole row clickable
        onEdit={handleView}
        onDelete={handleDeleteClick}
      />

      {/* View Message Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Message Details"
        submitText="Close"
        onSubmit={(e) => {
          e.preventDefault();
          setModalOpen(false);
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

            <div className="flex pt-4 border-t">
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