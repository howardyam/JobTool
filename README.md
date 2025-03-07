# JobTool

JobTool is a desktop application that helps you manage job applications by capturing job details from websites, organizing them, and automatically generating tailored resumes. It consists of two main components:

1. A Chrome extension that captures job details from websites (like JobStreet or LinkedIn)
2. An Electron desktop app that stores job details and generates tailored resumes

## Features

- Capture job details from any website via right-click context menu
- Organize job applications by status (New, Applied, Interview, Offer, Rejected)
- Store job descriptions, requirements, and application notes
- Generate tailored resumes for each job using AI (Google Gemini API or mock API)
- Export and import job data to/from Excel
- Estimate hiring chance for each job based on resume match

## Prerequisites

- Node.js (v18 or later)
- Chrome browser (for extension testing)
- Git (optional, for version control)

## Project Structure

```
jobtool/
├── extension/           # Chrome extension code
│   ├── manifest.json    # Extension manifest
│   ├── background.js    # Background script
│   ├── content.js       # Content script
│   └── package.json     # Extension package file
└── electron/            # Electron desktop app
    ├── main.js          # Main process
    ├── index.html       # Main UI
    ├── renderer.js      # Renderer process
    ├── preload.js       # Preload script
    └── package.json     # Electron package file
```

## Installation & Setup

### Setting Up the Development Environment

1. Clone or download this repository:
   ```
   git clone https://github.com/yourusername/jobtool.git
   cd jobtool
   ```

2. Set up the Electron app:
   ```
   cd electron
   npm install
   ```

3. Set up the Chrome extension:
   ```
   cd ../extension
   npm install
   ```

### Running the Electron App

From the `electron` directory:
```
npm start
```

### Installing the Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. The extension should now appear in your browser extensions

### Setting Up Native Messaging

For the Chrome extension to communicate with the Electron app, you need to set up native messaging:

#### Windows:

1. Find your Chrome extension ID (on the chrome://extensions page)
2. Edit `electron/native-messaging-host.json` and replace:
   - `PATH_TO_YOUR_EXECUTABLE` with the path to your Electron executable
   - `EXTENSION_ID_GOES_HERE` with your Chrome extension ID
3. Open Registry Editor and add a key:
   - Path: `HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\com.jobtool.app`
   - Value: Full path to your modified `native-messaging-host.json` file

#### macOS:

1. Find your Chrome extension ID
2. Edit `electron/native-messaging-host.json` as above
3. Copy it to: `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.jobtool.app.json`

#### Linux:

1. Find your Chrome extension ID
2. Edit `electron/native-messaging-host.json` as above
3. Copy it to: `~/.config/google-chrome/NativeMessagingHosts/com.jobtool.app.json`

## Using JobTool

1. **Capturing Jobs**: Browse job websites (e.g., LinkedIn, JobStreet). When you find a job you're interested in, right-click and select "Send to JobTool"

2. **Managing Jobs**: In the JobTool desktop app, you can:
   - View all captured jobs
   - Filter jobs by status
   - Add notes and update status
   - Delete jobs you're no longer interested in

3. **Generating Resumes**: Select a job and click "Generate Resume"
   - You can use the default template or customize it
   - The app will analyze the job description and generate a tailored resume
   - The resume will be saved as a PDF file

4. **Settings**: Configure your:
   - Default resume template
   - Google Gemini API key (optional, for better resume generation)

## Building for Production

### Packaging the Electron App

From the `electron` directory:
```
npm run package
```

This will create distributable packages in the `out` directory.

### Publishing the Chrome Extension

1. Create a ZIP file of the `extension` directory
2. Follow [Chrome's instructions](https://developer.chrome.com/docs/webstore/publish/) to publish your extension to the Chrome Web Store

## Customization

### Resume Templates

You can customize the resume generation by editing the default template in the Settings tab. The template uses Markdown syntax and can include variables like:

- `{{title}}` - Job title
- `{{company}}` - Company name
- `{{description}}` - Job description

### Integrating with Google Gemini API

To use the Google Gemini API instead of the mock API:

1. Get an API key from [Google AI Studio](https://ai.google.dev/)
2. Enter your API key in the Settings tab
3. Uncomment the Gemini API code in `electron/main.js` and replace the mock API code

## Troubleshooting

### Chrome Extension Not Connecting

1. Verify that the native messaging host is properly set up
2. Check that the extension ID in `native-messaging-host.json` matches your actual extension ID
3. Make sure the Electron app is running when you use the extension

### Resume Generation Issues

1. If you're using the Gemini API, check that your API key is valid
2. Make sure your job description is detailed enough for the AI to generate a good resume

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Electron framework
- Chrome Extensions API
- Google Gemini API
