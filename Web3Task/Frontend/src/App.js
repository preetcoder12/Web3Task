  import React, { useState, useEffect, useRef } from "react";
  import "./App.css";

  function App() {
    const [animationState, setAnimationState] = useState("idle");
    const [showTextGradient, setShowTextGradient] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const wsRef = useRef(null);
    const animationTimeoutRef = useRef(null);

    useEffect(() => {
const socketUrl =
  process.env.NODE_ENV === "production"
    ? "wss://web3task-1.onrender.com"
    : "ws://localhost:8080";



      const ws = new WebSocket(socketUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        console.log("Message from server:", event.data);
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log("WebSocket disconnected");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close();
      };

      return () => ws.close();
    }, []);

    const clearAllTimeouts = () => {
      clearTimeout(animationTimeoutRef.current);
    };

    const handleStartAnimation = () => {
      clearAllTimeouts();
      setAnimationState("idle");
      setShowTextGradient(false);

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "Animation->Start :)...." }));
      }

      setTimeout(() => {
        setAnimationState("running");

        animationTimeoutRef.current = setTimeout(() => {
          setAnimationState("idle");
          setShowTextGradient(true);
        }, 3000);
      }, 100);
    };

    const handleStopAnimation = () => {
      clearAllTimeouts();
      setAnimationState("idle");
      setShowTextGradient(false);

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "Animation->Stop...." }));
      }
    };

    return (
      <div className="app">
        <div className="animation-container">
          <div className="gradient-bar-container">
            <div
              className={`gradient-bar ${
                animationState === "running" ? "running" : "idle"
              }`}
            />
          </div>

          <h2 className={`text-title ${showTextGradient ? "active" : ""}`}>
            <span className="logo-title">
              <img src="/w3timg.png" alt="Web3Task logo" />
              Web3Task
            </span>
          </h2>
        </div>

        <div className="button-container">
          <button
            onClick={handleStartAnimation}
            disabled={!isConnected || animationState === "running"}
            className="start-button"
          >
            Start Animation
          </button>
          <button
            onClick={handleStopAnimation}
            disabled={!isConnected || animationState === "idle"}
            className="stop-button"
          >
            Stop Animation
          </button>
        </div>

        <p className="connection-status">
          Connection Status:{" "}
          <span className={isConnected ? "connected" : "disconnected"}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </p>

        <div className="self-section">
          <p className="self">Made by Preet Gusain</p>
          <p>
         <a
  href="https://github.com/preetcoder12/Web3Task"
  target="_blank"
  rel="noopener noreferrer"
  className="github-link"
>
  <img src="/github.png" className="gitimg" alt="GitHub" />
</a>

          </p>
        </div>
      </div>
    );
  }

  export default App;
