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
  const touchPos = useRef({ x: 0, y: 0 });
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
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

  // Mobile-optimized canvas animation
  useEffect(() => {
    if (!canvasRef.current) return;
    
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

    // Touch/mouse position tracker
    const handlePointerMove = (e) => {
      const pos = e.touches ? e.touches[0] : e;
      touchPos.current = { x: pos.clientX, y: pos.clientY };
    };
    
    window.addEventListener(isMobile ? 'touchmove' : 'mousemove', handlePointerMove);
    window.addEventListener('touchstart', handlePointerMove);

    // Performance-optimized particle system
    const particles = [];
    const particleCount = isMobile ? 25 : 50;

    class Particle {
      constructor() {
        this.reset();
        this.baseSize = Math.random() * 2 + 1;
        this.color = darkMode ? 
          `hsla(${Math.random() * 60 + 200}, 70%, 70%, 0.2)` : 
          `hsla(${Math.random() * 60 + 20}, 70%, 50%, 0.1)`;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
      }

      update() {
        // Pointer attraction (reduced effect on mobile)
        const dx = touchPos.current.x - this.x;
        const dy = touchPos.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (isMobile ? 200 : 150)) {
          const force = (isMobile ? 200 : 150) - distance;
          this.speedX += dx / distance * force * 0.0005;
          this.speedY += dy / distance * force * 0.0005;
        }

        // Normal movement with boundaries
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) this.speedX *= -0.8;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -0.8;
        
        // Friction
        this.speedX *= 0.95;
        this.speedY *= 0.95;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.baseSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections (fewer on mobile)
      if (!isMobile) {
        for (let a = 0; a < particles.length; a++) {
          for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.strokeStyle = darkMode ? 
                `hsla(210, 80%, 70%, ${1 - distance/100})` : 
                `hsla(20, 80%, 50%, ${1 - distance/100})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              ctx.stroke();
            }
          }
        }
      }

      // Update and draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener(isMobile ? 'touchmove' : 'mousemove', handlePointerMove);
      window.removeEventListener('touchstart', handlePointerMove);
    };
  }, [darkMode, isMobile]);

  // Mobile-optimized animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 5 : 10 },
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
    <div className={`relative min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* Performance-optimized Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      
      {/* Mobile-optimized Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`relative z-10 w-full max-w-md p-6 rounded-xl shadow-lg space-y-6 transition-all ${darkMode ? 'bg-gray-800/95 border border-gray-700' : 'bg-white/95 border border-gray-200'}`}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
        }}
        whileHover={!isMobile ? { 
          scale: 1.01,
          boxShadow: darkMode ? '0 10px 30px -10px rgba(0, 0, 0, 0.5)' : '0 10px 30px -10px rgba(0, 0, 0, 0.1)'
        } : {}}
      >
        {/* Theme Toggle (larger for mobile) */}
        <motion.button
          onClick={toggleMode}
          className={`absolute top-4 right-4 p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle theme"
          style={{
            width: isMobile ? 44 : 36,
            height: isMobile ? 44 : 36
          }}
        >
          {darkMode ? <FaSun size={isMobile ? 20 : 18} /> : <FaMoon size={isMobile ? 20 : 18} />}
        </motion.button>

        {/* Logo (smaller on mobile) */}
        <motion.div 
          className="flex justify-center"
          variants={itemVariants}
        >
          <div className={`relative rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <Image
              src={logo}
              alt="DryAura Logo"
              width={isMobile ? 80 : 100}
              height={isMobile ? 80 : 100}
              className="rounded-full border-2 border-white"
              priority // Important for mobile LCP
            />
          </div>
        </motion.div>

        {/* Content (adjusted for mobile) */}
        <motion.div className="space-y-4" variants={containerVariants}>
          <motion.h1 
            className={`text-xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}
            variants={itemVariants}
          >
            DryAura Premium
          </motion.h1>
          <motion.p 
            className={`text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            variants={itemVariants}
          >
            Premium dry fruits with eco-friendly packaging. Healthy snacking for your lifestyle.
          </motion.p>
        </motion.div>

        {/* Links (optimized for touch) */}
        <motion.div className="space-y-3" variants={containerVariants}>
          {[
            { 
              icon: <FaInstagram size={18} />, 
              text: "Instagram", 
              href: "https://instagram.com/dryaura",
              desc: "Follow us"
            },
            { 
              icon: <FaFacebook size={18} />, 
              text: "Facebook", 
              href: "https://facebook.com/dryaura",
              desc: "Join our community"
            },
            { 
              icon: <FaWhatsapp size={18} />, 
              text: "WhatsApp", 
              href: "https://wa.me/8384086292",
              desc: "Chat with us"
            },
            { 
              icon: <FiExternalLink size={18} />, 
              text: "Online Store", 
              href: "https://dryaura.in",
              desc: "Shop now"
            },
            { 
              icon: <IoMdMail size={18} />, 
              text: "Contact Us", 
              href: "mailto:support@dryaura.in",
              desc: "Get in touch"
            }
          ].map((link, i) => (
            <motion.a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} active:scale-95 transition-transform`}
              variants={itemVariants}
              whileTap={{ scale: isMobile ? 0.97 : 0.98 }}
              style={{
                minHeight: isMobile ? 56 : 48 // Larger touch target
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className={`flex-shrink-0 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {link.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {link.text}
                  </p>
                  <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {link.desc}
                  </p>
                </div>
                <FiExternalLink className={`flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Footer (simplified for mobile) */}
        <motion.div 
          className={`text-center text-xs mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
          variants={itemVariants}
        >
          <p>© {new Date().getFullYear()} DryAura</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LinktreeCard;