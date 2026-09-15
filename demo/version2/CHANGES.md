# Demo Repository — Version 2

Changes vs Version 1 (response model `UserResponse` used by `GET /users/{user_id}`):

- **BREAKING** — response field `name` renamed to `full_name` (severity HIGH)
- **WARNING** — response field `avatar_url` added to `UserResponse`
- **BREAKING** — endpoint `GET /users/{user_id}/orders` removed
- **SAFE** — new endpoint `GET /users/{user_id}/preferences` added
- **SAFE** — optional query parameter `sort` added to `GET /orders`

Everything else is unchanged.
