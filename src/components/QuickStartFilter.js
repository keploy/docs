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
const IconWrapper = ({icon, bg, darkBg}) => (
  <div
    style={{
      width: "70px",
      height: "70px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      backgroundColor: "var(--ifm-color-emphasis-100)",
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
    },
    {
      name: "Python",
      icon: <FaPython size={36} color="#3776AB" />,
    },
    {
      name: "Java",
      icon: <FaJava size={36} color="#007396" />,
    },
    {
      name: "JS/TS",
      icon: <IoLogoJavascript size={36} color="#F7DF1E" />,
    },
    {
      name: "Rust",
      icon: <FaRust size={36} color="#DEA584" />,
    },
    {
      name: "C#",
      icon: <TbBrandCSharp size={36} color="#512BD4" />,
    },
  ];

  const servers = [
    {
      name: "Local",
      icon: <FaLaptopCode size={36} color="#f97316" />,
    },
    {
      name: "Docker",
      icon: <FaDocker size={36} color="#2496ED" />,
    },
  ];

  return (
    <div className="quickstart-filter-container" style={{marginTop: "2rem"}}>
      {/* Language Selection */}
      <h2 style={headingStyle}>Choose your language</h2>
      <div className="quickstart-button-container" style={stepContainer}>
        {languages.map((lang) => (
          <button
            key={lang.name}
            className="quickstart-button-card"
            onClick={() => setLanguage(lang.name)}
            style={{
              ...buttonCard,
              border:
                language === lang.name ? "2px solid #f97316" : "2px solid var(--ifm-color-emphasis-300)",
              boxShadow:
                language === lang.name
                  ? "0 3px 8px rgba(249, 115, 22, 0.3)"
                  : "none",
            }}
          >
            <IconWrapper icon={lang.icon} />
            <p style={{marginTop: "0.5rem", fontWeight: "500", color: "var(--ifm-color)"}}>{lang.name}</p>
          </button>
        ))}
      </div>

      {/* Server Selection */}
      <h2 style={{...headingStyle, marginTop: "2rem"}}>
        Where do you want to run the app server?
      </h2>
      <div className="quickstart-button-container" style={serverContainer}>
        {servers.map((srv) => (
          <button
            key={srv.name}
            className="quickstart-button-card"
            onClick={() => setServer(srv.name)}
            style={{
              ...buttonCard,
              border:
                server === srv.name ? "2px solid #f97316" : "2px solid var(--ifm-color-emphasis-300)",
              boxShadow:
                server === srv.name
                  ? "0 3px 8px rgba(249, 115, 22, 0.3)"
                  : "none",
            }}
          >
            <IconWrapper icon={srv.icon} />
            <p style={{marginTop: "0.5rem", fontWeight: "500", color: "var(--ifm-color)"}}>{srv.name}</p>
          </button>
        ))}
      </div>

      {/* Quickstarts */}
      {language && server && (
        <>
          <h2 style={{...headingStyle, marginTop: "2rem"}}>
            ✨ AI Suggested Sample Apps
          </h2>
          <div className="quickstart-grid-container" style={gridContainer}>
            {filteredQuickstarts.length > 0 ? (
              filteredQuickstarts.map((app, idx) => (
                <div key={idx} className="quickstart-card" style={cardStyle}>
                  <h3 style={{margin: "0 0 0.5rem 0", fontSize: "1.2rem", color: "var(--ifm-color)"}}>
                    {app.title}
                  </h3>
                  <p style={{color: "var(--ifm-color-emphasis-600)", fontSize: "0.95rem"}}>
                    {app.description}
                  </p>
                  <Link to={app.link} style={linkStyle}>
                    View Quickstart →
                  </Link>
                </div>
              ))
            ) : (
              <p style={{color: "var(--ifm-color-emphasis-600)"}}>No quickstarts available for this selection.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Styles
const headingStyle = {
  textAlign: "center",
  marginLeft: "1rem",
  marginRight: "1rem",
  fontSize: "1.4rem",
  fontWeight: "600",
  color: "var(--ifm-color)",
};

const serverContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  justifyContent: "center",
  marginTop: "1.5rem",
  marginLeft: "1rem",
  marginRight: "1rem",
};

const stepContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  marginLeft: "1rem",
  marginRight: "1rem",
  justifyContent: "center",
  marginTop: "1.5rem",
};

const buttonCard = {
  border: "2px solid var(--ifm-color-emphasis-300)",
  borderRadius: "12px",
  padding: "1rem 1.5rem",
  cursor: "pointer",
  background: "var(--ifm-card-background-color)",
  transition: "all 0.2s ease",
  textAlign: "center",
  minWidth: "120px",
  flex: "1",
  maxWidth: "200px",
};

const gridContainer = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "1fr",
  marginTop: "2rem",
  padding: "0 1rem",
};

const cardStyle = {
  border: "1px solid var(--ifm-color-emphasis-300)",
  borderRadius: "12px",
  padding: "1.25rem",
  background: "var(--ifm-card-background-color)",
  boxShadow: "0 2px 6px var(--ifm-card-shadow-color)",
  width: "100%",
  maxWidth: "100%",
};

const linkStyle = {
  marginTop: "0.8rem",
  display: "inline-block",
  color: "#f97316",
  fontWeight: "bold",
  textDecoration: "none",
};
