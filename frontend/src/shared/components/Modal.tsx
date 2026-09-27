import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/70 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-md border border-outline-variant/40 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-4">
          <h3 className="font-fraunces text-xl text-forest font-normal">{title}</h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-forest text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
