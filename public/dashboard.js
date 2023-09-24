const calendarEl = document.getElementById('calendar');
const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: 'dayGridMonth'
});
calendar.render();


// const menuItems = document.querySelectorAll('.menu li a');
// const contentArea = document.getElementById('content-area');
// const selectedOption = document.getElementById('selected-option');
// const calendarContainer = document.getElementById('calendar-container');

// menuItems.forEach(item => {
//     item.addEventListener('click', event => {
//         event.preventDefault();

//         const contentType = item.getAttribute('data-content');

//         const optionText = item.textContent;
//         selectedOption.textContent = optionText;

//         //default hidden until 'calendar' is clicked
//         calendarContainer.style.display = 'none';

//         contentArea.innerHTML = '';

//         switch (contentType) {
//             case 'home-tab':
//                 contentArea.innerHTML = 'homepage content';
//                 break;
//             case 'calendar-tab':
//                 contentArea.innerHTML = 'calendar content';
//                 break;
//             case 'notes-tab':
//                 contentArea.innerHTML = 'notes content';
//                 break;
//             case 'notifications-tab':
//                 contentArea.innerHTML = 'notifications content';
//                 break;
//             default:
//                 contentArea.innerHTML = 'Default Content';
//         }
//     });
// });



// TODO: Add "Create new event" button to left panel
// When clicked, open modal with form to create new event

// Sequence of events:
// On page load: pull down preview events from server and populate the calendar days with them, including the event IDs
// When a day is clicked: pull down the events for that day and populate the left side panel with them
// Note that user can click on a day with no entries, and nothing should occur
// When an entry in the left panel is clicked, open a modal for viewing/editing the event. Including a share button
// Share function to be implemented by Alex