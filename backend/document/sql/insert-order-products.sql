INSERT INTO order_products (quantity, product_category, product_id, order_id) VALUES
-- Alice: Book A, PC A
(1, 1, 1, 1),
(1, 0, 5, 1),

-- Bob: Book B, PC A
(1, 1, 2, 2),
(1, 0, 5, 2),

-- Carol: Book A, Book B, PC B
(1, 1, 1, 3),
(1, 1, 2, 3),
(1, 0, 6, 3),

-- Dave: Book C, PC B
(1, 1, 3, 4),
(1, 0, 6, 4),

-- Eve: Book C, PC C
(1, 1, 3, 5),
(1, 0, 7, 5),

-- Frank: Book D, PC D
(1, 1, 4, 6),
(1, 0, 8, 6),

-- Grace: Book A, Book C
(1, 1, 1, 7),
(1, 1, 3, 7),

-- Heidi: Book B, PC A
(1, 1, 2, 8),
(1, 0, 5, 8),

-- Ivan: PC B, PC D
(1, 0, 6, 9),
(1, 0, 8, 9),

-- Judy: Book D, Book A, PC C
(1, 1, 4, 10),
(1, 1, 1, 10),
(1, 0, 7, 10);