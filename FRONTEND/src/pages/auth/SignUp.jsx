import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';


const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const context = useContext(UserContext);
  const updateUser = context?.updateUser || (() => {});
  const navigate = useNavigate();


  // Handle sign-up form submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      let profileImageUrl = "";
      
      // Upload profile image if selected
      if (profilePic) {
        const formData = new FormData();
        formData.append('image', profilePic);
        const imageResponse = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        profileImageUrl = imageResponse.data.imageUrl;
      }

      // Register user
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl: profileImageUrl,
      });

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/home');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full md:mt-0 flex flex-col justify-center">
        <span className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">Get started</span>
        <h3 className="text-3xl font-semibold tracking-tight text-slate-950">Create your account</h3>
        <p className="mt-2 mb-6 text-sm text-slate-500">
          A better view of your finances starts here.
        </p>

        <form onSubmit={handleSignUp}>

         <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
         


          <div className="mb-1 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
            />

            <Input
              value={email}
              onChange={({target}) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="email"
            />
          </div>

          <Input
            value={password}
            onChange={({target}) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
          />

          {error && <p role="alert" className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>

          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-semibold text-violet-700 hover:text-violet-800" to="/login">
              Login
            </Link>
          </p>
        </form>















      </div>
      </AuthLayout>
  );
};

export default SignUp;
