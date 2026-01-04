// ===================================
// EasyExpense Authentication JavaScript
// Client-side validation and form handling
// ===================================

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/auth';

// ===================================
// Utility Functions
// ===================================

/**
 * Display error message for a field
 */
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    if (inputElement) {
        inputElement.classList.add('error');
        inputElement.classList.remove('success');
    }
}

/**
 * Clear error message for a field
 */
function clearError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    if (inputElement) {
        inputElement.classList.remove('error');
    }
}

/**
 * Mark field as valid
 */
function markValid(fieldId) {
    const inputElement = document.getElementById(fieldId);
    if (inputElement) {
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
    }
}

/**
 * Show alert message
 */
function showAlert(type, message) {
    const alertId = type === 'success' ? 'successAlert' : 'errorAlert';
    const messageId = type === 'success' ? 'successMessage' : 'errorMessage';
    
    const alertElement = document.getElementById(alertId);
    const messageElement = document.getElementById(messageId);
    
    if (alertElement && messageElement) {
        messageElement.textContent = message;
        alertElement.style.display = 'flex';
        
        // Hide other alert type
        const otherAlertId = type === 'success' ? 'errorAlert' : 'successAlert';
        const otherAlert = document.getElementById(otherAlertId);
        if (otherAlert) {
            otherAlert.style.display = 'none';
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 5000);
    }
}

/**
 * Show/hide loading overlay
 */
function setLoading(isLoading) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const submitBtn = document.querySelector('button[type="submit"]');
    
    if (loadingOverlay) {
        loadingOverlay.style.display = isLoading ? 'flex' : 'none';
    }
    
    if (submitBtn) {
        submitBtn.disabled = isLoading;
    }
}

// ===================================
// Validation Functions
// ===================================

/**
 * Validate name field
 */
function validateName(name) {
    if (!name || name.trim() === '') {
        return { valid: false, message: 'Name is required' };
    }
    if (name.trim().length < 3) {
        return { valid: false, message: 'Name must be at least 3 characters' };
    }
    if (name.length > 100) {
        return { valid: false, message: 'Name must not exceed 100 characters' };
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return { valid: false, message: 'Name can only contain letters and spaces' };
    }
    return { valid: true };
}

/**
 * Validate email field
 */
function validateEmail(email) {
    if (!email || email.trim() === '') {
        return { valid: false, message: 'Email is required' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    if (email.length > 255) {
        return { valid: false, message: 'Email must not exceed 255 characters' };
    }
    return { valid: true };
}

/**
 * Validate password field
 */
function validatePassword(password) {
    if (!password || password === '') {
        return { valid: false, message: 'Password is required' };
    }
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/[a-zA-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true };
}

/**
 * Calculate password strength
 */
function getPasswordStrength(password) {
    if (!password) return 'none';
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Character variety
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

/**
 * Update password strength indicator
 */
function updatePasswordStrength(password) {
    const strengthElement = document.querySelector('.strength-bar');
    if (!strengthElement) return;
    
    const strength = getPasswordStrength(password);
    
    strengthElement.className = 'strength-bar';
    if (strength !== 'none') {
        strengthElement.classList.add(strength);
    }
}

// ===================================
// Password Toggle Functionality
// ===================================

function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.previousElementSibling || this.parentElement.querySelector('input');
            
            if (input) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                
                // Update icon (optional visual feedback)
                this.style.color = type === 'text' ? 'var(--primary-color)' : '';
            }
        });
    });
}

// ===================================
// Sign Up Form
// ===================================

function initSignupForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Real-time validation
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            const result = validateName(this.value);
            if (!result.valid) {
                showError('name', result.message);
            } else {
                clearError('name');
                markValid('name');
            }
        });
        
        nameInput.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearError('name');
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const result = validateEmail(this.value);
            if (!result.valid) {
                showError('email', result.message);
            } else {
                clearError('email');
                markValid('email');
            }
        });
        
        emailInput.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearError('email');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
            if (this.classList.contains('error')) {
                clearError('password');
            }
        });
        
        passwordInput.addEventListener('blur', function() {
            const result = validatePassword(this.value);
            if (!result.valid) {
                showError('password', result.message);
            } else {
                clearError('password');
                markValid('password');
            }
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', function() {
            if (passwordInput && this.value !== passwordInput.value) {
                showError('confirmPassword', 'Passwords do not match');
            } else if (this.value === '') {
                showError('confirmPassword', 'Please confirm your password');
            } else {
                clearError('confirmPassword');
                markValid('confirmPassword');
            }
        });
        
        confirmPasswordInput.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearError('confirmPassword');
            }
        });
    }
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        
        const nameResult = validateName(nameInput.value);
        if (!nameResult.valid) {
            showError('name', nameResult.message);
            isValid = false;
        }
        
        const emailResult = validateEmail(emailInput.value);
        if (!emailResult.valid) {
            showError('email', emailResult.message);
            isValid = false;
        }
        
        const passwordResult = validatePassword(passwordInput.value);
        if (!passwordResult.valid) {
            showError('password', passwordResult.message);
            isValid = false;
        }
        
        if (confirmPasswordInput.value !== passwordInput.value) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        
        if (!isValid) {
            showAlert('error', 'Please fix the errors before submitting');
            return;
        }
        
        // Submit to API
        setLoading(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    password: passwordInput.value,
                    confirm_password: confirmPasswordInput.value
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showAlert('success', data.message || 'Registration successful! Redirecting...');
                form.reset();
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = data.redirect || 'signin.html';
                }, 2000);
            } else {
                showAlert('error', data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAlert('error', 'Unable to connect to server. Please try again later.');
        } finally {
            setLoading(false);
        }
    });
    
    // Initialize password toggle
    initPasswordToggle();
}

// ===================================
// Sign In Form
// ===================================

function initSigninForm() {
    const form = document.getElementById('signinForm');
    if (!form) return;
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    
    // Real-time validation
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const result = validateEmail(this.value);
            if (!result.valid) {
                showError('email', result.message);
            } else {
                clearError('email');
                markValid('email');
            }
        });
        
        emailInput.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearError('email');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            if (this.value === '') {
                showError('password', 'Password is required');
            } else {
                clearError('password');
                markValid('password');
            }
        });
        
        passwordInput.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearError('password');
            }
        });
    }
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate fields
        let isValid = true;
        
        const emailResult = validateEmail(emailInput.value);
        if (!emailResult.valid) {
            showError('email', emailResult.message);
            isValid = false;
        }
        
        if (passwordInput.value === '') {
            showError('password', 'Password is required');
            isValid = false;
        }
        
        if (!isValid) {
            showAlert('error', 'Please fix the errors before submitting');
            return;
        }
        
        // Submit to API
        setLoading(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailInput.value.trim(),
                    password: passwordInput.value,
                    remember_me: rememberMeCheckbox ? rememberMeCheckbox.checked : false
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showAlert('success', data.message || 'Login successful! Redirecting...');
                
                // Store session token if provided
                if (data.session_token) {
                    localStorage.setItem('session_token', data.session_token);
                }
                
                // Store user data
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                
                // Redirect after 1.5 seconds
                setTimeout(() => {
                    window.location.href = data.redirect || 'dashboard.php';
                }, 1500);
            } else {
                showAlert('error', data.message || 'Login failed. Please check your credentials.');
                
                // Add delay to prevent brute force (client-side deterrent)
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('error', 'Unable to connect to server. Please try again later.');
        } finally {
            setLoading(false);
        }
    });
    
    // Initialize password toggle
    initPasswordToggle();
}

// ===================================
// Initialize on page load
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on and initialize accordingly
    // (The specific init function will be called from the HTML)
    console.log('EasyExpense Auth initialized');
});
