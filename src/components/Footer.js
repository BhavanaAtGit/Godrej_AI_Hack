import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-[#9A9A9A] py-6 mt-10">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <a href="/contact" className="text-white mr-4">Contact</a>
          <a href="/about" className="text-white mr-4">About</a>
          <a href="/terms" className="text-white mr-4">Terms</a>
        </div>
        <div className="mb-4">
          <a href="#" className="mr-4">Facebook</a>
          <a href="#" className="mr-4">Twitter</a>
          <a href="#">LinkedIn</a>
        </div>
        <div>
          © 2024 Godrej AI - All rights reserved.
        </div>
      </div>
    </footer>
  );
}
