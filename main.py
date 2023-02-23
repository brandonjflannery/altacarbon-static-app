from altacarbon_web import db, create_app, models

app = create_app()

if __name__ == '__main__':
    app.run(threaded=True, port=5051)

