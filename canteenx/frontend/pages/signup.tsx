import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import { Mail, Lock, User, Phone, Building2, Eye, EyeOff, UtensilsCrossed, GraduationCap, UserCog, ArrowRight, CheckCircle, Upload, Image, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function Signup() {
  const router = useRouter();
  const { signUp, loading, error, user, isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    collegeId: '',
    password: '',
    phone: '',
    department: '',
    position: '',
    role: 'student',
    idCardPhoto: null as File | null,
    profilePhoto: null,
  });
  const [success, setSuccess] = useState(false);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [checkingUnique, setCheckingUnique] = useState(false);

  // Check if email, phone, or college ID already exists
  const checkUniqueFields = async (): Promise<{ isUnique: boolean; message: string | null }> => {
    setCheckingUnique(true);
    setValidationError(null);
    
    try {
      // Check email in profiles table
      const { data: emailExists } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email.toLowerCase().trim())
        .maybeSingle();
      
      if (emailExists) {
        return { isUnique: false, message: 'This email is already registered. Please use a different email or login.' };
      }
      
      // Check phone number
      const { data: phoneExists } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', formData.phone.trim())
        .maybeSingle();
      
      if (phoneExists) {
        return { isUnique: false, message: 'This phone number is already registered with another account.' };
      }
      
      // Check college ID
      const { data: collegeIdExists } = await supabase
        .from('profiles')
        .select('id')
        .eq('college_id', formData.collegeId.trim().toUpperCase())
        .maybeSingle();
      
      if (collegeIdExists) {
        return { isUnique: false, message: 'This College ID is already registered with another account.' };
      }
      
      return { isUnique: true, message: null };
    } catch (error) {
      console.error('Validation error:', error);
      return { isUnique: true, message: null }; // Allow signup if check fails
    } finally {
      setCheckingUnique(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      window.location.href = '/menu';
    }
  }, [isAuthenticated, user]);

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      
      // Create preview for ID card photo
      if (name === 'idCardPhoto') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setIdCardPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeIdCardPhoto = () => {
    setFormData((prev) => ({ ...prev, idCardPhoto: null }));
    setIdCardPreview(null);
  };

  const uploadIdCardPhoto = async (userId: string): Promise<string | null> => {
    if (!formData.idCardPhoto) return null;
    
    try {
      const fileExt = formData.idCardPhoto.name.split('.').pop();
      const fileName = `${userId}/id_card_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('id-cards')
        .upload(fileName, formData.idCardPhoto, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error('Upload error:', error);
        return null;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('id-cards')
        .getPublicUrl(fileName);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setValidationError(null);
    
    // First check if email, phone, and college ID are unique
    const { isUnique, message } = await checkUniqueFields();
    if (!isUnique) {
      setValidationError(message);
      return;
    }
    
    setUploadingPhoto(true);
    
    try {
      // First create the user account
      await signUp(formData.email, formData.password, {
        name: formData.name,
        collegeId: formData.collegeId.trim().toUpperCase(),
        phone: formData.phone.trim(),
        department: formData.department,
        position: formData.position,
        role: formData.role as 'student' | 'teacher' | 'canteen_owner',
      });
      
      // If we have an ID card photo, upload it after signup
      if (formData.idCardPhoto) {
        // Get the newly created user
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (newUser) {
          const photoUrl = await uploadIdCardPhoto(newUser.id);
          if (photoUrl) {
            // Update profile with photo URL
            await supabase.from('profiles').update({
              id_card_photo_url: photoUrl
            }).eq('id', newUser.id);
          }
        }
      }
      
      setSuccess(true);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const roles = [
    { value: 'student', label: 'Student', icon: GraduationCap, emoji: '🎓' },
    { value: 'teacher', label: 'Teacher', icon: User, emoji: '👨‍🏫' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 food-pattern opacity-5"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-food-lettuce/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-food-mustard/20 rounded-full blur-3xl"></div>
      </div>

      {/* Floating food emojis */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-32 right-10 text-5xl opacity-20"
      >🍛</motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [5, -5, 5] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-32 left-10 text-5xl opacity-20"
      >🥗</motion.div>

      <div className="flex items-center justify-center min-h-screen py-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                whileHover={{ rotate: 20, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-food-lettuce to-food-mustard rounded-2xl flex items-center justify-center shadow-glow"
              >
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-heading font-black gradient-text mb-2">Join DGI Eats</h1>
              <p className="text-gray-500 dark:text-gray-400">Create your account to start ordering</p>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-6 bg-food-lettuce/10 border border-food-lettuce/20 rounded-2xl text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-16 h-16 mx-auto mb-4 bg-food-lettuce/20 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-8 h-8 text-food-lettuce" />
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold text-food-lettuce mb-2">Registration Successful! 🎉</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    We've sent you a verification email. You can login once your registration is approved by admin.
                  </p>
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 px-6 py-2 rounded-xl font-heading font-semibold bg-food-lettuce text-white"
                    >
                      Go to Login
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {!success && (error || validationError) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-food-tomato/10 border border-food-tomato/20 text-food-tomato rounded-xl text-sm flex items-center gap-2"
              >
                <span>⚠️</span> {validationError || error}
              </motion.div>
            )}

            {/* Form */}
            {!success && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-heading font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    I am a...
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {roles.map((role) => (
                      <motion.button
                        key={role.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData((prev) => ({ ...prev, role: role.value }))}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          formData.role === role.value
                            ? 'border-food-mustard bg-food-mustard/5 text-food-mustard'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{role.emoji}</span>
                        <span className="text-xs font-heading font-medium">{role.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-food-mustard transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-food-mustard transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                {/* College ID & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      College ID
                    </label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-food-mustard transition-colors" />
                      <input
                        type="text"
                        name="collegeId"
                        value={formData.collegeId}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                        placeholder="STU001"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Phone
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-food-mustard transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                        placeholder="+91 98765..."
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="computer_science">Computer Science</option>
                    <option value="electronics">Electronics</option>
                    <option value="mechanical">Mechanical</option>
                    <option value="civil">Civil</option>
                    <option value="electrical">Electrical</option>
                    <option value="business">Business Administration</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Position (for teachers) */}
                {formData.role === 'teacher' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                      placeholder="e.g., Professor, Assistant Professor"
                    />
                  </motion.div>
                )}

                {/* College ID Card Photo Upload */}
                <div>
                  <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Upload College ID Card Photo <span className="text-food-tomato">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">Upload a clear photo of your college ID card for verification</p>
                  
                  {idCardPreview ? (
                    <div className="relative">
                      <div className="relative rounded-xl overflow-hidden border-2 border-food-mustard bg-gray-50 dark:bg-gray-800">
                        <img 
                          src={idCardPreview} 
                          alt="ID Card Preview" 
                          className="w-full h-48 object-contain"
                        />
                        <button
                          type="button"
                          onClick={removeIdCardPhoto}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-food-lettuce mt-2 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Photo uploaded successfully
                      </p>
                    </div>
                  ) : (
                    <label className="relative cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-food-mustard transition-colors group">
                        <div className="w-16 h-16 mx-auto mb-4 bg-food-mustard/10 rounded-full flex items-center justify-center group-hover:bg-food-mustard/20 transition-colors">
                          <Upload className="w-8 h-8 text-food-mustard" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Click to upload ID card photo</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        name="idCardPhoto"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                        required
                      />
                    </label>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-food-mustard transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 mt-1 rounded border-gray-300 text-food-mustard focus:ring-food-mustard/20"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the <a href="#" className="text-food-mustard hover:underline">Terms of Service</a> and <a href="#" className="text-food-mustard hover:underline">Privacy Policy</a>
                  </span>
                </label>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || uploadingPhoto || checkingUnique}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(243, 156, 18, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl font-heading font-bold text-lg bg-gradient-to-r from-food-mustard to-food-tomato text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading || uploadingPhoto || checkingUnique ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      ></motion.div>
                      {checkingUnique ? 'Checking details...' : uploadingPhoto ? 'Uploading ID Card...' : 'Creating Account...'}
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>
            )}

            {/* Login Link */}
            {!success && (
              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link href="/login" className="text-food-mustard hover:text-food-tomato font-heading font-semibold transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
