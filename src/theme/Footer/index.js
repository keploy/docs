// import React from "react";
// import Footer from "@theme-original/Footer";

// export default function FooterWrapper(props) {
//   return (
//     <>
//       <Footer {...props} />
//     </>
//   );
// }
import React, { useState } from "react";
import Footer from "@theme-original/Footer";
import './FooterWrapper.css'; // Import the enhanced CSS

export default function FooterWrapper(props) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  // Mouse move handler for creating dynamic 3D tilt
  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const xVal = (clientX - left) / width;
    const yVal = (clientY - top) / height;

    const rotateX = (yVal - 0.5) * 20; // Increase tilt for better 3D effect
    const rotateY = (xVal - 0.5) * -20; // Increase tilt for better visibility

    setTilt({ rotateX, rotateY });
  };

  return (
    <div
      className="footer-3d-effect"
      style={{
        transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(1.02)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0 })} // Reset on mouse leave
    >
      <Footer {...props} />
    </div>
  );
}
