# Admin Authentication Setup Guide

## 🔐 Admin Registration

Your Plush Properties application now includes secure admin authentication!

### **How to Create an Admin Account**

1. **Access Admin Registration**
   - Open your app at http://localhost:3000/
   - Click the mobile menu (hamburger icon)
   - Scroll to the bottom and click "Admin Registration"
   - Or go directly to: http://localhost:3000/admin-signup

2. **Registration Form**
   - Enter your full name
   - Enter company name (optional)
   - Enter email address
   - Create a strong password (minimum 8 characters)
   - Confirm password
   - Enter admin registration key: `admin2024`

3. **After Registration**
   - You'll be redirected to admin login
   - Sign in with your new admin credentials
   - You'll have access to the full admin panel at `/admin`

### **Security Features**

✅ **Registration Key Protection** - Only users with the correct key can register as admin
✅ **Role-Based Access** - Admin routes are protected and require admin role
✅ **Profile Verification** - Admin role is stored in the profiles table
✅ **Secure Routing** - Protected routes check user roles before granting access

### **Admin Features Available**

Once logged in as admin, you can access:

- **📊 Overview Dashboard** - Statistics and metrics
- **🏠 Property Moderation** - Approve/reject property listings
- **👥 CRM Pipeline** - Manage leads and customer relationships
- **📅 Appointment Scheduling** - Manage property viewings
- **💬 Internal Messaging** - Team communication
- **📈 Analytics** - Performance reports and insights

### **Changing the Registration Key**

To change the admin registration key:

1. Open `src/pages/auth/AdminSignup.tsx`
2. Find this line:
   ```typescript
   if (secretKey !== 'admin2024') {
   ```
3. Change `'admin2024'` to your desired key
4. Restart the development server

### **Managing Admin Users**

Admin users are managed through the `profiles` table in Supabase:

- **role**: Set to `'admin'`
- **seller_verification_status**: Can be `'verified'` for trusted admins
- **is_active**: Set to `true` for active admins

### **Protected Routes**

These routes require admin authentication:
- `/admin/*` - Full admin panel
- `/admin-signup` - Admin registration (with key)

### **Next Steps**

1. **Set up Supabase** - If you haven't already, configure your Supabase project
2. **Create Admin Account** - Register your first admin user
3. **Test Features** - Explore all admin panel functionality
4. **Customize** - Adjust the registration key and admin features as needed

### **Troubleshooting**

**Can't access admin panel?**
- Ensure you're logged in with an admin account
- Check that your profile has `role: 'admin'` in Supabase
- Try logging out and back in

**Registration key not working?**
- Double-check the key is exactly `admin2024`
- Ensure no extra spaces or characters
- Check browser console for any errors

**Admin panel showing blank?**
- Verify Supabase connection in `.env.local`
- Check browser console for API errors
- Ensure RLS policies are properly configured

Your admin authentication system is now ready! 🎉
