import { useWindowSize } from '@utils/hooks/useWindowSize';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import QRCode from 'react-qr-code';

const QRModal = (props: {
  url: string;
  setQrCodeZoom: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const [width, height] = useWindowSize();

  const { url, setQrCodeZoom } = props;
  const size = Math.min(520, width - width * 0.17, height - height * 0.17);
  return (
    <motion.main
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.15 }}
          key="modal"
          className="absolute top-0 left-0 w-screen h-screen z-200 backdrop-filter backdrop-blur-sm flex items-center overflow-hidden"
          onClick={() => {
            setQrCodeZoom(false);
          }}
        >
          <div className="m-auto bg-white p-4 rounded-2xl shadow-custom">
            <QRCode value={url} size={size} level="M" />
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.main>
  );
};

export default QRModal;
