import React from 'react';
import Spinner from './Spinner';

interface ImageGridProps {
  images: string[];
  isLoading: boolean;
  onImageClick: (image: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, isLoading, onImageClick }) => {
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center bg-transparent rounded-lg p-8">
        <Spinner />
        <p className="mt-4 text-pink-500 text-center">AI đang vẽ, xin chờ trong giây lát...</p>
        <p className="text-sm text-gray-500 mt-2 text-center">Quá trình này có thể mất đến một phút.</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center bg-transparent rounded-lg p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700">Kết quả sẽ hiện ở đây</h3>
        <p className="text-gray-500 mt-2">Tải ảnh lên và chọn tùy chỉnh để bắt đầu tạo ảnh Trung Thu của riêng bạn!</p>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-2 gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative group aspect-square cursor-pointer"
          onClick={() => onImageClick(image)}
        >
          <img
            src={image}
            alt={`Generated result ${index + 1}`}
            className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;