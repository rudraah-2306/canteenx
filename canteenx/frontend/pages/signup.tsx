
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import { Mail, Lock, User, Phone, Building2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';


export default function Signup() {
  const router = useRouter();
  const { signUp, loading, error } = useAuthStore();
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
    idCardPhoto: null,
    profilePhoto: null,
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await signUp(formData.email, formData.password, {
      name: formData.name,
      collegeId: formData.collegeId,
      phone: formData.phone,
      department: formData.department,
      position: formData.position,
      role: formData.role as 'student' | 'teacher' | 'canteen_owner',
    });
    // Show success message regardless of immediate authentication
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white dark:bg-gray-950 rounded-3xl shadow-2xl p-10 md:p-14 border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-black gradient-text mb-2 tracking-tight">CanteenX</h1>
            <h2 className="text-2xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-600 dark:text-gray-400">Join the food revolution</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-xl text-base font-semibold text-center">
              Signup successful!<br />
              We have sent you an email for verification.<br />
              You can login once your registration is approved by admin.
            </div>
          )}

          {/* Error Message */}
          {!success && error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Role Selection */}
          {!success && (
            <>
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Sign up as</label>
                <div className="flex gap-4 justify-center">
                  <button
                    type="button"
                    className={`px-6 py-2 rounded-full font-semibold border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 text-sm
                      ${formData.role === 'student' ? 'bg-primary-600 text-white border-primary-600 shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900'}`}
                    onClick={() => setFormData((prev) => ({ ...prev, role: 'student' }))}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`px-6 py-2 rounded-full font-semibold border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 text-sm
                      ${formData.role === 'teacher' ? 'bg-primary-600 text-white border-primary-600 shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900'}`}
                    onClick={() => setFormData((prev) => ({ ...prev, role: 'teacher' }))}
                  >
                    Teacher
                  </button>
                  <button
                    type="button"
                    className={`px-6 py-2 rounded-full font-semibold border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 text-sm
                      ${formData.role === 'canteen_owner' ? 'bg-primary-600 text-white border-primary-600 shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900'}`}
                    onClick={() => setFormData((prev) => ({ ...prev, role: 'canteen_owner' }))}
                  >
                    Operator
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Role-based Fields */}
                {formData.role === 'student' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2">College ID</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="collegeId"
                          value={formData.collegeId}
                          onChange={handleChange}
                          className="input pl-10"
                          placeholder="STU001"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input pl-10"
                          placeholder="9876543210"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Department</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="input"
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="CSE">Computer Science</option>
                        <option value="ECE">Electronics</option>
                        <option value="ME">Mechanical</option>
                        <option value="CE">Civil</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Upload ID Card Photo</label>
                      <input
                        type="file"
                        name="idCardPhoto"
                        accept="image/*"
                        onChange={handleChange}
                        className="input"
                        required
                      />
                    </div>
                  </>
                )}
                {formData.role === 'teacher' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Department</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="input"
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="CSE">Computer Science</option>
                        <option value="ECE">Electronics</option>
                        <option value="ME">Mechanical</option>
                        <option value="CE">Civil</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Position</label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="input"
                        placeholder="Professor, Lecturer, etc."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Upload ID Card Photo</label>
                      <input
                        type="file"
                        name="idCardPhoto"
                        accept="image/*"
                        onChange={handleChange}
                        className="input"
                        required
                      />
                    </div>
                  </>
                )}
                {formData.role === 'canteen_owner' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input pl-10"
                          placeholder="9876543210"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Upload Profile Photo</label>
                      <input
                        type="file"
                        name="profilePhoto"
                        accept="image/*"
                        onChange={handleChange}
                        className="input"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input pl-10 pr-10"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 mt-4 text-lg tracking-wide"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </>
          )}

          {/* Login Link */}
          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
