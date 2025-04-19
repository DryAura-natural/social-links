"use client";
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebook, FaWhatsapp, FaSun, FaMoon } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import { IoMdMail } from 'react-icons/io';
import Image from 'next/image';
import logo from "./logo.png";

const LinktreeCard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  
  // Theme toggle with localStorage persistence
  const toggleMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem('darkMode'));
    if (savedMode !== null) setDarkMode(savedMode);
  }, []);

  // Canvas animation with mouse interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse movement tracker
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Enhanced particle system
    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);

    class Particle {
      constructor() {
        this.reset();
        this.baseSize = Math.random() * 3 + 1;
        this.color = darkMode ? 
          `hsla(${Math.random() * 60 + 200}, 70%, 70%, ${Math.random() * 0.3 + 0.1})` : 
          `hsla(${Math.random() * 60 + 20}, 70%, 50%, ${Math.random() * 0.2 + 0.1})`;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.originalSize = this.size;
      }

      update() {
        // Mouse attraction
        const dx = mousePos.current.x - this.x;
        const dy = mousePos.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (150 - distance) / 150;
          
          this.speedX += forceDirectionX * force * 0.2;
          this.speedY += forceDirectionY * force * 0.2;
          this.size = this.originalSize * (1 + force * 0.5);
        }

        // Normal movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Boundary check with gentle bounce
        if (this.x > canvas.width || this.x < 0) {
          this.speedX *= -0.8;
          this.x = Math.max(0, Math.min(canvas.width, this.x));
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY *= -0.8;
          this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
        
        // Slow down over time
        this.speedX *= 0.98;
        this.speedY *= 0.98;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        if (darkMode) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = this.color;
        }
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connecting lines
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.strokeStyle = darkMode ? 
              `hsla(210, 80%, 70%, ${1 - distance/120})` : 
              `hsla(20, 80%, 50%, ${1 - distance/120})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
        particles[a].update();
        particles[a].draw();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [darkMode]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* Interactive Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      
      {/* Main Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`relative z-10 w-full max-w-md p-8 rounded-2xl shadow-lg space-y-8 transition-all duration-500 ${darkMode ? 'bg-gray-800/90 backdrop-blur-sm border border-gray-700' : 'bg-white/95 backdrop-blur-sm border border-gray-200'}`}
        whileHover={{ 
          scale: 1.01,
          boxShadow: darkMode ? '0 10px 30px -10px rgba(0, 0, 0, 0.5)' : '0 10px 30px -10px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Theme Toggle */}
        <motion.button
          onClick={toggleMode}
          className={`absolute top-5 right-5 p-2 rounded-full transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle theme"
        >
          {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
        </motion.button>

        {/* Logo */}
        <motion.div 
          className="flex justify-center"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          <div className={`relative rounded-full p-1 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-900' : 'bg-gradient-to-br from-gray-100 to-gray-300'}`}>
            <Image
              src={logo}
              alt="DryAura Logo"
              width={120}
              height={120}
              className="rounded-full border-2 border-white shadow-md"
            />
          </div>
        </motion.div>

        {/* Brand Introduction */}
        <motion.div className="space-y-4" variants={containerVariants}>
          <motion.h1 
            className={`text-2xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}
            variants={itemVariants}
          >
            🌿 Join Our Flavor Journey! 🌱
          </motion.h1>
          <motion.p 
            className={`text-center text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            variants={itemVariants}
          >
            Experience nature's finest snacks with our hand-selected, premium dry fruits. 
            Sustainably sourced, carefully packaged in eco-friendly materials, and delivered 
            with the purity you deserve.
          </motion.p>
        </motion.div>

        {/* Links */}
        <motion.div className="space-y-4" variants={containerVariants}>
          {[
            { 
              icon: <FaInstagram />, 
              text: "Instagram", 
              href: "https://instagram.com/dryaura",
              desc: "Follow for daily inspiration and offers"
            },
            { 
              icon: <FaFacebook />, 
              text: "Facebook", 
              href: "https://facebook.com/dryaura",
              desc: "Join our community of health enthusiasts"
            },
            { 
              icon: <FaWhatsapp />, 
              text: "WhatsApp", 
              href: "https://wa.me/yournumber",
              desc: "Chat directly for orders and queries"
            },
            { 
              icon: <FiExternalLink />, 
              text: "Online Store", 
              href: "https://dryaura.com",
              desc: "Shop our premium collection"
            },
            { 
              icon: <IoMdMail />, 
              text: "Contact Us", 
              href: "mailto:contact@dryaura.com",
              desc: "We'd love to hear from you"
            }
          ].map((link, i) => (
            <motion.a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-4 rounded-xl transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} shadow-sm`}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                <span className={`text-xl mt-0.5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {link.icon}
                </span>
                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {link.text}
                  </h3>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {link.desc}
                  </p>
                </div>
                <FiExternalLink className={`ml-auto mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div 
          className={`text-center pt-4 border-t ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}
          variants={itemVariants}
        >
          <p className="text-xs">
            Premium Dry Fruits • Eco-Friendly Packaging • Healthy Lifestyle
          </p>
          <p className="text-xs mt-2">
            &copy; {new Date().getFullYear()} DryAura. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LinktreeCard;