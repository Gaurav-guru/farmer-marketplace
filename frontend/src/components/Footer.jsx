import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" style={{ backgroundColor: '#f8f9fa', padding: '1rem 0'  ,textAlign:'center'}}>
      <div className="container ">
        <div className="footer-content d-flex">
         

          <div className="footer-links d-flex gap-5">
            <Link to="/about" className="footer-link" style={{ color: '#007bff', textDecoration: 'none',padding:'10px' }}>
              About Us
            </Link>
            <Link to="/contact" className="footer-link" style={{ color: '#007bff', textDecoration: 'none' ,padding:'10px'}}>
              Contact
            </Link>
            <Link to="/privacy" className="footer-link" style={{ color: '#007bff', textDecoration: 'none' ,padding:'10px'}}>
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="text-center mt-3" style={{ color: '#6c757d', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} Farmer's Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
