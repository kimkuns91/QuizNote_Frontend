'use client';

import { useEffect, useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import FileUploadModal from './FileUploadModal';
import UrlUploadModal from './UrlUploadModal';
import { useModalStore } from '@/store/modalStore';

export const ModalProvider = () => {
  const { isOpen, modalType } = useModalStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && modalType === 'fileUpload' && <FileUploadModal />}
      {isOpen && modalType === 'urlUpload' && <UrlUploadModal />}
    </AnimatePresence>
  );
}; 