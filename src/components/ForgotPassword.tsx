import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../lib/authService';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await forgotPassword(email)
      setIsSubmitted(true)
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to send reset email. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-surface-card rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center">
          <img src="/images/logo.png" alt="DroneTv" className="h-10 mb-6 object-contain" />
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-status-success/15 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-ink mb-2">Check Your Email</h2>
            <p className="text-ink-paragraph mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-ink-caption mb-8">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
          <div className="space-y-4 w-full">
            <button
              onClick={() => {
                setIsSubmitted(false)
                setEmail('')
              }}
              className="w-full bg-status-warning text-white py-2 rounded hover:bg-status-warning transition"
            >
              Try Again
            </button>
            <Link
              to="/login"
              className="w-full inline-block text-center bg-ink-light text-ink-paragraph py-2 rounded hover:bg-ink-light transition"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-surface-card rounded-lg shadow-lg p-8">
      <div className="flex flex-col items-center mb-8">
        <img src="/images/logo.png" alt="DroneTv" className="h-10 mb-4 object-contain" />
        <h2 className="text-3xl font-bold text-ink mb-2">Reset Password</h2>
        <p className="text-ink-paragraph text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-status-warning ${errors.email ? 'border-status-error' : 'border-ink-light'}`}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-status-error text-sm mt-1">{errors.email}</p>}
        </div>
        {errors.submit && <p className="text-status-error text-center">{errors.submit}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-status-warning text-white py-2 rounded hover:bg-status-warning transition"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-status-warning hover:text-status-warning font-medium"
        >
          ← Back to Sign In
        </Link>
      </div>
    </div>
  )
}

export default ForgotPassword