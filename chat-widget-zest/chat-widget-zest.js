/**
 * Zest Chat Widget
 * A standalone chat widget for capturing leads via SMS
 *
 * Usage: <script src="chat-widget-zest.js"></script>
 *
 * Configuration (optional):
 * <script>
 *   window.ZestChatConfig = {
 *     webhookUrl: 'your-webhook-url',
 *     title: 'Custom title',
 *     description: 'Custom description'
 *   };
 * </script>
 */

(function () {
	'use strict';

	// Default configuration
	const defaultConfig = {
		webhookUrl: 'https://services.leadconnectorhq.com/hooks/I0mb9f5FdYZN0ED632XZ/webhook-trigger/3c5a9926-b6ab-48e7-92aa-4fb36fe2f017',
		title: 'Start a conversation with us now',
		description: 'Please complete your details below, we use SMS for our conversations so you can respond when it suits you',
		primaryColor: '#274f37',
		primaryHoverColor: '#365943',
	};

	// Merge with user config
	const config = { ...defaultConfig, ...(window.ZestChatConfig || {}) };

	// Inject CSS
	const style = document.createElement('style');
	style.textContent = `
		:root {
			--zest-primary: ${config.primaryColor};
			--zest-primary-hover: ${config.primaryHoverColor};
			--zest-primary-foreground: #ffffff;
			--zest-background: #ffffff;
			--zest-foreground: #0f172a;
			--zest-border: #e2e8f0;
			--zest-muted: #f1f5f9;
			--zest-muted-foreground: #64748b;
			--zest-success: #365943;
			--zest-radius: 8px;
			--zest-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
		}

		.zest-chat-widget * {
			box-sizing: border-box;
		}

		.zest-chat-header p {
			line-height: 1.5;
		}

		.zest-chat-widget {
			position: fixed;
			bottom: 24px;
			right: 24px;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
			z-index: 9999;
		}

		.zest-chat-button {
			width: 60px;
			height: 60px;
			border-radius: 50%;
			background: var(--zest-primary);
			border: none;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: var(--zest-shadow-lg);
			transition: transform 0.2s, box-shadow 0.2s;
			position: relative;
		}

		.zest-chat-button:hover {
			transform: scale(1.05);
			box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.15);
			background: var(--zest-primary-hover);
		}

		.zest-chat-button:active {
			transform: scale(0.95);
		}

		.zest-chat-button svg {
			width: 28px;
			height: 28px;
			color: var(--zest-primary-foreground);
		}

		.zest-chat-popover {
			position: absolute;
			bottom: 80px;
			right: 0;
			width: 380px;
			max-width: calc(100vw - 48px);
			background: var(--zest-background);
			border-radius: var(--zest-radius);
			box-shadow: var(--zest-shadow-lg), 0 0 0 1px rgba(0, 0, 0, 0.05);
			opacity: 0;
			visibility: hidden;
			transform: scale(0.9) translateY(10px);
			transform-origin: bottom right;
			transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out, visibility 0.2s ease-in-out;
			pointer-events: none;
		}

		.zest-chat-popover.open {
			opacity: 1;
			visibility: visible;
			transform: scale(1) translateY(0);
			pointer-events: auto;
		}

		.zest-chat-header {
			padding: 20px;
			border-bottom: 1px solid var(--zest-border);
			box-sizing: border-box;
		}

		.zest-chat-header h3 {
			font-size: 1.125rem;
			font-weight: 600;
			color: var(--zest-foreground);
			margin: 0 0 4px 0;
		}

		.zest-chat-header p {
			font-size: 0.875rem;
			color: var(--zest-muted-foreground);
			margin: 0;
		}

		.zest-close-button {
			position: absolute;
			top: 16px;
			right: 16px;
			width: 28px;
			height: 28px;
			border: none;
			background: transparent;
			border-radius: 4px;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--zest-muted-foreground);
			transition: background 0.2s ease-in-out, color 0.2s ease-in-out;
		}

		.zest-close-button:hover {
			background: var(--zest-muted);
			color: var(--zest-foreground);
		}

		.zest-close-button svg {
			width: 18px;
			height: 18px;
		}

		.zest-chat-body {
			padding: 20px;
			box-sizing: border-box;
		}

		.zest-chat-form {
			margin: 0;
			padding: 0;
		}

		.zest-form-group {
			margin-bottom: 8px;
			box-sizing: border-box;
		}

		.zest-form-label {
			display: block;
			font-size: 0.875rem;
			font-weight: 500;
			margin-bottom: 0px;
			color: var(--zest-foreground);
		}

		.zest-form-input,
		.zest-form-textarea {
			display: block;
			width: 100%;
			padding: 10px 12px;
			border: 1px solid var(--zest-border);
			border-radius: calc(var(--zest-radius) - 2px);
			font-size: 0.875rem;
			color: var(--zest-foreground);
			background: var(--zest-background);
			transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
			font-family: inherit;
			box-sizing: border-box;
		}

		.zest-form-input:focus,
		.zest-form-textarea:focus {
			outline: none;
			border-color: var(--zest-primary);
			box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
		}

		.zest-form-input::placeholder,
		.zest-form-textarea::placeholder {
			color: var(--zest-muted-foreground);
		}

		.zest-form-textarea {
			resize: vertical;
			min-height: 80px;
		}

		.zest-submit-button {
			display: block;
			width: 100%;
			padding: 12px 16px;
			background: var(--zest-primary);
			color: var(--zest-primary-foreground);
			border: none;
			border-radius: calc(var(--zest-radius) - 2px);
			font-size: 0.875rem;
			font-weight: 500;
			cursor: pointer;
			transition: background 0.2s ease-in-out, transform 0.1s ease-in-out;
			font-family: inherit;
			box-sizing: border-box;
		}

		.zest-submit-button:hover {
			background: var(--zest-primary-hover);
		}

		.zest-submit-button:active {
			transform: scale(0.98);
		}

		.zest-submit-button:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		.zest-success-message {
			padding: 16px;
			background: rgba(34, 197, 94, 0.1);
			border: 1px solid rgba(34, 197, 94, 0.2);
			border-radius: calc(var(--zest-radius) - 2px);
			margin-bottom: 16px;
			box-sizing: border-box;
			display: flex;
			gap: 12px;
			max-height: 0;
			opacity: 0;
			overflow: hidden;
			transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out, margin-bottom 0.4s ease-in-out, padding 0.4s ease-in-out;
			padding-top: 0;
			padding-bottom: 0;
			margin-bottom: 0;
		}

		.zest-success-message.show {
			max-height: 200px;
			opacity: 1;
			padding-top: 16px;
			padding-bottom: 16px;
			margin-bottom: 16px;
		}

		.zest-success-icon {
			width: 20px;
			height: 20px;
			color: var(--zest-success);
			flex-shrink: 0;
		}

		.zest-success-content h4 {
			font-size: 0.875rem;
			font-weight: 600;
			color: var(--zest-success);
			margin: 0 0 4px 0;
		}

		.zest-success-content p {
			font-size: 0.8125rem;
			color: var(--zest-foreground);
			margin: 0;
		}

		.zest-error-message {
			padding: 16px;
			background: rgba(239, 68, 68, 0.1);
			border: 1px solid rgba(239, 68, 68, 0.2);
			border-radius: calc(var(--zest-radius) - 2px);
			margin-bottom: 16px;
			box-sizing: border-box;
			display: flex;
			gap: 12px;
			max-height: 0;
			opacity: 0;
			overflow: hidden;
			transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out, margin-bottom 0.4s ease-in-out, padding 0.4s ease-in-out;
			padding-top: 0;
			padding-bottom: 0;
			margin-bottom: 0;
		}

		.zest-error-message.show {
			max-height: 200px;
			opacity: 1;
			padding-top: 16px;
			padding-bottom: 16px;
			margin-bottom: 16px;
		}

		.zest-error-icon {
			width: 20px;
			height: 20px;
			color: #dc2626;
			flex-shrink: 0;
		}

		.zest-error-content h4 {
			font-size: 0.875rem;
			font-weight: 600;
			color: #dc2626;
			margin: 0 0 4px 0;
		}

		.zest-error-content p {
			font-size: 0.8125rem;
			color: var(--zest-foreground);
			margin: 0;
		}

		.zest-disclaimer {
			font-size: 0.75rem;
			color: var(--zest-muted-foreground);
			margin: 0 0 16px 0;
			line-height: 1.5;
		}

		@media (max-width: 480px) {
			.zest-chat-widget {
				bottom: 16px;
				right: 16px;
			}

			.zest-chat-popover {
				width: calc(100vw - 32px);
			}

			.zest-chat-button {
				width: 56px;
				height: 56px;
			}

			.zest-chat-button svg {
				width: 24px;
				height: 24px;
			}
		}
	`;
	document.head.appendChild(style);

	// Create HTML structure
	const widgetHTML = `
		<div class="zest-chat-widget">
			<div class="zest-chat-popover" id="zestChatPopover" role="dialog" aria-labelledby="zestDialogTitle" aria-describedby="zestDialogDescription" aria-hidden="true">
				<div class="zest-chat-header">
					<h3 id="zestDialogTitle">${config.title}</h3>
					<p id="zestDialogDescription">${config.description}</p>
					<button class="zest-close-button" id="zestCloseButton" aria-label="Close contact form">
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="zest-chat-body">
					<div class="zest-success-message" id="zestSuccessMessage" role="status" aria-live="polite" aria-atomic="true">
						<svg class="zest-success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<div class="zest-success-content">
							<h4 id="zestSuccessTitle">Message sent!</h4>
							<p id="zestSuccessText">Share your details below and we'll message you via SMS — reply anytime that suits you.</p>
						</div>
					</div>

					<div class="zest-error-message" id="zestErrorMessage" role="alert" aria-live="assertive" aria-atomic="true">
						<svg class="zest-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<div class="zest-error-content">
							<h4 id="zestErrorTitle">Something went wrong</h4>
							<p id="zestErrorText">Please try again or contact us directly.</p>
						</div>
					</div>

					<form class="zest-chat-form" id="zestChatForm">
						<div class="zest-form-group">
							<label for="zestNameInput" class="zest-form-label">Name</label>
							<input type="text" id="zestNameInput" class="zest-form-input" placeholder="Your name" autocomplete="name" maxlength="100" required />
						</div>

						<div class="zest-form-group">
							<label for="zestMobileInput" class="zest-form-label">Mobile Number</label>
							<input type="tel" id="zestMobileInput" class="zest-form-input" placeholder="0412 345 678" autocomplete="tel" maxlength="15" required />
						</div>

						<div class="zest-form-group">
							<label for="zestMessageInput" class="zest-form-label">Message</label>
							<textarea id="zestMessageInput" class="zest-form-textarea" placeholder="How can we help?" autocomplete="off" rows="1" maxlength="500" required></textarea>
						</div>

						<p class="zest-disclaimer">
							By submitting this form, you agree to receive SMS and email communications from Zest Mortgage Solutions.
						</p>

						<button type="submit" class="zest-submit-button" id="zestSubmitButton">Start Conversation</button>
					</form>
				</div>
			</div>

			<button class="zest-chat-button" id="zestChatButton" aria-label="Open contact form" aria-haspopup="dialog" aria-expanded="false">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
				</svg>
			</button>
		</div>
	`;

	// Initialize widget when DOM is ready
	function initWidget() {
		document.body.insertAdjacentHTML('beforeend', widgetHTML);

		const chatButton = document.getElementById('zestChatButton');
		const chatPopover = document.getElementById('zestChatPopover');
		const closeButton = document.getElementById('zestCloseButton');
		const chatForm = document.getElementById('zestChatForm');
		const submitButton = document.getElementById('zestSubmitButton');
		const successMessage = document.getElementById('zestSuccessMessage');
		const errorMessage = document.getElementById('zestErrorMessage');
		const nameInput = document.getElementById('zestNameInput');
		const mobileInput = document.getElementById('zestMobileInput');

		function openPopover() {
			chatPopover.classList.add('open');
			chatButton.setAttribute('aria-expanded', 'true');
			chatPopover.setAttribute('aria-hidden', 'false');
			setTimeout(() => nameInput.focus(), 100);
		}

		chatButton.addEventListener('click', () => {
			const isOpen = chatPopover.classList.toggle('open');
			chatButton.setAttribute('aria-expanded', isOpen);
			chatPopover.setAttribute('aria-hidden', !isOpen);
			if (isOpen) {
				setTimeout(() => nameInput.focus(), 100);
			}
		});

		closeButton.addEventListener('click', () => {
			chatPopover.classList.remove('open');
			chatButton.setAttribute('aria-expanded', 'false');
			chatPopover.setAttribute('aria-hidden', 'true');
		});

		document.addEventListener('click', (e) => {
			if (!e.target.closest('.zest-chat-widget')) {
				chatPopover.classList.remove('open');
				chatButton.setAttribute('aria-expanded', 'false');
				chatPopover.setAttribute('aria-hidden', 'true');
			}
		});

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && chatPopover.classList.contains('open')) {
				chatPopover.classList.remove('open');
				chatButton.setAttribute('aria-expanded', 'false');
				chatPopover.setAttribute('aria-hidden', 'true');
			}
		});

		chatForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			e.stopImmediatePropagation();

			submitButton.disabled = true;
			submitButton.textContent = 'Submitting...';
			submitButton.setAttribute('aria-busy', 'true');

			const formData = {
				name: nameInput.value.trim(),
				mobile: mobileInput.value.trim(),
				message: document.getElementById('zestMessageInput').value.trim(),
				currentPage: window.location.href,
				utm: {},
				referrer: document.referrer || 'N/A',
			};

			formData.utm = new URLSearchParams(window.location.search).toString().split('&').reduce((acc, param) => {
				const [key, value] = param.split('=');
				if (key && key.startsWith('utm_')) {
					acc[key] = decodeURIComponent(value);
				}
				return acc;
			}, {});

			if (Object.keys(formData.utm).length === 0) {
				formData.utm = 'N/A';
			}

			try {
				const response = await fetch(config.webhookUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
					keepalive: true,
				});

				if (!response.ok) throw new Error('Failed to submit');

				document.getElementById('zestSuccessTitle').textContent = `Thanks ${formData.name}!`;
				document.getElementById('zestSuccessText').textContent = 'Jane will send you a text shortly.';
				successMessage.classList.add('show');

				setTimeout(() => {
					successMessage.classList.remove('show');
					chatForm.reset();
				}, 5000);

			} catch (error) {
				console.error('Error:', error);
				document.getElementById('zestErrorTitle').textContent = `Sorry ${formData.name}!`;
				document.getElementById('zestErrorText').textContent = 'We couldn\'t send your message, please try again.';
				errorMessage.classList.add('show');

				setTimeout(() => {
					errorMessage.classList.remove('show');
				}, 5000);

			} finally {
				submitButton.disabled = false;
				submitButton.textContent = 'Start Conversation';
				submitButton.setAttribute('aria-busy', 'false');
			}
		});

		// Expose API for programmatic control
		window.ZestChat = {
			open: openPopover,
			close: () => {
				chatPopover.classList.remove('open');
				chatButton.setAttribute('aria-expanded', 'false');
				chatPopover.setAttribute('aria-hidden', 'true');
			}
		};
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initWidget);
	} else {
		initWidget();
	}

})();
