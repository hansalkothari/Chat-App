'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase-client';
import { GiPeriscope } from "react-icons/gi";
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
    
        if (error) {
          setError(error.message);
        } else {
          console.log('Logged in:', data);
    
          // Optional: Save user data to localStorage
          if (data.session) {
            localStorage.setItem('user', JSON.stringify(data.session.user));
          }
    
          // 🚀 Redirect to dashboard (or any other protected route)
          router.push('/');
        }
    };

    return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5]">
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
        {/* WhatsApp-like logo */}
        <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">
            <GiPeriscope />
        </div>
        <h2 className="text-2xl font-semibold mt-4 text-gray-800">Login to Periskope</h2>
        <p className="text-sm text-gray-600 text-center">Stay connected with your friends</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition">
            Login
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
        <div className="text-center text-sm text-gray-600 mt-4">
        Don't have an account? <a href="/register" className="text-green-500 hover:underline">Sign up</a>
        </div>
    </div>
    </div>

    );
}
