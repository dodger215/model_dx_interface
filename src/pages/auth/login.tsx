"use client"

import type React from "react"
import { useState } from "react"
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap"
import { loginUser } from "../../services/authService"
import type { LoginFormValues } from "../../types/AuthForm"
import { useNavigate } from "react-router-dom"

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginFormValues>({
    email: "",
    password: "",
  })
  const [isloading, setIsloading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsloading(true)
    setError(null)

    const formData = new FormData()
    formData.append("email", form.email)
    formData.append("password", form.password)

    try {
      const res = await loginUser(formData)
      if (res?.status === 200) {
        localStorage.setItem("token", res.data.access_token)
        navigate("/main")
      }
    } catch (err) {
      console.error(err)
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsloading(false)
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <Container style={{ maxWidth: "420px" }}>
        <div className="text-center mb-4">
          <div
            className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: "80px", height: "80px" }}
          >
            <i className="bi bi-person-circle text-primary" style={{ fontSize: "2.5rem" }}></i>
          </div>
          <h2 className="text-white fw-bold mb-2">Welcome Back</h2>
          <p className="text-white opacity-75">Sign in to your account to continue</p>
        </div>

        <Card
          className="border-0 shadow-lg"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "1.5rem",
          }}
        >
          <Card.Body className="p-4">
            {error && (
              <Alert
                variant="danger"
                className="border-0 rounded-3 mb-4"
                style={{
                  background: "rgba(220, 53, 69, 0.1)",
                  color: "#dc3545",
                  backdropFilter: "blur(10px)",
                }}
                dismissible
                onClose={() => setError(null)}
              >
                <div className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold text-dark mb-2">
                  <i className="bi bi-envelope me-2"></i>
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="border-0 shadow-sm rounded-3"
                  style={{
                    padding: "12px 16px",
                    fontSize: "1rem",
                    background: "rgba(248, 249, 250, 0.8)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold text-dark mb-2">
                  <i className="bi bi-lock me-2"></i>
                  Password
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="border-0 shadow-sm rounded-3 pe-5"
                    style={{
                      padding: "12px 16px",
                      fontSize: "1rem",
                      background: "rgba(248, 249, 250, 0.8)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted p-0 me-3"
                    style={{ background: "none", boxShadow: "none" }}
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </Button>
                </div>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check type="checkbox" id="remember-me" label="Remember me" className="text-muted" />
                <Button
                  variant="link"
                  className="text-decoration-none p-0"
                  style={{ color: "#667eea" }}
                  onClick={() => {
                    // Handle forgot password
                    console.log("Forgot password clicked")
                  }}
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-100 border-0 rounded-3 py-3 fw-semibold"
                disabled={isloading}
                style={{
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                }}
              >
                {isloading ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Signing in...
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </div>
                )}
              </Button>
            </Form>

            <hr className="my-4 opacity-25" />

            <div className="text-center">
              <p className="text-muted mb-3">Don't have an account?</p>
              <Button
                variant="outline-primary"
                className="rounded-3 px-4 py-2"
                style={{
                  borderColor: "#667eea",
                  color: "#667eea",
                  transition: "all 0.3s ease",
                }}
                onClick={() => {
                  // Handle sign up navigation
                  navigate("/auth/register")
                }}
              >
                <i className="bi bi-person-plus me-2"></i>
                Create Account
              </Button>
            </div>
          </Card.Body>
        </Card>

        <div className="text-center mt-4">
          <p style={{ color: "rgba(255, 255, 255, 0.7)", margin: 0 }}>
            © 2024 Model_DX. All rights reserved. | Built with ❤️ for the future of AI | Created By Ked
          </p>
        </div>
      </Container>

      {/* Bootstrap CSS and Icons */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet" />

      <style>{`
        /* Custom form control focus styles */
        .form-control:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
          background: rgba(255, 255, 255, 0.9) !important;
        }

        /* Button hover effects */
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
        }

        .btn:active {
          transform: translateY(0);
        }

        /* Custom checkbox styling */
        .form-check-input:checked {
          background-color: #667eea;
          border-color: #667eea;
        }

        .form-check-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
        }

        /* Outline button hover */
        .btn-outline-primary:hover {
          background-color: #667eea;
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        /* Link button hover */
        .btn-link:hover {
          color: #5a67d8 !important;
        }

        /* Card animation */
        .card {
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Loading animation */
        .spinner-border {
          width: 1rem;
          height: 1rem;
        }

        /* Responsive adjustments */
        @media (max-width: 576px) {
          .container {
            padding: 1rem;
          }
          
          .card-body {
            padding: 2rem 1.5rem !important;
          }
        }

        /* Alert animation */
        .alert {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Password toggle button */
        .btn-link:focus {
          box-shadow: none !important;
        }

        /* Custom scrollbar for mobile */
        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
      `}</style>
    </div>
  )
}

export default Login
