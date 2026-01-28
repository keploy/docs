import React, {useState} from "react";
import quickstarts from "./QuickStartList";
import Link from "@docusaurus/Link";
import {FaGolang} from "react-icons/fa6";
import {FaJava, FaLaptopCode, FaDocker, FaPython, FaCheck, FaArrowRight, FaArrowLeft} from "react-icons/fa";
import {TbBrandCSharp} from "react-icons/tb";
import { TbBrandRust } from "react-icons/tb";
import {IoLogoJavascript} from "react-icons/io5";
import {useColorMode} from "@docusaurus/theme-common";

export default function QuickstartFilter({defaultLanguage = null}) {
  const {colorMode} = useColorMode();
  const isDark = colorMode === "dark";

  const [currentStep, setCurrentStep] = useState(defaultLanguage ? 2 : 1);
  const [language, setLanguage] = useState(defaultLanguage);
  const [server, setServer] = useState(null);

  const filteredQuickstarts = quickstarts.filter((app) => {
    return (
      (!language || app.language === language) &&
      (!server || app.server === server)
    );
  });

  const languages = [
    {name: "Go", icon: <FaGolang size={24} />, color: "#00ADD8"},
    {name: "Python", icon: <FaPython size={24} />, color: "#3776AB"},
    {name: "Java", icon: <FaJava size={24} />, color: "#007396"},
    {name: "JS/TS", icon: <IoLogoJavascript size={24} />, color: "#F7DF1E"},
    {name: "C#", icon: <TbBrandCSharp size={24} />, color: "#512BD4"},
    {name: "Rust", icon: <TbBrandRust size={24} />, color: "#DEA584"},

  ];

  const servers = [
    {name: "Local", icon: <FaLaptopCode size={24} />, description: "Run directly on your machine"},
    {name: "Docker", icon: <FaDocker size={24} />, description: "Run in a Docker container"},
  ];

  const steps = [
    {id: 1, label: "Language", icon: languages.find(l => l.name === language)?.icon || null},
    {id: 2, label: "Environment", icon: server === "Docker" ? <FaDocker size={16} /> : server === "Local" ? <FaLaptopCode size={16} /> : null},
    {id: 3, label: "Quickstart", icon: null},
  ];

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setCurrentStep(2);
  };

  const handleServerSelect = (srv) => {
    setServer(srv);
    setCurrentStep(3);
  };

  const goBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setServer(null);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  const resetSelection = () => {
    setLanguage(null);
    setServer(null);
    setCurrentStep(1);
  };

  return (
    <div className={`quickstart-wizard ${isDark ? 'dark' : 'light'}`}>
      <style>{`
        .quickstart-wizard {
          margin-top: 1.5rem;
        }
        .quickstart-wizard.light {
          --wizard-bg: #fff;
          --wizard-border: #e5e7eb;
          --wizard-text: #111827;
          --wizard-text-muted: #6b7280;
          --wizard-card-bg: #f9fafb;
          --wizard-card-hover: #f3f4f6;
          --wizard-selected-bg: rgba(255, 145, 77, 0.08);
          --wizard-selected-border: #ff914d;
        }
        .quickstart-wizard.dark {
          --wizard-bg: #1a1a1a;
          --wizard-border: #333;
          --wizard-text: #f3f4f6;
          --wizard-text-muted: #9ca3af;
          --wizard-card-bg: #222;
          --wizard-card-hover: #2a2a2a;
          --wizard-selected-bg: rgba(255, 145, 77, 0.15);
          --wizard-selected-border: #ff914d;
        }

        /* Stepper */
        .wizard-stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 2rem;
          padding: 1rem;
          background: var(--wizard-card-bg);
          border-radius: 12px;
          border: 1px solid var(--wizard-border);
        }
        .wizard-step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--wizard-text-muted);
          position: relative;
        }
        .wizard-step.active {
          color: #ff914d;
        }
        .wizard-step.completed {
          color: #22c55e;
        }
        .wizard-step-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--wizard-border);
          color: var(--wizard-text-muted);
        }
        .wizard-step.active .wizard-step-icon {
          background: #ff914d;
          color: #fff;
        }
        .wizard-step.completed .wizard-step-icon {
          background: #22c55e;
          color: #fff;
        }
        .wizard-step-connector {
          width: 60px;
          height: 2px;
          background: var(--wizard-border);
          margin: 0 0.5rem;
        }
        .wizard-step-connector.completed {
          background: #22c55e;
        }

        /* Step Content */
        .wizard-content {
          padding: 1.5rem;
          background: var(--wizard-bg);
          border-radius: 16px;
          border: 1px solid var(--wizard-border);
        }
        .wizard-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--wizard-text);
          margin-bottom: 0.5rem;
        }
        .wizard-subtitle {
          font-size: 0.875rem;
          color: var(--wizard-text-muted);
          margin-bottom: 1.5rem;
        }

        /* Option Cards */
        .wizard-options {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1rem;
        }
        .wizard-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--wizard-card-bg);
          border: 2px solid var(--wizard-border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .wizard-option:hover {
          background: var(--wizard-card-hover);
          border-color: #ff914d;
        }
        .wizard-option.selected {
          background: var(--wizard-selected-bg);
          border-color: var(--wizard-selected-border);
        }
        .wizard-option-radio {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid var(--wizard-border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wizard-option.selected .wizard-option-radio {
          background: #ff914d;
          border-color: #ff914d;
        }
        .wizard-option-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--wizard-bg);
          color: var(--wizard-text);
        }
        .wizard-option-label {
          font-weight: 500;
          color: var(--wizard-text);
          font-size: 0.9375rem;
        }
        .wizard-option-desc {
          font-size: 0.75rem;
          color: var(--wizard-text-muted);
          margin-top: 0.125rem;
        }

        /* Buttons */
        .wizard-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--wizard-border);
        }
        .wizard-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s ease;
          border: none;
        }
        .wizard-btn-secondary {
          background: transparent;
          color: var(--wizard-text-muted);
          border: 1px solid var(--wizard-border);
        }
        .wizard-btn-secondary:hover {
          background: var(--wizard-card-bg);
          color: var(--wizard-text);
        }
        .wizard-btn-primary {
          background: #ff914d;
          color: #fff;
        }
        .wizard-btn-primary:hover {
          background: #e67a3d;
        }
        .wizard-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Results Grid */
        .wizard-results {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        .wizard-result-card {
          padding: 1.25rem;
          background: var(--wizard-card-bg);
          border: 1px solid var(--wizard-border);
          border-radius: 12px;
          transition: all 0.15s ease;
        }
        .wizard-result-card:hover {
          border-color: #ff914d;
          box-shadow: 0 4px 12px rgba(255, 145, 77, 0.15);
        }
        .wizard-result-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--wizard-text);
          margin-bottom: 0.5rem;
        }
        .wizard-result-desc {
          font-size: 0.875rem;
          color: var(--wizard-text-muted);
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        .wizard-result-link {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #ff914d;
          text-decoration: none;
        }
        .wizard-result-link:hover {
          text-decoration: underline;
        }

        /* Selection Summary */
        .wizard-selection-summary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding: 0.75rem 1rem;
          background: var(--wizard-selected-bg);
          border-radius: 8px;
          font-size: 0.875rem;
        }
        .wizard-selection-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.75rem;
          background: var(--wizard-bg);
          border: 1px solid var(--wizard-border);
          border-radius: 20px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--wizard-text);
        }
        .wizard-reset-btn {
          margin-left: auto;
          font-size: 0.75rem;
          color: var(--wizard-text-muted);
          text-decoration: underline;
          cursor: pointer;
          background: none;
          border: none;
        }

        @media (max-width: 640px) {
          .wizard-options {
            grid-template-columns: 1fr;
          }
          .wizard-stepper {
            flex-wrap: wrap;
            justify-content: center;
          }
          .wizard-step-connector {
            display: none;
          }
        }
      `}</style>

      {/* Stepper */}
      <div className="wizard-stepper">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className={`wizard-step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
              <div className="wizard-step-icon">
                {currentStep > step.id ? <FaCheck size={12} /> : step.id}
              </div>
              <span>{step.label}</span>
              {currentStep > step.id && step.id === 1 && language && (
                <span style={{color: '#ff914d', marginLeft: '0.25rem'}}>({language})</span>
              )}
              {currentStep > step.id && step.id === 2 && server && (
                <span style={{color: '#ff914d', marginLeft: '0.25rem'}}>({server})</span>
              )}
            </div>
            {idx < steps.length - 1 && (
              <div className={`wizard-step-connector ${currentStep > step.id ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="wizard-content">
        {/* Step 1: Language Selection */}
        {currentStep === 1 && (
          <>
            <h3 className="wizard-title">Select your language</h3>
            <p className="wizard-subtitle">Choose the programming language for your application</p>
            <div className="wizard-options">
              {languages.map((lang) => (
                <button
                  key={lang.name}
                  className={`wizard-option ${language === lang.name ? 'selected' : ''}`}
                  onClick={() => handleLanguageSelect(lang.name)}
                >
                  <div className="wizard-option-radio">
                    {language === lang.name && <FaCheck size={10} color="#fff" />}
                  </div>
                  <div className="wizard-option-icon" style={{color: lang.color}}>
                    {lang.icon}
                  </div>
                  <span className="wizard-option-label">{lang.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Server/Environment Selection */}
        {currentStep === 2 && (
          <>
            <h3 className="wizard-title">Select your environment</h3>
            <p className="wizard-subtitle">Choose where you want to run the application server</p>
            <div className="wizard-options" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))'}}>
              {servers.map((srv) => (
                <button
                  key={srv.name}
                  className={`wizard-option ${server === srv.name ? 'selected' : ''}`}
                  onClick={() => handleServerSelect(srv.name)}
                  style={{flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem'}}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%'}}>
                    <div className="wizard-option-radio">
                      {server === srv.name && <FaCheck size={10} color="#fff" />}
                    </div>
                    <div className="wizard-option-icon">
                      {srv.icon}
                    </div>
                    <span className="wizard-option-label">{srv.name}</span>
                  </div>
                  <p className="wizard-option-desc" style={{marginLeft: '3.5rem'}}>{srv.description}</p>
                </button>
              ))}
            </div>
            <div className="wizard-actions">
              <button className="wizard-btn wizard-btn-secondary" onClick={goBack}>
                <FaArrowLeft size={12} /> Back
              </button>
            </div>
          </>
        )}

        {/* Step 3: Results */}
        {currentStep === 3 && (
          <>
            <div className="wizard-selection-summary">
              <span className="wizard-selection-tag">
                {languages.find(l => l.name === language)?.icon}
                {language}
              </span>
              <span className="wizard-selection-tag">
                {server === "Docker" ? <FaDocker size={14} /> : <FaLaptopCode size={14} />}
                {server}
              </span>
              <button className="wizard-reset-btn" onClick={resetSelection}>
                Start over
              </button>
            </div>
            <h3 className="wizard-title">✨ Recommended Quickstarts</h3>
            <p className="wizard-subtitle">
              {filteredQuickstarts.length > 0
                ? `Found ${filteredQuickstarts.length} quickstart${filteredQuickstarts.length > 1 ? 's' : ''} for ${language} with ${server}`
                : 'No quickstarts available for this selection'}
            </p>
            <div className="wizard-results">
              {filteredQuickstarts.map((app, idx) => (
                <div key={idx} className="wizard-result-card">
                  <h4 className="wizard-result-title">{app.title}</h4>
                  <p className="wizard-result-desc">{app.description}</p>
                  <Link to={app.link} className="wizard-result-link">
                    View Quickstart <FaArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
            <div className="wizard-actions">
              <button className="wizard-btn wizard-btn-secondary" onClick={goBack}>
                <FaArrowLeft size={12} /> Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
