document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth'
    });
    calendar.render();
  });

const menuItems = document.querySelectorAll('.menu li a');
const contentArea = document.getElementById('content-area');
const selectedOption = document.getElementById('selected-option');
const calendarContainer = document.getElementById('calendar-container');

menuItems.forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();

        const contentType = item.getAttribute('data-content');

        const optionText = item.textContent;
        selectedOption.textContent = optionText;

        //default hidden until 'calendar' is clicked
        calendarContainer.style.display = 'none';

        contentArea.innerHTML = '';

        switch (contentType) {
            case 'home-tab':
                contentArea.innerHTML = 'homepage content';
                break;
            case 'calendar-tab':
                contentArea.innerHTML = 'calendar content';
                break;
            case 'notes-tab':
                contentArea.innerHTML = 'notes content';
                break;
            case 'notifications-tab':
                contentArea.innerHTML = 'notifications content';
                break;
            default:
                contentArea.innerHTML = 'Default Content';
        }
    });
});
