import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  FileText,
  User,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const SupportCenter = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [supportTicket, setSupportTicket] = useState({
    subject: '',
    category: '',
    priority: '',
    description: '',
    attachments: []
  });

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'support',
      message: 'Hello! How can I help you today?',
      timestamp: '10:00 AM'
    }
  ]);

  const faqs = [
    {
      id: 1,
      question: 'How long does it take to process my ID application?',
      answer: 'ID applications are typically processed within 3-5 business days. You will receive email notifications about the status of your application.',
      category: 'Application Process'
    },
    {
      id: 2,
      question: 'What documents do I need to apply for a student ID?',
      answer: 'You need: (1) A passport-size photo with white background, (2) Copy of your national ID, (3) Copy of your admission letter, and (4) Completed application form.',
      category: 'Documentation'
    },
    {
      id: 3,
      question: 'Can I use my digital ID for library access?',
      answer: 'Yes, your digital ID can be used for library access, exam registration, and other university services. Simply show the QR code from your digital ID.',
      category: 'Digital ID Usage'
    },
    {
      id: 4,
      question: 'What should I do if I lose my physical ID card?',
      answer: 'Report the loss immediately through the support system. You can request a replacement card for a fee of KES 500. Your digital ID remains active.',
      category: 'Card Replacement'
    },
    {
      id: 5,
      question: 'How do I update my personal information?',
      answer: 'You can update most personal information through your profile page. Some changes like name corrections require supporting documents and admin approval.',
      category: 'Profile Management'
    },
    {
      id: 6,
      question: 'Why was my document rejected?',
      answer: 'Documents may be rejected for: poor image quality, incorrect format, missing information, or expired documents. Re-upload with clear, high-quality images.',
      category: 'Document Verification'
    },
    {
      id: 7,
      question: 'How can I download my digital ID?',
      answer: 'Go to "My ID" section and click "Download PDF". You can save this to your phone or print it as a backup to your physical card.',
      category: 'Digital ID Usage'
    },
    {
      id: 8,
      question: 'Is the GAU-ID-View system secure?',
      answer: 'Yes, we use bank-level encryption, secure servers, and regular security audits to protect your data. Your information is never shared without permission.',
      category: 'Security'
    }
  ];

  const supportCategories = [
    'Application Issues',
    'Document Problems',
    'Technical Support',
    'Account Access',
    'Payment Issues',
    'General Inquiry'
  ];

  const priorityLevels = [
    'Low - General question',
    'Medium - Need assistance',
    'High - Urgent issue',
    'Critical - System error'
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'user',
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');

      // Simulate support response
      setTimeout(() => {
        const responses = [
          "Thank you for your message. Let me help you with that.",
          "I understand your concern. Let me check that for you.",
          "That's a great question! Here's what I can tell you...",
          "I'll need to look into this further. Can you provide more details?"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const supportResponse = {
          id: chatMessages.length + 2,
          sender: 'support',
          message: randomResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, supportResponse]);
      }, 2000);
    }
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    console.log('Support ticket submitted:', supportTicket);
    alert('Support ticket submitted successfully! You will receive a confirmation email shortly.');
    setSupportTicket({
      subject: '',
      category: '',
      priority: '',
      description: '',
      attachments: []
    });
  };

  const FAQSection = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search frequently asked questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
        />
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-8">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No FAQs found matching your search.</p>
          </div>
        ) : (
          filteredFAQs.map((faq) => (
            <div key={faq.id} className="bg-white border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{faq.question}</h3>
                  <span className="text-sm text-[#00923F] mt-1">{faq.category}</span>
                </div>
                {expandedFAQ === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedFAQ === faq.id && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const ContactSection = () => (
    <div className="space-y-6">
      {/* Quick Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Phone Support</h3>
          <p className="text-gray-600 text-sm mb-4">Mon-Fri, 8AM-5PM</p>
          <p className="font-medium text-[#00923F]">+254 46 2231661</p>
          <button className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Call Now
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
          <p className="text-gray-600 text-sm mb-4">Response within 24hrs</p>
          <p className="font-medium text-[#00923F]">support@gau.ac.ke</p>
          <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Send Email
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Live Chat</h3>
          <p className="text-gray-600 text-sm mb-4">Available now</p>
          <p className="font-medium text-[#00923F]">Instant support</p>
          <button 
            onClick={() => setActiveTab('chat')}
            className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Chat
          </button>
        </div>
      </div>

      {/* Office Hours */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Office Hours & Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Student Services Office</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Monday - Friday: 8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Saturday: 9:00 AM - 1:00 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Sunday: Closed</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Technical Support</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Monday - Friday: 24/7 Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Emergency: +254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>tech-support@gau.ac.ke</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ChatSection = () => (
    <div className="bg-white border border-gray-200 rounded-lg h-96 flex flex-col">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#00923F] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Support Chat</h3>
            <p className="text-sm text-green-600">● Online</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-[#00923F] text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const TicketSection = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Submit Support Ticket</h3>
      
      <form onSubmit={handleTicketSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={supportTicket.subject}
              onChange={(e) => setSupportTicket({...supportTicket, subject: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={supportTicket.category}
              onChange={(e) => setSupportTicket({...supportTicket, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {supportCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              value={supportTicket.priority}
              onChange={(e) => setSupportTicket({...supportTicket, priority: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
              required
            >
              <option value="">Select priority level</option>
              {priorityLevels.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={supportTicket.description}
              onChange={(e) => setSupportTicket({...supportTicket, description: e.target.value})}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
              placeholder="Please provide detailed information about your issue..."
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <label className="cursor-pointer text-[#00923F] hover:text-[#007A33] font-medium">
                Click to attach files
                <input type="file" multiple className="hidden" />
              </label>
              <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB each</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => setSupportTicket({subject: '', category: '', priority: '', description: '', attachments: []})}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] transition-colors"
          >
            Submit Ticket
          </button>
        </div>
      </form>
    </div>
  );

  const tabs = [
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'chat', label: 'Live Chat', icon: MessageSquare },
    { id: 'ticket', label: 'Support Ticket', icon: FileText }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#00923F] rounded-full flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Support Center</h1>
            <p className="text-gray-600">Get help with your GAU-ID-View account and services</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex space-x-0 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#00923F] text-[#00923F]'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'faq' && <FAQSection />}
          {activeTab === 'contact' && <ContactSection />}
          {activeTab === 'chat' && <ChatSection />}
          {activeTab === 'ticket' && <TicketSection />}
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;