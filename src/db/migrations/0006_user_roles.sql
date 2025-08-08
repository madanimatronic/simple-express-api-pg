CREATE TABLE IF NOT EXISTS user_roles(
  id SERIAL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (id, user_id, role_id),
);