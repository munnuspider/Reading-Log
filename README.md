Shelf Lite Reading Log

A personal book-tracking app with a pixel art aesthetic — log what you're reading, track your progress, and browse your collection like a tiny retro library.
Built as my first substantial web project, focused on learning Flask routing and SQLite.


Features:
Track your books — add titles, authors, status (reading / to-read / finished), and notes
Full CRUD — create, view, update, and delete entries through a REST-style API
Pixel art UI — a lightweight, retro-styled interface built with vanilla JS (no frontend framework)
Persistent storage — SQLite database, no external services required



Tech Stack:
LayerTechBackendPython, FlaskDatabaseSQLiteFrontendHTML, CSS, vanilla JavaScriptAPIREST endpoints (JSON)


Getting Started:

Prerequisites:
Python 3.9+
pip


Installation:
bashgit clone https://github.com/Bhavya-N-Trivedi/shelf-lite.git
cd shelf-lite
pip install -r requirements.txt
python app.py

Visit http://localhost:5000 in your browser.


Project Structure:

shelf-lite/
├── app.py              # Flask routes and app entry point
├── database.py         # SQLite connection and schema
├── static/
│   ├── style.css        # Pixel art styling - a great way to gameify and engage readers
│   └── script.js         # Frontend logic (fetch calls to the API)
├── templates/
│   └── index.html       # Main page
└── requirements.txt


API Endpoints:
MethodEndpointDescriptionGET/api/booksGet all booksPOST/api/booksAdd a new bookPUT/api/books/<id>Update a book's detailsDELETE/api/books/<id>Remove a book


What I Learned:
This project was my introduction to full-stack web development:

Structuring a Flask app with proper route organisation
Working around SQLite's threading in a multi-request environment
Building a frontend that talks to a backend purely through fetch() and JSON, without a framework
Designing a simple but consistent REST API

License:
MIT
