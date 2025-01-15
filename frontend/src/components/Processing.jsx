import React from "react";
import "../css/Processing.css";

export default function Processing(props) {
  const { downloading } = props;

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-white"
      style={{
        width: "calc(100% - 10px)",
        height: "calc(100vh - 20px)",
        background: "#2C2F33",
        margin: "10px 10px 10px 5px",
        borderRadius: "16px",
        textAlign: "center",
      }}
    >
      <div className="mb-4">
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            color: "#7289DA",
            marginBottom: "10px",
          }}
        >
          Transcribing
        </h1>
        <p style={{ fontSize: "1rem", color: "#B9BBBE" }}>
          {!downloading ? "warming up cylinders" : "core cylinders engaged"}
        </p>
      </div>
      <div
        className="d-flex flex-column gap-2"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        {[0, 1, 2].map((val) => (
          <div
            key={val}
            className="rounded-pill bg-secondary"
            style={{
              height: "8px",
              background: "#778899",
              animation: `loadingAnimation${val} 1.5s infinite ease-in-out`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
