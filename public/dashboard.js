const calendarEl = document.getElementById('calendar');
const editButtons = document.querySelector('.edit-buttons');
var selectedDate = new Date();
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
        editButtons.classList.remove('invisible');
        // Get all events for selected date
        const events = calendar.getEvents();
        const currentDate = info.start;
        selectedDate = currentDate;
        const selectedEntries = events.filter(event => {
            return event.start.toDateString() === currentDate.toDateString();
        }
        );

        // Populate left panel with events
        const entriesPanel = document.querySelector('#entries');
        entriesPanel.innerHTML = '';
        selectedEntries.forEach(async(entry) => {
            const clone = await renderEntry(entry);
            entriesPanel.appendChild(clone);
        });
    },
    // date unselected
    unselect: function(info) {
        editButtons.classList.add('invisible');
    },
  });

function clearCalendar(){
    calendar.getEvents().forEach(event => {
        event.remove();
    });
}

const createButton = document.querySelector('#create-entry-button');
createButton.addEventListener('click', () => {
    showCreateModal(selectedDate);
});

async function renderEntry(entry){
    // Clone template
    const template = document.querySelector('#entry-template');
    const clone = template.cloneNode(true);
    clone.classList.remove('hidden');
    clone.id = '';

    // Populate clone with event data
    const title = clone.querySelector('.entry-title');
    const content = clone.querySelector('.entry-content');
    const editButton = clone.querySelector('.edit-button');
    const deleteButton = clone.querySelector('.delete-button');

    // Fetch event data
    const fullEntry = await getEntryById(entry.id);
    console.log(fullEntry);

    title.textContent = fullEntry.title;
    content.textContent = fullEntry.content;

    deleteButton.addEventListener('click', () => {
        clone.remove();
        deleteEntry(entry.id).then(response => {
            refreshCalendar();
        });
    });

    return clone;
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

calendar.render();
refreshCalendar();