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