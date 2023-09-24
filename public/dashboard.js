const calendarEl = document.getElementById('calendar');
const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    // dayCellContent: function(info) {
    //   const targetDate = '2023-09-30'; // Replace with your date
    //   if (info.dateStr === targetDate) {
    //     const iconElement = document.createElement('i');
    //     iconElement.className = 'fas fa-star'; // Font Awesome icon class
    //     info.cellContainer.appendChild(iconElement);
    //   }
    // },
    dateClick: function(info) {
      const targetDate = '2023-09-30'; // Replace with your date
      if (info.dateStr === targetDate) {
        alert('Date clicked: ' + info.dateStr);
      }
    }
  });
calendar.render();

// Add event to calendar for today for testing
// calendar.addEvent({
//     title: 'TEST',
//     start: new Date(),
//     // Do not display time
//     allDay: true,
//     // ends tomorrow
//     //end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
// });

function getEntryPreview(){
    fetch('/entry/preview')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(entry => {
            calendar.addEvent({
                title: entry.title,
                start: entry.entryDate,
                allDay: true,
                id: entry.id,
                tags: entry.tags
            });
        });
    });
}

function getEntryForDate(date){

}

function createEntry(title, content, tags, entryDate){
    fetch('/entry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            content,
            tags,
            entryDate
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        calendar.addEvent({
            title: data.title,
            start: data.entryDate,
            allDay: true,
            id: data.id,
            tags: data.tags
        });
    });
}

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