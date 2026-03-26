import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, Mail, Lock, User, ArrowLeft, Shield, Building, Home, Star, TrendingUp } from 'lucide-react';
import { useSignUp } from '@/hooks/useAuth';
import { useSystemAdmin } from '@/hooks/useSystemAdmin';

export default function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, loading, error } = useSignUp();
  const { createSystemAdmin, loading: adminLoading, error: adminError } = useSystemAdmin();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
    role: searchParams.get('role') || 'buyer',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (formData.role === 'admin') {
        // Create system admin account
        await createSystemAdmin({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          companyName: formData.companyName,
        });
        // Redirect to admin panel after successful admin creation
        navigate('/admin');
      } else {
        // Create regular user account
        await signUp(formData.email, formData.password, formData.fullName, formData.role as 'buyer' | 'seller');
        // Redirect to dashboard after successful signup
        navigate('/dashboard');
      }
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

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -right-20 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -360, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/4 w-36 h-36 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />
      </div>

      {/* Floating Icons */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-32 left-24 text-purple-200 opacity-30"
      >
        <Home className="w-20 h-20" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -15, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-32 right-24 text-blue-200 opacity-30"
      >
        <Building className="w-20 h-20" />
      </motion.div>

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/3 text-pink-200 opacity-30"
      >
        <TrendingUp className="w-16 h-16" />
      </motion.div>

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 right-1/4 text-yellow-200 opacity-30"
      >
        <Star className="w-12 h-12" />
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <img
              src="/logo.svg"
              alt="Plush Properties"
              className="w-24 h-auto mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Plush Properties
            </h1>
            <p className="text-gray-600 mt-2">Join our community of property enthusiasts</p>
          </motion.div>

          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  to="/"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-8"
              >
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Create Account</CardTitle>
                <CardDescription className="text-gray-600">
                  Join Plush and start your property journey
                </CardDescription>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit}
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-12 h-12 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-12 h-12 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-12 h-12 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500 transition-all"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-gray-500 ml-1">Minimum 6 characters</p>
                </motion.div>

                {formData.role === 'admin' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="companyName" className="text-gray-700 font-medium">Company Name (Optional)</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="companyName"
                        name="companyName"
                        type="text"
                        placeholder="Enter company name"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="pl-12 h-12 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500 transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="role" className="text-gray-700 font-medium">I want to</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="h-12 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Buy Properties</SelectItem>
                      <SelectItem value="seller">Sell Properties</SelectItem>
                      <SelectItem value="admin">🛡️ System Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {formData.role === 'admin' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert className="border-purple-200 bg-purple-50">
                      <Shield className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-purple-700">
                        System admin accounts have full control over the entire platform including user management, 
                        property moderation, and system settings. This should only be used by platform administrators.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {(error || adminError) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700">{error || adminError}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={loading || adminLoading}
                  >
                    {(loading || adminLoading) ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center"
                      >
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        {formData.role === 'admin' ? 'Creating Admin Account...' : 'Creating Account...'}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center"
                      >
                        {formData.role === 'admin' ? (
                          <>
                            <Shield className="h-5 w-5 mr-3" />
                            Create System Admin Account
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-5 w-5 mr-3" />
                            Create Account
                          </>
                        )}
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-8 text-center space-y-3"
              >
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
