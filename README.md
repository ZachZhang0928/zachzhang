# Zach Zhang - Personal Portfolio Website

A professional portfolio website showcasing Zach Zhang's work as a CS student and Machine Learning researcher, specifically designed for Google AI/ML position applications.

## 🌟 Features

- **Google Material Design 3** - Modern, clean interface following Google's design principles
- **Dark/Light Theme Toggle** - Seamless theme switching with localStorage persistence
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Interactive Avatar System** - Rainbow border animation with upload functionality
- **Google Doodle Style Name** - Animated name with Google brand colors
- **Project Showcase** - Detailed project pages with technical specifications
- **Blog Section** - Technical articles and research insights
- **About Page** - Comprehensive personal and professional information

## 🚀 Live Demo

**Website URL:** https://zachzhang0928.github.io/zachzhang/

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Design System:** Google Material Design 3
- **Fonts:** Google Sans, Material Icons
- **Deployment:** GitHub Pages
- **Features:** LocalStorage, WebSocket-ready, Progressive Web App ready

## 📁 Project Structure

```
zachzhang/
├── index.html              # Homepage with hero section
├── about.html              # About page with skills and education
├── projects.html           # Project showcase grid
├── blog.html               # Technical blog articles
├── style.css               # Main stylesheet with theme support
├── main.js                 # JavaScript functionality
├── ncsu-optimization.html  # Neural Network Optimization project
├── recommendation-engine.html # Smart Recommendation Engine project
├── ai-code-assistant.html  # AI Code Assistant project
├── ai-chat-system.html     # Real-time AI Chat System project
└── README.md               # Project documentation
```

## 🎨 Design Features

### Google Doodle Name Animation
- Each letter uses different Google brand colors
- Bouncing animation with staggered timing
- Hover effects with scale and shadow
- Click to navigate to About page

### Avatar System
- 180px circular avatar with rainbow border
- 8-second rotation animation
- Click to upload new image (JPG/PNG/WebP)
- Right-click or long-press to navigate to About page
- localStorage persistence

### Theme System
- Light and dark mode support
- Google brand colors adapted for both themes
- Smooth transitions between themes
- Persistent theme selection

## 📱 Responsive Design

- **Desktop:** Full layout with sidebar navigation
- **Tablet:** Adjusted spacing and typography
- **Mobile:** Hamburger menu, optimized touch targets
- **Breakpoints:** 1024px, 768px, 480px

## 🔧 Key JavaScript Features

- Theme switching with localStorage
- Avatar upload and management
- Mobile navigation toggle
- Smooth scrolling animations
- Intersection Observer for scroll animations
- File validation and error handling

## 🚀 Deployment

### GitHub Pages Setup

1. **Create Repository:**
   - Repository name: `zachzhang`
   - Description: "Personal portfolio website for Zach Zhang - CS Student & ML Researcher"
   - Visibility: Public

2. **Upload Files:**
   ```bash
   git clone https://github.com/ZachZhang0928/zachzhang.git
   cd zachzhang
   # Copy all project files
   git add .
   git commit -m "Initial portfolio website"
   git push origin main
   ```

3. **Enable GitHub Pages:**
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: main, folder: / (root)
   - Save settings

4. **Access Website:**
   - URL: https://zachzhang0928.github.io/zachzhang/

### Custom Domain (Optional)

If you have a custom domain (e.g., zachzhang.dev):

1. Create `CNAME` file in repository root:
   ```
   zachzhang.dev
   ```

2. Configure DNS records with your domain provider

3. Add custom domain in GitHub Pages settings

## 📊 Performance

- **Page Load Time:** < 3 seconds
- **Animation Frame Rate:** 60fps
- **Image Optimization:** WebP support with fallbacks
- **Caching:** Browser caching and localStorage
- **SEO:** Meta tags, structured data, semantic HTML

## 🎯 Target Audience

This portfolio is specifically designed for:
- **Google AI/ML Recruiters**
- **Machine Learning Researchers**
- **Software Engineering Managers**
- **Technical Hiring Teams**

## 📈 SEO Optimization

- Semantic HTML structure
- Meta descriptions for each page
- Open Graph tags for social sharing
- Structured data markup
- Optimized image alt texts
- Clean URL structure

## 🔒 Security

- No external dependencies except Google Fonts
- Local file processing (no server-side code)
- Input validation for file uploads
- XSS protection through proper escaping

## 🛠️ Development

### Local Development

1. Clone the repository
2. Open `index.html` in a web browser
3. Use a local server for testing (recommended):
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

While this is a personal portfolio, suggestions and improvements are welcome through issues and pull requests.

## 📞 Contact

- **Email:** zachzhang0928@outlook.com
- **GitHub:** https://github.com/ZachZhang0928
- **Location:** Boston, MA

---

**Built with ❤️ for Google AI/ML opportunities** 