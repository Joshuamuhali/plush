import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Mail, Lock, User, ArrowLeft, Building } from 'lucide-react';
import { useSignUp } from '@/hooks/useAuth';

export default function AdminSignup() {
  const navigate = useNavigate();
  const { signUp, loading, error } = useSignUp();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
    confirmPassword: '',
  });

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [secretKey, setSecretKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    // Simple admin registration key (in production, use a more secure method)
    if (secretKey !== 'admin2024') {
      alert('Invalid admin registration key');
      return;
    }

    try {
      await signUp(formData.email, formData.password, formData.fullName, 'admin');
      // Redirect to login after successful registration
      navigate('/login?role=admin');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-gray-700 bg-gray-800 text-white">
            <CardHeader className="text-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Admin Registration</CardTitle>
              <CardDescription className="text-gray-400">
                Create an administrator account for Plush Properties
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-300">Company Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder="Enter company name"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secretKey" className="text-gray-300">Admin Registration Key</Label>
                  <Input
                    id="secretKey"
                    type={showSecretKey ? "text" : "password"}
                    placeholder="Enter admin registration key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    {showSecretKey ? 'Hide' : 'Show'} key
                  </button>
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-900 border-red-700">
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Create Admin Account
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-gray-400">
                  Already have an admin account?{' '}
                  <Link
                    to="/login?role=admin"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
                <p className="text-xs text-gray-500">
                  Need the registration key? Contact your system administrator.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
    </div>
  );
}
