"use client"
import { useEffect, useRef, useState } from "react"
import AOS from "aos"

export const LandingPage = () => {
  const cubeRef = useRef<HTMLDivElement>(null)
  const [enlarged, setEnlarged] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    AOS.init({ duration: 1000, once: true })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      if (scrollTop > 100) {
        setEnlarged(true)
        setShowButton(true)
      } else {
        setEnlarged(false)
        setShowButton(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "300px",
          height: "300px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(100px)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "5%",
          width: "200px",
          height: "200px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      {/* Navigation Bar */}
      <nav
        data-aos="fade-down"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 2rem",
          position: "sticky",
          top: 0,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            background: "linear-gradient(45deg, #fff, #e0e7ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Model_DX
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <div style={{ display: "flex", gap: "2rem", fontSize: "1rem" }}>
            <button
              onClick={() => scrollToSection("home")}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                opacity: 0.8,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = "1"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = "0.8"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                opacity: 0.8,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = "1"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = "0.8"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                opacity: 0.8,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = "1"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = "0.8"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              Contact
            </button>
          </div>
          <button
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "0.75rem 1.5rem",
              borderRadius: "50px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              fontWeight: "500",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)"
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.2)"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "none"
            }}
            onClick={() => (window.location.href = "/auth/login")}
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`bi ${isMenuOpen ? "bi-x" : "bi-list"}`}></i>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="mobile-menu"
          style={{
            position: "fixed",
            top: "80px",
            left: 0,
            right: 0,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            padding: "2rem",
            zIndex: 999,
            animation: "slideDown 0.3s ease-out",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={() => scrollToSection("home")}
              style={{
                background: "none",
                border: "none",
                color: "#333",
                fontSize: "1.1rem",
                padding: "0.5rem",
                cursor: "pointer",
              }}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              style={{
                background: "none",
                border: "none",
                color: "#333",
                fontSize: "1.1rem",
                padding: "0.5rem",
                cursor: "pointer",
              }}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              style={{
                background: "none",
                border: "none",
                color: "#333",
                fontSize: "1.1rem",
                padding: "0.5rem",
                cursor: "pointer",
              }}
            >
              Contact
            </button>
            <button
              style={{
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                color: "white",
                border: "none",
                padding: "0.75rem 2rem",
                borderRadius: "50px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500",
                marginTop: "1rem",
              }}
              onClick={() => (window.location.href = "/auth/login")}
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        id="home"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "90vh",
          padding: "2rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Animated 3D Cube */}
        <div
          data-aos="zoom-in"
          style={{
            perspective: "1000px",
            marginBottom: "3rem",
          }}
        >
          <div
            ref={cubeRef}
            style={{
              width: "120px",
              height: "120px",
              background: "linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))",
              transformStyle: "preserve-3d",
              animation: "spin 8s linear infinite",
              transition: "transform 0.6s ease",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              transform: enlarged ? "scale(1.3) translateY(-20px)" : "scale(1) translateY(0)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          />
        </div>

        <h1
          data-aos="fade-up"
          data-aos-delay="200"
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            marginBottom: "1.5rem",
            fontWeight: "700",
            lineHeight: "1.1",
            fontFamily: "'Space Grotesk', sans-serif",
            background: "linear-gradient(135deg, #fff 0%, #e0e7ff 50%, #c7d2fe 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 4px 20px rgba(255, 255, 255, 0.3)",
          }}
        >
          Model_DX
        </h1>

        <p
          data-aos="fade-up"
          data-aos-delay="400"
          style={{
            fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
            marginBottom: "3rem",
            color: "rgba(255, 255, 255, 0.9)",
            fontWeight: "400",
            maxWidth: "600px",
            lineHeight: "1.6",
          }}
        >
          Experience the future of AI-powered conversations. Intelligent, intuitive, and designed to understand you
          better than ever before.
        </p>

        <div
          data-aos="fade-up"
          data-aos-delay="600"
          style={{
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              background: "linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "1rem 2.5rem",
              fontSize: "1.1rem",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              fontWeight: "500",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)"
              e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.3)"
              e.currentTarget.style.background =
                "linear-gradient(45deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.2)"
              e.currentTarget.style.background =
                "linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))"
            }}
            onClick={() => (window.location.href = "/auth/login")}
          >
            <i className="bi bi-rocket-takeoff me-2"></i>
            Start Chatting
          </button>

          <button
            style={{
              background: "transparent",
              color: "white",
              border: "2px solid rgba(255, 255, 255, 0.5)",
              padding: "1rem 2.5rem",
              fontSize: "1.1rem",
              borderRadius: "50px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontWeight: "500",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
              e.currentTarget.style.transform = "translateY(-3px)"
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.8)"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)"
            }}
            onClick={() => scrollToSection("about")}
          >
            <i className="bi bi-info-circle me-2"></i>
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="about"
        style={{
          padding: "5rem 2rem",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h2
            data-aos="fade-up"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              marginBottom: "3rem",
              fontWeight: "700",
              color: "#fff",
            }}
          >
            Why Choose Model_DX?
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
              marginTop: "3rem",
            }}
          >
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "2.5rem",
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  borderRadius: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <i className="bi bi-lightning-charge text-white" style={{ fontSize: "1.5rem" }}></i>
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#fff" }}>Lightning Fast</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.6" }}>
                Get instant responses powered by cutting-edge AI technology that understands context and nuance.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "2.5rem",
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  borderRadius: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <i className="bi bi-shield-check text-white" style={{ fontSize: "1.5rem" }}></i>
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#fff" }}>Secure & Private</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.6" }}>
                Your conversations are encrypted and protected with enterprise-grade security measures.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "2.5rem",
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  borderRadius: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <i className="bi bi-palette text-white" style={{ fontSize: "1.5rem" }}></i>
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#fff" }}>Customizable</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.6" }}>
                Personalize your AI experience with custom themes, preferences, and conversation styles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        style={{
          padding: "5rem 2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2
            data-aos="fade-up"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              marginBottom: "2rem",
              fontWeight: "700",
              color: "#fff",
            }}
          >
            Ready to Get Started?
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            style={{
              fontSize: "1.2rem",
              marginBottom: "3rem",
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: "1.6",
            }}
          >
            Join thousands of users who are already experiencing the future of AI conversation.
          </p>
          <button
            data-aos="fade-up"
            data-aos-delay="400"
            style={{
              background: "linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "1.2rem 3rem",
              fontSize: "1.2rem",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              fontWeight: "600",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)"
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.4)"
              e.currentTarget.style.background =
                "linear-gradient(45deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)"
              e.currentTarget.style.background =
                "linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))"
            }}
            onClick={() => (window.location.href = "/auth/register")}
          >
            <i className="bi bi-arrow-right-circle me-2"></i>
            Create Your Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem",
          textAlign: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          background: "rgba(0, 0, 0, 0.2)",
        }}
      >
        <p style={{ color: "rgba(255, 255, 255, 0.7)", margin: 0 }}>
          © 2024 Model_DX. All rights reserved. | Built with ❤️ for the future of AI | Created By Ked
        </p>
      </footer>

      {/* Bootstrap Icons */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap');

        @keyframes spin {
          from {
            transform: rotateY(0deg) rotateX(0deg);
          }
          to {
            transform: rotateY(360deg) rotateX(360deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          
          .mobile-menu-btn {
            display: block !important;
          }

          nav {
            padding: 1rem !important;
          }

          section {
            padding: 3rem 1rem !important;
          }

          .mobile-menu {
            top: 70px !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        /* Button focus states */
        button:focus {
          outline: 2px solid rgba(255, 255, 255, 0.5);
          outline-offset: 2px;
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}
