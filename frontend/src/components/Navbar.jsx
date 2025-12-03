import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`
        fixed left-1/2 -translate-x-1/2 z-50 
        flex flex-row justify-between items-center 
        p-4 h-20 w-[75%] rounded-full transition-all duration-300
        border-2 hover:border-blue-800 
        ${isScrolled ? "top-0 bg-black text-white border-black shadow-xl" : "top-10 bg-transparent text-black border-black"}
      `}
    >
      <div className="image flex items-center">
        <img src={Logo} alt="Logo" className="h-16 w-16 object-contain" />
      </div>

      <div className="content flex flex-row gap-6 text-lg mr-4">
        <a href="/" className="hover:text-blue-400 font-bold">Home</a>
        <a href="/login" className="hover:text-blue-400 font-bold">Login</a>
        <a href="/services" className="hover:text-blue-400 font-bold">Services</a>
        <a href="/contact" className="hover:text-blue-400 font-bold">Contact</a>
      </div>
    </div>
  );
}

export default Navbar;
