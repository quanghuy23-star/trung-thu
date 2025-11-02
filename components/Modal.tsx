import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen || !imageUrl) return null;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    const mimeType = imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';'));
    const extension = mimeType.split('/')[1] || 'png';
    link.download = `anh-dep-trung-thu-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Enlarged view" className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
             <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-pink-500 text-white font-bold py-2 px-5 rounded-full transition-transform duration-300 hover:scale-105 shadow-lg"
              aria-label="Download image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              <span>Tải về</span>
            </button>
        </div>
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold hover:bg-pink-700 transition"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;