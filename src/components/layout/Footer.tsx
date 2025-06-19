import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} FuturesFlow. All rights reserved.</p>
                <nav className="footer-nav" aria-label="Footer navigation">
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

// If it was default export: export default Footer;
// Keeping it as named export for consistency with other components.
