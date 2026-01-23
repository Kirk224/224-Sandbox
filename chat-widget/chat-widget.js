/**
 * Modern Chat Widget
 * A lightweight, customizable chat widget for websites
 *
 * Usage: <script src="chat-widget.js"></script>
 *
 * Optional configuration:
 * <script>
 *   window.ChatWidgetConfig = {
 *     title: "Chat with us",
 *     subtitle: "We'll get back to you shortly!",
 *     primaryColor: "#667eea",
 *     secondaryColor: "#764ba2",
 *     position: "bottom-right", // Options: bottom-right, bottom-left
 *     onSubmit: function(data) {
 *       // Custom handler for form submission
 *       console.log('Form data:', data);
 *     }
 *   };
 * </script>
 */

(function() {
    'use strict';

    // Default configuration
    const defaultConfig = {
        title: "Chat with us",
        subtitle: "We'll get back to you shortly!",
        primaryColor: "#667eea",
        secondaryColor: "#764ba2",
        position: "bottom-right",
        onSubmit: null
    };

    // Merge with user config
    const config = Object.assign({}, defaultConfig, window.ChatWidgetConfig || {});

    // Generate gradient from colors
    const gradient = `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%)`;

    // Position classes
    const positionStyles = config.position === "bottom-left"
        ? "bottom: 24px; left: 24px;"
        : "bottom: 24px; right: 24px;";

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        .chat-widget-container {
            position: fixed;
            ${positionStyles}
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .chat-widget-container * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        .chat-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: ${gradient};
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .chat-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
        }

        .chat-button:active {
            transform: scale(0.95);
        }

        .chat-icon,
        .close-icon {
            position: absolute;
            width: 28px;
            height: 28px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chat-icon {
            opacity: 1;
            transform: rotate(0deg);
        }

        .close-icon {
            opacity: 0;
            transform: rotate(-180deg);
        }

        .chat-button.active .chat-icon {
            opacity: 0;
            transform: rotate(180deg);
        }

        .chat-button.active .close-icon {
            opacity: 1;
            transform: rotate(0deg);
        }

        .icon-svg {
            width: 100%;
            height: 100%;
            fill: white;
        }

        .chat-widget {
            position: absolute;
            bottom: 80px;
            ${config.position === "bottom-left" ? "left: 0;" : "right: 0;"}
            width: 380px;
            max-width: calc(100vw - 48px);
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.15);
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px) scale(0.95);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        }

        .chat-widget.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
        }

        .chat-header {
            background: ${gradient};
            padding: 24px;
            color: white;
        }

        .chat-header h3 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .chat-header p {
            font-size: 14px;
            opacity: 0.9;
        }

        .chat-body {
            padding: 24px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 8px;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.3s ease;
            background: #fafafa;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: ${config.primaryColor};
            background: white;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .form-group textarea {
            resize: vertical;
            min-height: 100px;
        }

        .form-group.error input,
        .form-group.error textarea {
            border-color: #ef4444;
            background: #fef2f2;
        }

        .form-group.error input:focus,
        .form-group.error textarea:focus {
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
        }

        .error-message {
            display: none;
            color: #ef4444;
            font-size: 13px;
            margin-top: 6px;
        }

        .form-group.error .error-message {
            display: block;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .submit-button {
            width: 100%;
            padding: 14px;
            background: ${gradient};
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .submit-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .submit-button:active {
            transform: translateY(0);
        }

        .submit-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        .submit-button .button-text {
            transition: opacity 0.3s ease;
        }

        .submit-button.loading .button-text {
            opacity: 0;
        }

        .spinner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            opacity: 0;
            animation: spin 0.8s linear infinite;
        }

        .submit-button.loading .spinner {
            opacity: 1;
        }

        @keyframes spin {
            to {
                transform: translate(-50%, -50%) rotate(360deg);
            }
        }

        .success-message {
            display: none;
            background: #10b981;
            color: white;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
        }

        .success-message.show {
            display: block;
            animation: successFade 0.3s ease;
        }

        @keyframes successFade {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .success-message svg {
            width: 24px;
            height: 24px;
            margin-bottom: 8px;
        }

        @media (max-width: 480px) {
            .chat-widget-container {
                bottom: 16px;
                ${config.position === "bottom-left" ? "left: 16px;" : "right: 16px;"}
            }

            .chat-widget {
                width: calc(100vw - 32px);
                bottom: 90px;
            }

            .chat-button {
                width: 56px;
                height: 56px;
            }
        }
    `;
    document.head.appendChild(style);

    // Inject HTML
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="chat-widget-container">
            <button class="chat-button" id="chatWidgetButton" aria-label="Toggle chat">
                <div class="chat-icon">
                    <svg class="icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                        <path d="M7 9h10v2H7zm0-3h10v2H7z" />
                    </svg>
                </div>
                <div class="close-icon">
                    <svg class="icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </div>
            </button>

            <div class="chat-widget" id="chatWidgetPanel">
                <div class="chat-header">
                    <h3>${config.title}</h3>
                    <p>${config.subtitle}</p>
                </div>

                <div class="chat-body">
                    <div class="success-message" id="chatWidgetSuccess">
                        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <div>Message sent successfully!</div>
                    </div>

                    <form id="chatWidgetForm">
                        <div class="form-group" id="chatWidgetNameGroup">
                            <label for="chatWidgetName">Name</label>
                            <input type="text" id="chatWidgetName" name="name" placeholder="Enter your name" autocomplete="name">
                            <div class="error-message">Please enter your name</div>
                        </div>

                        <div class="form-group" id="chatWidgetPhoneGroup">
                            <label for="chatWidgetPhone">Phone</label>
                            <input type="tel" id="chatWidgetPhone" name="phone" placeholder="(555) 123-4567" autocomplete="tel">
                            <div class="error-message">Please enter a valid phone number</div>
                        </div>

                        <div class="form-group" id="chatWidgetMessageGroup">
                            <label for="chatWidgetMessage">Message</label>
                            <textarea id="chatWidgetMessage" name="message" placeholder="How can we help you?" rows="4"></textarea>
                            <div class="error-message">Please enter your message</div>
                        </div>

                        <button type="submit" class="submit-button" id="chatWidgetSubmit">
                            <span class="button-text">Send Message</span>
                            <div class="spinner"></div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

    function initWidget() {
        document.body.appendChild(container);

        // Get elements
        const chatButton = document.getElementById('chatWidgetButton');
        const chatWidget = document.getElementById('chatWidgetPanel');
        const chatForm = document.getElementById('chatWidgetForm');
        const submitButton = document.getElementById('chatWidgetSubmit');
        const successMessage = document.getElementById('chatWidgetSuccess');

        const nameInput = document.getElementById('chatWidgetName');
        const phoneInput = document.getElementById('chatWidgetPhone');
        const messageInput = document.getElementById('chatWidgetMessage');

        const nameGroup = document.getElementById('chatWidgetNameGroup');
        const phoneGroup = document.getElementById('chatWidgetPhoneGroup');
        const messageGroup = document.getElementById('chatWidgetMessageGroup');

        // Toggle widget
        chatButton.addEventListener('click', () => {
            chatButton.classList.toggle('active');
            chatWidget.classList.toggle('active');

            if (chatWidget.classList.contains('active')) {
                setTimeout(() => nameInput.focus(), 300);
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!chatWidget.contains(e.target) && !chatButton.contains(e.target)) {
                chatButton.classList.remove('active');
                chatWidget.classList.remove('active');
            }
        });

        // Phone formatting
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }

            e.target.value = value;
        });

        // Validation
        function validateField(input, group, customValidator = null) {
            const value = input.value.trim();

            if (!value) {
                group.classList.add('error');
                return false;
            }

            if (customValidator && !customValidator(value)) {
                group.classList.add('error');
                return false;
            }

            group.classList.remove('error');
            return true;
        }

        function validatePhone(phone) {
            const cleaned = phone.replace(/\D/g, '');
            return cleaned.length === 10;
        }

        // Real-time validation
        nameInput.addEventListener('blur', () => validateField(nameInput, nameGroup));
        phoneInput.addEventListener('blur', () => validateField(phoneInput, phoneGroup, validatePhone));
        messageInput.addEventListener('blur', () => validateField(messageInput, messageGroup));

        // Remove error on input
        [nameInput, phoneInput, messageInput].forEach(input => {
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                group.classList.remove('error');
            });
        });

        // Form submission
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isNameValid = validateField(nameInput, nameGroup);
            const isPhoneValid = validateField(phoneInput, phoneGroup, validatePhone);
            const isMessageValid = validateField(messageInput, messageGroup);

            if (!isNameValid || !isPhoneValid || !isMessageValid) {
                return;
            }

            submitButton.classList.add('loading');
            submitButton.disabled = true;

            const formData = {
                name: nameInput.value.trim(),
                phone: phoneInput.value.trim(),
                message: messageInput.value.trim(),
                timestamp: new Date().toISOString()
            };

            // Call custom handler if provided
            if (typeof config.onSubmit === 'function') {
                try {
                    await config.onSubmit(formData);
                } catch (error) {
                    console.error('Chat widget submission error:', error);
                }
            } else {
                // Default: log to console
                console.log('Chat widget form submitted:', formData);
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            submitButton.classList.remove('loading');
            submitButton.disabled = false;

            chatForm.style.display = 'none';
            successMessage.classList.add('show');

            setTimeout(() => {
                chatForm.reset();
                chatForm.style.display = 'block';
                successMessage.classList.remove('show');
                [nameGroup, phoneGroup, messageGroup].forEach(group => {
                    group.classList.remove('error');
                });

                setTimeout(() => {
                    chatButton.classList.remove('active');
                    chatWidget.classList.remove('active');
                }, 500);
            }, 3000);
        });

        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatWidget.classList.contains('active')) {
                chatButton.classList.remove('active');
                chatWidget.classList.remove('active');
            }
        });
    }
})();
