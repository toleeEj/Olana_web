// src/components/FormModal.jsx
import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

export default function FormModal({
  isOpen,
  onClose,
  title,
  children,               // ← form fields passed from parent
  onSubmit,               // ← function that expects the submit event
  isSubmitting = false,
  submitText = "Save",
  initialData = {},
}) {
  const [formData, setFormData] = useState(initialData);

  // Reset form only when modal opens (prevents infinite loop)
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [isOpen]);           // ← important: only depend on isOpen

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();   // ← this is safe because React passes real event
    onSubmit(e);          // ← forward the real event to parent handler
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop with gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#1B4D3E]/80 to-[#2E6B52]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container with Animation */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
        
        {/* Decorative Header Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1B4D3E] via-[#7ABF8E] to-[#1B4D3E]" />
        
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-[#1B4D3E]/10 bg-gradient-to-r from-[#F8FAF5] to-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1B4D3E] to-[#2E6B52] bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="text-sm text-[#5B6E6B] mt-1">
                Fill in the information below
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F0F4F3] rounded-lg transition-all group"
              disabled={isSubmitting}
            >
              <X size={20} className="text-[#5B6E6B] group-hover:text-[#1B4D3E] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Form Fields Container */}
            <div className="space-y-6">
              {children}
            </div>

            {/* Validation Hint (Optional - can be removed if not needed) */}
            <div className="flex items-start gap-2 p-4 bg-[#F8FAF5] rounded-xl border border-[#7ABF8E]/20">
              <AlertCircle size={18} className="text-[#7ABF8E] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#5B6E6B]">
                All fields marked with <span className="text-[#E8A87A]">*</span> are required
              </p>
            </div>
          </div>

          {/* Footer with buttons */}
          <div className="px-8 py-6 border-t border-[#1B4D3E]/10 bg-[#F8FAF5] flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 border-2 border-[#1B4D3E]/20 rounded-xl text-[#5B6E6B] hover:bg-white hover:border-[#1B4D3E] hover:text-[#1B4D3E] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="relative px-8 py-2.5 bg-gradient-to-r from-[#1B4D3E] to-[#2E6B52] text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              
              <div className="relative flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} className="group-hover:scale-110 transition-transform" />
                    {submitText}
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F0F4F3;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #7ABF8E;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1B4D3E;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

// Optional: Pre-styled form field components for consistent theming
export const FormInput = ({ label, name, type = "text", required = false, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-[#1B4D3E]">
      {label} {required && <span className="text-[#E8A87A]">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      className="w-full px-4 py-3 border-2 border-[#1B4D3E]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ABF8E] focus:border-transparent transition-all text-[#1B4D3E] placeholder-[#5B6E6B]/50"
      {...props}
    />
  </div>
);

export const FormTextarea = ({ label, name, required = false, rows = 4, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-[#1B4D3E]">
      {label} {required && <span className="text-[#E8A87A]">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      rows={rows}
      className="w-full px-4 py-3 border-2 border-[#1B4D3E]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ABF8E] focus:border-transparent transition-all text-[#1B4D3E] placeholder-[#5B6E6B]/50 resize-none"
      {...props}
    />
  </div>
);

export const FormSelect = ({ label, name, options = [], required = false, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-[#1B4D3E]">
      {label} {required && <span className="text-[#E8A87A]">*</span>}
    </label>
    <select
      id={name}
      name={name}
      className="w-full px-4 py-3 border-2 border-[#1B4D3E]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ABF8E] focus:border-transparent transition-all text-[#1B4D3E] bg-white"
      {...props}
    >
      <option value="">Select {label}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export const FormCheckbox = ({ label, name, ...props }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <input
      type="checkbox"
      id={name}
      name={name}
      className="w-5 h-5 rounded border-2 border-[#1B4D3E]/20 text-[#1B4D3E] focus:ring-[#7ABF8E] focus:ring-offset-2 transition-all cursor-pointer"
      {...props}
    />
    <span className="text-sm text-[#1B4D3E] group-hover:text-[#2E6B52] transition-colors">
      {label}
    </span>
  </label>
);

export const FormSwitch = ({ label, name, checked, onChange, ...props }) => (
  <label className="flex items-center justify-between cursor-pointer group">
    <span className="text-sm font-medium text-[#1B4D3E] group-hover:text-[#2E6B52] transition-colors">
      {label}
    </span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange({ target: { name, value: !checked } })}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#7ABF8E] focus:ring-offset-2 ${
        checked ? 'bg-[#1B4D3E]' : 'bg-[#1B4D3E]/30'
      }`}
      {...props}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </label>
);