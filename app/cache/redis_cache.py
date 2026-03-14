import os
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Try to import redis, fallback to dummy implementation if not available
try:
    import redis
    redis_client = redis.StrictRedis.from_url(REDIS_URL, decode_responses=True, socket_connect_timeout=2)
    redis_available = True
except Exception:
    redis_client = None
    redis_available = False

def get_cached_prediction(key: str):
    if not redis_available:
        return None
    try:
        value = redis_client.get(key)
        return eval(value) if value else None
    except Exception:
        return None

def set_cache_prediction(key: str, value):
    if not redis_available:
        return
    try:
        redis_client.set(key, str(value), ex=3600)  # 1 hour expiry
    except Exception:
        pass