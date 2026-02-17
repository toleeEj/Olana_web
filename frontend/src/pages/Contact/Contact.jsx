import { useState } from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  LinkIcon,
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline';
import api from '../../services/api';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/contact/messages/', formData);
      setStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus({
        type: 'error',
        message: 'Sorry, there was an error sending your message. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'olana.wakoya@example.com',
      href: 'mailto:olana.wakoya@example.com',
    },
    {
      icon: PhoneIcon,
      title: 'Phone',
      content: '+251-9XX-XXX-XXXX',
      href: 'tel:+2519XXXXXXXX',
    },
    {
      icon: MapPinIcon,
      title: 'Location',
      content: 'Addis Ababa, Ethiopia / Rwanda',
    },
    {
      icon: LinkIcon,
      title: 'LinkedIn',
      content: 'Connect on LinkedIn',
      href: 'https://www.linkedin.com/in/olana-wakoya-gichile-a02483168',
      external: true,
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question, consultation request, or just want to connect? I'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div 
            className="space-y-6 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-emerald-100/50">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full mr-3"></span>
                Contact Information
              </h2>
              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  const content = (
                    <>
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.external ? '_blank' : undefined}
                            rel={item.external ? 'noopener noreferrer' : undefined}
                            className="text-gray-600 hover:text-emerald-600 transition-colors"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-gray-600">{item.content}</p>
                        )}
                      </div>
                    </>
                  );

                  return item.href ? (
                    <a
                      key={index}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="flex items-start space-x-4 group hover:bg-emerald-50 p-3 rounded-xl transition-all"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={index} className="flex items-start space-x-4 group p-3 rounded-xl">
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decorative card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-2">Office Hours</h3>
              <p className="text-emerald-100 mb-4">Monday – Friday, 9:00 AM – 5:00 PM (EAT)</p>
              <p className="text-emerald-100 text-sm">
                Responses typically within 24–48 hours.
              </p>
            </div>
          </div>

          {/* Form */}
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-emerald-100/50 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full mr-3"></span>
              Send a Message
            </h2>

            {status.message && (
              <div
                className={`p-4 mb-6 rounded-xl ${
                  status.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow bg-white/50"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow bg-white/50"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow bg-white/50"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow bg-white/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 overflow-hidden
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:scale-[1.02] hover:shadow-xl'
                  }`}
              >
                <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative flex items-center justify-center">
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <PaperAirplaneIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Contact;