const menuItems = document.querySelectorAll('.menu li a');
const contentArea = document.getElementById('content-area');

menuItems.forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();

        const contentType = item.getAttribute('data-content');

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