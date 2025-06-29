# 🚀 Samas Portfolio - Google Colab Style

A creative and interactive portfolio website inspired by Google Colab's notebook interface. Built with HTML, CSS, Bootstrap, and JavaScript to showcase your skills and projects in a unique, code-execution style format.

## ✨ Features

### 🎨 Visual Design
- **Google Colab-inspired Interface**: Dark theme with notebook-style cells
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional look with smooth animations
- **Custom Scrollbars**: Styled scrollbars matching the theme

### 📝 Interactive Notebook Cells
- **Code Execution Simulation**: Click play buttons to "execute" cells
- **Cell Management**: Add, delete, and reorder cells dynamically
- **Syntax Highlighting**: Python-style code highlighting
- **Output Display**: Realistic terminal-style output areas

### 🎯 Portfolio Sections
- **About Me**: Personal introduction with code-style presentation
- **Skills**: Interactive skills visualization with categorized tags
- **Projects**: Project showcase with tech stack and live links
- **Experience**: Professional timeline with company details
- **Contact**: Contact form with social media links

### ⚡ Interactive Features
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + Enter`: Run current cell
  - `Ctrl/Cmd + Shift + Enter`: Run all cells
  - `Ctrl/Cmd + B`: Add new cell
- **Theme Toggle**: Switch between dark and light themes
- **Smooth Navigation**: Sidebar navigation with smooth scrolling
- **Auto-execution**: Cells can be set to auto-execute on load

### 🛠️ Technical Features
- **Bootstrap 5**: Modern responsive framework
- **Font Awesome Icons**: Beautiful iconography
- **Google Fonts**: Roboto and JetBrains Mono for optimal readability
- **CSS Custom Properties**: Easy theme customization
- **ES6 Classes**: Modern JavaScript architecture

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. That's it! The portfolio is ready to use

### Customization

#### Personal Information
Edit the `index.html` file to update:
- Your name and title
- Contact information
- Skills and technologies
- Project details
- Work experience

#### Styling
Modify `styles.css` to customize:
- Color scheme (CSS custom properties in `:root`)
- Typography
- Layout and spacing
- Animations and transitions

#### Functionality
Update `script.js` to add:
- New interactive features
- Custom animations
- Additional keyboard shortcuts
- Integration with external APIs

## 📁 File Structure

```
Samas_Portfolio/
├── index.html          # Main HTML structure
├── styles.css          # All styling and themes
├── script.js           # Interactive functionality
└── README.md           # This file
```

## 🎨 Customization Guide

### Changing Colors
The color scheme is defined using CSS custom properties in `styles.css`:

```css
:root {
    --primary-color: #1a73e8;    /* Google Blue */
    --secondary-color: #34a853;  /* Google Green */
    --accent-color: #ea4335;     /* Google Red */
    --bg-dark: #202124;          /* Dark background */
    --text-primary: #e8eaed;     /* Primary text */
    /* ... more colors */
}
```

### Adding New Cells
To add a new cell programmatically:

```javascript
portfolio.addNewCell();
```

### Custom Animations
Add new animations in `styles.css`:

```css
@keyframes yourAnimation {
    from { /* starting state */ }
    to { /* ending state */ }
}
```

## 🎯 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio! Some ideas for improvements:

- Add more cell types (markdown, charts, etc.)
- Integrate with real APIs
- Add more keyboard shortcuts
- Create different themes
- Add export functionality

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by Google Colab's interface
- Built with Bootstrap 5
- Icons by Font Awesome
- Fonts by Google Fonts

## 📞 Contact

- **Portfolio**: [Your Portfolio URL]
- **GitHub**: [Your GitHub Profile]
- **LinkedIn**: [Your LinkedIn Profile]
- **Email**: [Your Email]

---

**Made with ❤️ and lots of ☕**

*This portfolio showcases not just my skills, but also my creativity in presenting them in a unique, interactive way that stands out from traditional portfolios.* 