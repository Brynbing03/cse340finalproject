INSERT INTO divisions (name, slug)
VALUES
  ('Women''s Doubles', 'womens-doubles'),
  ('Men''s Doubles', 'mens-doubles'),
  ('Mixed Doubles', 'mixed-doubles')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO seasons (name, slug, is_active)
VALUES
  ('Spring 2026', 'spring-2026', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO users (first_name, last_name, email, password_hash, role, gender)
VALUES
  ('Brynlee', 'Bingham', 'brynlee@example.com', 'testhash1', 'player', 'F'),
  ('Emma', 'Jones', 'emma@example.com', 'testhash2', 'player', 'F'),
  ('Jake', 'Smith', 'jake@example.com', 'testhash3', 'player', 'M'),
  ('Noah', 'Davis', 'noah@example.com', 'testhash4', 'player', 'M')
ON CONFLICT (email) DO NOTHING;

INSERT INTO teams (name, slug, division_id, season_id, created_by, approved)
VALUES
  (
    'Smash Sisters',
    'smash-sisters',
    (SELECT id FROM divisions WHERE slug = 'womens-doubles'),
    (SELECT id FROM seasons WHERE slug = 'spring-2026'),
    (SELECT id FROM users WHERE email = 'brynlee@example.com'),
    true
  ),
  (
    'Net Ninjas',
    'net-ninjas',
    (SELECT id FROM divisions WHERE slug = 'mens-doubles'),
    (SELECT id FROM seasons WHERE slug = 'spring-2026'),
    (SELECT id FROM users WHERE email = 'jake@example.com'),
    true
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO team_members (team_id, user_id)
VALUES
  (
    (SELECT id FROM teams WHERE slug = 'smash-sisters'),
    (SELECT id FROM users WHERE email = 'brynlee@example.com')
  ),
  (
    (SELECT id FROM teams WHERE slug = 'smash-sisters'),
    (SELECT id FROM users WHERE email = 'emma@example.com')
  ),
  (
    (SELECT id FROM teams WHERE slug = 'net-ninjas'),
    (SELECT id FROM users WHERE email = 'jake@example.com')
  ),
  (
    (SELECT id FROM teams WHERE slug = 'net-ninjas'),
    (SELECT id FROM users WHERE email = 'noah@example.com')
  )
ON CONFLICT DO NOTHING;