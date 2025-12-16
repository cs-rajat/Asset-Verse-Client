import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-neutral text-neutral-content pt-10 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-3xl font-bold font-heading flex items-center gap-2 tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            <span className="text-4xl mr-1">💎</span> Asset<span className="text-primary">Verse</span>
                        </Link>
                        <p className="mt-4 text-sm opacity-80">
                            Simplifying asset management for modern businesses. Track, request, and manage assets with ease.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="footer-title text-lg opacity-100 font-heading">Product</h3>
                        <div className="flex flex-col gap-2 opacity-80">
                            <Link to="/" className="hover:text-primary transition-colors">Features</Link>
                            <Link to="/" className="hover:text-primary transition-colors">Pricing</Link>
                            <Link to="/" className="hover:text-primary transition-colors">Testimonials</Link>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="footer-title text-lg opacity-100 font-heading">Company</h3>
                        <div className="flex flex-col gap-2 opacity-80">
                            <Link to="/" className="hover:text-primary transition-colors">About Us</Link>
                            <Link to="/" className="hover:text-primary transition-colors">Careers</Link>
                            <Link to="/" className="hover:text-primary transition-colors">Contact</Link>
                            <Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        </div>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h3 className="footer-title text-lg opacity-100 font-heading">Contact Us</h3>
                        <div className="flex flex-col gap-3 opacity-80 text-sm">
                            <p className="flex items-center gap-2">
                                📧 <a href="mailto:support@assetverse.com" className="hover:text-primary">support@assetverse.com</a>
                            </p>
                            <p className="flex items-center gap-2">
                                📞 <a href="tel:+8801710440718" className="hover:text-primary">01710440718</a>
                            </p>
                            <p className="flex items-center gap-2">
                                📍 Dhaka Bangladesh
                            </p>
                        </div>
                    </div>
                </div>

                <div className="divider divider-neutral my-8 opacity-20"></div>

                <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-60">
                    <p>© 2025 AssetVerse Inc. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></a>
                        <a href="#" className="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
