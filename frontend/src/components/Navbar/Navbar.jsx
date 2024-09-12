import React,{useEffect} from 'react'
import './Navbar.css'
import logob from '../../assets/logob.png'
const Navbar = () => {
    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector('.header');
            const logo = document.querySelector('.logo');
            const navLinks = document.querySelectorAll('.nav a');

            if (window.scrollY > 50) { // Adjust the scroll value as needed
                header.classList.add('scrolled');
                logo.classList.add('scrolled');
                navLinks.forEach(link => link.classList.add('scrolled'));
            } else {
                header.classList.remove('scrolled');
                logo.classList.remove('scrolled');
                navLinks.forEach(link => link.classList.remove('scrolled'));
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


  return (
    <header className="header">
        <a href='/' className="logo">
                <img src={logob} alt="Tour Mate Logo" className="logo-image" />
            </a>

        <nav className="nav">
            <a href='/'>Home</a>
            <a href='/'>Tours</a>
            <a href='/'>About me</a>
            <a href='/'>Contact me</a>
        </nav>
        <button className="signin-btn">SIGN IN</button>
    </header>
  )
}

export default Navbar