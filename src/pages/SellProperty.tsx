import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PropertyType = 'residential' | 'commercial' | 'land' | 'industrial';

const propertyTypes = [
  {
    id: 'residential',
    title: 'Residential',
    description: 'Sell houses, apartments, or other living spaces',
    icon: '🏠'
  },
  {
    id: 'commercial',
    title: 'Commercial',
    description: 'Sell office spaces, retail stores, or business properties',
    icon: '🏢'
  },
  {
    id: 'land',
    title: 'Land',
    description: 'Sell vacant land or plots for development',
    icon: '🌄'
  },
  {
    id: 'industrial',
    title: 'Industrial',
    description: 'Sell warehouses, factories, or manufacturing spaces',
    icon: '🏭'
  }
];

export const SellProperty = () => {
  const [activeTab, setActiveTab] = useState<PropertyType>('residential');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: 'residential',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Sell Your Property</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          List your property with us and connect with potential buyers. Fill out the form below to get started.
        </p>
      </div>

      <Tabs 
        defaultValue="residential" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value as PropertyType)}
      >
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-4xl grid-cols-4">
            {propertyTypes.map((type) => (
              <TabsTrigger key={type.id} value={type.id}>
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">{type.icon}</span>
                  <span>{type.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {propertyTypes.find(t => t.id === activeTab)?.title} Property Details
              </CardTitle>
              <CardDescription>
                {propertyTypes.find(t => t.id === activeTab)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      placeholder="E.g., Beautiful 3-Bedroom House in Lusaka"
                      value={formData.title}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      placeholder="E.g., Kabulonga, Lusaka"
                      value={formData.location}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (ZMW) *</Label>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Area (sq.m) *</Label>
                    <Input 
                      id="area" 
                      name="area" 
                      type="number" 
                      placeholder="Area in square meters"
                      value={formData.area}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  {activeTab === 'residential' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input 
                          id="bedrooms" 
                          name="bedrooms" 
                          type="number" 
                          placeholder="Number of bedrooms"
                          value={formData.bedrooms}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input 
                          id="bathrooms" 
                          name="bathrooms" 
                          type="number" 
                          placeholder="Number of bathrooms"
                          value={formData.bathrooms}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Property Description *</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Describe your property in detail..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    required 
                  />
                  <p className="text-sm text-muted-foreground">
                    Include details about the property's features, amenities, and any other relevant information.
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Your Name *</Label>
                      <Input 
                        id="contactName" 
                        name="contactName" 
                        placeholder="John Doe"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email *</Label>
                      <Input 
                        id="contactEmail" 
                        name="contactEmail" 
                        type="email" 
                        placeholder="your@email.com"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone Number *</Label>
                      <Input 
                        id="contactPhone" 
                        name="contactPhone" 
                        type="tel" 
                        placeholder="+260 97 123 4567"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" size="lg">
                    List My Property
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
};

export default SellProperty;
