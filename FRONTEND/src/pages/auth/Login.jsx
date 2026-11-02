import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

function Login() {
const [email, setEmail] = React.useState("");
const [password, setPassword] = React.useState("");
const [error, setError] = React.useState("");
const [isSubmitting, setIsSubmitting] = React.useState(false);
const context = React.useContext(UserContext);
const updateUser = context?.updateUser || (() => {});

const navigate = useNavigate();

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();

        if(!validateEmail(email)){
          setError("Please enter a valid email address.");
          return;
        }

        if(!password){
          setError("Please enter your password.");
          return;
        }
        setError("");
        setIsSubmitting(true);



        //Login API Call
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            });

            const { token, user } = response.data;

            if (token) {
                // Store token in localStorage
                localStorage.setItem('token', token);
                updateUser(user);
                navigate('/home');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }

    // Close handler
    };


    

  return (
    <AuthLayout>
       <div className="flex flex-col justify-center">
       <span className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">Welcome back</span>
       <h3 className="text-3xl font-semibold tracking-tight text-slate-950">Sign in to your account</h3>
       <p className="mt-2 mb-7 text-sm text-slate-500">
        Pick up where you left off with your finances.
       </p>

      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={({target}) => setEmail(target.value)}
          label="Email Address"
          placeholder="john@example.com"
          type="text"
          />

           <Input
          value={password}
          onChange={({target}) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 characters"
          type="password"
          />

          {error && <p role="alert" className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="mt-4 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link className="font-semibold text-violet-700 hover:text-violet-800" to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
       </div>
    </AuthLayout>
  );
}

export default Login;
