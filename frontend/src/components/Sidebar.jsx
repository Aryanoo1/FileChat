import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarRightCollapseFilled,
} from "react-icons/tb";
import { RiChatNewLine } from "react-icons/ri";
import { FaSort } from "react-icons/fa6";
import "../css/Sidebar.css";

const Sidebar = ({ handlePageChange, closeSidebar, uploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFileId, setActiveFileId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const apiUrl = import.meta.env.VITE_API_URL;
  const email = Cookies.get("sessionEmail");

  const fetchFiles = async () => {
    if (!email) return;

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/get-all-files`, {
        email,
      });
      setFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [email, uploadComplete]);

  const handleFileSelect = (fileId, fileUrl) => {
    setActiveFileId(fileId);
    handlePageChange("Conversation", fileId, fileUrl);
  };

  const toggleSidebarVisibility = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    const sortedFiles = [...files].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateB - dateA : dateA - dateB;
    });
    setFiles(sortedFiles);
  };

  const filteredFiles = files.filter((file) =>
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {!isSidebarOpen && (
        <button
          title="Open Sidebar"
          className="btn btn-link position-absolute top-0 start-0 m-2"
          onClick={toggleSidebarVisibility}
          style={{
            color: "#7289DA",
            fontSize: "1.5rem",
            zIndex: 10,
          }}
        >
          <TbLayoutSidebarRightCollapseFilled />
        </button>
      )}

      {!isSidebarOpen && (
        <button
          title="Upload File"
          className="btn btn-link position-absolute top-0 start-0 ms-5 m-2"
          onClick={() => {
            setActiveFileId(null);
            handlePageChange("Upload");
          }}
          style={{
            color: "#7289DA",
            fontSize: "1.5rem",
            zIndex: 10,
          }}
        >
          <RiChatNewLine />
        </button>
      )}

      <div
        className={`sidebar-container position-relative ${
          isSidebarOpen ? "d-block" : "d-none"
        }`}
        style={{
          width: "300px",
          height: "calc(100vh - 20px)",
          backgroundColor: "#2C2F33",
          color: "white",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          borderRadius: "16px 16px 16px 16px",
          position: "fixed",
          top: 0,
          left: 0,
          transition: "transform 0.3s ease",
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          margin: "10px 5px 10px 10px",
        }}
      >
        <button
          title="Close Sidebar"
          className="btn btn-link position-absolute top-0 start-0 m-1"
          onClick={toggleSidebarVisibility}
          style={{
            color: "#7289DA",
            fontSize: "1.5rem",
          }}
        >
          <TbLayoutSidebarLeftCollapseFilled />
        </button>

        <div
          className="sidebar-header d-flex justify-content-between align-items-center p-3"
          style={{
            borderBottom: "1px solid #444",
          }}
        >
          <h4 className="text-center w-100 mb-0">Previous Chats</h4>
          <button
            title="Upload File"
            className="btn"
            onClick={() => {
              setActiveFileId(null);
              handlePageChange("Upload");
            }}
            style={{
              color: "#7289DA",
              border: "none",
              position: "absolute",
              right: "10px",
              fontSize: "1.5rem",
            }}
          >
            <RiChatNewLine />
          </button>
        </div>

        <div
          className="list-group list-group-flush border-bottom scrollarea"
          style={{
            flexGrow: 1,
            overflowY: "auto",
            height: "calc(100vh - 160px)",
            padding: "10px 15px",
            marginTop: "10px",
          }}
        >
          {loading ? (
            <div className="text-center">Loading files...</div>
          ) : filteredFiles.length === 0 ? (
            <div
              className="no-files-message text-muted text-center"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
                fontWeight: "700",
              }}
            >
              Start Uploading Files
            </div>
          ) : (
            Object.entries(
              filteredFiles.reduce((groups, file) => {
                const formattedDate = new Date(
                  file.createdAt
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                if (!groups[formattedDate]) groups[formattedDate] = [];
                groups[formattedDate].push(file);
                return groups;
              }, {})
            ).map(([date, filesOnDate]) => (
              <div key={date}>
                <div
                  className="text-center"
                  style={{
                    color: "white",
                    textDecoration: "underline",
                    fontWeight: "bold",
                    margin: "20px 0 10px",
                  }}
                >
                  {date}
                </div>

                {filesOnDate.map((file) => (
                  <div
                    key={file._id}
                    onClick={() => handleFileSelect(file._id, file.fileUrl)}
                    className={`list-group-item py-3 px-4 mb-3 ${
                      activeFileId === file._id ? "active" : ""
                    }`}
                    style={{
                      backgroundColor:
                        activeFileId === file._id ? "#5865F2" : "#40444B",
                      color: "#FFF",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "background-color 0s, transform 0.2s",
                      boxShadow:
                        activeFileId === file._id
                          ? "0 4px 8px rgba(0, 0, 0, 0.3)"
                          : "none",
                    }}
                  >
                    <strong className="mb-1">{file.fileName}</strong>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="p-3 d-flex" style={{ borderTop: "1px solid #444" }}>
          <div className="d-flex justify-content-center align-items-center">
            <a
              title="Sort Files"
              onClick={handleSortOrderChange}
              style={{
                color: "#5865F2",
                border: "none",
                cursor: "pointer",
                marginRight: "5px",
              }}
            >
              <FaSort />
            </a>
          </div>

          <div className="input-group">
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Search files..."
              value={searchQuery}
              onChange={handleSearch}
              style={{
                backgroundColor: "#40444B",
                color: "#FFF",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
