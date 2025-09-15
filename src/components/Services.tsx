import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building, MapPin, MessageCircle, Shield, Clock } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Home className="w-8 h-8" />,
      title: "Property Listing",
      description: "Professional property listing services with high-quality photography and detailed descriptions to attract the right buyers or tenants."
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "Commercial Real Estate",
      description: "Specialized services for office spaces, retail shops, and commercial properties with expert market analysis and valuation."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location Advisory",
      description: "Expert guidance on prime locations for investment, considering accessibility, market potential, and future development plans."
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "WhatsApp Integration",
      description: "Seamless communication through integrated WhatsApp messaging for instant inquiries and real-time property updates."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Transactions",
      description: "Verified property documentation and secure transaction processes ensuring peace of mind for all parties involved."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support and property management services for landlords and tenants alike."
    }
  ];

  return (
    <section id="services" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Our Services
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-body">
            Comprehensive real estate solutions tailored to your needs. From property listing to transaction completion, we've got you covered.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-card transition-smooth border-border/50 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-secondary text-secondary-foreground mb-6 group-hover:shadow-glow transition-smooth">
                  {service.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Button variant="cta" size="lg">
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;