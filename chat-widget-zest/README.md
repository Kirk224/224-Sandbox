# Chat Widget

## Installation

### Option 1: Simple Script Tag

Add this single line to your website before the closing `</body>` tag:

```html
<script src="chat-widget-zest.js"></script>
```

### Option 2: With Custom Configuration

```html
<script>
  window.ZestChatConfig = {
    webhookUrl: 'https://your-webhook-url.com',
    title: 'Chat with our team',
    description: 'We\'ll respond via SMS within minutes',
    primaryColor: '#274f37',
    primaryHoverColor: '#365943'
  };
</script>
<script src="chat-widget-zest.js"></script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `webhookUrl` | string | Zest webhook URL | Your webhook endpoint for form submissions |
| `title` | string | "Start a conversation..." | Widget header title |
| `description` | string | "Please complete your details..." | Widget header description |
| `primaryColor` | string | `#274f37` | Primary brand color |
| `primaryHoverColor` | string | `#365943` | Hover state color |

## Programmatic API

After the widget loads, you can control it programmatically:

```javascript
// Open the chat widget
window.ZestChat.open();

// Close the chat widget
window.ZestChat.close();
```

### Trigger from Custom Button

You can trigger the widget from any element on your page:

```html
<button data-open-popover>Contact Us</button>
```

Or using JavaScript:

```html
<button onclick="window.ZestChat.open()">Start Chat</button>
```

## Form Data Structure

When submitted, the form sends this data to your webhook:

```json
{
  "name": "John Doe",
  "mobile": "0412 345 678",
  "message": "I'd like to learn more",
  "currentPage": "https://yoursite.com/page",
  "referrer": "https://google.com",
  "utm": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "spring_sale"
  }
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Files

- `chat-widget-zest.html` - Standalone demo page
- `chat-widget-zest.js` - Production-ready widget script
- `README.md` - This file

## Customization

The widget uses CSS custom properties (variables) for easy theming. You can override these in your own CSS:

```css
:root {
  --zest-primary: #your-color;
  --zest-primary-hover: #your-hover-color;
}
```

## License

MIT

## Support

For issues or questions, please contact your development team.
