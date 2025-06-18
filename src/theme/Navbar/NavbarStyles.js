// NavbarStyles.js - Custom styles component for enhanced navbar
import { useEffect } from 'react';

export default function NavbarStyles() {
  useEffect(() => {
    // Inject custom CSS for navbar enhancements
    const styleId = 'enhanced-navbar-styles';
    
    // Check if styles already exist
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Enhanced Navbar Custom Styles - Docusaurus Compatible */
      
      /* Smooth scroll behavior */
      html {
        scroll-behavior: smooth;
      }
      
      /* Enhanced navbar backdrop blur support */
      @supports (backdrop-filter: blur(10px)) {
        .navbar {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      }
      
      /* Active link highlighting with animation */
      .navbar__link--active {
        position: relative;
        font-weight: 600;
        color: var(--ifm-color-primary) !important;
      }
      
      .navbar__link--active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background: linear-gradient(90deg, var(--ifm-color-primary), var(--ifm-color-primary-light));
        border-radius: 1px;
        animation: slideInActive 0.3s ease-out;
      }
      
      @keyframes slideInActive {
        from { 
          transform: translateX(-50%) scaleX(0);
          opacity: 0;
        }
        to { 
          transform: translateX(-50%) scaleX(1);
          opacity: 1;
        }
      }
      
      /* Enhanced navbar item hover effects */
      .navbar__item {
        transition: transform 0.2s ease-out;
      }
      
      .navbar__item:hover {
        transform: translateY(-1px);
      }
      
      .navbar__link {
        transition: all 0.2s ease-out;
        border-radius: 6px;
        padding: 0.5rem 0.75rem;
      }
      
      .navbar__link:hover {
        background-color: var(--ifm-color-emphasis-200);
        transform: translateY(-1px);
      }
      
      /* Logo hover animation */
      .navbar__logo {
        transition: transform 0.2s ease-out;
      }
      
      .navbar__logo:hover {
        transform: scale(1.05);
      }
      
      /* Enhanced mobile sidebar */
      .navbar-sidebar {
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .navbar-sidebar__item {
        transition: all 0.2s ease-out;
      }
      
      .navbar-sidebar__item:hover {
        transform: translateX(4px);
        background-color: var(--ifm-color-emphasis-100);
      }
      
      /* Enhanced focus styles for accessibility */
      .navbar__item:focus-visible,
      .navbar__link:focus-visible,
      .navbar__toggle:focus-visible {
        outline: 2px solid var(--ifm-color-primary);
        outline-offset: 2px;
        border-radius: 4px;
      }
      
      /* Search bar enhancements */
      .navbar__search-input {
        transition: all 0.2s ease-out;
        border-radius: 8px;
      }
      
      .navbar__search-input:focus {
        transform: scale(1.02);
        box-shadow: 0 0 0 2px var(--ifm-color-primary);
      }
      
      /* Color mode toggle enhancements */
      .navbar__toggle {
        transition: all 0.2s ease-out;
        border-radius: 6px;
        padding: 0.5rem;
      }
      
      .navbar__toggle:hover {
        background-color: var(--ifm-color-emphasis-200);
        transform: scale(1.05);
      }
      
      /* Mobile sidebar backdrop */
      .navbar-sidebar__backdrop {
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
      
      /* Custom scrollbar for mobile sidebar */
      .navbar-sidebar__items {
        scrollbar-width: thin;
        scrollbar-color: var(--ifm-color-primary) transparent;
      }
      
      .navbar-sidebar__items::-webkit-scrollbar {
        width: 6px;
      }
      
      .navbar-sidebar__items::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .navbar-sidebar__items::-webkit-scrollbar-thumb {
        background-color: var(--ifm-color-primary);
        border-radius: 3px;
      }
      
      /* Responsive improvements */
      @media (max-width: 996px) {
        .navbar__items {
          gap: 0.5rem;
        }
        
        .navbar__link {
          padding: 0.75rem 1rem;
        }
      }
    `;
    
    document.head.appendChild(style);
    
    // Cleanup function
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);
  
  return null; // This component doesn't render anything
}