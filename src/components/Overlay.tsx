import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { ReactNode, MouseEvent } from "react";

type IOverlay = {
  overlayClickHandler?: (showOverlay?: boolean) => void;
  showOverlay: boolean;
  children?: ReactNode;
  minHeight?: string;
};

const Overlay = ({
  overlayClickHandler,
  showOverlay,
  children,
  minHeight = "100vh",
}: IOverlay) => {
  return createPortal(
    <motion.section
      initial={{ y: "-140vh" }}
      animate={{ y: showOverlay ? "0" : "-" + minHeight }}
      transition={{ type: "tween", duration: 0.5 }}
      className={`absolute top-0 left-0 w-screen bg-black/80 z-[999]`}
      style={{ height: minHeight }}
      onClick={(e: MouseEvent) => {
        
        e.stopPropagation();
        overlayClickHandler?.(false);
      }}
    >
      {children}
    </motion.section>,
    document.body
  );
};

export default Overlay;
