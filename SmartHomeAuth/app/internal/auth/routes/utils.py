import logging
from datetime import datetime, timedelta
from urllib.parse import urlparse, parse_qs, urlencode
from fastapi import HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from app.internal.user.models.user import User
from app.internal.role.models.role import Role
from app.internal.role.logic.get_privilege import get_privilege
from app.internal.auth.models.auth import Session
from app.internal.auth.logic.get_session import get_session_by_id
from app.internal.auth.schemas.auth import TempTokenData
from app.configuration.settings import TIMEZONE, MODULES_COOKIES_NAME
from app.internal.auth.logic.token import create_token

from app.internal.auth.logic.token import temp_token_check
from app.internal.auth.logic.get_service_auth import service_config
from app.internal.role.logic.get_role import get_role_by_id
from app.internal.user.logic.get_user import get_user
from app.internal.auth.logic.create_session import create_session_module

logger = logging.getLogger(__name__)

async def module_service_auth(temp_token: str | None = None, path:str = "/", service:str = "", host="localhost", dest:str = ""):
	payload = await temp_token_check(temp_token)
	print(payload)
	if not payload:
		raise HTTPException(403, "Role not allowed")
		
	if "service" not in payload or payload["service"] is None or payload["user_role"] is None:
		raise HTTPException(403, "Service not allowed")
	
	if payload["service"] != service:
		raise HTTPException(403, "invalid service in token")
		
	config = service_config(payload["service"], path=path)
	user = await get_user(payload["user_id"])
	user_role = await get_role_by_id(payload["user_role"])

	if user_role.role_name not in config.roles or not user:
		raise HTTPException(403, "permission denied")
	
	if config.iframe_only and dest != "iframe":
		raise HTTPException(status_code=403, detail="Only iframe access allowed")
		
	session = await create_session_module(user, service=service, host=host)

	return session
		

async def generate_temp_token(user: User, role: Role, service: str) -> TempTokenData:
    """Создаёт временный токен для модуля (живёт 15 минут)."""
    expires_at = datetime.now(TIMEZONE) + timedelta(minutes=15)
    token = await create_token(
        data={"user_id": user.id, "user_role": role.id},
        expires_at=expires_at,
        type="temp_token",
        service=service
    )
    logger.info("Создан временный токен",
        extra={"user_id": user.id, "role_id": role.id, "service": service, "expires_at": expires_at.isoformat()}
    )
    return TempTokenData(token=token)


def parse_forwarded_uri(request: Request) -> tuple[str, str, str, str, str, str]:
    """Извлекает параметры из запроса и проверяет forwarded_uri."""
    forwarded_uri = request.headers.get("X-Forwarded-Uri")
    dest = request.headers.get("sec-fetch-dest")
    scheme = request.headers.get("X-Forwarded-Proto", "http")
    host = request.headers.get("X-Forwarded-Host", "localhost")

    if not forwarded_uri:
        logger.warning("Отсутствует X-Forwarded-Uri")
        raise HTTPException(400, "Missing X-Forwarded-Uri")

    parsed = urlparse(forwarded_uri)
    query_params = parse_qs(parsed.query)
    temp_token = query_params.get("temp_token", [None])[0]

    parts = parsed.path.strip("/").split("/")
    if len(parts) < 2 or parts[0] != "modules":
        logger.warning("Некорректный формат пути", extra={"path": parsed.path})
        raise HTTPException(400, "Invalid path format")

    service = parts[1]
    inner_path = "/" + "/".join(parts[2:]) if len(parts) > 2 else "/"

    return forwarded_uri, dest, scheme, host, service, inner_path, temp_token


async def handle_temp_token(temp_token: str, forwarded_uri: str, scheme: str, host: str,
                            inner_path: str, service: str, dest: str) -> RedirectResponse:
    """Создаёт сессию по временному токену и редиректит без токена в URL."""
    session = await module_service_auth(temp_token=temp_token, path=inner_path, service=service, host=host, dest=dest)
    logger.info("Аутентификация через временный токен", extra={"service": service, "session_id": session.id})

    parsed = urlparse(forwarded_uri)
    query = parse_qs(parsed.query)
    query.pop("temp_token", None)  # удаляем temp_token из URL
    clean_qs = urlencode(query, doseq=True)
    clean_path = parsed.path + (("?" + clean_qs) if clean_qs else "")
    absolute_url = f"{scheme}://{host}{clean_path}"

    resp = RedirectResponse(url=absolute_url)
    resp.set_cookie(
        key=MODULES_COOKIES_NAME,
        value=session.id,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )
    return resp


async def handle_existing_session(request: Request, inner_path: str, dest: str) -> Response:
    """Проверяет существующую сессию и возвращает заголовки с данными пользователя."""
    cookies = request.cookies
    session_id = cookies.get(MODULES_COOKIES_NAME)
    if not session_id:
        logger.warning("Нет сессии (cookie отсутствует)")
        raise HTTPException(status_code=401, detail="No session cookie")

    sess: Session = await get_session_by_id(session_id)
    if not sess or sess.expires_at < datetime.utcnow():
        logger.warning("Сессия не найдена или истекла", extra={"session_id": session_id})
        raise HTTPException(status_code=401, detail="Session expired")

    config = service_config(sess.service, path=inner_path)
    if config.iframe_only and dest != "iframe":
        logger.warning("Попытка доступа вне iframe", extra={"session_id": sess.id, "service": sess.service})
        raise HTTPException(status_code=403, detail="Only iframe access allowed")

    await sess.user.load()
    await sess.user.role.load()
    privileges = await get_privilege(sess.user.role)

    resp = Response(status_code=200)
    resp.headers["X-Status-Auth"] = "ok"
    resp.headers["X-User-Role"] = sess.user.role.role_name
    resp.headers["X-User-Privilege"] = ", ".join(p.privilege for p in privileges)
    resp.headers["X-User-Id"] = str(sess.user.id)

    logger.info("Сессия подтверждена",
        extra={"session_id": sess.id, "user_id": sess.user.id, "role": sess.user.role.role_name}
    )
    return resp

