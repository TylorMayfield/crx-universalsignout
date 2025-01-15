# Universal Sign Out

An extension that provides one-click sign out functionality for any web application you're currently using. Simple, secure, and efficient.

## Features

- **One-Click Sign Out**: Instantly log out of your current web application
- **Universal Compatibility**: Works with most common web applications
- **Privacy Focused**: No data collection or tracking
- **Modern UI**: Built with React and Mantine UI
- **Lightweight**: Minimal impact on browser performance

## Getting Started

1. Install from the Chrome Web Store (link coming soon)
2. Click the extension icon when you want to sign out
3. That's it! The extension will handle the sign out process

## For Developers

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load the extension:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` directory

## Project Structure

```
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── App.css          # Global styles
├── src/components/      # Component directory
└── index.html          # HTML template
├── manifest.json       # Extension manifest
├── vite.config.js      # Vite configuration
└── icon.png           # Extension icon
└── PRIVACY.md         # Privacy policy
└── README.md          # Project README
└── package.json       # Project configuration
└── package-lock.json  # Project lock file
```

## Privacy

This extension is designed with privacy in mind. It does not collect any personal data, track user behavior, or store any information. For more details, see our [Privacy Policy](PRIVACY.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
