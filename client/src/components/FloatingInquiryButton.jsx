import { useState, useEffect } from 'react';
import Modal from './Modal';
import InquiryForm from './InquiryForm';

export default function FloatingInquiryButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Always visible logic
    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-secondary-500 hover:text-primary-950 text-white p-4 rounded-full shadow-2xl transform transition-all hover:scale-110 active:scale-95 animate-bounce-in md:hidden"
                aria-label="Inquire Now"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="sr-only">Inquire</span>
            </button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Send an Inquiry"
                maxWidth="max-w-4xl"
            >
                <InquiryForm embedded={true} />
            </Modal>
        </>
    );
}
