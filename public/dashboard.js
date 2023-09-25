const calendarEl = document.getElementById('calendar');
const editButtons = document.querySelector('.edit-buttons');
var selectedDate = new Date();
const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    dateClick: function(info) {
        // Select current date
        calendar.select(info.date);
    },
    // date selected
    select: function(info) {
        // Make create entry buttons visible
        editButtons.classList.remove('invisible');
        // Update global current date variable
        selectedDate = info.start;
        populateEntriesPanel();
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


function populateEntriesPanel(){
    // Get all events for selected date
    const events = calendar.getEvents();
    
    const selectedEntries = events.filter(event => {
        return event.start.toDateString() === selectedDate.toDateString();
    });
    // Populate left panel with events
    const entriesPanel = document.querySelector('#entries');
    entriesPanel.innerHTML = '';
    selectedEntries.forEach(async(entry) => {
        const clone = await renderEntry(entry);
        entriesPanel.appendChild(clone);
    });
}

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
    const reminderButton = clone.querySelector('.reminder-button');

    // Fetch notification status
    getReminderByEntryId(entry.id).then(reminder => {
        if(reminder.length > 0){
            clone.querySelector('.reminder-button > img').src = '/img/bell-on.svg';
            reminderButton.dataset.reminderid = reminder[0].id;
        }
    });

    // Fetch event data
    const fullEntry = await getEntryById(entry.id);

    title.textContent = fullEntry.title;
    content.textContent = fullEntry.content;

    deleteButton.addEventListener('click', async () => {
        if(reminderButton.dataset.reminderid !== '0'){
            await deleteReminder(reminderButton.dataset.reminderid);
        }
        clone.remove();
        deleteEntry(entry.id).then(response => {
            refreshCalendar();
        });
    });

    editButton.addEventListener('click', () => {
        showEditModal(fullEntry);
    });

    // Toggle reminder state
    reminderButton.addEventListener('click', async () => {
        if(reminderButton.dataset.reminderid !== '0'){
            deleteReminder(reminderButton.dataset.reminderid);
            reminderButton.querySelector('img').src = '/img/bell.svg';
            reminderButton.dataset.reminderid = "0";
        } else {
            const reminderId = await createReminder(entry.id, entry.start);
            reminderButton.dataset.reminderid = reminderId;
            reminderButton.querySelector('img').src = '/img/bell-on.svg';
            
        }
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

async function updateEntry(id, title, content, tags){
    fetch(`/entry/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            content,
            tags
        })
    })
    .then(response => response.json())
    .then(data => {
        refreshCalendar();
    });
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
        calendar.addEvent({
            title: data.title,
            start: data.entryDate,
            allDay: true,
            id: data.id,
            tags: data.tags
        });
    });
}

async function createReminder(entryId, reminderTime){
    const response = await fetch('/reminder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            entryId,
            reminderTime
        })
    });
    const data = await response.json();
    return data.id;
}

async function getReminderByEntryId(id){
    const response = await fetch(`/reminder/entry/${id}`);
    const data = await response.json();
    return data;
}

async function deleteReminder(id){
    const response = fetch(`/reminder/${id}`, {
        method: 'DELETE'
    });
    return response;
}

function refreshCalendar(){
    clearCalendar();
    loadEntryPreviews();
}

// Basically the same as showCreateModal but prepopulate the form with data from the entry and send to different endpoint
function showEditModal(entry){
    const form = document.querySelector('#edit-form');
    const modal = document.getElementById('edit-modal');

    form.reset();

    // Populate form data
    form.querySelector('#edit-title').value = entry.title;
    form.querySelector('#edit-content').value = entry.content;
    form.querySelector('#edit-tags').value = entry.tags;
  
    function handleSubmit(event) {
      event.preventDefault();
  
      const formData = new FormData(form);
      const title = formData.get('title');
      const content = formData.get('content');
      const tags = formData.get('tags');

      updateEntry(entry.id, title, content, tags);
      populateEntriesPanel();
  
      modal.close();

      form.removeEventListener('submit', handleSubmit);
    }

    form.addEventListener('submit', handleSubmit);
  
    function handleClose() {
      form.removeEventListener('submit', handleSubmit);
    }
  
    modal.addEventListener('close', handleClose, { once: true });
    
    const cancelButton = modal.querySelector('#edit-cancel');
    cancelButton.addEventListener('click', () => {
        modal.close();
        handleClose();
    });

  
    const readableDate = new Date(entry.entryDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  
    modal.querySelector('#edit-date').textContent = readableDate;
    modal.showModal();
}

function showCreateModal(date) {
    const form = document.querySelector('#edit-form');
    const modal = document.getElementById('edit-modal');

    form.reset();
  
    function handleSubmit(event) {
      event.preventDefault();
  
      const formData = new FormData(form);
      const title = formData.get('title');
      const content = formData.get('content');
      const tags = formData.get('tags');
      const entryDate = date;
      createEntry(title, content, tags, entryDate);
  
      modal.close();
  
      form.removeEventListener('submit', handleSubmit);
    }
  
    form.addEventListener('submit', handleSubmit);
  
    function handleClose() {
      form.removeEventListener('submit', handleSubmit);
    }
  
    modal.addEventListener('close', handleClose, { once: true });
    
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