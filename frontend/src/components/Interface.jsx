import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Upload from "./Upload";
import Conversation from "./Conversation";
import "../css/Interface.css";

const Interface = () => {
  const [page, setPage] = useState("Upload");
  const [uploadComplete, setUploadComplete] = useState(1);
  const [fileId, setFileId] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handlePageChange = (newPage, fileId = null, fileUrl = null) => {
    setPage(newPage);
    if (fileId) {
      setFileId(fileId);
    }
    if (fileUrl) {
      setFileUrl(fileUrl);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex" style={{ background: "currentcolor" }}>
      {isSidebarOpen && (
        <Sidebar
          handlePageChange={handlePageChange}
          closeSidebar={toggleSidebar}
          uploadComplete={uploadComplete}
        />
      )}

      <div
        className={`main-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
        style={{
          flexGrow: 1,
          transition: "margin-left 0.3s ease",
        }}
      >
        {page === "Upload" ? (
          <Upload
            setPage={handlePageChange}
            setUploadComplete={setUploadComplete}
            uploadComplete={uploadComplete}
          />
        ) : (
          <Conversation fileId={fileId} fileUrl={fileUrl} />
        )}
      </div>
    </div>
  );
};

export default Interface;
