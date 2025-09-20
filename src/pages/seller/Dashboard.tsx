import { Button } from "@/components/ui/button";
import { Plus, Home, Check, Shield, TrendingUp, MessageSquare, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function SellerDashboard() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Sell Your Property with Ease</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          List your property on Zambia's fastest growing real estate platform and connect with serious buyers.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8 mb-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Home className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Ready to list your property?</h2>
          <p className="text-muted-foreground mb-8">
            Fill out our simple form to get your property in front of thousands of potential buyers. 
            It only takes a few minutes to get started.
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link to="/sell/list-property">
              <Plus className="h-5 w-5" />
              List Your Property
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="text-center">
          <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Simple Process</h3>
          <p className="text-muted-foreground">
            Our easy-to-use form makes listing your property quick and hassle-free.
          </p>
        </div>
        <div className="text-center">
          <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Maximum Exposure</h3>
          <p className="text-muted-foreground">
            Reach thousands of potential buyers actively searching for properties.
          </p>
        </div>
        <div className="text-center">
          <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No Upfront Costs</h3>
          <p className="text-muted-foreground">
            List your property for free. We only succeed when you do.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <blockquote className="text-xl font-medium text-gray-800 mb-4">
            "Sold my property within a week of listing. The process was so simple and the team was incredibly helpful throughout."
          </blockquote>
          <div className="font-medium">John M.</div>
          <div className="text-sm text-muted-foreground">Property Seller, Lusaka</div>
        </div>
      </div>
    </div>
  );
}
