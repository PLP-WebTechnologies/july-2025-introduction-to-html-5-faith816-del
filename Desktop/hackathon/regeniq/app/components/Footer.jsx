"use client";

import { Leaf, HelpCircle, Info, Shield, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#e6e9da] text-[#01411C] mt-16 shadow-inner">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo / About */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Leaf className="w-5 h-5 text-[#01411C]" />
            <h2 className="font-bold text-lg">RegenIQ</h2>
          </div>
          <p className="text-sm leading-relaxed">
            RegenIQ empowers farmers with real-time soil and weather insights
            to improve productivity through regenerative, data-driven farming.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-md mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="flex items-center space-x-2 hover:text-[#800020] transition">
                <Info size={16} /> <span>About Us</span>
              </Link>
            </li>
            <li>
              <Link href="/help" className="flex items-center space-x-2 hover:text-[#800020] transition">
                <HelpCircle size={16} /> <span>Help Center</span>
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="flex items-center space-x-2 hover:text-[#800020] transition">
                <Shield size={16} /> <span>Privacy Policy</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-md mb-3">Contact</h3>
          <p className="flex items-center space-x-2 text-sm mb-2">
            <Mail size={16} /> <span>care@regeniq.com</span>
          </p>
          <p className="text-sm">Nairobi, Kenya</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#c2cfb2] text-[#01411C] py-3 text-center text-xs border-t border-[#9caf88]/30">
        © 2025 <strong>RegenIQ</strong> | Growing Smarter with Nature 🌿
      </div>
    </footer>
  );
}
