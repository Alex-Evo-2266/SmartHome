TORTOISE_ORM = {
    "connections": {"default": "mysql://roothome:root@127.0.0.1:3306/auth_service"},
    "apps": {
        "models": {
            "models": ["authservice.src.models", "aerich.models"],
            "default_connection": "default",
        },
    },
}
