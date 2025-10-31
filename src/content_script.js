'use strict';

const CURRENT_VERSION = '2.0.0';

const STORAGE_KEYS = {
    VERSION: 'apinames_version'
};

const TIPS_POPUP_STYLES = `
  .apinames-tips-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 550px;  /* Increased from 380px */
    padding: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    z-index: 100000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    overflow: hidden;
    animation: popup-fadeIn 0.3s ease-out;
  }
  
  .apinames-tips-popup-header {
    display: flex;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, #0176d3 0%, #0b5cab 100%);
    color: white;
  }
  
  .apinames-tips-popup-icon {
    width: 32px;
    height: 32px;
    margin-right: 12px;
    border-radius: 6px;
  }
  
  .apinames-tips-popup-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 2px;
  }
  
  .apinames-tips-popup-content {
    padding: 20px;
    line-height: 1.5;
    color: #444;
    font-size: 14px;  /* Slightly smaller font */
  }
  
  .apinames-tips-popup-list {
    margin: 15px 0;
    padding: 0;
    list-style: none;
  }
  
  .apinames-tips-popup-list li {
    display: flex;
    margin-bottom: 10px;
    white-space: nowrap;  /* Prevent line breaks */
  }
  
  .apinames-tips-popup-list li::before {
    content: "•";
    color: #0176d3;
    font-weight: bold;
    display: inline-block;
    width: 20px;
    margin-left: -10px;
  }
  
  .apinames-tips-popup-list kbd {
    display: inline-block;
    padding: 3px 6px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
    margin: 0 4px;
  }
  
  .apinames-tips-popup-footer {
    padding: 15px 20px;
    background: #f8f9fa;
    border-top: 1px solid #eee;
    font-size: 13px;
    color: #666;
    text-align: center;
  }
  
  .apinames-tips-popup-close {
    display: block;
    width: 100%;
    padding: 10px;
    background: #0176d3;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .apinames-tips-popup-close:hover {
    background: #0b5cab;
  }
`;

const EXTENSION_ICON_BASE64 = 'data:image/png;base64,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'; // <-- Add your base64 encoded icon here

const tipsPopup = (() => {
    const checkVersionAndShow = () => {
        chrome.storage.sync.get([STORAGE_KEYS.VERSION], (result) => {
            if (result[STORAGE_KEYS.VERSION] !== CURRENT_VERSION) {
                show();
                chrome.storage.sync.set({[STORAGE_KEYS.VERSION]: CURRENT_VERSION});
            }
        });
    };

    const show = () => {
        const overlay = document.createElement('div');
        overlay.className = 'apinames-tips-popup-overlay';

        const popup = document.createElement('div');
        popup.className = 'apinames-tips-popup';
        popup.innerHTML = `
        <div class="apinames-tips-popup-header">
            <img src="${EXTENSION_ICON_BASE64}" class="apinames-tips-popup-icon" alt="Extension icon">
            <div class="apinames-tips-popup-title">Salesforce Show API Name V2.0.0</div>
        </div>
        
        <div class="apinames-tips-popup-content">
            <p style="margin-bottom: 15px; white-space: nowrap;">After clicking the extension icon, API names will appear with copy buttons:</p>
            
            <ul class="apinames-tips-popup-list">
                <li><strong>Click</strong><span style="margin:0 4px">-</span>Copy single API name</li>
                <li><strong>Cmd/Ctrl+Click</strong><span style="margin:0 4px">-</span>Multi-select fields (comma-separated)</li>
                <li><strong>Shift+Cmd/Ctrl+Click</strong><span style="margin:0 4px">-</span>Generate SOQL query</li>
            </ul>
            
            <button class="apinames-tips-popup-close">Got it!</button>
        </div>
        
        <div class="apinames-tips-popup-footer">
            Access this guide anytime via the extension menu
        </div>
    `;

        const closePopup = () => {
            popup.style.animation = 'popup-fadeIn 0.3s ease-out reverse';
            overlay.style.animation = 'overlay-fadeIn 0.3s ease-out reverse';
            setTimeout(() => {
                popup.remove();
                overlay.remove();
            }, 250);
        };

        popup.querySelector('.apinames-tips-popup-close').addEventListener('click', closePopup);
        overlay.addEventListener('click', closePopup);
        popup.addEventListener('click', (e) => e.stopPropagation());

        document.body.appendChild(overlay);
        document.body.appendChild(popup);
    };

    return { checkVersionAndShow };
})();

// ==================== Constants Definition ====================
const SELECTORS = {
    LIGHTNING: {
        FIELD_LABEL: '.test-id__field-label-container.slds-form-element__label',
        OBJECT_TITLE: '.slds-page-header__title'
    },
    CLASSIC: {
        FIELD_LABEL: '.labelCol',
        OBJECT_TITLE: '.pageType'
    }
};

const STYLE_CONFIG = {
    TOAST: {
        MAX_WIDTH: 1500,
        LINE_MAX_LENGTH: 175
    },
    BUTTON: {
        SIZE: 18,
        ICON_SIZE: 12
    }
};

// Update the COPY_ICON_SVG to use Salesforce's clipboard icon
const COPY_ICON_SVG = `
  <svg viewBox="0 0 52 52" width="14" height="14" aria-hidden="true">
    <path d="M43,7h-5V5c0-1.6-1.3-2.9-2.9-2.9H5C3.4,2.1,2.1,3.4,2.1,5v30.1c0,1.6,1.3,2.9,2.9,2.9h2v5c0,1.6,1.3,2.9,2.9,2.9h33.1c1.6,0,2.9-1.3,2.9-2.9V9.9C45.9,8.3,44.6,7,43,7z M7.1,35.1V5h28v33.1H7.1z M42.9,45H12V9h5v28.1c0,1.6,1.3,2.9,2.9,2.9H43V45z" 
          fill="currentColor"/>
  </svg>
`;

// SVG icons
const METADATA_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" 
          fill="currentColor"/>
  </svg>
`;

// Update the APINAMES_STYLES with Salesforce-like styling
const APINAMES_STYLES = `
  /* Base styles for both modes */
  .apinames-copy-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 0.5rem;
    border: 1px solid #dddbda;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.15s ease;
    padding: 0;
    vertical-align: middle;
    box-shadow: 0 1px 1px rgba(0,0,0,0.05);
    background-color: #ffffff;
    color: #706e6b;
  }

  .apinames-copy-btn svg {
    width: 0.75rem;
    height: 0.75rem;
    pointer-events: none;
  }

  /* Metadata button styles */
  .apinames-metadata-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 0.25rem;
    border: 1px solid #dddbda;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.15s ease;
    padding: 0;
    vertical-align: middle;
    box-shadow: 0 1px 1px rgba(0,0,0,0.05);
    background-color: #ffffff;
    color: #706e6b;
  }

  .apinames-metadata-btn svg {
    width: 0.75rem;
    height: 0.75rem;
    pointer-events: none;
  }

  /* Lightning mode specific styles */
  .lightning-mode .apinames-copy-btn,
  .lightning-mode .apinames-metadata-btn {
    background-color: #f3f2f2;
    border-color: #c9c7c5;
    color: #706e6b;
  }

  .lightning-mode .apinames-copy-btn:hover,
  .lightning-mode .apinames-metadata-btn:hover {
    background-color: #eef4ff;
    border-color: #1b96ff;
    color: #0176d3;
  }

  .lightning-mode .apinames-copy-btn:active,
  .lightning-mode .apinames-metadata-btn:active {
    background-color: #e1f0ff;
    border-color: #0176d3;
  }

  /* Classic mode specific styles */
  .classic-mode .apinames-copy-btn,
  .classic-mode .apinames-metadata-btn {
    background-color: #f8f8f8;
    border-color: #c0c0c0;
    color: #333333;
  }

  .classic-mode .apinames-copy-btn:hover,
  .classic-mode .apinames-metadata-btn:hover {
    background-color: #e6f2fb;
    border-color: #7eb4dd;
    color: #015ba7;
  }

  /* Selected state styles for both modes */
  .apinames-multi-selected,
  .apinames-query-selected {
    background-color: #e1f0ff !important;
    border-color: #0176d3 !important;
    color: #0176d3 !important;
  }

  .lightning-mode .apinames-multi-selected,
  .lightning-mode .apinames-query-selected {
    box-shadow: 0 0 0 1px #0176d3 !important;
  }

  .classic-mode .apinames-multi-selected,
  .classic-mode .apinames-query-selected {
    box-shadow: 0 0 0 1px #015ba7 !important;
  }

  /* Metadata popup styles */
  .apinames-metadata-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    max-height: 80vh;
    padding: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    z-index: 100001;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    overflow: hidden;
    animation: popup-fadeIn 0.3s ease-out;
  }

  .apinames-metadata-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100000;
    animation: overlay-fadeIn 0.3s ease-out;
  }

  .apinames-metadata-popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background: linear-gradient(135deg, #0176d3 0%, #0b5cab 100%);
    color: white;
  }

  .apinames-metadata-popup-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  .apinames-metadata-popup-close {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .apinames-metadata-popup-close:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .apinames-metadata-popup-content {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .apinames-metadata-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
  }

  .apinames-metadata-item {
    display: flex;
    flex-direction: column;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 3px solid #0176d3;
  }

  .apinames-metadata-label {
    font-weight: 600;
    color: #333;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .apinames-metadata-value {
    color: #666;
    font-size: 14px;
    word-break: break-word;
  }

  .apinames-metadata-value.boolean-true {
    color: #28a745;
    font-weight: 500;
  }

  .apinames-metadata-value.boolean-false {
    color: #dc3545;
    font-weight: 500;
  }

  .apinames-metadata-formula {
    grid-column: 1 / -1;
    background: #fff3cd;
    border-left-color: #ffc107;
  }

  .apinames-metadata-formula .apinames-metadata-value {
    font-family: monospace;
    font-size: 12px;
    background: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #dee2e6;
    white-space: pre-wrap;
    max-height: 150px;
    overflow-y: auto;
  }

  @keyframes popup-fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @keyframes overlay-fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// ==================== Style Management ====================
// Add to Style Management section
const styleManager = (() => {
    const injectStyles = () => {
        if (!document.getElementById('apinames-styles')) {
            const style = document.createElement('style');
            style.id = 'apinames-styles';
            style.textContent = APINAMES_STYLES + TIPS_POPUP_STYLES;
            document.head.appendChild(style);
        }
    };

    return { injectStyles };
})();

// ==================== Toast Management ====================
const toastManager = (() => {
    const show = (message) => {
        removeExistingToast();
        const toast = createToastElement(message);
        document.body.appendChild(toast);
        autoRemoveToast(toast);
    };

    const removeExistingToast = () => {
        document.getElementById('apinames-toast')?.remove();
    };

    const createToastElement = (message) => {
        const toast = document.createElement('div');
        toast.id = 'apinames-toast';
        toast.innerHTML = formatToastContent(message);
        Object.assign(toast.style, getToastStyle());
        return toast;
    };

    const formatToastContent = (message) => message.split('\n')
        .map(line => createToastLine(line))
        .join('');

    const createToastLine = (line) => `
    <div class="toast-line" title="${utils.escapeHtml(line)}">
      ${utils.truncateText(line, STYLE_CONFIG.TOAST.LINE_MAX_LENGTH)}
    </div>
  `;

    const getToastStyle = () => ({
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px 16px',
        background: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        borderRadius: '4px',
        zIndex: '99999',
        maxWidth: `${STYLE_CONFIG.TOAST.MAX_WIDTH}px`,
        fontSize: '13px',
        lineHeight: '1.4',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        animation: 'toast-fadeInOut 2.5s ease-in-out'
    });

    const autoRemoveToast = (toast) => {
        setTimeout(() => toast.remove(), 2500);
    };

    return { show };
})();

// ==================== Copy Management ====================
const copyManager = (() => {
    let state = {
        multiItems: [],
        queryItems: [],
        lastAction: null
    };

    let currentSObjectName = 'UnknownObject'; // Store current object name

    const init = (sObjectName) => {
        currentSObjectName = sObjectName;
    };

    const handleCopy = (apiName, event) => {
        event.preventDefault();
        event.stopPropagation();

        const isMulti = event.metaKey || event.ctrlKey;
        const isQuery = event.shiftKey;

        if (isQuery && isMulti) {
            handleQuerySelection(apiName, event.target, currentSObjectName);
        } else if (isMulti) {
            handleMultiSelection(apiName, event.target, currentSObjectName);
        } else {
            singleCopy(apiName, event);
        }
    };

    const handleQuerySelection = async (apiName, target, sObjectName) => {
        const wasSelected = target.classList.contains('apinames-query-selected');
        target.classList.toggle('apinames-query-selected', !wasSelected);

        state.queryItems = wasSelected
            ? state.queryItems.filter(v => v !== apiName)
            : [...state.queryItems, apiName];

        await generateSOQL(sObjectName);
        state.lastAction = 'query';
    };

    const handleMultiSelection = (apiName, target) => {
        const wasSelected = target.classList.contains('apinames-multi-selected');
        target.classList.toggle('apinames-multi-selected');

        if (!wasSelected) {
            state.multiItems.push(apiName);
        } else {
            state.multiItems = state.multiItems.filter(v => v !== apiName);
        }
        updateMultiCopyState();
        state.lastAction = 'multi';
    };

    const singleCopy = (apiName, event) => {
        navigator.clipboard.writeText(apiName).then(() => {
            toastManager.show(`Copied: ${apiName}`);
            flashButton(event.target);
            resetState();
        }).catch(err => {
            console.error('Copy failed:', err);
            toastManager.show('Copy failed!');
        });
    };

    const flashButton = (btn) => {
        btn.animate([
            { backgroundColor: 'rgba(0, 255, 0, 0.3)' },
            { backgroundColor: 'transparent' }
        ], { duration: 500 });
    };

    const generateSOQL = async (sObjectName) => {
        try {
            if (!sObjectName || sObjectName === 'UnknownObject') {
                toastManager.show('⚠️ Invalid object name');
                return;
            }

            const fields = [...new Set(state.queryItems)];
            if (fields.length === 0) {
                await navigator.clipboard.writeText('');
                return;
            }

            const soql = `SELECT ${fields.map(f =>
                f.includes(' ') ? `"${f}"` : f
            ).join(', ')} FROM ${sObjectName}`;

            await writeToClipboard(soql);
            toastManager.show(`✅ SOQL generated:\n${utils.truncateText(soql, STYLE_CONFIG.TOAST.LINE_MAX_LENGTH)}`);
        } catch (err) {
            console.error('SOQL generation failed:', err);
            toastManager.show('❌ Copy failed, please try again');
        }
    };

    const writeToClipboard = async (text) => {
        try {
            // Method 1: Prefer modern API
            await navigator.clipboard.writeText(text);
        } catch (err) {
            // Method 2: Fallback solution
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            document.body.appendChild(textarea);
            textarea.select();

            try {
                document.execCommand('copy');
            } finally {
                document.body.removeChild(textarea);
            }
        }
    };

    const updateMultiCopyState = () => {
        const text = state.multiItems.join(', ');
        navigator.clipboard.writeText(text);
        toastManager.show(`Multi selection:\n${utils.truncateText(text, STYLE_CONFIG.TOAST.LINE_MAX_LENGTH)}`);
    };

    const resetState = () => {
        state = { multiItems: [], queryItems: [], lastAction: null };
        document.querySelectorAll('.apinames-multi-selected, .apinames-query-selected')
            .forEach(el => el.classList.remove('apinames-multi-selected', 'apinames-query-selected'));
    };

    return { init, handleCopy, resetState };
})();

// ==================== DOM Utilities ====================
const domHelper = {
    createElement: (tag, config) => {
        const el = document.createElement(tag);
        Object.assign(el, config);
        return el;
    },

    createApiContainer: (apiName, isField = true, label = '', fieldMetadata = null) => {
        const container = domHelper.createElement('div', {
            className: 'apinames-api-container',
            style: `display: ${isField ? 'block' : 'inline-flex'}; margin: ${isField ? '0.25rem 0 0' : '0 0 0 0.5rem'};`
        });

        const textSpan = domHelper.createElement('span', {
            className: 'apinames-api-text',
            textContent: apiName
        });

        container.append(textSpan, domHelper.createCopyButton(apiName));
        
        if (isField && label && fieldMetadata && fieldMetadata[apiName]) {
            container.append(domHelper.createMetadataButton(apiName, label));
        }
        
        return container;
    },

    createCopyButton: (apiName) => {
        const button = document.createElement('button');
        button.className = 'apinames-copy-btn';
        button.innerHTML = COPY_ICON_SVG;
        button.title = 'Copy API Name';
        button.style.cssText = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
    `;

        button.addEventListener('click', (e) => {
            copyManager.handleCopy(apiName, e);
        });

        return button;
    },

    createMetadataButton: (apiName, label) => {
        const button = document.createElement('button');
        button.className = 'apinames-metadata-btn';
        button.innerHTML = METADATA_ICON_SVG;
        button.title = 'Show field metadata';
        button.setAttribute('data-api-name', apiName);
        button.setAttribute('data-label', label);
        button.style.cssText = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
    `;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Metadata button clicked for:', { apiName, label });
            metadataManager.showMetadataPopup(apiName, label);
        });

        return button;
    }
};

// ==================== Utility Functions ====================
const utils = {
    escapeHtml: (str) => str.replace(/</g, '&lt;').replace(/>/g, '&gt;'),

    truncateText: (text, maxLength = 35) =>
        text.length > maxLength ? `…${text.slice(-maxLength)}` : text,

    getSObjectName: () => {
        const selector = `${SELECTORS.LIGHTNING.OBJECT_TITLE}, ${SELECTORS.CLASSIC.OBJECT_TITLE}`;
        return document.querySelector(selector)?.textContent?.split(':')[0]?.trim() || 'UnknownObject';
    },

    isAPINameVisible: () => document.querySelector('.apinames-api-container') !== null,

    removeAllApiElements: () => {
        document.querySelectorAll('.apinames-api-container, .apinames-script-container')
            .forEach(el => el.remove());
    }
};

// ==================== Metadata Management ====================
const metadataManager = {
  currentFieldMetadata: null,

  init() {
    // Add event listener for metadata buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.apinames-metadata-btn')) {
        const button = e.target.closest('.apinames-metadata-btn');
        const apiName = button.getAttribute('data-api-name');
        const label = button.getAttribute('data-label');
        this.showMetadataPopup(apiName, label);
      }
    });

    // Add event listener for closing popup
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('apinames-metadata-popup-overlay') || 
          e.target.classList.contains('apinames-metadata-popup-close')) {
        this.closeMetadataPopup();
      }
    });

    // Add escape key listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.querySelector('.apinames-metadata-popup')) {
        this.closeMetadataPopup();
      }
    });
  },

  showMetadataPopup(apiName, label) {
    console.log('showMetadataPopup called with:', { apiName, label });
    console.log('currentFieldMetadata:', this.currentFieldMetadata);
    
    const fieldData = this.currentFieldMetadata?.[apiName];
    console.log('fieldData for', apiName, ':', fieldData);
    
    if (!fieldData) {
      console.warn('No metadata found for field:', apiName);
      toastManager.show('Metadata not available for this field', 'error');
      return;
    }

    this.closeMetadataPopup(); // Close any existing popup

    const overlay = document.createElement('div');
    overlay.className = 'apinames-metadata-popup-overlay';

    const popup = document.createElement('div');
    popup.className = 'apinames-metadata-popup';

    popup.innerHTML = `
      <div class="apinames-metadata-popup-header">
        <h3 class="apinames-metadata-popup-title">Field Metadata: ${utils.escapeHtml(label)} (${utils.escapeHtml(apiName)})</h3>
        <button class="apinames-metadata-popup-close">&times;</button>
      </div>
      <div class="apinames-metadata-popup-content">
        ${this.generateMetadataContent(fieldData)}
      </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  },

  closeMetadataPopup() {
    const overlay = document.querySelector('.apinames-metadata-popup-overlay');
    if (overlay) {
      overlay.remove();
    }
  },

  generateMetadataContent(fieldData) {
    const requiredFields = [
      'autoNumber', 'calculated', 'calculatedFormula', 'createable', 'caseSensitive',
      'custom', 'defaultValue', 'defaultValueFormula', 'defaultedOnCreate',
      'dependentPicklist', 'controllerName', 'digits', 'externalId', 'filterable',
      'label', 'length', 'name', 'picklistValues', 'precision', 'scale', 'type', 'relationshipName'
    ];

    let content = '<div class="apinames-metadata-grid">';

    requiredFields.forEach(field => {
      if (fieldData.hasOwnProperty(field)) {
        const value = fieldData[field];
        const isFormula = field === 'calculatedFormula' || field === 'defaultValueFormula';
        const itemClass = isFormula ? 'apinames-metadata-item apinames-metadata-formula' : 'apinames-metadata-item';
        
        content += `
          <div class="${itemClass}">
            <div class="apinames-metadata-label">${this.formatFieldName(field)}</div>
            <div class="apinames-metadata-value ${this.getValueClass(value)}">${this.formatValue(value)}</div>
          </div>
        `;
      }
    });

    content += '</div>';
    return content;
  },

  formatFieldName(field) {
    return field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  },

  formatValue(value) {
    if (value === null || value === undefined) {
      return '<em>null</em>';
    }
    if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return '<em>empty array</em>';
      }
      return value.map(item => {
        if (typeof item === 'object' && item.label) {
          return item.label;
        }
        return String(item);
      }).join(', ');
    }
    if (typeof value === 'string' && value.length > 100) {
      return value; // Long strings will be handled by CSS
    }
    return utils.escapeHtml(String(value));
  },

  getValueClass(value) {
    if (typeof value === 'boolean') {
      return value ? 'boolean-true' : 'boolean-false';
    }
    return '';
  },

  updateFieldMetadata(fieldMetadata) {
    console.log('updateFieldMetadata called with:', fieldMetadata);
    this.currentFieldMetadata = fieldMetadata;
    console.log('currentFieldMetadata updated to:', this.currentFieldMetadata);
  }
};

// ==================== Main Logic ====================
const apiNameManager = (() => {
    const init = () => {
        styleManager.injectStyles();
        chrome.runtime.onMessage.addListener(handleMessage);
        document.addEventListener('keyup', handleKeyUp);
        metadataManager.init();
        tipsPopup.checkVersionAndShow();
    };

    const processFields = (selector, filter, labelExtractor, labelMap, fieldMetadata) => {
        const elements = document.querySelectorAll(selector);
        const labelCounts = {};

        elements.forEach(el => {
            if (!filter(el)) return;

            const label = labelExtractor(el);
            const apiName = findApiName(label, labelCounts, labelMap);
            if (apiName) {
                removeExistingApiElement(el);
                appendApiElement(el, apiName, label, fieldMetadata);
            }
        });
    };

    const findApiName = (label, counts, labelMapData) => {
        counts[label] = (counts[label] || -1) + 1;
        // labelMapData is now the full object with labelMap and assistLabelMap
        const labelMap = labelMapData.labelMap || labelMapData;
        const assistLabelMap = labelMapData.assistLabelMap || {};
        return labelMap?.[label]?.[counts[label]] || assistLabelMap?.[label];
    };

    const removeExistingApiElement = (el) => {
        el.closest('.slds-form-element__item, .dataCol')
            ?.querySelector('.apinames-api-container')
            ?.remove();
    };

    const appendApiElement = (el, apiName, label, fieldMetadata) => {
        const container = domHelper.createApiContainer(apiName, true, label, fieldMetadata);
        const fieldContainer = el.closest('.slds-form-element__control, .labelCol') || el;
        fieldContainer.appendChild(container);
    };

    const addObjectApiName = (selector, sObjectName, longId) => {
        const titleElements = document.querySelectorAll(selector);
        if (titleElements.length === 0) return;

        const titleEl = titleElements[titleElements.length - 1];
        titleEl.querySelectorAll('.apinames-script-container').forEach(el => el.remove());

        const container = domHelper.createElement('div', {
            className: 'apinames-script-container',
            style: 'display: inline-block; margin-left: 10px;'
        });

        container.append(domHelper.createApiContainer(sObjectName, false));
        if (longId) container.append(domHelper.createApiContainer(longId, false));

        titleEl.style.position = 'relative';
        titleEl.appendChild(container);
    };

    const handleKeyUp = (e) => {
        if (['Meta', 'Control', 'Shift'].includes(e.key)) {
            copyManager.resetState();
        }
    };

    const handleMessage = (message) => {
        console.log('Content script received message:', message);
        if (message.command === 'showApiName') {
            console.log('Processing showApiName command');
            console.log('Field metadata received:', message.fieldMetadata);
            copyManager.init(message.sObjectName); // Initialize name storage
            metadataManager.updateFieldMetadata(message.fieldMetadata);
            toggleDisplay({
                isLightning: message.isLightningMode,
                sObjectName: message.sObjectName,
                labelMap: message.labelMap,
                longId: message.longId,
                fieldMetadata: message.fieldMetadata
            });
        }
    };

    const toggleDisplay = ({ isLightning, sObjectName, labelMap, longId, fieldMetadata }) => {
        if (utils.isAPINameVisible()) {
            utils.removeAllApiElements();
        } else {
            const mode = isLightning ? 'LIGHTNING' : 'CLASSIC';
            injectApiNames(
                SELECTORS[mode].FIELD_LABEL,
                SELECTORS[mode].OBJECT_TITLE,
                sObjectName,
                labelMap, // This is now the full object with labelMap, assistLabelMap, and fieldMetadata
                longId,
                isLightning,
                fieldMetadata
            );
        }
    };

    // In the injectApiNames function, add the lightning mode class to body
    const injectApiNames = (fieldSelector, objectSelector, sObjectName, labelMapData, longId, isLightning, fieldMetadata) => {
        // Remove any existing mode classes
        document.body.classList.remove('lightning-mode', 'classic-mode');

        // Add the appropriate mode class
        if (isLightning) {
            document.body.classList.add('lightning-mode');
            processFields(fieldSelector,
                el => el.childNodes.length > 0,
                el => el.firstChild?.innerText,
                labelMapData,
                fieldMetadata
            );
        } else {
            document.body.classList.add('classic-mode');
            processFields(fieldSelector,
                () => true,
                el => el.textContent.split('sfdcPage.')[0],
                labelMapData,
                fieldMetadata
            );
        }
        addObjectApiName(objectSelector, sObjectName, longId);
    };

    return { init };
})();

// ==================== Initialization ====================
apiNameManager.init();