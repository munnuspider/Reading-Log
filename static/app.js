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
    const books = await res.json();
    const list = document.getElementById('book-list');
    list.innerHTML = '';
    books.forEach(book => {
        list.innerHTML += `
            <div class="book-entry">
                <p><strong>${book[1]}</strong> by ${book[2]}</p>
                <p>Rating: ${book[3]} | Status: ${book[4]}</p>
                <p>${book[5] ?? ''}</p>
                <button onclick="deleteBook(${book[0]})">Delete</button>
            </div>
        `;
    });
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