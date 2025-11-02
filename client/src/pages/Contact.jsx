import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about GAU-ID-View? We're here to help. Reach out to us 
            and we'll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#00923F] text-white rounded-full flex items-center justify-center mr-4">
                  📧
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">support@gau.ac.ke</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#00923F] text-white rounded-full flex items-center justify-center mr-4">
                  📞
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">+254 (0) 46 443 3251</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#00923F] text-white rounded-full flex items-center justify-center mr-4">
                  📍
                </div>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">Garissa University<br />P.O. Box 1801-70100<br />Garissa, Kenya</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F]"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F]"
                  required
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F]"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F]"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#00923F] text-white rounded-lg font-semibold hover:bg-[#007A33] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;