# 🎨 BG Remover - AI-Powered Background Removal Web App

A modern, full-stack web application for removing image backgrounds using AI technology. Built with React, Node.js, Express, and the remove.bg API.

## 🌟 Features

- ✨ **AI-Powered Background Removal** - Advanced machine learning for precise background removal
- ⚡ **Lightning Fast Processing** - Remove backgrounds in just 2-3 seconds
- 🎯 **Precise Edge Detection** - Handles complex edges like hair and fur
- 📥 **Easy Download** - Get PNG with transparent background instantly
- 🎨 **Beautiful Modern UI** - Dark theme with glassmorphism design
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🆓 **Free Tier Available** - 50 free API calls per month
- 🔒 **Secure** - Server-side API key handling, no exposure to frontend

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Frontend Features](#frontend-features)
- [Backend Implementation](#backend-implementation)
- [remove.bg API Details](#removebg-api-details)
- [Error Handling](#error-handling)
- [Performance](#performance)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## 🛠 Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icon library
- **Vite** - Next-generation build tool
- **ESLint** - Code quality

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling
- **node-fetch** - HTTP client
- **form-data** - Multipart form handling
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

### API
- **remove.bg** - AI background removal service

## 📁 Project Structure

```
ai-prompt-pix/
├── src/
│   ├── pages/
│   │   ├── Index.tsx          # Main page with UI
│   │   └── NotFound.tsx       # 404 page
│   ├── components/
│   │   ├── NavLink.tsx        # Navigation component
│   │   └── ui/                # Shadcn UI components
│   ├── hooks/
│   │   ├── use-toast.ts       # Toast notifications
│   │   └── use-mobile.tsx     # Mobile detection
│   ├── lib/
│   │   └── utils.ts           # Utility functions
│   ├── App.tsx                # Main app component
│   ├── main.tsx               # Entry point
│   ├── App.css                # Global styles
│   └── index.css              # Base styles
├── public/
│   └── robots.txt
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
└── components.json

backend/
├── index.js                   # Express server
├── package.json
└── .env                       # Environment variables
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A remove.bg API key (free account)

### Frontend Setup

```bash
# Navigate to frontend directory
cd ai-prompt-pix

# Install dependencies
npm install
# or
yarn install
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
# or
yarn install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
REMOVE_BG_API_KEY=your_remove_bg_api_key_here
```

**How to get your remove.bg API Key:**
1. Visit [remove.bg/api](https://www.remove.bg/api)
2. Click "Get API Key"
3. Sign up (free - no credit card required)
4. Copy your API key from the dashboard
5. Paste it in your `.env` file

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend
npm start
# or
npm run dev  # with nodemon for auto-reload
```

Expected output:
```
[dotenv] injecting env (1) from .env
API Key loaded: YES
Server running on port 3000
```

### Start Frontend Development Server

```bash
cd ai-prompt-pix
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📚 API Documentation

### Endpoint: `/api/edit`

**Request:**
```http
POST /api/edit
Content-Type: multipart/form-data

{
  "image": <File>,
  "prompt": "Remove background"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| image | File | Yes | Image file (JPG, PNG, WebP) |
| prompt | string | Yes | Currently only "Remove background" is processed |

**Response (Success - 200):**
```json
{
  "imageBase64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}
```

**Response (Error):**
```json
{
  "error": "Error message describing what went wrong"
}
```

**Error Codes:**
| Code | Message | Solution |
|------|---------|----------|
| 400 | No image file uploaded | Upload an image file |
| 500 | API key not configured | Add REMOVE_BG_API_KEY to .env |
| 500 | Remove.bg failed | Check API key validity, rate limits |

## 🎨 Frontend Features

### Upload Section
- **Drag & Drop** - Drag images directly onto the upload area
- **Click Upload** - Browse files using file picker
- **Preview** - Display uploaded image before processing
- **File Validation** - Only accept image files

### Processing
- **Loading State** - Animated loader during processing
- **Real-time Feedback** - Toast notifications for success/errors
- **Error Handling** - User-friendly error messages

### Results
- **Side-by-Side Comparison** - Original vs processed image
- **Download** - Export as PNG with transparent background
- **Retry** - Upload a new image without page reload
- **Quality Indicator** - Visual feedback on processing

## 🔧 Backend Implementation

### Request Handling
```javascript
// Parse multipart form data
const imageBuffer = req.file.buffer;
const apiKey = process.env.REMOVE_BG_API_KEY?.trim();

// Create FormData for remove.bg API
const formData = new FormData();
formData.append("image_file", imageBuffer, "image.png");
formData.append("size", "auto");
formData.append("format", "auto");
```

### API Communication
```javascript
const removeResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
  method: "POST",
  headers: {
    "X-API-Key": apiKey,
    ...formData.getHeaders(),
  },
  body: formData,
});
```

### Response Handling
```javascript
// Convert image to base64
const buffer = await removeResponse.buffer();
const resultBase64 = buffer.toString("base64");

// Return to frontend
res.json({ imageBase64: resultBase64 });
```

## 🌐 remove.bg API Details

### Overview
Professional background removal API with 12+ million successful runs.

### Key Information
| Property | Value |
|----------|-------|
| Endpoint | `https://api.remove.bg/v1.0/removebg` |
| Authentication | API Key (X-API-Key header) |
| Free Tier | 50 calls/month |
| Cost After Free | $0.01/call (approximately) |
| Max File Size | 12 MB |
| Max Resolution | 50 megapixels |
| Processing Time | ~2 seconds |
| Output Format | PNG with transparency |

### Supported Formats
**Input:** JPG, PNG, WebP
**Output:** PNG (with transparency), JPG, WebP, ZIP

### Rate Limits
- **500 megapixels/minute** total processing
- Example: 1MP image = 500 calls/min
- Example: 10MP image = 50 calls/min

### Parameters Used
```javascript
size: "auto"      // Automatically determines optimal size
format: "auto"    // Returns best format (PNG for transparency)
```

## 🛡️ Error Handling

### Frontend Error Handling
```typescript
// Validates file type
if (!file.type.startsWith("image/")) {
  // Show error toast
}

// Validates API response
if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.error);
}
```

### Backend Error Handling
```javascript
// API Key validation
if (!apiKey) {
  return res.status(500).json({ 
    error: "API key not configured" 
  });
}

// API response validation
if (!removeResponse.ok) {
  const error = await removeResponse.json();
  throw new Error(`Remove.bg failed: ${error.errors?.[0]?.title}`);
}

// Comprehensive try-catch
try {
  // Process
} catch (err) {
  res.status(500).json({ error: err.message });
}
```

## ⚡ Performance

### Optimizations
- **Server-side Processing** - No client-side image processing overhead
- **Efficient Formats** - Base64 encoding for easy transmission
- **Minimal Dependencies** - Lightweight libraries only
- **Error Recovery** - Graceful error handling with retry capability
- **Responsive Design** - Mobile-first CSS approach

### Typical Performance
- **Upload Time** - <1 second (depends on file size)
- **Processing Time** - 2-3 seconds (remove.bg API)
- **Download Time** - <1 second (depends on network)
- **Total** - ~3-4 seconds end-to-end

## 🔄 Workflow

1. **User uploads image** → Validated on frontend
2. **Frontend sends to backend** → Multipart form data
3. **Backend receives image** → File buffer extraction
4. **Backend calls remove.bg API** → Passes image + API key
5. **remove.bg processes** → ~2 seconds processing
6. **Backend receives result** → Base64 encoded PNG
7. **Backend sends to frontend** → JSON response
8. **Frontend displays result** → Side-by-side comparison
9. **User downloads** → PNG with transparent background

## 📦 Dependencies

### Frontend
```json
{
  "react": "^18.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "lucide-react": "^0.x",
  "vite": "^5.x"
}
```

### Backend
```json
{
  "express": "^4.x",
  "multer": "^1.x",
  "node-fetch": "^2.x",
  "form-data": "^4.x",
  "dotenv": "^16.x",
  "cors": "^2.x"
}
```

## 🚀 Future Enhancements

### Planned Features
- [ ] **Batch Processing** - Upload multiple images at once
- [ ] **Image History** - Save processing history
- [ ] **Custom Backgrounds** - Add custom background colors
- [ ] **Advanced Editing** - Fine-tune edges after removal
- [ ] **Image Comparison Slider** - Interactive before/after
- [ ] **Dark/Light Mode Toggle** - User preference
- [ ] **Analytics Dashboard** - Track usage statistics
- [ ] **API Integration** - Allow other apps to use your instance
- [ ] **WebP Output** - Additional output format support
- [ ] **Compression Options** - Adjust output quality

### Optimization Ideas
- [ ] **Redis Caching** - Cache processed results
- [ ] **Image Compression** - Reduce upload file sizes
- [ ] **Progressive Upload** - Show upload progress
- [ ] **Worker Threads** - Parallel processing
- [ ] **Database Storage** - Store processing history

## 🐛 Troubleshooting

### "API Key not configured"
- Ensure `.env` file exists in `backend/` directory
- Verify `REMOVE_BG_API_KEY=your_key` is in `.env`
- Restart backend server after adding .env

### "Failed to remove background"
- Check your remove.bg API key is valid
- Verify you haven't exceeded 50 free calls/month
- Ensure image format is supported (JPG, PNG, WebP)
- Check image is not corrupted

### Port already in use
- Backend: `lsof -i :3000` then kill process
- Frontend: Change port in vite.config.ts

### CORS errors
- Verify backend CORS is enabled
- Check frontend is calling correct backend URL
- Ensure backend is running on port 3000

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Created as a MERN Stack Assignment Project

## 🙌 Acknowledgments

- **remove.bg** - For providing excellent background removal API
- **Shadcn/ui** - For beautiful UI components
- **Tailwind CSS** - For amazing utility-first styling
- **Lucide Icons** - For perfect icon library

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check your API key validity
4. Verify all environment variables are set

## 🎯 Getting Started Guide

### Quick Start (5 minutes)

1. **Get API Key** (2 min)
   - Visit [remove.bg/api](https://www.remove.bg/api)
   - Sign up free (no credit card)
   - Copy API key

2. **Setup Backend** (1 min)
   ```bash
   cd backend
   echo "REMOVE_BG_API_KEY=your_key" > .env
   npm install && npm start
   ```

3. **Setup Frontend** (1 min)
   ```bash
   cd ai-prompt-pix
   npm install && npm run dev
   ```

4. **Start Using** (1 min)
   - Open http://localhost:5173
   - Upload an image
   - Click "Remove Background"
   - Download result!

---

**Happy background removing! 🎉**

Last Updated: November 25, 2025
#   R e m o v e - B g - a s s i g n m e n t  
 