import math
from typing import Dict, Tuple

import numpy as np
from sklearn.linear_model import LinearRegression


def _clip(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def _build_training_data() -> Tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(42)
    rows = []
    scores = []

    for _ in range(300):
        views = int(rng.integers(25, 20000))
        likes = int(rng.integers(0, max(views // 2, 1)))
        transactions = int(rng.integers(0, 2000))
        rarity = int(rng.integers(1, 101))
        creator_reputation = float(rng.integers(20, 96))
        creator_portfolio_size = int(rng.integers(1, 250))
        age_hours = float(rng.integers(1, 24 * 180))

        creator_avg_views = views * float(rng.uniform(0.6, 1.5))
        creator_avg_likes = min(likes * float(rng.uniform(0.6, 1.6)) + rng.integers(0, 20), creator_avg_views)
        creator_avg_transactions = min(
            transactions * float(rng.uniform(0.5, 1.7)) + rng.integers(0, 8),
            creator_avg_views
        )

        popularity_score = min(100, math.log1p(views) / math.log1p(20000) * 100)
        engagement_rate = likes / max(views, 1)
        engagement_score = min(100, engagement_rate * 400)
        transaction_score = min(100, math.log1p(transactions) / math.log1p(2000) * 100)
        rarity_score = rarity
        creator_portfolio_score = min(100, math.log1p(creator_portfolio_size) / math.log1p(250) * 100)
        freshness_score = max(20, 100 - (age_hours / (24 * 180)) * 80)

        suspicious_signal = min(
            100,
            (40 if engagement_rate > 0.8 else engagement_rate * 50)
            + (40 if transactions / max(views, 1) > 0.5 else (transactions / max(views, 1)) * 80)
            + (20 if likes > views else 0),
        )

        trust_score = (
            0.18 * popularity_score
            + 0.18 * engagement_score
            + 0.12 * transaction_score
            + 0.16 * rarity_score
            + 0.18 * creator_reputation
            + 0.07 * creator_portfolio_score
            + 0.08 * freshness_score
            - 0.12 * suspicious_signal
        )

        rows.append([
            views,
            likes,
            transactions,
            rarity,
            creator_reputation,
            creator_portfolio_size,
            age_hours,
            suspicious_signal,
            creator_avg_views,
            creator_avg_likes,
            creator_avg_transactions,
        ])
        scores.append(_clip(trust_score, 0, 100))

    return np.array(rows, dtype=float), np.array(scores, dtype=float)


X_train, y_train = _build_training_data()
model = LinearRegression()
model.fit(X_train, y_train)


def _validate_payload(data: Dict) -> Dict[str, float]:
    required_fields = (
        "views",
        "likes",
        "transactions",
        "rarity",
        "creatorReputation",
        "creatorPortfolioSize",
        "ageHours",
        "suspiciousActivity",
    )
    cleaned = {}

    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")

        try:
            value = float(data[field])
        except (TypeError, ValueError):
            raise ValueError(f"Field '{field}' must be a number") from None

        if value < 0:
            raise ValueError(f"Field '{field}' cannot be negative")

        cleaned[field] = value

    cleaned["rarity"] = _clip(cleaned["rarity"], 0, 100)
    cleaned["creatorReputation"] = _clip(cleaned["creatorReputation"], 0, 100)
    cleaned["creatorPortfolioSize"] = max(0, cleaned["creatorPortfolioSize"])
    cleaned["ageHours"] = max(0, cleaned["ageHours"])
    cleaned["suspiciousActivity"] = _clip(cleaned["suspiciousActivity"], 0, 100)
    cleaned["creatorAvgViews"] = max(0, float(data.get("creatorAvgViews", cleaned["views"])))
    cleaned["creatorAvgLikes"] = max(0, float(data.get("creatorAvgLikes", cleaned["likes"])))
    cleaned["creatorAvgTransactions"] = max(0, float(data.get("creatorAvgTransactions", cleaned["transactions"])))
    return cleaned


def _calculate_live_signals(data: Dict[str, float]) -> Dict[str, float]:
    views = data["views"]
    likes = data["likes"]
    transactions = data["transactions"]
    rarity = data["rarity"]
    creator_reputation = data["creatorReputation"]
    creator_portfolio_size = data["creatorPortfolioSize"]
    age_hours = data["ageHours"]
    suspicious_activity = data["suspiciousActivity"]

    popularity_score = min(100, math.log1p(views) / math.log1p(20000) * 100)
    engagement_rate = likes / max(views, 1)
    engagement_score = min(100, engagement_rate * 400)
    transaction_score = min(100, math.log1p(transactions) / math.log1p(2000) * 100)
    rarity_score = rarity
    creator_portfolio_score = min(100, math.log1p(creator_portfolio_size) / math.log1p(250) * 100)
    freshness_score = max(20, 100 - (age_hours / (24 * 180)) * 80)

    rule_based_score = (
        0.18 * popularity_score
        + 0.18 * engagement_score
        + 0.12 * transaction_score
        + 0.16 * rarity_score
        + 0.18 * creator_reputation
        + 0.07 * creator_portfolio_score
        + 0.08 * freshness_score
        - 0.12 * suspicious_activity
    )

    return {
        "popularity": round(popularity_score, 2),
        "engagement": round(engagement_score, 2),
        "transactions": round(transaction_score, 2),
        "rarity": round(rarity_score, 2),
        "creatorReputation": round(creator_reputation, 2),
        "creatorPortfolio": round(creator_portfolio_score, 2),
        "freshness": round(freshness_score, 2),
        "suspiciousActivity": round(suspicious_activity, 2),
        "rule_based_score": round(_clip(rule_based_score, 0, 100), 2),
    }


def predict_score(data: Dict) -> Dict[str, float]:
    cleaned = _validate_payload(data)
    features = np.array(
        [[
            cleaned["views"],
            cleaned["likes"],
            cleaned["transactions"],
            cleaned["rarity"],
            cleaned["creatorReputation"],
            cleaned["creatorPortfolioSize"],
            cleaned["ageHours"],
            cleaned["suspiciousActivity"],
            cleaned["creatorAvgViews"],
            cleaned["creatorAvgLikes"],
            cleaned["creatorAvgTransactions"],
        ]],
        dtype=float,
    )

    ml_score = float(model.predict(features)[0])
    live_signals = _calculate_live_signals(cleaned)

    blended_score = (0.6 * live_signals["rule_based_score"]) + (0.4 * ml_score)
    trust_score = round(_clip(blended_score, 0, 100), 2)

    return {
        "trustScore": trust_score,
        "score": trust_score,
        "mlScore": round(_clip(ml_score, 0, 100), 2),
        "breakdown": {
            "popularity": live_signals["popularity"],
            "engagement": live_signals["engagement"],
            "transactions": live_signals["transactions"],
            "rarity": live_signals["rarity"],
            "creatorReputation": live_signals["creatorReputation"],
            "creatorPortfolio": live_signals["creatorPortfolio"],
            "freshness": live_signals["freshness"],
            "suspiciousActivity": live_signals["suspiciousActivity"],
        },
    }
