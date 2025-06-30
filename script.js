// Google Colab Inspired Portfolio JavaScript

class ColabPortfolio {
    constructor() {
        this.currentCell = 0;
        this.cells = [];
        this.isExecuting = false;
        this.selectedCellIndex = 0; // Track selected cell for keyboard navigation
        this.init();
        this.initSidebar();
    }

    init() {
        this.setupEventListeners();
        this.initializeCells();
        this.setupNavigation();
        this.setupThemeToggle();
        this.hideAllOutputs(); // Hide all outputs by default
        this.initializeSyntaxHighlighting(); // Initialize syntax highlighting
        this.addWelcomeAnimation();
        // Highlight the first cell on load
        setTimeout(() => {
            if (this.cells.length > 0) {
                this.cells.forEach(cell => cell.classList.remove('cell-active'));
                this.cells[0].classList.add('cell-active');
                this.selectedCellIndex = 0;
            }
        }, 0);
    }

    initSidebar() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                // Icon rotation handled by CSS
                localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
            });
            // Restore sidebar state from localStorage
            const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            if (isCollapsed) {
                sidebar.classList.add('collapsed');
            }
        }
        // Run All button functionality
        const runAllBtn = document.getElementById('runAllBtn');
        if (runAllBtn) {
            runAllBtn.addEventListener('click', () => {
                // Simulate running all notebook cells
                document.querySelectorAll('.notebook-cell').forEach(cell => {
                    const output = cell.querySelector('.cell-output');
                    if (output) {
                        output.classList.add('show');
                        // Optionally add animation or highlight
                        output.classList.add('fade-in');
                        setTimeout(() => output.classList.remove('fade-in'), 500);
                    }
                });
            });
        }
        // REMOVED: Add Cell button event listener from here to prevent double cell creation
    }

    setupEventListeners() {
        // Run all cells button
        document.getElementById('runAllBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.runAllCells();
        });

        // Add cell button
        document.getElementById('addCellBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.addNewCell();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
    }

    initializeCells() {
        this.cells = document.querySelectorAll('.notebook-cell');
        this.cells.forEach((cell, index) => {
            // Add run cell functionality
            const runBtn = cell.querySelector('.run-cell');
            if (runBtn) {
                runBtn.addEventListener('click', () => {
                    this.executeCell(cell, index);
                    this.setSelectedCell(index);
                });
            }

            // Add delete cell functionality
            const deleteBtn = cell.querySelector('.delete-cell');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.deleteCell(cell);
                });
            }

            // Add cell number
            const cellNumber = cell.querySelector('.cell-number');
            if (cellNumber) {
                cellNumber.textContent = `[${index}]`;
            }

            // Add click to select cell
            cell.addEventListener('click', (e) => {
                this.setSelectedCell(index);
            });
        });
    }

    setSelectedCell(index) {
        this.selectedCellIndex = index;
        this.cells.forEach(cell => cell.classList.remove('cell-active'));
        if (this.cells[index]) {
            this.cells[index].classList.add('cell-active');
        }
    }

    initializeSyntaxHighlighting() {
        // Initialize Prism.js for syntax highlighting
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
        
        // Re-highlight when cells are added dynamically
        this.observeCodeChanges();
    }

    observeCodeChanges() {
        // Create a mutation observer to re-highlight code when new cells are added
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.classList.contains('notebook-cell')) {
                            // New cell added, highlight its code
                            const codeBlocks = node.querySelectorAll('code[class*="language-python"]');
                            codeBlocks.forEach(block => {
                                if (typeof Prism !== 'undefined') {
                                    Prism.highlightElement(block);
                                }
                            });
                        }
                    });
                }
            });
        });

        // Start observing
        observer.observe(document.querySelector('.notebook-container'), {
            childList: true,
            subtree: true
        });
    }

    hideAllOutputs() {
        // Hide all cell outputs by default
        document.querySelectorAll('.cell-output').forEach(output => {
            output.classList.remove('show');
        });
    }

    setupNavigation() {
        // Highlight active section in sidebar
        const observerOptions = {
            threshold: [0.2,0.5],
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
                    const targetId = entry.target.id;
                    this.updateActiveNavigation(targetId);
                }
            });
        }, observerOptions);

        // Observe all current cells
        this.cells.forEach(cell => {
            if (cell.id) { // Only observe cells with IDs
                observer.observe(cell);
            }
        });

        // Observe dynamically added cells
        const notebookContainer = document.querySelector('.notebook-container');
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.classList.contains('notebook-cell') && node.id) {
                            observer.observe(node);
                        }
                    });
                }
            });
        });

        mutationObserver.observe(notebookContainer, {
            childList: true,
            subtree: true
        });
    }

    updateActiveNavigation(activeId) {
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    scrollToSection(sectionId) {
        const targetCell = document.getElementById(sectionId);
        if (targetCell) {
            targetCell.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    executeCell(cell, index, force = false) {
        if (this.isExecuting && !force) return;

        // Only set isExecuting for manual execution, not for Run All
        if (!force) {
            this.isExecuting = true;
        }
        this.currentCell = index;

        // Add executing animation
        cell.classList.add('executing');
        
        // Update cell number to show execution
        const cellNumber = cell.querySelector('.cell-number');
        const originalText = cellNumber.textContent;
        cellNumber.innerHTML = '<span class="loading"></span>';

        // Simulate execution time
        setTimeout(() => {
            cell.classList.remove('executing');
            cellNumber.textContent = originalText;
            
            // Show the output
            const output = cell.querySelector('.cell-output');
            if (output) {
                output.classList.add('show');
                // Scroll output into view so user sees the result immediately
                output.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Add success indicator
            this.showExecutionSuccess(cell);
            
            if (!force) {
                this.isExecuting = false;
            }
        }, 1500 + Math.random() * 1000);
    }

    showExecutionSuccess(cell) {
        const cellNumber = cell.querySelector('.cell-number');
        const originalText = cellNumber.textContent;
        
        cellNumber.innerHTML = '<i class="fas fa-check text-success"></i>';
        
        setTimeout(() => {
            cellNumber.textContent = originalText;
        }, 2000);
    }

    runAllCells() {
        if (this.isExecuting) return;

        this.isExecuting = true;
        let currentIndex = 0;

        const runNextCell = () => {
            if (currentIndex < this.cells.length) {
                this.executeCell(this.cells[currentIndex], currentIndex, true);
                currentIndex++;
                setTimeout(runNextCell, 2000);
            } else {
                this.isExecuting = false;
                this.showCompletionMessage();
            }
        };

        runNextCell();
    }

    showCompletionMessage() {
        // Create a temporary success message
        const message = document.createElement('div');
        message.className = 'alert alert-success fade-in';
        message.style.position = 'fixed';
        message.style.top = '100px';
        message.style.right = '20px';
        message.style.zIndex = '9999';
        message.innerHTML = '<i class="fas fa-check-circle"></i> All cells executed successfully!';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    addNewCell() {
        // Prevent double cell creation
        if (window._addingCell) return;
        window._addingCell = true;

        const notebookContainer = document.querySelector('.notebook-container');
        const newCellIndex = document.querySelectorAll('.notebook-cell').length;
        const newCell = document.createElement('div');
        newCell.className = 'notebook-cell fade-in';
        newCell.innerHTML = `
            <div class="cell-header">
                <div class="cell-number">[${newCellIndex}]</div>
                <div class="cell-type">Code</div>
                <div class="cell-actions">
                    <button class="btn btn-sm btn-outline-secondary run-cell">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary delete-cell">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="cell-content">
                <div class="code-editor">
                    <pre><code class="language-python"># New Cell ${newCellIndex}
print("This is a new cell!")
print("Add your code here...")

def hello_world():
    """Simple greeting function"""
    return f"Hello from cell {${newCellIndex}}!"

result = hello_world()
print(result)
</code></pre>
                </div>
            </div>
            <div class="cell-output">
                <div class="output-header">
                    <i class="fas fa-terminal"></i> Output
                </div>
                <div class="output-content">
                    <div class="output-line">Hello from cell number ${newCellIndex}!</div>
                </div>
            </div>
        `;

        notebookContainer.appendChild(newCell);
        
        // Update cells array
        this.cells = document.querySelectorAll('.notebook-cell');
        
        // Add event listeners to new cell
        const runBtn = newCell.querySelector('.run-cell');
        const deleteBtn = newCell.querySelector('.delete-cell');
        
        // Use the main executeCell logic for new cells
        runBtn.addEventListener('click', () => {
            const index = Array.from(this.cells).indexOf(newCell);
            this.executeCell(newCell, index);
        });
        
        deleteBtn.addEventListener('click', () => {
            newCell.remove();
            this.cells = document.querySelectorAll('.notebook-cell');
        });

        // Highlight the new cell's code
        const codeBlock = newCell.querySelector('code[class*="language-python"]');
        if (codeBlock && typeof Prism !== 'undefined') {
            Prism.highlightElement(codeBlock);
        }

        // Scroll to new cell
        newCell.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Release the guard after a short delay to allow DOM update
        setTimeout(() => { window._addingCell = false; }, 100);
    }

    deleteCell(cell) {
        if (this.cells.length <= 1) {
            this.showError('Cannot delete the last cell!');
            return;
        }

        cell.style.animation = 'fadeOut 0.3s ease-out';
        
        setTimeout(() => {
            cell.remove();
            this.cells = document.querySelectorAll('.notebook-cell');
            
            // Renumber cells
            this.cells.forEach((cell, index) => {
                const cellNumber = cell.querySelector('.cell-number');
                if (cellNumber) {
                    cellNumber.textContent = `[${index}]`;
                }
            });
        }, 300);
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            if (document.body.classList.contains('light-theme')) {
                icon.className = 'fas fa-sun';
                this.updateThemeColors('light');
            } else {
                icon.className = 'fas fa-moon';
                this.updateThemeColors('dark');
            }
        });
    }

    updateThemeColors(theme) {
        const root = document.documentElement;
        
        if (theme === 'light') {
            root.style.setProperty('--bg-dark', '#ffffff');
            root.style.setProperty('--bg-darker', '#f8f9fa');
            root.style.setProperty('--bg-light', '#e9ecef');
            root.style.setProperty('--text-primary', '#212529');
            root.style.setProperty('--text-secondary', '#6c757d');
            root.style.setProperty('--border-color', '#dee2e6');
            root.style.setProperty('--cell-bg', '#f8f9fa');
            root.style.setProperty('--code-bg', '#f1f3f4');
            root.style.setProperty('--output-bg', '#ffffff');
        } else {
            root.style.setProperty('--bg-dark', '#0d1117');
            root.style.setProperty('--bg-darker', '#010409');
            root.style.setProperty('--bg-light', '#161b22');
            root.style.setProperty('--text-primary', '#f0f6fc');
            root.style.setProperty('--text-secondary', '#8b949e');
            root.style.setProperty('--border-color', '#30363d');
            root.style.setProperty('--cell-bg', '#161b22');
            root.style.setProperty('--code-bg', '#0d1117');
            root.style.setProperty('--output-bg', '#0d1117');
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter: Run current cell
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const activeCell = this.getActiveCell();
            if (activeCell) {
                const index = Array.from(this.cells).indexOf(activeCell);
                this.executeCell(activeCell, index);
                this.setSelectedCell(index);
            }
        }
        
        // Shift + Enter: Run current cell and highlight next cell (keyboard-driven)
        if (e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            const activeCell = this.getActiveCell();
            if (activeCell) {
                const index = Array.from(this.cells).indexOf(activeCell);
                this.executeCell(activeCell, index);
                // Move highlight to next cell immediately
                let nextIndex = index + 1 < this.cells.length ? index + 1 : index;
                this.setSelectedCell(nextIndex);
                this.cells[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        // Ctrl/Cmd + Shift + Enter: Run all cells
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            this.runAllCells();
        }
        
        // Ctrl/Cmd + B: Add new cell
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            this.addNewCell();
        }
    }

    highlightNextCell(currentIndex) {
        // Remove highlight from all cells
        this.cells.forEach(cell => cell.classList.remove('cell-active'));
        // Highlight next cell if it exists, else stay on last cell
        let nextIndex = currentIndex + 1 < this.cells.length ? currentIndex + 1 : currentIndex;
        this.cells[nextIndex].classList.add('cell-active');
        this.cells[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    getActiveCell() {
        // Use selectedCellIndex for keyboard navigation
        if (this.cells.length === 0) return null;
        return this.cells[this.selectedCellIndex] || this.cells[0];
    }

    addWelcomeAnimation() {
        // Add a welcome message when the page loads
        setTimeout(() => {
            this.showNotification('Welcome to Samas Portfolio! 🚀', 'info');
        }, 1000);
        
        // Auto-execute first cell after a delay
        setTimeout(() => {
            this.executeCell(this.cells[0], 0);
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} fade-in`;
        notification.style.position = 'fixed';
        notification.style.top = '100px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        notification.innerHTML = `
            <i class="fas fa-${type === 'info' ? 'info-circle' : type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    showError(message) {
        this.showNotification(message, 'warning');
    }
}

// Utility functions
function downloadResume() {
    // Simulate resume download
    const link = document.createElement('a');
    link.href = '#';
    link.download = './Files/Docs/Resume Firoj.pdf';
    link.click();
    
    // Show notification
    setTimeout(() => {
        portfolio.showNotification('Resume download started! 📄', 'success');
    }, 100);
}

function openGitHub() {
    window.open('https://github.com/samas', '_blank');
}

function sendMessage() {
    const name = document.querySelector('.contact-form input[type="text"]').value;
    const email = document.querySelector('.contact-form input[type="email"]').value;
    const message = document.querySelector('.contact-form textarea').value;
    
    if (!name || !email || !message) {
        portfolio.showError('Please fill in all fields!');
        return;
    }
    
    // Simulate sending message
    portfolio.showNotification('Message sent successfully! 📧', 'success');
    
    // Clear form
    document.querySelector('.contact-form input[type="text"]').value = '';
    document.querySelector('.contact-form input[type="email"]').value = '';
    document.querySelector('.contact-form textarea').value = '';
}

// Add fadeOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    .light-theme {
        --bg-dark: #ffffff;
        --bg-darker: #f8f9fa;
        --bg-light: #e9ecef;
        --text-primary: #212529;
        --text-secondary: #6c757d;
        --border-color: #dee2e6;
        --cell-bg: #f8f9fa;
        --code-bg: #f1f3f4;
        --output-bg: #ffffff;
    }
`;
document.head.appendChild(style);

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new ColabPortfolio();
});

// Add some fun Easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code: ↑↑↓↓←→←→BA
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'b') {
        // You can add fun easter eggs here!
    }
});

// Add smooth scrolling for all internal links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});