import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Lusaka-specific property data with local pricing in Kwacha
export const properties = [
  {
    id: "1",
    title: "Modern Family House in Kabulonga",
    type: "House",
    price: 8500,
    location: "Kabulonga, Lusaka",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    status: "active" as const,
    slug: "modern-family-house-kabulonga"
  },
  {
    id: "2", 
    title: "Executive Apartment in Roma",
    type: "Apartment",
    price: 4500,
    location: "Roma, Lusaka",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    status: "active" as const,
    slug: "executive-apartment-roma"
  },
  {
    id: "3",
    title: "Prime Shop Space in Cairo Road",
    type: "Shop",
    price: 6800,
    location: "Cairo Road, Lusaka",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    area: 850,
    status: "active" as const,
    slug: "prime-shop-space-cairo-road"
  },
  {
    id: "4",
    title: "Residential Plot in Meanwood",
    type: "Plot",
    price: 280000,
    location: "Meanwood, Lusaka",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    area: 0.5,
    status: "active" as const,
    slug: "residential-plot-meanwood"
  },
  {
    id: "5",
    title: "Luxury Townhouse in Longacres", 
    type: "House",
    price: 12000,
    location: "Longacres, Lusaka",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    status: "active" as const,
    slug: "luxury-townhouse-longacres"
  },
  {
    id: "6",
    title: "Affordable House in Chawama",
    type: "House", 
    price: 3200,
    location: "Chawama, Lusaka",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    bedrooms: 3,
    bathrooms: 2,
    area: 1400,
    status: "active" as const,
    slug: "affordable-house-chawama"
  }
];

const PropertyShowcase = () => {
  return (
    <section id="listings" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Properties in Lusaka
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">
            Discover quality homes, apartments, shops, and plots across Lusaka's prime locations
          </p>
        </motion.div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <PropertyCard 
              id={property.id}
              title={property.title}
              type={property.type}
              price={property.price}
              location={property.location}
              image={property.image}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area}
              status={property.status}
              slug={property.slug}
            />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link to="/listings">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              View All Properties <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertyShowcase;