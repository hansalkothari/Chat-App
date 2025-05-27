'use client';

import { useState } from 'react';
import { GiPeriscope } from "react-icons/gi";
import { supabase } from '../lib/supabase-client';
import { useRouter } from 'next/navigation';
export default function RegisterPage() {

    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            return;
        }

        if (data.user) {
            const user = data.user;
            const { error: profileError } = await supabase.from('Profile').insert([
              {
                id: user.id,          
                email: user.email,
                username: email.split('@')[0], 
                created_at: new Date().toISOString(),
              }
            ]);
        
            if (profileError) {
              setError('Error creating user profile: ' + profileError.message);
              return;
            }

            console.log('Registered user:', data.user);
            router.push('/');
        }
        setError('');
    };

    return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5]">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
            {/* WhatsApp-like logo */}
            <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">
            <GiPeriscope />
            </div>
            <h2 className="text-2xl font-semibold mt-4 text-gray-800">Create an Account</h2>
            <p className="text-sm text-gray-600 text-center">Sign up to stay connected</p>
        </div>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
            <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            />
            <button type="submit" className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition">
            Register
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
        <div className="text-center text-sm text-gray-600 mt-4">
            Already have an account? <a href="/login" className="text-green-500 hover:underline">Login</a>
        </div>
        </div>
    </div>
    );
}
