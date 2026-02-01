import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import './index.css';

const menuData = [
    { id: 1, name: "Otoro Nigiri", price: "£15", desc: "Fatty tuna belly, aged 3 days", img: "src/assets/otoro_nigiri.png" },
    { id: 2, name: "Hamachi", price: "£12", desc: "Yellowtail with citrus zest", img: "src/assets/hamachi.png" },
    { id: 3, name: "Uni Gunkan", price: "£18", desc: "Fresh Hokkaido sea urchin", img: "src/assets/uni_gunkan.png" },
    { id: 4, name: "Anago", price: "£10", desc: "Saltwater eel with sweet soy", img: "src/assets/anago.png" },
    { id: 5, name: "Akami", price: "£9", desc: "Lean bluefin tuna", img: "src/assets/akami.png" },
    { id: 6, name: "Botan Ebi", price: "£14", desc: "Sweet spot prawn", img: "src/assets/botan_ebi.png" },
    { id: 7, name: "Hotate", price: "£11", desc: "Hokkaido scallops", img: "src/assets/hotate.png" },
    { id: 8, name: "Ikura", price: "£12", desc: "Marinated salmon roe", img: "src/assets/ikura.png" },
];

const omakaseSets = [
    { name: "Hana", price: "£85", items: 8, desc: "Seasonal introduction" },
    { name: "Tsuki", price: "£120", items: 12, desc: "Moonlight selection" },
    { name: "Yume", price: "£180", items: 16, desc: "Chef's dream course" },
];

function App() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [activeCategory, setActiveCategory] = useState("all");
    const [reservationData, setReservationData] = useState({
        name: "",
        email: "",
        phone: "",
        guests: 2,
        date: "",
        time: "19:00",
        message: ""
    });
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const y = useTransform(scrollYProgress, [0, 1], [0, 50]);
    const rotateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, -5]), { stiffness: 100 });

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % menuData.length);
        }, 8000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, []);

    const nextSlide = () => setActiveIndex((prev) => (prev + 1) % menuData.length);
    const prevSlide = () => setActiveIndex((prev) => (prev - 1 + menuData.length) % menuData.length);

    const filteredMenu = activeCategory === "all"
        ? menuData
        : menuData.filter(item => item.category === activeCategory);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleReservationSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the reservation data to your backend
        console.log('Reservation submitted:', reservationData);
        alert('Reservation request sent! We will contact you shortly to confirm.');

        // Reset form
        setReservationData({
            name: "",
            email: "",
            phone: "",
            guests: 2,
            date: "",
            time: "19:00",
            message: ""
        });
    };

    const timeSlots = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

    return (
        <div className="app-luxury" ref={containerRef}>
            <div className="bg-grain"></div>
            <div className="floating-particles">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="particle"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 0.3, 0],
                            y: [0, -100],
                            x: Math.sin(i) * 50
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.2
                        }}
                    />
                ))}
            </div>

            <motion.nav
                className={`nav-minimal ${isScrolled ? 'scrolled' : ''}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 20 }}
            >
                <div className="nav-container">
                    <motion.div
                        className="logo"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <span className="kanji-logo">鮨</span>
                        <span className="logo-text">TETSU</span>
                        <motion.div
                            className="logo-underline"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.5 }}
                        />
                    </motion.div>

                    <div className="nav-menu">
                        <div className="nav-dots">
                            {['philosophy', 'menu', 'omakase', 'book'].map((item, i) => (
                                <motion.div
                                    key={item}
                                    className="nav-dot"
                                    whileHover={{ scale: 1.5 }}
                                    onClick={() => scrollToSection(item)}
                                    animate={{
                                        opacity: isScrolled ? 1 : 0.5,
                                        scale: isScrolled ? 1 : 0.8
                                    }}
                                />
                            ))}
                        </div>
                        <motion.button
                            className="reservation-btn"
                            whileHover={{ scale: 1.05, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => scrollToSection('book')}
                        >
                            <span className="btn-text">Book a Table</span>
                            <motion.span
                                className="btn-arrow"
                                animate={{ x: [0, 3, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                →
                            </motion.span>
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            <motion.header
                className="hero-parallax"
                ref={heroRef}
                style={{ scale, rotateX }}
            >
                <motion.div
                    className="hero-bg-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ duration: 2 }}
                />

                <div className="hero-content-wrapper">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="hero-main"
                    >
                        <motion.div
                            className="kanji-hero"
                            animate={{
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            鮨
                        </motion.div>

                        <motion.div
                            className="title-container"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, delay: 0.3 }}
                        >
                            <h1 className="hero-title-glitch">
                                <span className="glitch" data-text="TETSU">TETSU</span>
                                <span className="subtitle">Edomae Sushi Experience</span>
                            </h1>
                        </motion.div>

                        <motion.div
                            className="hero-info"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            <div className="info-line">
                                <span>Ⓙ C L E R K E N W E L L</span>
                                <div className="dot-separator">•</div>
                                <span>Ⓣ 19:00 - 23:00</span>
                                <div className="dot-separator">•</div>
                                <span>Ⓢ 7 Seats Only</span>
                            </div>
                        </motion.div>

                        <motion.div
                            className="scroll-indicator"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            onClick={() => scrollToSection('philosophy')}
                        >
                            <div className="scroll-line"></div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.header>

            <section id="philosophy" className="philosophy-section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">
                            <span className="title-number">01</span>
                            <span className="title-text">The Philosophy</span>
                        </h2>
                        <div className="title-line"></div>
                    </motion.div>

                    <div className="philosophy-grid">
                        <motion.div
                            className="philosophy-card"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                        >
                            <div className="card-icon">季</div>
                            <h3>Seasonal</h3>
                            <p>Each piece reflects the current season, sourced from Japan's morning markets.</p>
                        </motion.div>

                        <motion.div
                            className="philosophy-card"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                        >
                            <div className="card-icon">技</div>
                            <h3>Technique</h3>
                            <p>Decades of mastery in shari preparation and neta handling.</p>
                        </motion.div>

                        <motion.div
                            className="philosophy-card"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                        >
                            <div className="card-icon">心</div>
                            <h3>Mindfulness</h3>
                            <p>Every movement, from knife to plate, is performed with intention.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section id="menu" className="menu-section" style={{ padding: '40px 0 60px 0', overflow: 'hidden' }}>
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ marginBottom: '60px' }}
                    >
                        <h2 className="section-title">
                            <span className="title-number">02</span>
                            <span className="title-text">Featured Selection</span>
                        </h2>
                        <div className="title-line"></div>
                    </motion.div>

                    <div className="carousel-inner" style={{
                        position: 'relative',
                        height: '500px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'visible',
                        maxWidth: '1000px',
                        margin: '0 auto',
                        transform: 'translateY(-150px) translateX(-150px)'
                    }}>
                        <AnimatePresence mode="popLayout">
                            {filteredMenu.map((item, index) => {
                                const isCenter = index === activeIndex;
                                const isLeft = index === (activeIndex - 1 + filteredMenu.length) % filteredMenu.length;
                                const isRight = index === (activeIndex + 1) % filteredMenu.length;

                                if (!isCenter && !isLeft && !isRight) return null;

                                return (
                                    <motion.div
                                        key={item.id}
                                        className={`carousel-card-3d ${!isCenter ? 'clickable-side-card' : ''}`}
                                        style={{
                                            position: 'absolute',
                                            cursor: isCenter ? 'default' : 'pointer',
                                            width: '300px',
                                            height: '400px'
                                        }}
                                        onClick={() => {
                                            if (isLeft) prevSlide();
                                            if (isRight) nextSlide();
                                        }}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{
                                            opacity: isCenter ? 1 : 0.5,
                                            scale: isCenter ? 1 : 0.7,
                                            x: isLeft ? -320 : isRight ? 320 : 0,
                                            y: isCenter ? -30 : -10,
                                            zIndex: isCenter ? 10 : 1,
                                            rotateY: isLeft ? 25 : isRight ? -25 : 0,
                                        }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                        onHoverStart={() => setHoveredItem(index)}
                                        onHoverEnd={() => setHoveredItem(null)}
                                    >
                                        <div className="card-3d-content" style={{
                                            background: 'transparent',
                                            borderRadius: '20px',
                                            padding: '40px 30px',
                                            border: '1px solid rgba(255, 255, 255, 0.15)',
                                            backdropFilter: 'blur(10px)',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                        }}>
                                            <motion.div
                                                style={{
                                                    width: '140px',
                                                    height: '140px',
                                                    marginBottom: '25px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                                                }}
                                                animate={{
                                                    scale: hoveredItem === index ? 1.15 : 1
                                                }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <img
                                                    src={item.img}
                                                    alt={item.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain',
                                                        borderRadius: '10px'
                                                    }}
                                                />
                                            </motion.div>
                                            <div className="card-3d-info" style={{ width: '100%' }}>
                                                <h3 style={{
                                                    fontSize: '26px',
                                                    fontWeight: '300',
                                                    marginBottom: '12px',
                                                    color: '#fff',
                                                    letterSpacing: '0.5px'
                                                }}>{item.name}</h3>
                                                <p style={{
                                                    fontSize: '14px',
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                    marginBottom: '18px',
                                                    lineHeight: '1.5'
                                                }}>{item.desc}</p>
                                                <div style={{
                                                    fontSize: '22px',
                                                    fontWeight: '400',
                                                    color: '#D4AF37',
                                                    letterSpacing: '1px'
                                                }}>{item.price}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            <section id="omakase" className="omakase-section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">
                            <span className="title-number">03</span>
                            <span className="title-text">Omakase Experience</span>
                        </h2>
                        <div className="title-line"></div>
                    </motion.div>

                    <div className="omakase-grid">
                        {omakaseSets.map((set, index) => (
                            <motion.div
                                key={set.name}
                                className="omakase-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="omakase-header">
                                    <h3>{set.name}</h3>
                                    <div className="omakase-price">{set.price}</div>
                                </div>
                                <div className="omakase-details">
                                    <span>{set.items} pieces</span>
                                    <p>{set.desc}</p>
                                </div>
                                <motion.button
                                    className="select-btn"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Select Set
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="book" className="reservation-section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">
                            <span className="title-number">04</span>
                            <span className="title-text">Make a Reservation</span>
                        </h2>
                        <div className="title-line"></div>
                    </motion.div>

                    <div className="reservation-wrapper">
                        <motion.div
                            className="reservation-form"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <form onSubmit={handleReservationSubmit}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={reservationData.name}
                                            onChange={(e) => setReservationData({...reservationData, name: e.target.value})}
                                            placeholder="Your full name"
                                            required
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={reservationData.email}
                                            onChange={(e) => setReservationData({...reservationData, email: e.target.value})}
                                            placeholder="your@email.com"
                                            required
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={reservationData.phone}
                                            onChange={(e) => setReservationData({...reservationData, phone: e.target.value})}
                                            placeholder="+44 1234 567890"
                                            required
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="guests">Number of Guests *</label>
                                        <select
                                            id="guests"
                                            value={reservationData.guests}
                                            onChange={(e) => setReservationData({...reservationData, guests: parseInt(e.target.value)})}
                                            className="form-input"
                                            required
                                        >
                                            <option value="1">1 person</option>
                                            <option value="2">2 people</option>
                                            <option value="3">3 people</option>
                                            <option value="4">4 people</option>
                                            <option value="5">5 people</option>
                                            <option value="6">6 people</option>
                                            <option value="7">7 people</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="date">Date *</label>
                                        <input
                                            type="date"
                                            id="date"
                                            value={reservationData.date}
                                            onChange={(e) => setReservationData({...reservationData, date: e.target.value})}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="time">Time *</label>
                                        <select
                                            id="time"
                                            value={reservationData.time}
                                            onChange={(e) => setReservationData({...reservationData, time: e.target.value})}
                                            className="form-input"
                                            required
                                        >
                                            {timeSlots.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Special Requests</label>
                                    <textarea
                                        id="message"
                                        value={reservationData.message}
                                        onChange={(e) => setReservationData({...reservationData, message: e.target.value})}
                                        placeholder="Any dietary restrictions, allergies, or special occasions..."
                                        className="form-textarea"
                                        rows="4"
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    className="submit-reservation"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span>Book Reservation</span>
                                    <motion.div
                                        className="reservation-arrow"
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    >
                                        ↗
                                    </motion.div>
                                </motion.button>

                                <p className="form-note">
                                    * Required fields. We'll contact you within 24 hours to confirm your reservation.
                                </p>
                            </form>
                        </motion.div>

                        <motion.div
                            className="reservation-info"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="info-card">
                                <div className="info-header">
                                    <h3>Reservation Details</h3>
                                    <div className="info-icon">📋</div>
                                </div>

                                <div className="info-content">
                                    <div className="info-item">
                                        <div className="info-label">Hours</div>
                                        <div className="info-value">19:00 - 23:00</div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-label">Capacity</div>
                                        <div className="info-value">7 seats per session</div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-label">Duration</div>
                                        <div className="info-value">2-hour omakase experience</div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-label">Cancellation</div>
                                        <div className="info-value">24 hours notice required</div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-label">Dress Code</div>
                                        <div className="info-value">Smart casual</div>
                                    </div>
                                </div>

                                <div className="contact-details">
                                    <h4>Contact Information</h4>
                                    <div className="contact-item">
                                        <span className="contact-icon">📍</span>
                                        <span>42 Sushi Lane, Clerkenwell, London EC1R 4RP</span>
                                    </div>
                                    <div className="contact-item">
                                        <span className="contact-icon">Ⓣ</span>
                                        <span>0207 123 4567</span>
                                    </div>
                                    <div className="contact-item">
                                        <span className="contact-icon">📧</span>
                                        <span>reservations@sushitetsu.co.uk</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <footer className="main-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-logo">
                            <span className="kanji-footer">鮨</span>
                            <span className="footer-text">TETSU</span>
                        </div>

                        <div className="footer-links">
                            <a href="https://www.instagram.com/p/2t6RPFiUd7/?hl=fr">Instagram</a>
                        </div>

                        <div className="footer-credit">
                            <p>© 2024 Sushi Tetsu. Crafted in London.</p>
                            <p>Served with intention.</p>
                            <p>made by M.Mehdi.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
//life sucks lmao
export default App;