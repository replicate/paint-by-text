from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route("/")
def home():
    return "Hello, World!"


@app.route("/prediction", methods=["POST"])
def prediction():
    if request.method == "GET":
        return "Hello World!"

    json_data = request.get_json()
    print(json_data)
    data = {"message": "summary", "status": "succeeded"}
    return jsonify(data), 200
