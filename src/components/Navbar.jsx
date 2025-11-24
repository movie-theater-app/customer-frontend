import React from "react";
import logo from "../assets/north-star-logo.jpg";
import "../CSS/Navbar.css";

export default function Navbar() {

  return (
    <header className="header">
        <img src={logo} alt="North Star logo" className="navbar-logo" />
    </header>
    );
}