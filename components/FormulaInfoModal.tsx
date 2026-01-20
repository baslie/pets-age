'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Button } from '@/components/ui/button';

interface FormulaInfoModalProps {
  children?: ReactNode;
}

export default function FormulaInfoModal({ children }: FormulaInfoModalProps) {
  const t = useTranslations('formulaModal');
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Needed for SSR - Portal can only render after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  // Render LaTeX formula
  const formulaHtml = katex.renderToString('H = 16 \\cdot \\ln(D) + 31', {
    throwOnError: false,
    displayMode: true,
  });

  // Default trigger (question mark button) or custom children
  const trigger = children ? (
    <span onClick={handleOpen} className="cursor-pointer">
      {children}
    </span>
  ) : (
    <button
      onClick={handleOpen}
      className="inline-flex items-center justify-center w-5 h-5 ml-1.5 rounded-full bg-main border-2 border-border text-xs font-bold text-main-foreground cursor-pointer hover:scale-110 transition-transform align-middle"
      aria-label={t('ariaLabel')}
      type="button"
    >
      ?
    </button>
  );

  return (
    <>
      {trigger}

      {/* Modal rendered via Portal to avoid nesting issues */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={handleClose}
                aria-hidden="true"
              />

              {/* Modal content */}
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              >
                <div
                  className="bg-secondary-background border-2 border-border shadow-shadow rounded-base p-6 w-full max-w-[calc(100vw-2rem)] sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="formula-modal-title"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <h2 id="formula-modal-title" className="font-bold text-xl mb-4">
                    {t('title')}
                  </h2>

                  {/* Content */}
                  <div className="space-y-4 text-sm">
                    <p className="text-foreground/80">{t('intro')}</p>

                    <p className="font-bold text-foreground">{t('mythBuster')}</p>

                    {/* Formula */}
                    <div className="bg-background border-2 border-border rounded-base p-4 my-4">
                      <div
                        dangerouslySetInnerHTML={{ __html: formulaHtml }}
                        className="text-center"
                      />
                      <p className="text-xs text-foreground/60 text-center mt-2">
                        {t('formulaExplanation')}
                      </p>
                    </div>

                    {/* Examples */}
                    <div>
                      <p className="font-bold mb-2">{t('examplesTitle')}</p>
                      <ul className="space-y-1 text-foreground/80">
                        <li>{t('example1')}</li>
                        <li>{t('example2')}</li>
                        <li>{t('example3')}</li>
                        <li>{t('example4')}</li>
                      </ul>
                    </div>

                    {/* Sources */}
                    <div className="pt-2 border-t border-border/50">
                      <p className="font-bold mb-2">{t('sourcesTitle')}</p>
                      <a
                        href="https://doi.org/10.1016/j.cels.2020.06.006"
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="text-main hover:underline text-sm cursor-pointer"
                      >
                        {t('sourceLink')}
                      </a>
                      <p className="text-xs text-foreground/60 mt-1">
                        {t('sourcePaperTitle')}
                      </p>
                    </div>
                  </div>

                  {/* Close button */}
                  <Button
                    onClick={handleClose}
                    variant="default"
                    className="mt-6 px-8 mx-auto block"
                  >
                    {t('close')}
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
