"""OpenAPI Generator — builds an OpenAPI 3.x specification from extracted endpoints."""
from typing import Any, Optional

TYPE_MAP = {"string": "string", "integer": "integer", "number": "number", "boolean": "boolean", "array": "array", "object": "object"}


def _ref_for_model(model: Optional[str]) -> Optional[dict]:
    if not model:
        return None
    return {"$ref": f"#/components/schemas/{model}"}


def _param_schema(param: dict) -> dict:
    schema = {"type": TYPE_MAP.get(param.get("type", "string"), "string")}
    if param.get("type") == "array":
        schema["items"] = {"type": "string"}
    return schema


def _schema_from_fields(schema_def: Optional[dict]) -> Optional[dict]:
    if not schema_def:
        return None
    fields = schema_def.get("fields") or {}
    properties: dict[str, Any] = {}
    for name, jtype in fields.items():
        if jtype == "array":
            properties[name] = {"type": "array", "items": {}}
        else:
            properties[name] = {"type": TYPE_MAP.get(jtype, "string")}
    return {"type": "object", "properties": properties}


def generate(endpoints: list[dict], title: str = "Scanned API", version: str = "1.0.0") -> dict:
    spec: dict[str, Any] = {
        "openapi": "3.0.3",
        "info": {"title": title, "version": version,
                 "description": "Generated automatically by API Documentation Agent from backend source code."},
        "servers": [{"url": "/"}],
        "paths": {},
        "components": {"schemas": {}},
    }
    schemas = spec["components"]["schemas"]

    for ep in endpoints:
        path = ep["path"] or "/"
        if path not in spec["paths"]:
            spec["paths"][path] = {}
        method = ep["method"].lower()

        parameters = []
        for p in ep.get("params") or []:
            param = {
                "name": p["name"],
                "in": p.get("in", "query"),
                "required": bool(p.get("required")) if p.get("in") != "path" else True,
                "schema": _param_schema(p),
            }
            parameters.append(param)

        operation: dict[str, Any] = {
            "summary": ep.get("summary") or f"{ep['method']} {path}",
            "operationId": f"{method}_{path.strip('/').replace('/', '_').replace('{', '').replace('}', '')}",
            "parameters": parameters,
            "responses": {},
        }
        if ep.get("description"):
            operation["description"] = ep["description"]
        if ep.get("auth"):
            operation["security"] = [{"bearerAuth": []}]

        request_model = (ep.get("request_schema") or {}).get("model")
        if request_model:
            operation["requestBody"] = {
                "required": True,
                "content": {"application/json": {"schema": _ref_for_model(request_model)}},
            }

        status_codes = ep.get("status_codes") or [200]
        response_model = (ep.get("response_schema") or {}).get("model")
        for code in status_codes:
            content = {}
            if response_model and code < 400:
                many = (ep.get("response_schema") or {}).get("many")
                schema = _ref_for_model(response_model)
                if many:
                    schema = {"type": "array", "items": schema}
                content = {"application/json": {"schema": schema}}
            operation["responses"][str(code)] = {
                "description": "Successful response" if code < 300 else "Response",
                **({"content": content} if content else {}),
            }
        if not operation["responses"]:
            operation["responses"]["200"] = {"description": "Successful response"}

        spec["paths"][path][method] = operation

        for model_name in (request_model, response_model):
            if model_name and model_name not in schemas:
                schemas[model_name] = _schema_from_fields(
                    ep.get("request_schema") if model_name == request_model else ep.get("response_schema")
                ) or {"type": "object"}

    if schemas.get("bearerAuth") is None:
        spec["components"]["securitySchemes"] = {"bearerAuth": {"type": "http", "scheme": "bearer"}}
    return spec


def validate(spec: dict) -> list[str]:
    """Lightweight structural validation of the generated spec."""
    errors: list[str] = []
    if spec.get("openapi") is None:
        errors.append("Missing 'openapi' version field")
    if not isinstance(spec.get("info"), dict):
        errors.append("Missing 'info' object")
    if not isinstance(spec.get("paths"), dict):
        errors.append("Missing 'paths' object")
    for path, methods in (spec.get("paths") or {}).items():
        if not path.startswith("/"):
            errors.append(f"Path '{path}' must start with '/'")
        for method, op in (methods or {}).items():
            if not isinstance(op, dict) or "responses" not in op:
                errors.append(f"Operation {method.upper()} {path} missing 'responses'")
    return errors
