import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { resetPassword } from '../lib/authService';

export default function ResetPassword() {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const { id: token } = useParams(); // Get token from URL params

  useEffect(() => {
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError("Invalid reset link");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess('');
      return;
    }
    setError('');

    try {
      const data = await resetPassword(token, password);
      setSuccess(data.message || "Password reset successful!");
      setError('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
      setSuccess('');
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center bg-ink-light">
      <div className="bg-surface-card p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-ink-light rounded focus:outline-none focus:ring-2 focus:ring-status-info"
              required
              minLength={8}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-ink-light rounded focus:outline-none focus:ring-2 focus:ring-status-info"
              required
              minLength={8}
            />
          </div>
          {error && <p className="text-status-error text-sm">{error}</p>}
          {success && <p className="text-status-success text-sm">{success}</p>}
          <button
            type="submit"
            className="w-full bg-status-info text-white py-2 rounded hover:bg-status-info transition"
            disabled={!token}
          >
            Reset Password
          </button>
        </form>
      </div>
    </main>
  );
}