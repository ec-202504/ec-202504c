INSERT INTO cart_products (quantity, session_id, user_id, product_category, product_id)
VALUES
  (2, NULL, 1, 0, 10),
  (1, NULL, 2, 1, 20),
  (3, NULL, 1, 0, 30),
  (5, 'session-abc123', NULL, 1, 40),
  (2, 'session-xyz789', NULL, 0, 50),
  (1, NULL, 2, 1, 60),
  (4, NULL, 1, 1, 70),
  (2, 'session-temp999', NULL, 0, 80),
  (3, NULL, 2, 0, 90),
  (1, 'session-guest123', NULL, 1, 100);