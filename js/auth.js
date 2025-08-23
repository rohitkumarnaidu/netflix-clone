/**
 * Netflix Clone Authentication Module
 * Handles user authentication, login/signup forms, and auth state
 */

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    // Check if user is already logged in
    if (netflixAPI.isLoggedIn()) {
      this.loadUserProfile();
    }
    this.updateAuthUI();
    this.bindEvents();
  }

  bindEvents() {
    // Auth modal events
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeModal = document.querySelector('.close-modal');
    const authToggleButtons = document.querySelectorAll('.auth-toggle');

    // Open login modal
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.showAuthModal('login'));
    }

    // Close modal
    if (closeModal) {
      closeModal.addEventListener('click', () => this.hideAuthModal());
    }

    // Close modal when clicking outside
    if (authModal) {
      authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
          this.hideAuthModal();
        }
      });
    }

    // Toggle between login and signup
    authToggleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const mode = btn.dataset.mode;
        this.switchAuthMode(mode);
      });
    });

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // User menu toggle
    const userAvatar = document.getElementById('userAvatar');
    const userMenu = document.getElementById('userMenu');
    
    if (userAvatar && userMenu) {
      userAvatar.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('show');
      });

      // Close user menu when clicking outside
      document.addEventListener('click', () => {
        userMenu.classList.remove('show');
      });
    }
  }

  showAuthModal(mode = 'login') {
    const authModal = document.getElementById('authModal');
    if (authModal) {
      authModal.style.display = 'flex';
      this.switchAuthMode(mode);
    }
  }

  hideAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
      authModal.style.display = 'none';
      this.clearForms();
      this.clearMessages();
    }
  }

  switchAuthMode(mode) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const modalTitle = document.getElementById('authModalTitle');

    if (mode === 'login') {
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
      modalTitle.textContent = 'Sign In to Netflix';
    } else {
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
      modalTitle.textContent = 'Join Netflix Today';
    }

    this.clearMessages();
  }

  async handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    this.showLoading('loginForm');
    this.clearMessages();

    try {
      const response = await netflixAPI.login(credentials);
      
      if (response.success) {
        this.currentUser = response.data.user;
        this.hideAuthModal();
        this.updateAuthUI();
        this.showNotification('Welcome back!', 'success');
        
        // Reload page content to show user-specific data
        this.loadUserContent();
      }
    } catch (error) {
      this.showMessage('loginError', error.message, 'error');
    } finally {
      this.hideLoading('loginForm');
    }
  }

  async handleSignup(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const userData = {
      email: formData.get('email'),
      username: formData.get('username'),
      password: formData.get('password')
    };

    // Basic validation
    if (userData.password.length < 6) {
      this.showMessage('signupError', 'Password must be at least 6 characters long', 'error');
      return;
    }

    this.showLoading('signupForm');
    this.clearMessages();

    try {
      const response = await netflixAPI.signup(userData);
      
      if (response.success) {
        this.currentUser = response.data.user;
        this.hideAuthModal();
        this.updateAuthUI();
        this.showNotification('Welcome to Netflix!', 'success');
        
        // Load user content
        this.loadUserContent();
      }
    } catch (error) {
      this.showMessage('signupError', error.message, 'error');
    } finally {
      this.hideLoading('signupForm');
    }
  }

  async loadUserProfile() {
    try {
      const response = await netflixAPI.getProfile();
      if (response.success) {
        this.currentUser = response.data;
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // Token might be expired, clear it
      netflixAPI.removeToken();
    }
  }

  updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userSection = document.getElementById('userSection');
    const userAvatar = document.getElementById('userAvatar');
    const username = document.getElementById('username');

    if (netflixAPI.isLoggedIn() && this.currentUser) {
      // Show user section, hide login button
      if (loginBtn) loginBtn.style.display = 'none';
      if (userSection) userSection.style.display = 'flex';
      
      // Update user info
      if (username) username.textContent = this.currentUser.username;
      if (userAvatar) {
        userAvatar.textContent = this.currentUser.username.charAt(0).toUpperCase();
      }
    } else {
      // Show login button, hide user section
      if (loginBtn) loginBtn.style.display = 'block';
      if (userSection) userSection.style.display = 'none';
    }
  }

  logout() {
    this.currentUser = null;
    netflixAPI.logout();
    this.updateAuthUI();
    this.showNotification('You have been logged out', 'info');
  }

  // UI Helper Methods
  showLoading(formId) {
    const form = document.getElementById(formId);
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Loading...';
    }
  }

  hideLoading(formId) {
    const form = document.getElementById(formId);
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = formId === 'loginForm' ? 'Sign In' : 'Sign Up';
    }
  }

  showMessage(elementId, message, type = 'error') {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.className = `auth-message ${type}`;
      element.style.display = 'block';
    }
  }

  clearMessages() {
    const messages = document.querySelectorAll('.auth-message');
    messages.forEach(msg => {
      msg.style.display = 'none';
      msg.textContent = '';
    });
  }

  clearForms() {
    const forms = document.querySelectorAll('#authModal form');
    forms.forEach(form => form.reset());
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto hide after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
  }

  loadUserContent() {
    // Trigger loading of user-specific content
    if (window.movieManager) {
      window.movieManager.loadUserData();
    }
  }

  // Utility methods
  isLoggedIn() {
    return netflixAPI.isLoggedIn() && this.currentUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

// Initialize authentication manager
window.authManager = new AuthManager();
