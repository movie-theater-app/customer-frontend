import React from "react";
import logo from "../assets/north-star-logo.jpg";
import home from "../assets/home.png"
import "../CSS/Navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="header">
        <img src={logo} alt="North Star logo" className="navbar-logo" />
        <img src={home} 
             alt="home-button" 
             className="back-btn"
             onClick={() => navigate("/")} 
        />
    </header>
    );
}