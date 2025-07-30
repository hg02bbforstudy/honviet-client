import React from 'react';
import { MessageCircle } from 'lucide-react';

const PAGE_ID = '61573071584469'; // Thay bằng page id thật của bạn
const FB_MESSENGER_LINK = `https://m.me/${PAGE_ID}`;
const FB_MESSENGER_APP = `fb-messenger://user-thread/${PAGE_ID}`;
const FB_PAGE_MESSAGES = `https://www.facebook.com/messages/t/${PAGE_ID}?ref=page_internal`;

function openMessenger() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = FB_MESSENGER_APP;
    setTimeout(() => {
      window.open(FB_MESSENGER_LINK, '_blank');
    }, 800);
  } else {
    window.open(FB_PAGE_MESSAGES, '_blank');
  }
}

export default function MessengerFab() {
  return (
    <button
      onClick={openMessenger}
      aria-label="Liên hệ Facebook Messenger"
      className="fixed bottom-2 right-2 z-40 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
      style={{ boxShadow: '0 2px 8px #0003' }}
    >
      <span className="sr-only">Liên hệ qua Facebook Messenger</span>
      <MessageCircle className="w-7 h-7" />
    </button>
  );
}
