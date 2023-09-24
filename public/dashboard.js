const calendarEl = document.getElementById('calendar');
const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    dateClick: function(info) {
        // Select current date
        calendar.select(info.date);
        //console.log(info);
        //showCreateModal(info.date);
    },
    // date selected
    select: function(info) {
        // Get all events for selected date
        const events = calendar.getEvents();
        const selectedDate = info.start;
        const selectedEntries = events.filter(event => {
            return event.start.toDateString() === selectedDate.toDateString();
        }
        );
        // Clear left panel
        const entriesPanel = document.querySelector('#entries');
        entriesPanel.innerHTML = '';

        // Populate left panel with events
        selectedEntries.forEach(async(entry) => {
            const clone = await renderEntry(entry);
            entriesPanel.appendChild(clone);
        });
    },
    // date unselected
    unselect: function(info) {
        console.log(info);
    },
  });
calendar.render();

function clearCalendar(){
    calendar.getEvents().forEach(event => {
        event.remove();
    });
}


async function renderEntry(entry){
    // Get template element
    const template = document.querySelector('#entry-template');
    // Clone template
    const clone = template.cloneNode(true);
    // Remove hidden class
    clone.classList.remove('hidden');
    // Populate clone with event data
    const title = clone.querySelector('.entry-title');
    const content = clone.querySelector('.entry-content');
    //const tags = clone.querySelector('.entry-tags');
    //const date = clone.querySelector('.entry-date');
    const editButton = clone.querySelector('.edit-button');
    const deleteButton = clone.querySelector('.delete-button');

    // Fetch event data
    const fullEntry = await getEntryById(entry.id);
    console.log(fullEntry);

    title.textContent = fullEntry.title;
    content.textContent = fullEntry.content;
    //tags.textContent = fullEntry.tags;
    // date.textContent = entry.start.toLocaleDateString('en-US', {
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric'
    // });
    // Add event listeners
    // editButton.addEventListener('click', () => {
    //     showEditModal(entry.start);
    // });
    deleteButton.addEventListener('click', () => {
        clone.remove();
        deleteEntry(entry.id).then(response => {
            refreshCalendar();
        });
    });
    // Append clone to left panel
    return clone;
    //entriesPanel.appendChild(clone);
}

function loadEntryPreviews(){
    fetch('/entry/preview')
    .then(response => response.json())
    .then(data => {
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

async function getEntryById(id) {
    const response = await fetch(`/entry/${id}`);
    const data = await response.json();
    return data;
}

// Delete entry
// router.delete('/:id', async (req, res) => {
//     const entry = await Entry.findOne({
//       where: {
//         id: req.params.id,
//         userId: req.user.id
//       }
//     });
//     await entry.destroy();
//     res.json({ message: "Deleted entry" });
//   });

async function deleteEntry(id){
    const response = fetch(`/entry/${id}`, {
        method: 'DELETE'
    });
    return response;
}


async function createEntry(title, content, tags, entryDate){
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

function refreshCalendar(){
    clearCalendar();
    loadEntryPreviews();
}


refreshCalendar();

function showEditModal(date){
    const modal = document.getElementById('edit-modal');
    modal.showModal();
}

function showCreateModal(date) {
    const form = document.querySelector('#edit-form');
    const modal = document.getElementById('edit-modal');

    // Clear form
    form.reset();
  
    // Define named function for event handling
    function handleSubmit(event) {
      event.preventDefault();
  
      const formData = new FormData(form);
      const title = formData.get('title');
      const content = formData.get('content');
      const tags = formData.get('tags');
      const entryDate = date;
      createEntry(title, content, tags, entryDate);
  
      // Close modal
      modal.close();
  
      // Remove event listener
      form.removeEventListener('submit', handleSubmit);
    }
  
    // Add submit event listener
    form.addEventListener('submit', handleSubmit);
  
    // Define named function for close event handling
    function handleClose() {
      form.removeEventListener('submit', handleSubmit);
    }
  
    // Add close event listener
    modal.addEventListener('close', handleClose, { once: true });
    
    // Add cancel button event listener
    const cancelButton = modal.querySelector('#edit-cancel');
    cancelButton.addEventListener('click', () => {
        modal.close();
        handleClose();
    });
  
    const readableDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  
    modal.querySelector('#edit-date').textContent = readableDate;
    modal.showModal();
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