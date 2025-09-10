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
    
    // Check business hours (9:30 AM - 4:30 PM with 30 min buffer)
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const startTime = 9 * 60 + 30; // 9:30 AM
    const endTime = 16 * 60 + 30;  // 4:30 PM
    
    if (timeInMinutes < startTime || timeInMinutes > endTime) {
        document.getElementById('result2').innerHTML = 'Appointments only available 9:30 AM - 4:30 PM!';
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
    
    // Check if it's a weekend (Saturday = 6, Sunday = 0)
    const dayOfWeek = appointmentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        document.getElementById('result2').innerHTML = 'We are closed on weekends!';
        document.getElementById('result2').className = 'error';
        document.getElementById('result2').style.display = 'block';
        return;
    }
    
    document.getElementById('result2').innerHTML = 'Appointment scheduled successfully!';
    document.getElementById('result2').className = 'success';
    document.getElementById('result2').style.display = 'block';
});