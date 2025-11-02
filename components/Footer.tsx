
import React from 'react';
import { ZALO_COMMUNITY_LINK } from '../constants';

const ZaloIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.5 3.5H3.5C3.22386 3.5 3 3.72386 3 4V20C3 20.2761 3.22386 20.5 3.5 20.5H20.5C20.7761 20.5 21 20.2761 21 20V4C21 3.72386 20.7761 3.5 20.5 3.5Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12.5H12" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.5 10.5C15.5 11.8807 14.3807 13 13 13H9V10.5C9 9.11929 10.1193 8 11.5 8C12.8807 8 14 9.11929 14 10.5C14 11.2956 14.7956 12 15.5 12C16.2044 12 17 11.2044 17 10.5C17 8.567 15.433 7 13.5 7C11.567 7 10 8.567 10 10.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-8 px-4 mt-8">
      <a
        href={ZALO_COMMUNITY_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 px-6 rounded-full transition-transform duration-300 hover:scale-105 shadow-lg"
      >
        <ZaloIcon />
        Tham gia Nhóm học làm ảnh AI
      </a>
      <p className="mt-4 text-sm text-gray-500">© 2024 Do Dai Trang. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;