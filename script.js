// Appointment Cards - Edge Cases Demo
// This script demonstrates the difference between handling and not handling edge cases

// Business hours configuration
const BUSINESS_HOURS = {
    start: 9,  // 9 AM
    end: 17    // 5 PM
};

// Maximum months ahead for scheduling
const MAX_MONTHS_AHEAD = 3;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAppointmentCards();
});

function initializeAppointmentCards() {
    // Set up the first form (NO edge case handling)
    setupFormWithoutEdgeCases();
    
    // Set up the second form (WITH edge case handling)
    setupFormWithEdgeCases();
}

// ========================================
// FORM 1: WITHOUT EDGE CASE HANDLING
// ========================================
function setupFormWithoutEdgeCases() {
    const form = document.getElementById('appointmentForm1');
    const resultDiv = document.getElementById('result1');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const appointmentData = {
            name: formData.get('name'),
            email: formData.get('email'),
            date: formData.get('date'),
            time: formData.get('time')
        };
        
        // NO VALIDATION - Just accept whatever the user submits
        // This is BAD practice and demonstrates what happens without edge case handling
        
        showResult(resultDiv, 'success', 
            `✅ Appointment scheduled for ${appointmentData.name}!<br>
             Date: ${appointmentData.date}<br>
             Time: ${appointmentData.time}<br>
             Email: ${appointmentData.email}<br><br>
             <strong>⚠️ Note:</strong> This form accepts ANY date/time, even past dates or impossible times!`
        );
        
        // Clear the form
        form.reset();
    });
}

// ========================================
// FORM 2: WITH PROPER EDGE CASE HANDLING
// ========================================
function setupFormWithEdgeCases() {
    const form = document.getElementById('appointmentForm2');
    const resultDiv = document.getElementById('result2');
    const dateInput = document.getElementById('date2');
    const timeInput = document.getElementById('time2');
    
    // Set minimum date to today (prevents past dates)
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    // Set maximum date to 3 months from now
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + MAX_MONTHS_AHEAD);
    dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
    
    // Add real-time validation
    dateInput.addEventListener('change', function() {
        validateDate(this);
    });
    
    timeInput.addEventListener('change', function() {
        validateTime(this);
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const appointmentData = {
            name: formData.get('name'),
            email: formData.get('email'),
            date: formData.get('date'),
            time: formData.get('time')
        };
        
        // COMPREHENSIVE VALIDATION - Handle all edge cases
        const validationResult = validateAppointment(appointmentData);
        
        if (validationResult.isValid) {
            showResult(resultDiv, 'success', 
                `✅ Appointment successfully scheduled!<br>
                 Name: ${appointmentData.name}<br>
                 Date: ${formatDate(appointmentData.date)}<br>
                 Time: ${appointmentData.time}<br>
                 Email: ${appointmentData.email}<br><br>
                 <strong>✅ All validations passed!</strong>`
            );
            
            // Clear the form
            form.reset();
            // Reset min/max attributes
            dateInput.setAttribute('min', today);
            dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
        } else {
            showResult(resultDiv, 'error', 
                `❌ Appointment scheduling failed:<br>
                 <strong>${validationResult.errorMessage}</strong><br><br>
                 Please correct the issues and try again.`
            );
            
            // Add shake animation to the form
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
        }
    });
}

// ========================================
// VALIDATION FUNCTIONS
// ========================================

function validateAppointment(data) {
    // Check if all required fields are filled
    if (!data.name || !data.email || !data.date || !data.time) {
        return {
            isValid: false,
            errorMessage: 'All fields are required.'
        };
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return {
            isValid: false,
            errorMessage: 'Please enter a valid email address.'
        };
    }
    
    // Validate date (not in the past)
    const appointmentDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    if (appointmentDate < today) {
        return {
            isValid: false,
            errorMessage: 'Cannot schedule appointments in the past. Please select today or a future date.'
        };
    }
    
    // Validate date (not too far in the future)
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + MAX_MONTHS_AHEAD);
    
    if (appointmentDate > maxDate) {
        return {
            isValid: false,
            errorMessage: `Cannot schedule appointments more than ${MAX_MONTHS_AHEAD} months in advance.`
        };
    }
    
    // Validate business hours
    const timeValidation = validateBusinessHours(data.time);
    if (!timeValidation.isValid) {
        return {
            isValid: false,
            errorMessage: timeValidation.errorMessage
        };
    }
    
    // Validate weekend scheduling (optional - uncomment if needed)
    const dayOfWeek = appointmentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday = 0, Saturday = 6
        return {
            isValid: false,
            errorMessage: 'Appointments are not available on weekends. Please select a weekday.'
        };
    }
    
    // If we get here, all validations passed
    return { isValid: true };
}

function validateBusinessHours(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const businessStartMinutes = BUSINESS_HOURS.start * 60;
    const businessEndMinutes = BUSINESS_HOURS.end * 60;
    
    if (timeInMinutes < businessStartMinutes) {
        return {
            isValid: false,
            errorMessage: `Appointments are only available between ${BUSINESS_HOURS.start}:00 AM and ${BUSINESS_HOURS.end}:00 PM.`
        };
    }
    
    if (timeInMinutes >= businessEndMinutes) {
        return {
            isValid: false,
            errorMessage: `Appointments are only available between ${BUSINESS_HOURS.start}:00 AM and ${BUSINESS_HOURS.end}:00 PM.`
        };
    }
    
    return { isValid: true };
}

function validateDate(dateInput) {
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        dateInput.setCustomValidity('Cannot select a past date');
        dateInput.classList.add('invalid');
    } else {
        dateInput.setCustomValidity('');
        dateInput.classList.remove('invalid');
    }
}

function validateTime(timeInput) {
    const timeString = timeInput.value;
    const validation = validateBusinessHours(timeString);
    
    if (!validation.isValid) {
        timeInput.setCustomValidity(validation.errorMessage);
        timeInput.classList.add('invalid');
    } else {
        timeInput.setCustomValidity('');
        timeInput.classList.remove('invalid');
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function showResult(element, type, message) {
    element.className = `result ${type}`;
    element.innerHTML = message;
    element.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ========================================
// EDUCATIONAL COMMENTS
// ========================================

/*
EDGE CASES HANDLED IN THIS DEMO:

1. PAST DATES:
   - Problem: Users can schedule appointments in the past
   - Solution: Set min attribute on date input and validate in JavaScript
   - Code: dateInput.setAttribute('min', today)

2. FUTURE DATE LIMITS:
   - Problem: Users can schedule appointments years in advance
   - Solution: Set max attribute and validate against business rules
   - Code: maxDate.setMonth(maxDate.getMonth() + MAX_MONTHS_AHEAD)

3. BUSINESS HOURS:
   - Problem: Users can schedule outside business hours
   - Solution: Validate time against business hours range
   - Code: validateBusinessHours() function

4. WEEKEND SCHEDULING:
   - Problem: Users can schedule on weekends when business is closed
   - Solution: Check day of week and reject weekends
   - Code: dayOfWeek === 0 || dayOfWeek === 6

5. EMAIL VALIDATION:
   - Problem: Invalid email addresses can be submitted
   - Solution: Use regex pattern to validate email format
   - Code: emailRegex.test(data.email)

6. REQUIRED FIELDS:
   - Problem: Users can submit empty forms
   - Solution: Check all required fields are filled
   - Code: !data.name || !data.email || !data.date || !data.time

7. REAL-TIME VALIDATION:
   - Problem: Users only find out about errors on submit
   - Solution: Validate inputs as user types/selects
   - Code: addEventListener('change', validateFunction)

ADDITIONAL EDGE CASES TO CONSIDER:

- Time zone handling for global applications
- Holiday scheduling (block out specific dates)
- Appointment duration conflicts
- Maximum appointments per day
- User authentication and authorization
- Data persistence and storage
- Network connectivity issues
- Browser compatibility
- Mobile device considerations
- Accessibility requirements
*/
