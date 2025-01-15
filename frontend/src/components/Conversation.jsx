import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { FiLogOut } from "react-icons/fi";
import { FaFileAlt } from "react-icons/fa";

const Conversation = ({ fileId, fileUrl }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const email = Cookies.get("sessionEmail");

  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      console.error("Email not found in cookies.");
      return;
    }

    const fetchChats = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/file-chats`, {
          params: { fileId, email },
        });

        if (response.data.success) {
          setMessages(response.data.chats || []);
        }
      } catch (error) {
        console.error("Error fetching chats:", error.message);
      }
    };

    fetchChats();
  }, [fileId, email]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      message: newMessage,
      sender: "user",
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    try {
      setLoading(true);

      const queryResponse = await axios.post(`${apiUrl}/api/file-query`, {
        email,
        fileId,
        question: newMessage,
      });

      const systemMessage = {
        message:
          queryResponse.data.data?.answer || "No answer from the system.",
        sender: "system",
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, systemMessage]);
    } catch (error) {
      console.error("Error handling message:", error.message);
      setMessages((prev) => [
        ...prev,
        {
          message: "Something went wrong, please try again later.",
          sender: "system",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("sessionEmail", "sessionName");
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message, index) => {
    const isUser = message.sender === "user";
    const bubbleStyle = isUser
      ? {
          background: "linear-gradient(135deg, #40444B, #666B72)",
          color: "#FFF",
        }
      : {
          background: "linear-gradient(135deg, #5865F2, #a1c4fd 0%)",
          color: "#333",
        };

    return (
      <div
        className={`d-flex ${
          isUser ? "justify-content-end" : "justify-content-start"
        } mb-3`}
        key={index}
      >
        <div
          style={{
            ...bubbleStyle,
            maxWidth: "70%",
            borderRadius: "20px",
            padding: "10px 15px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ fontSize: "1rem", fontWeight: "500" }}>
            {message.message}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              marginTop: "5px",
              textAlign: "right",
              opacity: 0.7,
            }}
          >
            {message.time}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="d-flex flex-column border-start"
      style={{
        width: "98%",
        height: "calc(100vh - 20px)",
        backgroundColor: "#292B2F",
        margin: "10px 10px 10px 5px",
        borderRadius: "16px 16px 16px 16px",
      }}
    >
      <div
        className="border-bottom p-3 d-flex align-items-center"
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          background: "linear-gradient(135deg, #40444B, #666B72)",
          color: "#FFF",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          position: "relative",
        }}
      >
        <span style={{ flex: 1, textAlign: "center" }}>Chat</span>

        <button
          title="Logout"
          className="btn btn-link"
          onClick={handleLogout}
          style={{
            color: "#FFF",
            fontSize: "1.5rem",
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <FiLogOut />
        </button>
      </div>

      <div
        style={{
          flex: "1",
          overflowY: "auto",
          padding: "20px",
          display: messages.length > 0 ? "block" : "flex",
          alignItems: messages.length > 0 ? "unset" : "center",
          justifyContent: messages.length > 0 ? "unset" : "center",
        }}
      >
        {messages.length > 0 ? (
          messages.map(renderMessage)
        ) : (
          <div
            className="text-muted text-center"
            style={{
              fontSize: "2.5rem",
            }}
          >
            {loading ? "Loading..." : "Start a conversation..."}
          </div>
        )}
      </div>

      <div
        className="border-top p-3"
        style={{
          background: "#292B2F",
          boxShadow: "0 -2px 6px rgba(0, 0, 0, 0.1)",
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
        }}
      >
        <div className="d-flex align-items-center">
          <a title="View Upload" href={fileUrl} target="_blank">
            <FaFileAlt
              style={{
                marginRight: "10px",
                fontSize: "1.5rem",
                color: "white",
              }}
            />
          </a>

          <input
            type="text"
            className="form-control me-2"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            style={{
              borderRadius: "20px",
              background: "linear-gradient(135deg, #40444B, #666B72)",
              color: "#FFF",
              border: "none",
            }}
          />
          <button
            className="btn btn-primary"
            onClick={handleSendMessage}
            disabled={loading}
            style={{
              borderRadius: "20px",
              background: "linear-gradient(135deg, #40444B, #666B72)",
              border: "none",
            }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
