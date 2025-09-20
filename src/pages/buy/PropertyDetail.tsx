import { useParams, useNavigate } from 'react-router-dom';
import { useProperties } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Ruler, Share2, Heart, ArrowLeft, Check, Home, Map, Layers, Calendar, Car } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useCallback, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useEmblaCarousel from 'embla-carousel-react';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: properties } = useProperties();
  const property = properties?.find(p => p.slug === id);
  const [activeImage, setActiveImage] = useState(0);

  // Process property images
  const getImages = useCallback(() => {
    if (!property?.images) return [];
    if (Array.isArray(property.images) && property.images.length > 0) {
      if (typeof property.images[0] === 'string') {
        return (property.images as string[]).map((url, index) => ({
          url,
          alt: `${property.title} - Image ${index + 1}`,
          isPrimary: index === 0
        }));
      } else {
        return property.images as Array<{url: string, alt: string, isPrimary?: boolean}>;
      }
    }
    return [];
  }, [property]);

  const images = getImages();
  const location = typeof property?.location === 'string' 
    ? { address: property.location, city: '', district: '' } 
    : property?.location || { address: '', city: '', district: '' };
    
  // Carousel state
  const [api, setApi] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Handle carousel navigation
  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
    setSelectedIndex(index);
    setActiveImage(index);
  }, [api]);
  
  // Update selected index when carousel changes
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
      setActiveImage(api.selectedScrollSnap());
    };
    
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Properties
        </Button>
      </div>
    );
  }

  const price = typeof property.price === 'number'
    ? { amount: property.price, currency: 'ZMW', isNegotiable: false }
    : property.price;

  // Format price with currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price.amount);

  // Format area with comma separators
  const formattedArea = new Intl.NumberFormat('en-US').format(property.area || 0);

  return (
    <div className="py-6 md:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4 md:mb-6 group" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Properties
      </Button>

      {/* Property Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-primary" />
              <span className="truncate">
                {[location.address, location.city, location.district].filter(Boolean).join(', ')}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl md:text-3xl font-bold text-primary">
              {formattedPrice}
              {price.period && (
                <span className="text-sm font-normal text-muted-foreground">/{price.period}</span>
              )}
            </div>
            {price.isNegotiable && (
              <span className="text-sm text-muted-foreground">Price is negotiable</span>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 mt-6 p-4 bg-muted/30 rounded-lg">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="w-5 h-5 mr-2 text-primary" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="w-5 h-5 mr-2 text-primary" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center">
              <Ruler className="w-5 h-5 mr-2 text-primary" />
              <span>{formattedArea} m²</span>
            </div>
          )}
          <div className="flex items-center">
            <Badge variant={property.status === 'available' ? 'default' : 'outline'} className="capitalize">
              {property.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Enhanced Image Gallery */}
          <div className="rounded-xl overflow-hidden bg-muted/10 border">
            <Carousel 
              className="w-full relative group"
              setApi={setApi}
              opts={{
                startIndex: activeImage,
                loop: true,
              }}
            >
              <CarouselContent>
                {images.length > 0 ? (
                  images.map((img, index) => (
                    <CarouselItem key={index} className="h-[400px] md:h-[500px] lg:h-[550px]">
                      <div className="relative h-full w-full">
                        <img 
                          src={img.url} 
                          alt={img.alt} 
                          className="h-full w-full object-cover transition-opacity duration-300"
                        />
                        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                          {index + 1} / {images.length}
                        </div>
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem className="h-[400px] md:h-[500px] lg:h-[550px]">
                    <div className="flex h-full w-full items-center justify-center bg-muted/20">
                      <div className="text-center p-8">
                        <Home className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                        <p className="text-muted-foreground">No images available for this property</p>
                      </div>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              
              {/* Navigation Arrows with Hover Effect */}
              <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 hover:bg-background" />
              <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 hover:bg-background" />
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent pt-6 pb-2 px-2 z-10">
                <div className="flex justify-center gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollTo(index);
                      }}
                      className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden transition-all duration-200 ${
                        selectedIndex === index 
                          ? 'ring-2 ring-primary ring-offset-2' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img 
                        src={img.url} 
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                  </div>
                </div>
              )}
            </Carousel>
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Property Details Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mb-6 bg-muted/20 p-1 rounded-lg">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md py-2"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="features"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md py-2"
              >
                Features & Amenities
              </TabsTrigger>
              <TabsTrigger 
                value="location"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md py-2"
              >
                Location
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">About This Property</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description || 'No description available for this property.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Key Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Property Details</h3>
                  <div className="space-y-3">
                    {property.bedrooms && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Bedrooms</span>
                        <span className="font-medium">{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Bathrooms</span>
                        <span className="font-medium">{property.bathrooms}</span>
                      </div>
                    )}
                    {property.area && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Area</span>
                        <span className="font-medium">{formattedArea} m²</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Property Type</span>
                      <span className="font-medium capitalize">{property.type}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium capitalize">{property.status}</span>
                    </div>
                    {property.listedAt && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Listed On</span>
                        <span className="font-medium">
                          {new Date(property.listedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Features & Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities && property.amenities.length > 0 ? (
                    property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No amenities listed for this property.</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Additional Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/10 rounded-lg">
                    <h5 className="text-sm font-medium text-muted-foreground mb-1">Year Built</h5>
                    <p>{property.yearBuilt || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-muted/10 rounded-lg">
                    <h5 className="text-sm font-medium text-muted-foreground mb-1">Garage</h5>
                    <p>{property.garage ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Location</h3>
                <div className="aspect-video bg-muted/30 rounded-lg overflow-hidden">
                  {/* Replace with your actual map component */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <Map className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                      <p className="text-muted-foreground">Map view will be displayed here</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {[location.address, location.city, location.district].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <h4 className="font-medium">Nearby Amenities</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { icon: <Home className="w-4 h-4" />, text: 'Schools: 1.2 km' },
                      { icon: <Car className="w-4 h-4" />, text: 'Public Transport: 500 m' },
                      { icon: <MapPin className="w-4 h-4" />, text: 'Shopping: 800 m' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm p-2 bg-muted/10 rounded">
                        <span className="text-primary">{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="overview" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description || 'No description available.'}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <Ruler className="w-6 h-6 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Plot Size</p>
                      <p className="font-medium">{property.area} m²</p>
                    </div>
                  </div>
                  {property.features?.bedrooms && (
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                      <Home className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                        <p className="font-medium">{property.features.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.features?.bathrooms && (
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                      <Bath className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bathrooms</p>
                        <p className="font-medium">{property.features.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.features?.parking && (
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                      <Car className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Parking</p>
                        <p className="font-medium">{property.features.parking} {property.features.parking === 1 ? 'Space' : 'Spaces'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.amenities && property.amenities.length > 0 ? (
                    property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No amenities listed</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location">
              <div className="space-y-4">
                <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <Map className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h4 className="font-medium mb-2">Location Map</h4>
                    <p className="text-sm text-muted-foreground">
                      {location.address} {location.city ? `, ${location.city}` : ''}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Neighborhood</h4>
                  <p className="text-sm text-muted-foreground">
                    {property.title.includes('Chilanga') ? (
                      'Located in the serene area of Chilanga, this property offers a peaceful environment while being just a short drive from essential amenities and major road networks.'
                    ) : property.title.includes('Silverest') ? (
                      'Situated in the rapidly developing Silverest area, this property is just 1.5km from the University of Lusaka (UNILUS) turn-off, making it an excellent location for both residential and investment purposes.'
                    ) : (
                      'This property is located in a prime area with easy access to major amenities and transportation routes.'
                    )}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">Asking Price</p>
                <p className="text-3xl font-bold">
                  {new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: price.currency || 'ZMW',
                    maximumFractionDigits: 0
                  }).format(price.amount)}
                  {price.period && <span className="text-base font-normal text-muted-foreground">/{price.period}</span>}
                </p>
                {price.isNegotiable && (
                  <p className="text-sm text-muted-foreground mt-1">Price is negotiable</p>
                )}
              </div>

              <div className="space-y-4">
                <Button className="w-full" size="lg">
                  Schedule a Viewing
                </Button>
                <div className="pt-4">
                  <h4 className="font-medium mb-3">Property Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property ID</span>
                      <span className="font-medium">{property.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium capitalize">{property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium capitalize">{property.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Area</span>
                      <span className="font-medium">{property.area} m²</span>
                    </div>
                    {property.listedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Listed</span>
                        <span className="font-medium">
                          {new Date(property.listedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Share this property</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-printer">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect width="12" height="8" x="6" y="14" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2">
                    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                    <path d="M9 22v-4h6v4" />
                    <path d="M8 6h.01" />
                    <path d="M16 6h.01" />
                    <path d="M12 6h.01" />
                    <path d="M12 10h.01" />
                    <path d="M12 14h.01" />
                    <path d="M16 10h.01" />
                    <path d="M16 14h.01" />
                    <path d="M8 10h.01" />
                    <path d="M8 14h.01" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Property Agent</h4>
                  <p className="text-sm text-muted-foreground">Plush Real Estate</p>
                  <p className="text-sm mt-2">
                    <a href="tel:+260977777777" className="text-primary hover:underline">+260 97 777 7777</a>
                  </p>
                  <p className="text-sm">
                    <a href="mailto:info@plushestate.com" className="text-primary hover:underline">info@plushestate.com</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar Properties */}
      {properties && properties.length > 1 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties
              .filter(p => p.id !== property.id && p.type === property.type)
              .slice(0, 3)
              .map(property => (
                <div key={property.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] bg-muted/50 overflow-hidden">
                    <img 
                      src={Array.isArray(property.images) && property.images.length > 0 
                        ? typeof property.images[0] === 'string' 
                          ? property.images[0] 
                          : (property.images[0] as any).url
                        : '/placeholder-property.jpg'
                      } 
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{property.title}</h3>
                      <span className="font-medium text-sm">
                        {typeof property.price === 'number' 
                          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ZMW' }).format(property.price)
                          : new Intl.NumberFormat('en-US', { 
                              style: 'currency', 
                              currency: property.price.currency || 'ZMW' 
                            }).format(property.price.amount)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {property.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{property.area} m²</span>
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetail;
