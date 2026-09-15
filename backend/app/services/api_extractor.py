"""API Extractor — parses FastAPI/Python source with the `ast` module (no AI needed).

Detects routes decorated with @app.get/.post/.put/.delete/.patch, extracts
method, path, path/query parameters, request body, response schema (Pydantic
models defined in the repository), status codes, auth hints and docstrings.
"""
import ast
import os
from typing import Any, Optional

HTTP_METHODS = {"get", "post", "put", "delete", "patch", "head", "options"}

PYTHON_TO_JSON = {
    "int": "integer", "str": "string", "float": "number",
    "bool": "boolean", "bytes": "string", "Any": "object", "dict": "object", "list": "array",
}

PARAM_EXCLUDE = {"request", "db", "session", "response"}


class PydanticModelRegistry:
    """Collects Pydantic-style model classes defined across a repository."""

    def __init__(self) -> None:
        self.models: dict[str, dict[str, str]] = {}

    def scan_file(self, tree: ast.AST) -> None:
        for node in ast.walk(tree):
            if not isinstance(node, ast.ClassDef):
                continue
            fields: dict[str, str] = {}
            is_model = False
            for stmt in node.body:
                if isinstance(stmt, ast.AnnAssign) and isinstance(stmt.target, ast.Name):
                    is_model = True
                    fields[stmt.target.id] = self._annotation_to_json_type(stmt.annotation)
                elif isinstance(stmt, ast.Assign):
                    for target in stmt.targets:
                        if isinstance(target, ast.Name):
                            is_model = True
            if is_model and fields:
                self.models[node.name] = fields

    @staticmethod
    def _annotation_to_json_type(annotation: ast.expr) -> str:
        text = ast.unparse(annotation)
        base = text.replace("Optional[", "").replace("List[", "").replace("list[", "")
        base = base.replace("]", "").split("|")[0].strip()
        if base.startswith(("list", "List")):
            return "array"
        return PYTHON_TO_JSON.get(base, "object")


def _kwargs_of(decorator: ast.Call) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for kw in decorator.keywords:
        if kw.arg is None:
            continue
        try:
            result[kw.arg] = ast.literal_eval(kw.value)
        except (ValueError, SyntaxError):
            result[kw.arg] = ast.unparse(kw.value)
    return result


def _annotation_json(annotation: Optional[ast.expr]) -> str:
    if annotation is None:
        return "string"
    text = ast.unparse(annotation)
    base = text.replace("Optional[", "").replace("Union[", "").split(",")[0].replace("]", "").split("|")[0].strip()
    if base.startswith(("list", "List")):
        return "array"
    return PYTHON_TO_JSON.get(base, "object")


def _annotation_is_optional(annotation: Optional[ast.expr]) -> bool:
    if annotation is None:
        return False
    text = ast.unparse(annotation)
    return "Optional[" in text or "|" in text


def extract_endpoint(node, registry: PydanticModelRegistry, file_rel: str) -> Optional[dict]:
    endpoint: Optional[dict] = None
    for decorator in node.decorator_list:
        if not isinstance(decorator, ast.Call) or not isinstance(decorator.func, ast.Attribute):
            continue
        method = decorator.func.attr.lower()
        if method not in HTTP_METHODS:
            continue
        path = ""
        if decorator.args and isinstance(decorator.args[0], ast.Constant):
            path = str(decorator.args[0].value)
        kwargs = _kwargs_of(decorator)
        # Defaults align to the last N positional args
        defaults = node.args.defaults
        n_args = len(node.args.args)
        default_names = set()
        for i, d in enumerate(defaults):
            idx = n_args - len(defaults) + i
            if 0 <= idx < n_args:
                default_names.add(node.args.args[idx].arg)
        path_params = []
        inside = False
        current = ""
        for ch in path:
            if ch == "{":
                inside = True
                current = ""
            elif ch == "}":
                path_params.append(current)
                inside = False
            elif inside:
                current += ch

        params: list[dict] = []
        request_schema: Optional[dict] = None
        body_model: Optional[str] = None
        response_model = kwargs.get("response_model") if isinstance(kwargs.get("response_model"), str) else None

        args = list(node.args.args)
        if args and args[0].arg == "self":
            args = args[1:]  # skip self on class methods

        for arg in args:
            name = arg.arg
            has_default = arg.arg in default_names
            if name in path_params:
                params.append({"name": name, "in": "path", "type": _annotation_json(arg.annotation), "required": True})
            elif name in PARAM_EXCLUDE:
                continue
            else:
                annotation_text = ast.unparse(arg.annotation) if arg.annotation else ""
                if annotation_text in registry.models:
                    body_model = annotation_text
                    request_schema = {"model": annotation_text, "fields": registry.models[annotation_text]}
                else:
                    params.append({"name": name, "in": "query", "type": _annotation_json(arg.annotation),
                                   "required": not has_default and not _annotation_is_optional(arg.annotation)})

        for arg in node.args.kwonlyargs:
            name = arg.arg
            annotation_text = ast.unparse(arg.annotation) if arg.annotation else ""
            if annotation_text in registry.models:
                body_model = annotation_text
                request_schema = {"model": annotation_text, "fields": registry.models[annotation_text]}
            elif name not in path_params and name not in PARAM_EXCLUDE:
                params.append({"name": name, "in": "query", "type": _annotation_json(arg.annotation), "required": False})

        if response_model and response_model in registry.models:
            response_schema = {"model": response_model, "fields": registry.models[response_model]}
        else:
            ret_text = ast.unparse(node.returns) if node.returns else ""
            if ret_text in registry.models:
                response_model = ret_text
                response_schema = {"model": ret_text, "fields": registry.models[ret_text]}
            elif ret_text.startswith(("list[", "List[")):
                inner = ret_text.split("[", 1)[1].rstrip("]").strip()
                if inner in registry.models:
                    response_model = inner
                    response_schema = {"model": inner, "fields": registry.models[inner], "many": True}
            else:
                response_schema = None

        status_codes = [200]
        if isinstance(kwargs.get("status_code"), int):
            status_codes = [kwargs["status_code"]]

        auth = None
        src = ast.unparse(node)
        if "get_current_user" in src or "Security(" in src or "OAuth2" in src:
            auth = "Bearer token (Depends detected)"
        elif "api_key" in src.lower():
            auth = "API key (detected)"

        doc = ast.get_docstring(node)
        summary = doc.strip().splitlines()[0] if doc else f"{method.upper()} {path}"

        endpoint = {
            "method": method.upper(),
            "path": path,
            "summary": summary,
            "description": doc.strip() if doc else None,
            "params": params,
            "request_schema": request_schema,
            "response_schema": response_schema,
            "response_model": response_model,
            "body_model": body_model,
            "status_codes": status_codes,
            "auth": auth,
            "source_file": file_rel,
        }
        break
    return endpoint


def scan_repo(repo_path: str) -> list[dict]:
    """Scan a repository directory and return the extracted endpoint list."""
    if not os.path.isdir(repo_path):
        raise FileNotFoundError(f"Repository path not found: {repo_path}")
    registry = PydanticModelRegistry()
    trees: list[tuple[str, ast.AST]] = []
    py_files: list[str] = []
    for root, _dirs, files in os.walk(repo_path):
        for f in files:
            if f.endswith(".py"):
                py_files.append(os.path.join(root, f))
    if not py_files:
        raise ValueError(f"No Python files found in repository: {repo_path}")

    for file_path in py_files:
        try:
            with open(file_path, "r", encoding="utf-8") as fh:
                source = fh.read()
            tree = ast.parse(source)
        except SyntaxError:
            # Invalid python code: skip the file, keep scanning the rest
            continue
        registry.scan_file(tree)
        trees.append((os.path.relpath(file_path, repo_path), tree))

    endpoints: list[dict] = []
    for file_rel, tree in trees:
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                ep = extract_endpoint(node, registry, file_rel.replace("\\", "/"))
                if ep:
                    endpoints.append(ep)
    endpoints.sort(key=lambda e: (e["path"], e["method"]))
    return endpoints
