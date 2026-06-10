from flask import Flask, request, jsonify, render_template
import database

app = Flask(__name__) #we tell the framework where the main file is located
database.init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/books', methods=['GET'])
def get_books():
    books = database.view_tbr_books()  # fix: was view_books() which doesn't exist
    return jsonify(books)

@app.route('/all-books', methods=['GET'])
def get_all_books():
    books = database.get_all_books()
    return jsonify(books)

@app.route('/delete', methods=['POST'])
def delete_book():
    data = request.json
    database.delete_book(data['id'])
    return jsonify({"success": True})

@app.route('/update-rating', methods=['POST'])
def update_rating():
    data = request.json
    database.update_rating(data['rating'], data['id'])
    return jsonify({"success": True})

@app.route('/update-status', methods=['POST'])
def update_status():
    data = request.json
    database.update_status(data['id'], data['status'])
    return jsonify({"success": True})

@app.route('/add', methods=['POST'])
def add_book():
    data = request.json
    if not data['title'] or not data['author'] or not data['rating'] or not data['status']:
        return jsonify({"success": False, "error": "Missing required fields"}), 400
    database.add_book(data['title'], data['author'], data['rating'], data['status'], data['comments'])
    return jsonify({"success": True})

@app.route('/stats', methods=['GET'])
def get_stats():
    return jsonify({
        "total_read": database.get_total_books_read(),
        "read_this_month": database.get_books_read_this_month()
    })

#for when i add the ML model - i'll just link this below for now in comments
"""
@app.route('/recommend', methods=['GET'])
def recommend():
    # TODO: wire up ML model
    return jsonify({"recommendation": None})
"""

# --- RUN ---

if __name__ == '__main__':
    app.run(debug=True)