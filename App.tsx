import React, { useState } from 'react';
import Header from './components/Header';
import OptionSelector from './components/OptionSelector';
import ImageUploader from './components/ImageUploader';
import ImageGrid from './components/ImageGrid';
import Modal from './components/Modal';
import { generateMidAutumnImages } from './services/geminiService';
import { KID_PROMPT_OPTIONS, ADULT_PROMPT_OPTIONS, ASPECT_RATIO_OPTIONS, QUALITY_OPTIONS } from './constants';
import type { Option } from './types';

const App: React.FC = () => {
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [sourceImagePreview, setSourceImagePreview] = useState<string | null>(null);
  const [activeConceptTab, setActiveConceptTab] = useState<'kids' | 'adults'>('kids');
  const [selectedPrompt, setSelectedPrompt] = useState<Option>(KID_PROMPT_OPTIONS[0]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<Option>(ASPECT_RATIO_OPTIONS[0]);
  const [selectedQuality, setSelectedQuality] = useState<Option>(QUALITY_OPTIONS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [poseModificationPrompt, setPoseModificationPrompt] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedModalImage, setSelectedModalImage] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSourceImageFile(file);
    setSourceImagePreview(URL.createObjectURL(file));
  };

  const handleConceptTabChange = (tab: 'kids' | 'adults') => {
    setActiveConceptTab(tab);
    if (tab === 'kids') {
      setSelectedPrompt(KID_PROMPT_OPTIONS[0]);
    } else {
      setSelectedPrompt(ADULT_PROMPT_OPTIONS[0]);
    }
  };

  const handleGenerateClick = async () => {
    if (!sourceImageFile) {
      setError('Vui lòng chọn một ảnh để bắt đầu.');
      return;
    }

    let finalPrompt: Option;

    if (customPrompt.trim()) {
      // If user writes a full custom prompt, it overrides everything else
      finalPrompt = { 
        id: 'custom', 
        label: 'Custom Prompt', 
        value: customPrompt.trim() 
      };
    } else {
      // Otherwise, use the selected concept and add modifications if any
      let modifiedPromptValue = selectedPrompt.value;
      if (poseModificationPrompt.trim()) {
        modifiedPromptValue += `\n\nAdditionally, apply this modification to the pose or action: ${poseModificationPrompt.trim()}.`;
      }
      finalPrompt = {
        id: selectedPrompt.id,
        label: selectedPrompt.label,
        value: modifiedPromptValue,
      };
    }
      
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    try {
      const images = await generateMidAutumnImages(sourceImageFile, finalPrompt, selectedAspectRatio.value, selectedQuality.value);
      setGeneratedImages(images);
      if (images.length === 0) {
        setError('Không thể tạo ảnh. Vui lòng thử lại với ảnh khác hoặc tùy chỉnh khác.');
      }
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const openModal = (image: string) => {
    setSelectedModalImage(image);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedModalImage(null);
  }

  const ConceptIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  const CustomPromptIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
  );

  const AspectRatioIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );

  const QualityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const PoseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className="min-h-screen text-gray-800">
      <main className="container mx-auto px-4 py-8">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
          {/* Left Panel: Controls */}
          <div className="bg-white/70 backdrop-blur-lg border border-white/30 p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-pink-400 pb-2 text-gray-700">Tạo ảnh theo concept</h2>
            <ImageUploader onFileSelect={handleFileSelect} previewUrl={sourceImagePreview} />
            
            <div className="mb-4">
              <div className="flex border-b-2 border-pink-200">
                <button
                  onClick={() => handleConceptTabChange('kids')}
                  className={`flex-1 py-2 text-center font-semibold rounded-t-lg transition-colors duration-300 ${
                    activeConceptTab === 'kids' ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-pink-100'
                  }`}
                >
                  Concept Trẻ Em
                </button>
                <button
                  onClick={() => handleConceptTabChange('adults')}
                  className={`flex-1 py-2 text-center font-semibold rounded-t-lg transition-colors duration-300 ${
                    activeConceptTab === 'adults' ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-pink-100'
                  }`}
                >
                  Concept Người Lớn
                </button>
              </div>
            </div>

            <OptionSelector 
              title="Chọn Concept Có Sẵn" 
              options={activeConceptTab === 'kids' ? KID_PROMPT_OPTIONS : ADULT_PROMPT_OPTIONS} 
              selectedOption={selectedPrompt} 
              onSelect={setSelectedPrompt}
              icon={<ConceptIcon />}
            />

            <div className="my-4">
              <label htmlFor="pose-modification" className="text-lg font-semibold mb-3 flex items-center gap-2 text-pink-600">
                <PoseIcon />
                Tùy chỉnh thêm về dáng (tùy chọn)
              </label>
              <textarea
                id="pose-modification"
                value={poseModificationPrompt}
                onChange={(e) => setPoseModificationPrompt(e.target.value)}
                placeholder="Ví dụ: đang mỉm cười, góc mặt nghiêng, tay cầm một bông hoa..."
                rows={2}
                className="w-full bg-pink-50 border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-gray-800 placeholder-gray-400"
              />
            </div>

            <div className="my-6">
              <label htmlFor="custom-prompt" className="text-lg font-semibold mb-3 flex items-center gap-2 text-pink-600">
                <CustomPromptIcon />
                Hoặc viết câu lệnh theo ý muốn
              </label>
              <textarea
                id="custom-prompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Mô tả ảnh bạn muốn tạo... (Nếu điền, các lựa chọn bên trên sẽ được bỏ qua)"
                rows={3}
                className="w-full bg-pink-50 border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-gray-800 placeholder-gray-400"
              />
            </div>
            
            <div className="mt-6">
              <OptionSelector 
                title="Chọn Tỷ Lệ Ảnh"
                options={ASPECT_RATIO_OPTIONS}
                selectedOption={selectedAspectRatio}
                onSelect={setSelectedAspectRatio}
                icon={<AspectRatioIcon />}
              />
            </div>

            <div className="mt-6">
              <OptionSelector 
                title="Chọn Chất Lượng Ảnh"
                options={QUALITY_OPTIONS}
                selectedOption={selectedQuality}
                onSelect={setSelectedQuality}
                icon={<QualityIcon />}
              />
            </div>
            
            <button
              onClick={handleGenerateClick}
              disabled={isLoading || !sourceImageFile}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 px-6 rounded-lg text-lg
               hover:from-pink-600 hover:to-rose-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
               flex items-center justify-center gap-2 shadow-lg hover:shadow-pink-500/50 mt-4"
            >
              {isLoading ? 'Đang xử lý...' : '✨ Tạo ảnh ngay ✨'}
            </button>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>
          
          {/* Right Panel: Results */}
          <div className="bg-white/70 backdrop-blur-lg border border-white/30 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[400px] lg:min-h-full">
            <div className="w-full flex-grow flex items-center justify-center">
              <ImageGrid images={generatedImages} isLoading={isLoading} onImageClick={openModal} />
            </div>
            <a
              href="https://zalo.me/g/ezvvls050"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center text-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 px-6 rounded-full transition-transform duration-300 hover:scale-105 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.523 5.754 19 7.5 19s3.332-.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19s-3.332-.477-4.5-1.253" />
              </svg>
              học thêm thật nhiều về kiếm tiền từ APP AI tại đây
            </a>
          </div>
        </div>
      </main>
      <Modal isOpen={isModalOpen} onClose={closeModal} imageUrl={selectedModalImage} />
    </div>
  );
};

export default App;