import sqlite3
from datetime import date

DB = "booklibrary.db"

def get_connection():
    conn = sqlite3.connect(DB)
    return conn, conn.cursor()

def init_db():
    conn, cursor = get_connection()
    cursor.execute("CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, rating INTEGER)")
    try:
        cursor.execute("ALTER TABLE books ADD COLUMN status TEXT DEFAULT 'to_read'")
    except sqlite3.OperationalError:
        pass
    try:
        cursor.execute("ALTER TABLE books ADD COLUMN comments TEXT")
    except sqlite3.OperationalError:
        pass
    try:
        cursor.execute("ALTER TABLE books ADD COLUMN date_added TEXT")
    except sqlite3.OperationalError:
        pass
    conn.commit()
    conn.close()

def add_book(title, author, rating, status, comments):
    conn, cursor = get_connection()
    today = str(date.today())
    cursor.execute("INSERT INTO books (title, author, rating, status, comments, date_added) VALUES (?, ?, ?, ?, ?, ?)", (title, author, rating, status, comments, today))
    conn.commit()
    conn.close()

def view_tbr_books():
    conn, cursor = get_connection()
    cursor.execute("SELECT * FROM books WHERE status = 'to_read'")
    books = cursor.fetchall()
    conn.close()
    return books

def update_rating(new_rating, book_to_update):
    conn, cursor = get_connection()
    cursor.execute("UPDATE books SET rating = ? WHERE id = ?", (new_rating, book_to_update))
    conn.commit()
    conn.close()

def delete_book(book_to_delete):
    conn, cursor = get_connection()
    cursor.execute("DELETE FROM books WHERE id = ?", (book_to_delete,))
    conn.commit()
    conn.close()

def update_status(book_to_change_status, new_status):
    conn, cursor = get_connection()
    cursor.execute("UPDATE books SET status = ? WHERE id = ?", (new_status, book_to_change_status))
    conn.commit()
    conn.close()

def get_books_read_this_month():
    conn, cursor = get_connection()
    month = str(date.today())[:7]
    cursor.execute("SELECT COUNT(*) FROM books WHERE status = 'read' AND date_added LIKE ?", (month + '%',))
    count = cursor.fetchone()[0]
    conn.close()
    return count

def get_total_books_read():
    conn, cursor = get_connection()
    cursor.execute("SELECT COUNT(*) FROM books WHERE status = 'read'")
    count = cursor.fetchone()[0]
    conn.close()
    return count

def get_all_books():
    conn, cursor = get_connection()
    cursor.execute("SELECT * FROM books")
    books = cursor.fetchall()
    conn.close()
    return books