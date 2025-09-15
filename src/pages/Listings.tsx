import { useState } from 'react';
import { motion } from 'framer-motion';
import { sampleProperties as properties } from '@/data/properties';
import PropertyCard from '@/components/PropertyCard';
import Navbar from '@/components/Navbar';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Listings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('any');

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = propertyType === 'all' || property.type === propertyType;
    
    // Get the price amount from the price object
    const price = property.price.amount;
    const isZMW = property.price.currency === 'ZMW';
    
    // Convert ZMW to USD for filtering (approximate rate 1 USD = 20 ZMW)
    const priceInUSD = isZMW ? price / 20 : price;
                 
    const matchesPrice = priceRange === 'any' || 
                       (priceRange === 'under-500k' && priceInUSD < 500000) ||
                       (priceRange === '500k-1m' && priceInUSD >= 500000 && priceInUSD <= 1000000) ||
                       (priceRange === 'over-1m' && priceInUSD > 1000000);
    
    return matchesSearch && matchesType && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Dream Property</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Browse through our exclusive collection of properties in prime locations
            </p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by location or property name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="shop">Shop</SelectItem>
                <SelectItem value="office">Office</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Price</SelectItem>
                <SelectItem value="under-500k">Under ZMW 10M</SelectItem>
                <SelectItem value="500k-1m">ZMW 10M - 20M</SelectItem>
                <SelectItem value="over-1m">Over ZMW 20M</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="col-span-1 md:col-span-4">
              <Search className="mr-2 h-4 w-4" /> Search Properties
            </Button>
          </div>
        </div>

        {/* Property Listings */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Available Properties</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Featured" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * (index % 3) }}
                >
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    price={property.price.amount}
                    currency={property.price.currency}
                    location={`${property.location.address}, ${property.location.city}`}
                    image={property.images[0]?.url || '/placeholder.svg'}
                    bedrooms={property.features.bedrooms}
                    bathrooms={property.features.bathrooms}
                    area={property.features.area}
                    status={property.status}
                    type={property.type}
                    slug={property.slug}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">No properties found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search filters</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our team of expert agents can help you find the perfect property that meets all your requirements.
            </p>
            <Button size="lg" variant="default">
              Contact an Agent
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Listings;
