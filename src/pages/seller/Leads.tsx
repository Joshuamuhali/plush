import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MessageSquare, Calendar, Search as SearchIcon, Filter, MoreHorizontal } from "lucide-react";

// Mock lead data
const leads = [
  {
    id: 1,
    name: "John Mwale",
    email: "john@example.com",
    phone: "+260 97 123 4567",
    property: "Plot in Lusaka East",
    status: "new",
    lastContact: "2025-09-20",
    source: "Website"
  },
  {
    id: 2,
    name: "Sarah Banda",
    email: "sarah@example.com",
    phone: "+260 96 765 4321",
    property: "3 Bedroom House in Kabulonga",
    status: "contacted",
    lastContact: "2025-09-19",
    source: "Phone"
  },
  {
    id: 3,
    name: "David Phiri",
    email: "david@example.com",
    phone: "+260 95 555 1234",
    property: "Commercial Space in CBD",
    status: "qualified",
    lastContact: "2025-09-18",
    source: "Email"
  },
  {
    id: 4,
    name: "Grace Mwila",
    email: "grace@example.com",
    phone: "+260 97 888 9999",
    property: "Farm Land in Chongwe",
    status: "new",
    lastContact: "2025-09-20",
    source: "Website"
  },
];

export default function Leads() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Contacted</Badge>;
      case 'qualified':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Qualified</Badge>;
      case 'lost':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Lost</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">Manage and follow up with potential clients</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>Add Lead</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>All Leads</CardTitle>
            <div className="relative w-full md:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell className="text-sm">{lead.property}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                        <Mail className="h-4 w-4" />
                      </a>
                      <a href={`tel:${lead.phone}`} className="text-green-600 hover:underline">
                        <Phone className="h-4 w-4" />
                      </a>
                      <button className="text-purple-600 hover:text-purple-800">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(lead.lastContact).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{lead.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Simple Search icon component
function Search(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

// Simple Input component
function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
