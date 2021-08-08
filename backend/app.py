from flask import Flask, jsonify, request
from flask_cors import CORS
from kp import KP

# configuration
DEBUG = True

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
# CORS(app)
# CORS(app, support_credentials=True)

# sanity check route
# @app.route('/ping', methods=['GET'])
# def ping_pong():
#     return jsonify('pong!')

@app.route('/q/', methods=['POST', 'GET'])
def get_search():
    # post_data = request.get_json()
    q = request.get_json()
    return jsonify(KP(q).search())

if __name__ == '__main__':
    app.run(host='0.0.0.0')