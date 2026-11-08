/**
 * Drawer.jsx
 * 
 * Reusable Slide-Over Drawer Component.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. PURPOSE:
 *    Drawers are slide-out panels used for creating or editing entities (Add Lead,
 *    Add Follow-up, Schedule Meeting, Add Organization) without navigating away
 *    from the current list page.
 * 
 * 2. KEYBOARD & ACCESSIBILITY:
 *    - `Escape` key automatically triggers `onClose`.
 *    - Tapping the dark backdrop triggers `onClose`.
 *    - `role="dialog"` and `aria-modal="true"` provide screen-reader accessibility.
 * 
 * 3. COMPOSITION PATTERN:
 *    Rather than hardcoding form fields inside this drawer, it acts as a generic
 *    shell that accepts `children` and an optional `footer`.
 */

import { useEffect, isValidElement } from "react";
import { X } from "lucide-react";

export default function Drawer({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  children,
  footer,
  maxWidth = "max-w-[620px]",
}) {
  // Listen for Escape key to close the drawer
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Don't render anything if the drawer is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
        aria-label="Close backdrop"
      />

      {/* Slide-out Panel */}
      <div
        className={`relative flex h-full w-full ${maxWidth} flex-col bg-white shadow-2xl z-10 animate-in slide-in-from-right duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4.5">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                {isValidElement(Icon) ? Icon : <Icon size={20} />}
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
              {description && (
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="border-t border-gray-200 bg-gray-50/50 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

