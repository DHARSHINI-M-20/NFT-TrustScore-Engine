from flask import Flask, jsonify, request

from model import predict_score


app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "ai-trust-score-engine"})


@app.post("/predict")
def predict():
    payload = request.get_json(silent=True)

    if payload is None:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    try:
        result = predict_score(payload)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"error": f"Prediction failed: {exc}"}), 500

    return jsonify(result)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
