import sqlite3

conn = sqlite3.connect('database.db')

cur = conn.cursor()

cur.execute('''
CREATE TABLE IF NOT EXISTS contacts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    message TEXT
)
''')

conn.commit()
conn.close()

print("Database Created Successfully")