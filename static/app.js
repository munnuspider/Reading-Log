function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    if (screenId === 'screen-tbr') loadBooks();
    if (screenId === 'screen-profile') loadProfile();
}
//the above is the function i am going to use to switch between menu screens
//i really need to brush up on javascript so i will probs go do that now

async function loadBooks() {
    const res = await fetch('/books');
    window.tbrBooks = await res.json();
    renderTbrBooks(window.tbrBooks);
}

function renderTbrBooks(books) {
    const list = document.getElementById('book-list');
    list.innerHTML = '';
    books.forEach(book => {
        list.innerHTML += `
            <div class="book-entry" data-id="${book[0]}">
                <div class="book-display">
                    <p><strong>${book[1]}</strong> by ${book[2]}</p>
                    <p>Rating: ${book[3] ?? '-'} | Status: ${book[4]}</p>
                    <p>${book[5] ?? ''}</p>
                    <button onclick="deleteBook(${book[0]})">Delete</button>
                    <button onclick="showEditForm(${book[0]})">Edit</button>
                </div>
                <div class="book-edit hidden">
                    <input type="number" class="edit-rating" min="1" max="5" value="${book[3] ?? ''}" placeholder="Rating (1-5)">
                    <select class="edit-status">
                        <option value="to_read" ${book[4] === 'to_read' ? 'selected' : ''}>To Read</option>
                        <option value="reading" ${book[4] === 'reading' ? 'selected' : ''}>Reading</option>
                        <option value="read" ${book[4] === 'read' ? 'selected' : ''}>Read</option>
                    </select>
                    <textarea class="edit-comments" placeholder="Comments...">${book[5] ?? ''}</textarea>
                    <button onclick="saveEdit(${book[0]})">Save</button>
                    <button onclick="cancelEdit(${book[0]})">Cancel</button>
                </div>
            </div>
        `;
    });
}

function filterTbrBooks() {
    const query = document.getElementById('search-tbr').value.toLowerCase();
    const filtered = window.tbrBooks.filter(b =>
        b[1].toLowerCase().includes(query) || b[2].toLowerCase().includes(query)
    );
    renderTbrBooks(filtered);
}

async function addBook() {
    const res = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: document.getElementById('input-title').value,
            author: document.getElementById('input-author').value,
            rating: document.getElementById('input-rating').value,
            status: document.getElementById('input-status').value,
            comments: document.getElementById('input-comments').value
        })
    });
    const data = await res.json();

    if (!data.success) {
        alert("Please fill in all required fields!");
    } else {
        loadBooks();
        // clear the form after adding
        document.getElementById('input-title').value = '';
        document.getElementById('input-author').value = '';
        document.getElementById('input-rating').value = '';
        document.getElementById('input-status').value = '';
        document.getElementById('input-comments').value = '';
    }
}

async function deleteBook(id) {
    await fetch('/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    });
    loadBooks();
}

// edit mode: toggle between the display view and the editable form for one book
function showEditForm(id) {
    const entry = document.querySelector(`.book-entry[data-id="${id}"]`);
    entry.querySelector('.book-display').classList.add('hidden');
    entry.querySelector('.book-edit').classList.remove('hidden');
}

function cancelEdit(id) {
    const entry = document.querySelector(`.book-entry[data-id="${id}"]`);
    entry.querySelector('.book-display').classList.remove('hidden');
    entry.querySelector('.book-edit').classList.add('hidden');
}

// NOTE: backend only has /update-rating and /update-status (no /update-comments yet),
// so comments typed here won't actually persist until that route exists
async function saveEdit(id) {
    const entry = document.querySelector(`.book-entry[data-id="${id}"]`);
    const rating = entry.querySelector('.edit-rating').value;
    const status = entry.querySelector('.edit-status').value;
    // const comments = entry.querySelector('.edit-comments').value; // not saved yet, see note above

    const [ratingRes, statusRes] = await Promise.all([
        fetch('/update-rating', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, rating })
        }),
        fetch('/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status })
        })
    ]);

    if (!ratingRes.ok || !statusRes.ok) {
        alert("Couldn't save changes — try again.");
        return;
    }

    loadBooks();
}

// multi-add: lets you add several books to the TBR in one go
let multiAddRowCount = 0;

function addBookRow() {
    const rowId = multiAddRowCount++;
    const container = document.getElementById('multi-add-rows');
    const row = document.createElement('div');
    row.className = 'multi-add-row';
    row.dataset.rowId = rowId;
    row.innerHTML = `
        <input type="text" class="multi-title" placeholder="Title">
        <input type="text" class="multi-author" placeholder="Author">
        <select class="multi-status">
            <option value="to_read">To Read</option>
            <option value="reading">Reading</option>
            <option value="read">Read</option>
        </select>
        <button type="button" onclick="this.parentElement.remove()">Remove</button>
    `;
    container.appendChild(row);
}

async function addAllBooks() {
    const rows = document.querySelectorAll('#multi-add-rows .multi-add-row');
    const books = Array.from(rows).map(row => ({
        title: row.querySelector('.multi-title').value,
        author: row.querySelector('.multi-author').value,
        status: row.querySelector('.multi-status').value
    })).filter(b => b.title.trim() !== '');

    if (books.length === 0) {
        alert("Add at least one book with a title first!");
        return;
    }

    for (const book of books) {
        await fetch('/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
    }

    document.getElementById('multi-add-rows').innerHTML = '';
    loadBooks();
}

async function loadProfile() {
    const stats = await fetch('/stats').then(r => r.json());
    document.getElementById('stat-total').textContent = stats.total_read;
    document.getElementById('stat-month').textContent = stats.read_this_month;

    const books = await fetch('/all-books').then(r => r.json());
    
    const current = books.find(b => b[4] === 'reading');
    document.getElementById('current-book').textContent = current
        ? `${current[1]} by ${current[2]}`
        : 'Nothing yet!';

    window.readBooks = books.filter(b => b[4] === 'read');
    renderReadBooks(window.readBooks);
}

function renderReadBooks(books) {
    const list = document.getElementById('read-books-list');
    list.innerHTML = '';
    books.forEach(book => {
        list.innerHTML += `
            <div class="book-entry">
                <p><strong>${book[1]}</strong> by ${book[2]}</p>
            </div>
        `;
    });
}

function filterReadBooks() {
    const query = document.getElementById('search-read').value.toLowerCase();
    const filtered = window.readBooks.filter(b =>
        b[1].toLowerCase().includes(query) || b[2].toLowerCase().includes(query)
    );
    renderReadBooks(filtered);
}

//the syntax is surprisingly like C except no OOP and like no malloc()