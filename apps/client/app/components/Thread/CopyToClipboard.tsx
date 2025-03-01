import { type ReactNode } from 'react';

interface CopyToClipboardProps {
  text: string;
  onCopy?: () => void;
  children: ReactNode;
}

const CopyToClipboard = ({ text, onCopy, children }: CopyToClipboardProps) => {
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      onCopy?.();
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return <div onClick={handleClick}>{children}</div>;
};

export default CopyToClipboard;
