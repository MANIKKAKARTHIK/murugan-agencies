from flask import Flask, render_template, request, redirect
import sqlite3
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv

# LOAD ENV VARIABLES
load_dotenv()

app = Flask(__name__)

# SECRET KEY
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")

# MAIL CONFIG
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASS')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('EMAIL_USER')

mail = Mail(app)

# DATABASE CONNECTION
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# HOME
@app.route('/')
def home():
    return render_template('index.html')

# SERVICES
@app.route('/services')
def services():
    return render_template('services.html')

# ABOUT
@app.route('/about')
def about():
    return render_template('about.html')

# CONTACT
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':

        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')

        # VALIDATION
        if not name or not email or not message:
            return "All fields required ❌"

        # SAVE DATABASE
        try:
            conn = get_db_connection()
            conn.execute(
                "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
                (name, email, message)
            )
            conn.commit()
            conn.close()
        except Exception as e:
            print("DB ERROR:", e)

        # SEND EMAIL
        try:
            msg = Message(
                subject=f"New Inquiry from {name}",
                recipients=[app.config['MAIL_USERNAME']],
                body=f"""
Customer Name: {name}
Customer Email: {email}

Message:
{message}
"""
            )
            mail.send(msg)
        except Exception as e:
            print("MAIL ERROR:", e)

        return redirect('/success')

    return render_template('contact.html')

# SUCCESS PAGE
@app.route('/success')
def success():
    return "<h2 style='text-align:center;margin-top:60px;'>Message Sent Successfully ✅</h2>"
@app.route('/admin')
def admin():
    key = request.args.get("key")

    if key != "murugan123":
        return "Unauthorized ❌"

    conn = get_db_connection()
    messages = conn.execute("SELECT * FROM contacts").fetchall()
    conn.close()

    return render_template("message.html", messages=messages)

# RUN SERVER (LOCAL + MOBILE ACCESS)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)