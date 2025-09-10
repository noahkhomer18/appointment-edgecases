// Card 1: No edge case handling
document.getElementById('appointmentForm1').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('result1').innerHTML = 'Appointment scheduled! (No validation)';
    document.getElementById('result1').className = 'success';
    document.getElementById('result1').style.display = 'block';
});

// Card 2: With edge case handling
document.getElementById('appointmentForm2').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const date = document.getElementById('date2').value;
    const time = document.getElementById('time2').value;
    const today = new Date().toISOString().split('T')[0];
    
    // Check if date is in the past
    if (date < today) {
        document.getElementById('result2').innerHTML = 'Cannot schedule in the past!';
        document.getElementById('result2').className = 'error';
        document.getElementById('result2').style.display = 'block';
        return;
    }
    
    // Check business hours (9 AM - 5 PM)
    const hour = parseInt(time.split(':')[0]);
    if (hour < 9 || hour >= 17) {
        document.getElementById('result2').innerHTML = 'Appointments only available 9 AM - 5 PM!';
        document.getElementById('result2').className = 'error';
        document.getElementById('result2').style.display = 'block';
        return;
    }
    
    // Check if date is more than 3 months away
    const appointmentDate = new Date(date);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    
    if (appointmentDate > maxDate) {
        document.getElementById('result2').innerHTML = 'Cannot schedule more than 3 months ahead!';
        document.getElementById('result2').className = 'error';
        document.getElementById('result2').style.display = 'block';
        return;
    }
    
    document.getElementById('result2').innerHTML = 'Appointment scheduled successfully!';
    document.getElementById('result2').className = 'success';
    document.getElementById('result2').style.display = 'block';
});