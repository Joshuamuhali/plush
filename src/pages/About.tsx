import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, Home, Users, Award } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About Plush Properties</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Your trusted partner in finding the perfect property in Zambia. We specialize in connecting people with their dream homes and investment opportunities.
        </p>
      </motion.section>

      {/* Our Story */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-20"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 2023, Plush Properties has quickly become a leading real estate agency in Zambia. 
                What started as a small team with a passion for real estate has grown into a trusted name 
                in property management and sales.
              </p>
              <p>
                Our mission is to make property transactions seamless, transparent, and rewarding for all parties involved. 
                We believe in building lasting relationships with our clients by providing exceptional service and 
                expert advice.
              </p>
              <p>
                Whether you're buying, selling, or renting, our team of experienced professionals is dedicated to 
                helping you achieve your real estate goals.
              </p>
            </div>
          </div>
          <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
            <img 
              src="/public/Silverest 1.5km1.jpeg" 
              alt="Our Office" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.section>

      {/* Our Values */}
      <section className="max-w-7xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Building2 className="w-12 h-12 text-primary mb-4" />,
              title: "Integrity",
              description: "We conduct our business with the highest ethical standards, ensuring transparency and honesty in all our dealings."
            },
            {
              icon: <Home className="w-12 h-12 text-primary mb-4" />,
              title: "Client Focus",
              description: "Your needs are our priority. We listen carefully and work tirelessly to exceed your expectations."
            },
            {
              icon: <Users className="w-12 h-12 text-primary mb-4" />,
              title: "Expertise",
              description: "Our team brings years of experience and deep market knowledge to help you make informed decisions."
            }
          ].map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              {value.icon}
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary/5 rounded-2xl p-8 md:p-12 max-w-7xl mx-auto text-center"
      >
        <Award className="w-12 h-12 text-primary mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Our team of experts is here to help you every step of the way. Get in touch with us today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/listings">View Listings</Link>
          </Button>
        </div>
      </motion.section>

      {/* Team Section - Placeholder for future team members */}
      {/* <section className="max-w-7xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: item * 0.1 }}
              className="text-center"
            >
              <div className="w-48 h-48 rounded-full bg-gray-200 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Team Member {item}</h3>
              <p className="text-muted-foreground">Position</p>
            </motion.div>
          ))}
        </div>
      </section> */}
      </div>
      <Footer />
    </div>
  );
};

export default About;
