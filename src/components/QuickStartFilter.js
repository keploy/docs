import React, {useState} from "react";
import quickstarts from "./QuickStartList";
import Link from "@docusaurus/Link";
import {FaGolang} from "react-icons/fa6";
import {FaJava} from "react-icons/fa";
import {FaLaptopCode} from "react-icons/fa";
import {FaRust} from "react-icons/fa";
import {TbBrandCSharp} from "react-icons/tb";
import {FaPython} from "react-icons/fa";
import {FaDocker} from "react-icons/fa";
import {IoLogoJavascript} from "react-icons/io5";

// 🔹 Wrapper for icons to make them uniform
const IconWrapper = ({icon, bg}) => (
  <div
    style={{
      width: "70px",
      height: "70px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      backgroundColor: bg || "#f3f4f6",
      boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
      transition: "transform 0.2s ease",
    }}
    className="icon-wrapper"
  >
    {icon}
  </div>
);

export default function QuickstartFilter({defaultLanguage = null}) {
  // 👇 initialize with defaultLanguage if provided
  const [language, setLanguage] = useState(defaultLanguage);
  const [server, setServer] = useState(null);

  const filteredQuickstarts = quickstarts.filter((app) => {
    return (
      (!language || app.language === language) &&
      (!server || app.server === server)
    );
  });

  const languages = [
    {
      name: "Go",
      icon: <FaGolang size={36} color="#00ADD8" />,
      bg: "#E0F7FA",
    },
    {
      name: "Python",
      icon: <FaPython size={36} color="#3776AB" />,
      bg: "#E8F0FE",
    },
    {
      name: "Java",
      icon: <FaJava size={36} color="#007396" />,
      bg: "#FDEDED",
    },
    {
      name: "JS/TS",
      icon: <IoLogoJavascript size={36} color="#F7DF1E" />,
      bg: "#FFF8E1",
    },
    {
      name: "Rust",
      icon: <FaRust size={36} color="#DEA584" />,
      bg: "#FFF3E0",
    },
    {
      name: "C#",
      icon: <TbBrandCSharp size={36} color="#512BD4" />,
      bg: "#EDE7F6",
    },
  ];

  const servers = [
    {
      name: "Local",
      icon: <FaLaptopCode size={36} color="#f97316" />,
      bg: "#FFF3E0",
    },
    {
      name: "Docker",
      icon: <FaDocker size={36} color="#2496ED" />,
      bg: "#E3F2FD",
    },
  ];

  return (
    <div style={{marginTop: "2rem"}}>
      {/* Language Selection */}
      <h2 style={headingStyle}>Choose your language</h2>
      <div style={stepContainer}>
        {languages.map((lang) => (
          <button
            key={lang.name}
            onClick={() => setLanguage(lang.name)}
            style={{
              ...buttonCard,
              border:
                language === lang.name ? "2px solid #f97316" : "2px solid #ddd",
              boxShadow:
                language === lang.name
                  ? "0 3px 8px rgba(249, 115, 22, 0.3)"
                  : "none",
            }}
          >
            <IconWrapper icon={lang.icon} bg={lang.bg} />
            <p style={{marginTop: "0.5rem", fontWeight: "500"}}>{lang.name}</p>
          </button>
        ))}
      </div>

      {/* Server Selection */}
      <h2 style={{...headingStyle, marginTop: "2rem"}}>
        Where do you want to run the app server?
      </h2>
      <div style={serverContainer}>
        {servers.map((srv) => (
          <button
            key={srv.name}
            onClick={() => setServer(srv.name)}
            style={{
              ...buttonCard,
              border:
                server === srv.name ? "2px solid #f97316" : "2px solid #ddd",
              boxShadow:
                server === srv.name
                  ? "0 3px 8px rgba(249, 115, 22, 0.3)"
                  : "none",
            }}
          >
            <IconWrapper icon={srv.icon} bg={srv.bg} />
            <p style={{marginTop: "0.5rem", fontWeight: "500"}}>{srv.name}</p>
          </button>
        ))}
      </div>

      {/* Quickstarts */}
      {language && server && (
        <>
          <h2 style={{...headingStyle, marginTop: "2rem"}}>
            ✨ AI Suggested Sample Apps
          </h2>
          <div style={gridContainer}>
            {filteredQuickstarts.length > 0 ? (
              filteredQuickstarts.map((app, idx) => (
                <div key={idx} style={cardStyle}>
                  <h3 style={{margin: "0 0 0.5rem 0", fontSize: "1.2rem"}}>
                    {app.title}
                  </h3>
                  <p style={{color: "#555", fontSize: "0.95rem"}}>
                    {app.description}
                  </p>
                  <Link to={app.link} style={linkStyle}>
                    View Quickstart →
                  </Link>
                </div>
              ))
            ) : (
              <p>No quickstarts available for this selection.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Styles
const headingStyle = {
  textAlign: "left",
  marginLeft: "1rem",
  fontSize: "1.4rem",
  fontWeight: "600",
};

const serverContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1.5rem",
  justifyContent: "flex-start",
  marginTop: "1.5rem",
  marginLeft: "1rem",
};

const stepContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1.5rem",
  marginLeft: "1rem",
  justifyContent: "flex-start",
  marginTop: "1.5rem",
};

const buttonCard = {
  border: "2px solid #ddd",
  borderRadius: "12px",
  padding: "1rem 2rem",
  cursor: "pointer",
  background: "#fff",
  transition: "all 0.2s ease",
  textAlign: "center",
};

const gridContainer = {
  display: "grid",
  gap: "1.5rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  marginTop: "2rem",
};

const cardStyle = {
  border: "1px solid #eee",
  borderRadius: "12px",
  padding: "1rem",
  background: "#fff",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
};

const linkStyle = {
  marginTop: "0.8rem",
  display: "inline-block",
  color: "#f97316",
  fontWeight: "bold",
  textDecoration: "none",
};
