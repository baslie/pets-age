'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  TwitterShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  VKShareButton,
  TwitterIcon,
  FacebookIcon,
  WhatsappIcon,
  TelegramIcon,
  VKIcon,
} from 'next-share';
import { motion, AnimatePresence } from 'framer-motion';
import { trackShare } from '@/lib/analytics';

interface ShareButtonsProps {
  dogAge: number;
  humanAge: number;
}

const SHARE_URL = 'https://truedogage.com';
const ICON_SIZE = 40;

export default function ShareButtons({ dogAge, humanAge }: ShareButtonsProps) {
  const t = useTranslations('share');
  const [showCopied, setShowCopied] = useState(false);

  const shareText = t('text', {
    dogAge: dogAge.toFixed(1),
    humanAge: Math.round(humanAge),
  });

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setShowCopied(true);
      trackShare('copy_link');
      setTimeout(() => setShowCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = SHARE_URL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopied(true);
      trackShare('copy_link');
      setTimeout(() => setShowCopied(false), 2000);
    }
  }, []);

  const handleShare = useCallback((platform: string) => {
    trackShare(platform);
  }, []);

  return (
    <div className="mt-6 pt-6 border-t-2 border-border">
      <p className="text-sm font-bold text-foreground/70 mb-3 text-center">
        {t('title')}
      </p>
      <div className="flex items-center justify-center gap-3 relative">
        <TwitterShareButton
          url={SHARE_URL}
          title={shareText}
          onClick={() => handleShare('twitter')}
        >
          <div className="rounded-full border-2 border-border shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all overflow-hidden">
            <TwitterIcon size={ICON_SIZE} round />
          </div>
        </TwitterShareButton>

        <FacebookShareButton
          url={SHARE_URL}
          quote={shareText}
          onClick={() => handleShare('facebook')}
        >
          <div className="rounded-full border-2 border-border shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all overflow-hidden">
            <FacebookIcon size={ICON_SIZE} round />
          </div>
        </FacebookShareButton>

        <WhatsappShareButton
          url={SHARE_URL}
          title={shareText}
          onClick={() => handleShare('whatsapp')}
        >
          <div className="rounded-full border-2 border-border shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all overflow-hidden">
            <WhatsappIcon size={ICON_SIZE} round />
          </div>
        </WhatsappShareButton>

        <TelegramShareButton
          url={SHARE_URL}
          title={shareText}
          onClick={() => handleShare('telegram')}
        >
          <div className="rounded-full border-2 border-border shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all overflow-hidden">
            <TelegramIcon size={ICON_SIZE} round />
          </div>
        </TelegramShareButton>

        <VKShareButton
          url={SHARE_URL}
          title={shareText}
          onClick={() => handleShare('vk')}
        >
          <div className="rounded-full border-2 border-border shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all overflow-hidden">
            <VKIcon size={ICON_SIZE} round />
          </div>
        </VKShareButton>

        <button
          onClick={handleCopyLink}
          className="w-10 h-10 rounded-full border-2 border-border bg-gray-200 shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center cursor-pointer"
          aria-label="Copy link"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>

        {/* Toast notification */}
        <AnimatePresence>
          {showCopied && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-1 rounded-base text-sm font-bold whitespace-nowrap border-2 border-border"
            >
              {t('copied')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
