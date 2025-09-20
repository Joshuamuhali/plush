import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PropertyType = 'house' | 'apartment' | 'land' | 'commercial' | 'office' | 'shop';

const propertyTypes = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'office', label: 'Office' },
  { value: 'shop', label: 'Shop' },
];

export default function ListProperty() {
  const [activeTab, setActiveTab] = useState('details');
  const [propertyType, setPropertyType] = useState<PropertyType>('house');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
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
    console.log('Form submitted:', { ...formData, propertyType });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">List a New Property</h1>
        <p className="text-muted-foreground">Fill in the details below to list your property</p>
      </div>

      <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="media">Photos & Media</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="details">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select 
                    value={propertyType} 
                    onValueChange={(value: PropertyType) => setPropertyType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Beautiful 3 Bedroom House in Kabulonga"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (ZMW)</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 2500000"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Kabulonga, Lusaka"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Area (sq.m)</Label>
                  <Input 
                    id="area" 
                    name="area" 
                    type="number" 
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="e.g., 250"
                    required 
                  />
                </div>

                {!['land'].includes(propertyType) && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input 
                        id="bedrooms" 
                        name="bedrooms" 
                        type="number" 
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        placeholder="e.g., 3"
                        required={!['land'].includes(propertyType)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input 
                        id="bathrooms" 
                        name="bathrooms" 
                        type="number" 
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        placeholder="e.g., 2"
                        required={!['land'].includes(propertyType)}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your property in detail..."
                  rows={5}
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setActiveTab('media')}>
                  Next: Add Photos
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media">
            <div className="space-y-6">
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your images here, or click to browse
                  </p>
                  <Button variant="outline" type="button" className="mt-2">
                    Select Images
                  </Button>
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setActiveTab('details')}
                >
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setActiveTab('contact')}
                >
                  Next: Contact Info
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Your Name</Label>
                  <Input id="contactName" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input id="contactEmail" type="email" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input id="contactPhone" type="tel" placeholder="+260 97 123 4567" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                  <Select defaultValue="phone">
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setActiveTab('media')}
                >
                  Back
                </Button>
                <Button type="submit">Submit Property</Button>
              </div>
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}

// Simple Upload icon component (you can replace with your actual icon component)
function Upload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
