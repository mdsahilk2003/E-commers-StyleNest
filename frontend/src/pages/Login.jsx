import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            const user = result.user;
            if (user && user.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        setLoading(true);

        const result = await googleLogin(credentialResponse.credential);

        if (result.success) {
            const user = result.user;
            if (user && user.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleGoogleError = () => {
        setError('Google Sign-In was cancelled or failed. Please try again.');
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-navy-500 mb-2">Welcome Back</h2>
                        <p className="text-gray-600 text-sm">Login to your account to manage your profile</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Official Google OAuth 2.0 Sign-In Button */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-full flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                useOneTap
                                theme="filled_blue"
                                shape="pill"
                                text="continue_with"
                                size="large"
                                width="320"
                            />
                        </div>
                    </div>

                    <div className="relative flex py-2 items-center mb-6">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">OR</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Standard Mobile Number / Email & Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="identifier" className="block text-sm font-semibold text-navy-500 mb-2">
                                Mobile Number or Email
                            </label>
                            <input
                                type="text"
                                id="identifier"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder="10-digit Mobile Number or Email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-navy-500 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3.5 rounded-xl font-bold shadow-gold disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-gold-600 hover:text-gold-700 font-bold">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
