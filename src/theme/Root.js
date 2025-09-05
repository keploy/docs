import React from "react";
import Chatbot from "../components/ChatBot";
// import Chatbot from "../components/Chatbot";

export default function Root({children}) {
  return (
    <>
      {children}
      <Chatbot />
    </>
  );
}
