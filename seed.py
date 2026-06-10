import sqlite3
from datetime import date

DB = "booklibrary.db"

books = [
    ("The Association of Small Bombs", "Unknown", "to_read"),
    ("A Streetcar Named Desire", "Tennessee Williams", "to_read"),
    ("Don Quixote", "Miguel de Cervantes", "to_read"),
    ("A Spy in the House of Love", "Anaïs Nin", "to_read"),
    ("The Picture of Dorian Gray", "Oscar Wilde", "to_read"),
    ("The Metamorphosis", "Franz Kafka", "to_read"),
    ("Lolita", "Vladimir Nabokov", "read"),
    ("The Prophet", "Kahlil Gibran", "read"),
    ("The Blind Owl", "Sadegh Hedayat", "to_read"),
    ("The Tartar Steppe", "Dino Buzzati", "to_read"),
    ("The Hour of the Star", "Clarice Lispector", "to_read"),
    ("Auto-da-Fé", "Elias Canetti", "to_read"),
    ("Pedro Páramo", "Juan Rulfo", "to_read"),
    ("The Brothers Karamazov", "Fyodor Dostoevsky", "to_read"),
    ("Crime and Punishment", "Fyodor Dostoevsky", "read"),
    ("The Great Gatsby", "F. Scott Fitzgerald", "to_read"),
    ("To Kill a Mockingbird", "Harper Lee", "to_read"),
    ("The Kite Runner", "Khaled Hosseini", "to_read"),
    ("The Road", "Cormac McCarthy", "to_read"),
    ("Atonement", "Ian McEwan", "to_read"),
    ("A Clockwork Orange", "Anthony Burgess", "to_read"),
    ("The Bighead", "Edward Lee", "to_read"),
    ("Tender is the Flesh", "Agustina Bazterrica", "to_read"),
    ("The Troop", "Nick Cutter", "to_read"),
    ("All the Pretty Dolls", "Unknown", "to_read"),
    ("White Nights", "Fyodor Dostoevsky", "to_read"),
    ("King of Wrath", "Ana Huang", "to_read"),
    ("Pride and Prejudice", "Jane Austen", "to_read"),
    ("A Court of Thorns and Roses", "Sarah J. Maas", "to_read"),
    ("Red Queen", "Victoria Aveyard", "to_read"),
    ("The Cruel Prince", "Holly Black", "read"),
    ("Jane Eyre", "Charlotte Brontë", "to_read"),
    ("Why I Am So Clever", "Friedrich Nietzsche", "to_read"),
    ("Mahabharat", "Unknown", "to_read"),
    ("The Saga of Gunnlaug Serpent-Tongue", "Unknown", "read"),
    ("Mrs Rosie and the Priest", "Unknown", "read"),
    ("Philosophy and Analysis of Education", "Unknown", "to_read"),
    ("Men Are from Mars Women Are from Venus", "John Gray", "to_read"),
    ("A Room of One's Own", "Virginia Woolf", "to_read"),
    ("Rebecca", "Daphne du Maurier", "to_read"),
    ("Wise Blood", "Flannery O'Connor", "to_read"),
    ("A Good Man is Hard to Find", "Flannery O'Connor", "to_read"),
    ("The Grapes of Wrath", "John Steinbeck", "to_read"),
    ("The Catcher in the Rye", "J.D. Salinger", "to_read"),
    ("The Idiot", "Fyodor Dostoevsky", "to_read"),
    ("War and Peace", "Leo Tolstoy", "to_read"),
    ("Frankenstein", "Mary Shelley", "to_read"),
    ("Dracula", "Bram Stoker", "to_read"),
    ("Powerless", "Lauren Roberts", "to_read"),
    ("The Gambler", "Fyodor Dostoevsky", "to_read"),
    ("Fourth Wing", "Rebecca Yarros", "to_read"),
    ("Slouching Towards Bethlehem", "Joan Didion", "to_read"),
    ("The Bell Jar", "Sylvia Plath", "to_read"),
    ("American Psycho", "Bret Easton Ellis", "to_read"),
    ("The Phantom of the Opera", "Gaston Leroux", "to_read"),
    ("Anne of Green Gables", "L.M. Montgomery", "to_read"),
    ("Wuthering Heights", "Emily Brontë", "to_read"),
    ("The Iliad", "Homer", "to_read"),
    ("Animal Farm", "George Orwell", "to_read"),
    ("1984", "George Orwell", "to_read"),
    ("Middlemarch", "George Eliot", "to_read"),
    ("The Secret Garden", "Frances Hodgson Burnett", "to_read"),
    ("A Study in Scarlet", "Arthur Conan Doyle", "to_read"),
    ("Master of the Game", "Sidney Sheldon", "read"),
    ("The Heart is a Lonely Hunter", "Carson McCullers", "to_read"),
    ("Shostakovich: A Life Coded in Music", "Brian Morton", "to_read"),
]

conn = sqlite3.connect(DB)
cursor = conn.cursor()

today = str(date.today())

for title, author, status in books:
    cursor.execute(
        "INSERT INTO books (title, author, status, date_added) VALUES (?, ?, ?, ?)",
        (title, author, status, today)
    )

conn.commit()
conn.close()
print(f"Done! {len(books)} books added.")