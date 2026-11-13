import { useEffect } from 'react';

/**
 * Custom hook to listen for hotkeys (e.g., 'ctrl+k', 'meta+k', 'escape', '?')
 * @param {string} keyCombo e.g. 'k', 'escape', '?'
 * @param {Function} callback
 * @param {Object} options { ctrlOrMeta: boolean }
 */
export function useHotkeys(keyCombo, callback, options = {}) {
  useEffect(() => {
    function handleKeyDown(event) {
      const isCtrlOrMeta = event.ctrlKey || event.metaKey;
      const lowerKey = event.key.toLowerCase();

      if (options.ctrlOrMeta) {
        if (isCtrlOrMeta && lowerKey === keyCombo.toLowerCase()) {
          event.preventDefault();
          callback(event);
        }
      } else {
        if (lowerKey === keyCombo.toLowerCase() && !event.ctrlKey && !event.metaKey) {
          // Avoid triggering when user is typing in an input or textarea
          const targetTag = event.target.tagName.toLowerCase();
          if (targetTag === 'input' || targetTag === 'textarea' || event.target.isContentEditable) {
            return;
          }
          callback(event);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyCombo, callback, options.ctrlOrMeta]);
}
