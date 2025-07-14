"use client"

import type React from "react"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Spinner } from "react-bootstrap"

interface Interaction {
  id: string
  content: string
  prompt: string
  isFileSet: boolean
  created_at: string
}

interface Session {
  id: string
  topic: string
  created_at: string
  interaction: Interaction[]
  isClosed: boolean
}

interface User {
  name: string
  email: string
  date_of_birth: string
  phonenumber: string
  gender: "MALE" | "FEMALE"
  id: string
  created_at: string
}

export const SessionPage = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [prompt, setPrompt] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem("token")
  if (!token) {
    navigate("/auth/login")
  }

  useEffect(() => {
    fetchSessions()
    fetchUserProfile()
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/user/me", {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const fetchSessions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/model/get/session", {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      setSessions(response.data)
      if (response.data.length > 0) {
        setSelectedSession(response.data[0])
      }
    } catch (error) {
      navigate("/auth/login")
      console.error("Error fetching sessions:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSession?.isClosed) return

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("prompts", prompt)
    if (file) {
      formData.append("file", file)
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/model/generate/response", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `bearer ${token}`,
        },
      })

      if (selectedSession) {
        const updatedSession = {
          ...selectedSession,
          interaction: [...selectedSession.interaction, response.data],
        }
        setSelectedSession(updatedSession)

        setSessions(sessions.map((session) => (session.id === selectedSession.id ? updatedSession : session)))
      }
      setPrompt("")
      setFile(null)
    } catch (error) {
      setError("Error submitting prompt")
      console.error("Error submitting prompt:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/auth/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div
      className="vh-100 position-relative"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {error && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1050 }}>
          <div className="alert alert-danger alert-dismissible fade show shadow-lg border-0" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
          </div>
        </div>
      )}

    
      <div className="d-lg-none bg-white bg-opacity-10 backdrop-blur p-3 border-bottom border-white border-opacity-20">
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-outline-light border-0 p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="bi bi-list fs-5"></i>
          </button>
          <h5 className="text-white mb-0 fw-bold">AI Chat</h5>
          {user && (
            <div className="position-relative">
              <button
                className="btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ width: "36px", height: "36px" }}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <span className="fw-bold" style={{ fontSize: "0.75rem" }}>
                  {getInitials(user.name)}
                </span>
              </button>
              {showUserDropdown && (
                <div
                  className="dropdown-menu dropdown-menu-end show position-absolute mt-2 shadow-lg border-0"
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    right: 0,
                    minWidth: "180px",
                  }}
                >
                  <div className="px-3 py-2 border-bottom">
                    <div className="fw-semibold small">{user.name}</div>
                    <small className="text-muted">{user.email}</small>
                  </div>
                  <button
                    className="dropdown-item py-2"
                    onClick={() => {
                      setShowProfileModal(true)
                      setShowUserDropdown(false)
                    }}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    View Profile
                  </button>
                  <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container-fluid h-100 p-0">
        <div className="row h-100 g-0">
          {/* Sidebar - Reduced width */}
          <div
            className={`col-xl-2 col-lg-3 col-md-4 position-fixed position-lg-relative h-100 ${
              sidebarOpen ? "d-block" : "d-none d-lg-block"
            }`}
            style={{ zIndex: 1040 }}
          >
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
                onClick={() => setSidebarOpen(false)}
                style={{ zIndex: -1 }}
              ></div>
            )}

            <div
              className="h-100 p-3 position-relative"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
                width: "100%",
                maxWidth: "280px",
              }}
            >
              {/* Desktop Header with User Info - Compact */}
              <div className="d-flex d-lg-flex align-items-center justify-content-between mb-3" style={{
                flexDirection: "row"
              }}>
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle p-1 me-2">
                    <i className="bi bi-chat-dots-fill text-white" style={{ fontSize: "0.9rem" }}></i>
                  </div>
                  <h5 className="text-white mb-0 fw-bold">Sessions</h5>
                </div>
                {user && (
                  <div className="position-relative">
                    <button
                      className="btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: "36px", height: "36px" }}
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                    >
                      <span className="fw-bold" style={{ fontSize: "0.75rem" }}>
                        {getInitials(user.name)}
                      </span>
                    </button>
                    {showUserDropdown && (
                      <div
                        className="dropdown-menu dropdown-menu-end show position-absolute mt-2 shadow-lg border-0"
                        style={{
                          background: "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(10px)",
                          right: 0,
                          minWidth: "180px",
                        }}
                      >
                        <div className="px-3 py-2 border-bottom">
                          <div className="fw-semibold small">{user.name}</div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                        <button
                          className="dropdown-item py-2"
                          onClick={() => {
                            setShowProfileModal(true)
                            setShowUserDropdown(false)
                          }}
                        >
                          <i className="bi bi-person-circle me-2"></i>
                          View Profile
                        </button>
                        <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              
              <button
                className="btn btn-outline-light border-0 position-absolute top-0 end-0 m-2 d-lg-none"
                onClick={() => setSidebarOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>

              <div
                className="d-flex flex-column gap-2 mt-3 mt-lg-0"
                style={{ maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}
              >
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    className={`btn text-start p-2 rounded-3 border-0 transition-all position-relative ${
                      selectedSession?.id === session.id
                        ? "bg-primary text-white shadow-sm"
                        : "bg-white bg-opacity-10 text-white hover-bg-white hover-bg-opacity-20"
                    }`}
                    onClick={() => {
                      setSelectedSession(session)
                      setSidebarOpen(false)
                    }}
                    style={{
                      transition: "all 0.3s ease",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="mb-0 fw-semibold" style={{ fontSize: "0.8rem" }}>
                        {session.topic.length > 25 ? `${session.topic.substring(0, 25)}...` : session.topic}
                      </h6>
                      <div className="d-flex flex-column align-items-end">
                        <small className="opacity-75" style={{ fontSize: "0.7rem" }}>
                          {new Date(session.created_at).toLocaleDateString()}
                        </small>
                        {session.isClosed && (
                          <span className="badge bg-danger bg-opacity-75" style={{ fontSize: "0.55rem" }}>
                            Expired
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <i className="bi bi-chat-square-text-fill opacity-75" style={{ fontSize: "0.7rem" }}></i>
                      <small className="opacity-75" style={{ fontSize: "0.7rem" }}>
                        {session.interaction.length} messages
                      </small>
                    </div>
                  </button>
                ))}

                {sessions.length === 0 && (
                  <div className="text-center text-white opacity-75 mt-4">
                    <i className="bi bi-inbox fs-1 mb-2"></i>
                    <p className="small">No sessions yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

      
          <div className="col-xl-10 col-lg-9 col-md-8 d-flex flex-column h-100" style={{ height: "100%", marginTop: "6px", justifyContent: "space-between" }}>
            <div
              className="h-100 d-flex flex-column"
              style={{
                width: "83%",
                height: "100%",
                background: "rgba(255, 255, 255, 0.05)",
                position: "absolute",
                right: "0%",
                backdropFilter: "blur(20px)",
                marginTop: "-60px",
                paddingTop: "60px",
                
              }}
            >
              {selectedSession ? (
                <>

                  <div className="p-3 border-bottom border-white border-opacity-20">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h4 className="text-white mb-1 fw-bold">{selectedSession.topic}</h4>
                        <small className="text-white opacity-75">
                          <i className="bi bi-calendar3 me-1"></i>
                          {new Date(selectedSession.created_at).toLocaleString()}
                        </small>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-pill small d-flex text-light ${
                          selectedSession.isClosed
                            ? "bg-danger bg-opacity-20 "
                            : "bg-success bg-opacity-20 "
                        }`}

                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i className="bi bi-circle-fill me-1" style={{ fontSize: "0.4rem" }}></i>
                        {selectedSession.isClosed ? "Expired" : "Active"}
                      </div>
                    </div>
                  </div>

                 
                  <div className="flex-grow-1 p-3 overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
                    {selectedSession.interaction.length === 0 ? (
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-center text-white opacity-75">
                          <i className="bi bi-chat-heart display-4 mb-3"></i>
                          <h5>Start a conversation</h5>
                          <p>Send your first message to begin this session</p>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex gap-3" style={{
                        flexDirection: "column-reverse"
                      }}>
                        {selectedSession.interaction.map((interaction) => (
                          <div key={interaction.id} className="d-flex flex-column gap-2">
                            {/* User Message */}
                            <div className="d-flex justify-content-end">
                              <div
                                className="bg-primary text-white p-3 rounded-4 shadow-sm position-relative"
                                style={{
                                  maxWidth: "80%",
                                  borderBottomRightRadius: "0.5rem !important",
                                }}
                              >
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  
                                  <strong style={{ fontSize: "0.8rem" }}>You</strong>
                                </div>
                                <div style={{ lineHeight: "1.4", fontSize: "0.9rem" }}>{interaction.prompt}</div>
                                {interaction.isFileSet && (
                                  <div className="mt-2 p-2 bg-white bg-opacity-10 rounded-2">
                                    <i className="bi bi-image me-1"></i>
                                    <small>Image attached</small>
                                  </div>
                                )}
                              </div>
                            </div>

                        
                            <div className="d-flex justify-content-start">
                              <div
                                className="bg-white text-dark p-3 rounded-4 shadow-sm position-relative"
                                style={{
                                  maxWidth: "80%",
                                  borderBottomLeftRadius: "0.5rem !important",
                                }}
                              >
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <div className="rounded-circle">
                                    <i className="bi bi-robot text-primary" style={{ fontSize: "0.7rem" }}></i>
                                  </div>
                                  <strong className="text-primary" style={{ fontSize: "0.8rem" }}>
                                    AI Assistant
                                  </strong>
                                </div>
                                {interaction.content ? (
                                  <div
                                  className="text-dark"
                                  style={{
                                    whiteSpace: "pre-line",
                                    lineHeight: "1.5",
                                    fontSize: "0.9rem",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: interaction.content.replace(/\**([^*]+)\**/g, '<strong>$1</strong>')
                                  }}
                                />
                                ) : (
                                  <div
                                    className="text-dark"
                                    style={{
                                      whiteSpace: "pre-line",
                                      lineHeight: "1.5",
                                      fontSize: "0.9rem",
                                    }}
                                  >
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                  </div>
                                )}
                                
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Input Form - Compact */}
                  <div
                    className="p-3 border-top border-white border-opacity-20"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {selectedSession.isClosed ? (
                      <div className="text-center py-3">
                        <div className="bg-danger bg-opacity-20 text-light p-2 rounded-3 d-inline-flex align-items-center gap-2">
                          <i className="bi bi-exclamation-triangle-fill"></i>
                          <span className="fw-semibold small">
                            This session has expired and is no longer available for new messages
                          </span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        <div className="d-flex gap-2 align-items-end" style={{
                          borderRadius: "20px"
                        }}>
                          {/* File Upload - Compact */}
                          <div className="flex-shrink-0">
                            <label
                              htmlFor="file-upload"
                              className={`btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center ${
                                file ? "bg-success bg-opacity-20 border-success text-success" : ""
                              }`}
                              style={{
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                backdropFilter: "blur(10px)",
                                background: file ? "rgba(25, 135, 84, 0.1)" : "rgba(255, 255, 255, 0.1)",
                                width: "40px",
                                height: "40px",
                              }}
                              title={file ? `Selected: ${file.name}` : "Upload image (optional)"}
                            >
                              <i className={`bi ${file ? "bi-check-circle-fill" : "bi-image"}`}></i>
                            </label>
                            <input
                              id="file-upload"
                              type="file"
                              className="d-none"
                              accept="image/*"
                              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            />
                          </div>

                          {/* Text Input - Compact */}
                          <div className="flex-grow-1">
                            <textarea
                              className="form-control border-0 shadow-sm"
                              rows={1}
                              placeholder="Type your message..."
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              required
                              style={{
                                resize: "none",
                                fontSize: "0.9rem",
                                padding: "10px 14px",
                                borderRadius: "20px",
                                background: "rgba(255, 255, 255, 0.9)",
                                backdropFilter: "blur(10px)",
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault()
                                  handleSubmit(e)
                                }
                              }}
                            />
                          </div>

                    
                          <div className="flex-shrink-0">
                            <button
                              type="submit"
                              className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm"
                              disabled={isLoading || !prompt.trim()}
                              style={{
                                width: "40px",
                                height: "40px",
                                transition: "all 0.3s ease",
                                background: "linear-gradient(45deg, #007bff, #0056b3)",
                                border: "none",
                              }}
                            >
                              {isLoading ? (
                                <div className="spinner-border spinner-border-sm" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                              ) : (
                                <i className="bi bi-send-fill"></i>
                              )}
                            </button>
                          </div>

                          {/* Clear file button */}
                          {file && (
                            <div className="flex-shrink-0">
                              <button
                                type="button"
                                className="btn btn-outline-danger rounded-circle p-2"
                                onClick={() => setFile(null)}
                                style={{ width: "40px", height: "40px" }}
                                title="Remove file"
                              >
                                <i className="bi bi-x-lg"></i>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* File indicator */}
                        {file && (
                          <div className="mt-2">
                            <small className="text-white opacity-75">
                              <i className="bi bi-paperclip me-1"></i>
                              {file.name}
                            </small>
                          </div>
                        )}
                      </form>
                    )}
                  </div>
                </>
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="text-center text-white px-4">
                    <i className="bi bi-chat-square-dots display-1 mb-4 opacity-50"></i>
                    <h3 className="mb-3">Welcome to AI Chat</h3>
                    <p className="lead opacity-75">Select a session from the sidebar to start chatting</p>
                    <p className="opacity-50">or create a new session to begin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && user && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0 shadow-lg"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Profile Information</h5>
                <button type="button" className="btn-close" onClick={() => setShowProfileModal(false)}></button>
              </div>
              <div className="modal-body pt-0">
                <div className="text-center mb-4">
                  <div
                    className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold mb-3"
                    style={{ width: "80px", height: "80px", fontSize: "1.5rem" }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <h4 className="mb-1">{user.name}</h4>
                  <p className="text-muted">{user.email}</p>
                </div>

                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold text-muted">Phone Number</label>
                    <p className="mb-0">{user.phonenumber}</p>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold text-muted">Gender</label>
                    <p className="mb-0">{user.gender}</p>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold text-muted">Date of Birth</label>
                    <p className="mb-0">{formatDate(user.date_of_birth)}</p>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold text-muted">Member Since</label>
                    <p className="mb-0">{formatDate(user.created_at)}</p>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold text-muted">User ID</label>
                    <p className="mb-0 font-monospace text-break small">{user.id}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showUserDropdown && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 1030 }}
          onClick={() => setShowUserDropdown(false)}
        ></div>
      )}

      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet" />

      <style>{`
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .hover-bg-white:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        .btn:hover {
          transform: translateY(-1px);
        }
        
        .btn:active {
          transform: translateY(0);
        }
        
        .backdrop-blur {
          backdrop-filter: blur(20px);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        /* Mobile responsive adjustments */
        @media (max-width: 991.98px) {
          .col-lg-9 {
            margin-left: 0 !important;
          }
        }
        
        /* Textarea auto-resize */
        textarea {
          min-height: 40px;
          max-height: 120px;
          overflow-y: auto;
        }
        
        /* Animation for messages */
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Modal backdrop */
        .modal.show {
          backdrop-filter: blur(5px);
        }
      `}</style>
    </div>
  )
}
