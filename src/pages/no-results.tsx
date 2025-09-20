import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Search, Home, MapPin, Mail, Phone, MessageSquare, ArrowRight, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

type PropertyType = 'house' | 'apartment' | 'land' | 'commercial' | 'other';

interface FormData {
  name: string;
  email: string;
  phone: string;
  propertyType: PropertyType;
  location: string;
  budget: string;
  bedrooms: string;
  message: string;
}

export default function NoResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    propertyType: 'house',
    location: searchQuery,
    budget: '',
    bedrooms: '',
    message: `I'm interested in properties matching my search criteria.`
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this data to your backend
      console.log('Property request submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyType: 'house',
        location: '',
        budget: '',
        bedrooms: '',
        message: `I'm interested in properties matching my search criteria.`
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>No Properties Found | Plush Properties</title>
        <meta name="description" content="We'll help you find your perfect property. Let us know what you're looking for." />
      </Helmet>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-6">
            <Search className="h-10 w-10 text-blue-600" />
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            No Properties Found
          </h1>
          
          <p className="mt-4 text-xl text-gray-600">
            We couldn't find any properties matching "{searchQuery}"
          </p>
          
          <p className="mt-6 text-lg text-gray-600">
            Don't worry! Our team can help you find exactly what you're looking for.
          </p>
          
          <div className="mt-8">
            <Link 
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Property Request Form */}
        <div className="mt-16 bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Can't find what you're looking for?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Fill out the form below and our team will help you find your perfect property.
              </p>
            </div>
            
            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Received!</h3>
                <p className="text-gray-600 mb-8">We'll contact you as soon as we find properties matching your criteria.</p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Your Information</h3>
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="block w-full pl-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full pl-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="block w-full pl-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="+260 97 123 4567"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Property Requirements */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Property Requirements</h3>
                    
                    <div>
                      <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                        Property Type <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <select
                          id="propertyType"
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleChange}
                          className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="house">House</option>
                          <option value="apartment">Apartment</option>
                          <option value="land">Land/Plot</option>
                          <option value="commercial">Commercial Property</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Preferred Location <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="location"
                          id="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="block w-full pl-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., Lusaka, Woodlands"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                          Budget (ZMW)
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="budget"
                            id="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="500,000"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                          Bedrooms
                        </label>
                        <div className="mt-1">
                          <select
                            id="bedrooms"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleChange}
                            className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5+</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Additional Details
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Tell us more about the property you're looking for..."
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        Submit Request
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-center text-sm text-gray-500">
                    We'll contact you within 24 hours with property matches.
                  </p>
                </div>
              </form>
            )}
          </div>
          
          <div className="bg-gray-50 px-6 py-4 sm:px-10 border-t border-gray-200">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Need immediate assistance? Call us at{' '}
                  <a href="tel:+260977777777" className="font-medium text-blue-600 hover:text-blue-500">
                    +260 97 777 7777
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
