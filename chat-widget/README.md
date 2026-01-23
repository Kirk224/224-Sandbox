# Modern Chat Widget

A lightweight, customizable chat widget that can be added to any website with a single script tag.

## Features

- 🎨 Fully customizable colors and text
- 📱 Mobile responsive
- ♿ Accessible (keyboard navigation, ARIA labels)
- 🎯 Form validation with real-time feedback
- 📞 Auto-formatting phone numbers
- ⚡ Lightweight (no dependencies)
- 🔧 Easy to integrate

## Quick Start

### Basic Installation

Add this single line to your HTML, just before the closing `</body>` tag:

```html
<script src="chat-widget.js"></script>
```

That's it! The widget will appear in the bottom-right corner of your website.

## Configuration

### Custom Colors and Text

Add configuration before loading the script:

```html
<script>
  window.ChatWidgetConfig = {
    title: "Need Help?",
    subtitle: "We're here to assist!",
    primaryColor: "#4f46e5",
    secondaryColor: "#7c3aed",
    position: "bottom-left"
  };
</script>
<script src="chat-widget.js"></script>
```

### Handle Form Submissions

Process form data with your own function:

```html
<script>
  window.ChatWidgetConfig = {
    onSubmit: async function(data) {
      // Send to your server
      const response = await fetch('https://your-api.com/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      return response.json();
    }
  };
</script>
<script src="chat-widget.js"></script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | "Chat with us" | Header title |
| `subtitle` | string | "We'll get back to you shortly!" | Header subtitle |
| `primaryColor` | string | "#667eea" | Primary gradient color |
| `secondaryColor` | string | "#764ba2" | Secondary gradient color |
| `position` | string | "bottom-right" | Widget position: "bottom-right" or "bottom-left" |
| `onSubmit` | function | null | Custom form submission handler |

## Form Data Structure

When the form is submitted, the data object contains:

```javascript
{
  name: "John Doe",
  phone: "(555) 123-4567",
  message: "I need help with...",
  timestamp: "2026-01-22T10:30:00.000Z"
}
```

## Examples

### Example 1: Send to Email Service

```html
<script>
  window.ChatWidgetConfig = {
    title: "Contact Us",
    onSubmit: async function(data) {
      await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
  };
</script>
<script src="chat-widget.js"></script>
```

### Example 2: Custom Styling

```html
<script>
  window.ChatWidgetConfig = {
    title: "Get in Touch",
    subtitle: "24/7 Support Available",
    primaryColor: "#ec4899",
    secondaryColor: "#f43f5e",
    position: "bottom-left"
  };
</script>
<script src="chat-widget.js"></script>
```

### Example 3: Google Sheets Integration

```html
<script>
  window.ChatWidgetConfig = {
    onSubmit: async function(data) {
      const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
  };
</script>
<script src="chat-widget.js"></script>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

MIT License - Feel free to use in personal and commercial projects.

## Demo

See `demo.html` for a working example.
