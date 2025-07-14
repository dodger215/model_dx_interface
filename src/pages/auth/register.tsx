"use client"

import type React from "react"
import { useState } from "react"
import { Form, Button, Card, Container, Alert, Spinner, Row, Col } from "react-bootstrap"
import { registerUser } from "../../services/authService"
import type { RegisterFormValues } from "../../types/AuthForm"
import { useNavigate } from "react-router-dom"

const Register: React.FC = () => {
  const [form, setForm] = useState<RegisterFormValues>({
    name: "",
    email: "",
    phonenumber: "",
    date_of_birth: "",
    gender: "MALE",
    password: "",
  })
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [isloading, setIsloading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [passwordStrength, setPasswordStrength] = useState<number>(0)
  const navigate = useNavigate()

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const getPasswordStrengthColor = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1:
        return "#dc3545"
      case 2:
        return "#fd7e14"
      case 3:
        return "#ffc107"
      case 4:
      case 5:
        return "#198754"
      default:
        return "#6c757d"
    }
  }

  const getPasswordStrengthText = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1:
        return "Weak"
      case 2:
        return "Fair"
      case 3:
        return "Good"
      case 4:
      case 5:
        return "Strong"
      default:
        return ""
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value))
    }

    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if (error) setError(null)
  }

  const validateForm = (): boolean => {
    if (form.password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!/^\+?[\d\s-()]+$/.test(form.phonenumber)) {
      setError("Please enter a valid phone number")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsloading(true)
    setError(null)

    const formData = new FormData()
    formData.append("username", form.name)
    formData.append("email", form.email)
    formData.append("phonenumber", form.phonenumber)
    formData.append("date_of_birth", form.date_of_birth)
    formData.append("gender", form.gender)
    formData.append("password", form.password)

    try {
      const res = await registerUser(formData)
      if (res?.status === 200 || res?.status === 201) {
        navigate("/auth/login")
      }
    } catch (err) {
      console.error(err)
      setError("Registration failed. Please try again.")
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
      <Container style={{ maxWidth: "500px" }}>
        <div className="text-center mb-4">
          <div
            className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: "80px", height: "80px" }}
          >
            <i className="bi bi-person-plus text-primary" style={{ fontSize: "2.5rem" }}></i>
          </div>
          <h2 className="text-white fw-bold mb-2">Create Account</h2>
          <p className="text-white opacity-75">Join us and start your AI chat experience</p>
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
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-dark mb-2">
                      <i className="bi bi-person me-2"></i>
                      Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
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
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
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
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-dark mb-2">
                      <i className="bi bi-telephone me-2"></i>
                      Phone Number
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phonenumber"
                      value={form.phonenumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter your phone number"
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
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-dark mb-2">
                      <i className="bi bi-calendar me-2"></i>
                      Date of Birth
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="date_of_birth"
                      value={form.date_of_birth}
                      onChange={handleChange}
                      required
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
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-dark mb-2">
                      <i className="bi bi-gender-ambiguous me-2"></i>
                      Gender
                    </Form.Label>
                    <Form.Select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      required
                      className="border-0 shadow-sm rounded-3"
                      style={{
                        padding: "12px 16px",
                        fontSize: "1rem",
                        background: "rgba(248, 249, 250, 0.8)",
                        backdropFilter: "blur(10px)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
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
                        placeholder="Create a password"
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
                    {form.password && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Password strength:</small>
                          <small style={{ color: getPasswordStrengthColor(passwordStrength) }}>
                            {getPasswordStrengthText(passwordStrength)}
                          </small>
                        </div>
                        <div className="progress" style={{ height: "4px" }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${(passwordStrength / 5) * 100}%`,
                              backgroundColor: getPasswordStrengthColor(passwordStrength),
                              transition: "all 0.3s ease",
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-dark mb-2">
                      <i className="bi bi-shield-check me-2"></i>
                      Confirm Password
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                        placeholder="Confirm your password"
                        className={`border-0 shadow-sm rounded-3 pe-5 ${
                          confirmPassword && form.password !== confirmPassword ? "is-invalid" : ""
                        } ${confirmPassword && form.password === confirmPassword && confirmPassword.length > 0 ? "is-valid" : ""}`}
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        type="button"
                      >
                        <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </Button>
                    </div>
                    {confirmPassword && form.password !== confirmPassword && (
                      <small className="text-danger mt-1 d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        Passwords do not match
                      </small>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <div className="mb-4">
                <Form.Check
                  type="checkbox"
                  id="terms-checkbox"
                  label={
                    <span>
                      I agree to the{" "}
                      <Button variant="link" className="p-0 text-decoration-none" style={{ color: "#667eea" }}>
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="p-0 text-decoration-none" style={{ color: "#667eea" }}>
                        Privacy Policy
                      </Button>
                    </span>
                  }
                  className="text-muted"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-100 border-0 rounded-3 py-3 fw-semibold mb-3"
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
                    Creating Account...
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center">
                    <i className="bi bi-person-plus me-2"></i>
                    Create Account
                  </div>
                )}
              </Button>
            </Form>

            <hr className="my-4 opacity-25" />

            <div className="text-center">
              <p className="text-muted mb-3">Already have an account?</p>
              <Button
                variant="outline-primary"
                className="rounded-3 px-4 py-2"
                style={{
                  borderColor: "#667eea",
                  color: "#667eea",
                  transition: "all 0.3s ease",
                }}
                onClick={() => navigate("/auth/login")}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Sign In
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
        .form-control:focus,
        .form-select:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
          background: rgba(255, 255, 255, 0.9) !important;
        }

        /* Valid/Invalid input styles */
        .form-control.is-valid {
          border-color: #198754 !important;
          background-image: none !important;
        }

        .form-control.is-invalid {
          border-color: #dc3545 !important;
          background-image: none !important;
        }

        /* Button hover effects */
        .btn:hover {
          transform: translateY(-2px);
        }

        .btn:active {
          transform: translateY(0);
        }

        .btn[type="submit"]:hover {
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
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

          .row .col-md-6 {
            margin-bottom: 0;
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

        /* Progress bar animation */
        .progress-bar {
          transition: width 0.3s ease, background-color 0.3s ease;
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

        /* Date input styling */
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.5);
        }

        /* Select dropdown styling */
        .form-select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23667eea' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 6 7 7 7-7'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  )
}

export default Register
