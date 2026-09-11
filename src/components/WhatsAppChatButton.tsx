import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_URL = 'https://wa.me/917520123555?text=Hello';

type WhatsAppChatButtonProps = {
  liftAboveTicker?: boolean;
};

const WhatsAppChatButton = ({ liftAboveTicker = false }: WhatsAppChatButtonProps) => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed right-4 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:bg-[#1ebe57] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ${
        liftAboveTicker ? 'bottom-16' : 'bottom-6'
      }`}
    >
      <FaWhatsapp className="h-8 w-8" />
    </a>
  );
};

export default WhatsAppChatButton;
