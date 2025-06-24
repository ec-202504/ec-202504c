INSERT INTO orders (order_id, total_price, order_date_time, destination_name, destination_email, destination_zipcode,
 destination_prefecture, destination_municipalities, destination_address, destination_telephone,
 delivery_date_time, payment_method, user_id) VALUES
(1, 5000, CURRENT_TIMESTAMP, 'Alice', 'alice@example.com', '1000001', '東京都', '千代田区', '1-1-1', '0311111111', CURRENT_TIMESTAMP + INTERVAL '1 hour', 0, 1),
(2, 6000, CURRENT_TIMESTAMP, 'Bob', 'bob@example.com', '1000002', '東京都', '港区', '2-2-2', '0322222222', CURRENT_TIMESTAMP + INTERVAL '1 hour', 0, 2),
(3, 7000, CURRENT_TIMESTAMP, 'Carol', 'carol@example.com', '1000003', '東京都', '渋谷区', '3-3-3', '0333333333', CURRENT_TIMESTAMP + INTERVAL '1 hour', 0, 3),
(4, 8000, CURRENT_TIMESTAMP, 'Dave', 'dave@example.com', '1000004', '東京都', '新宿区', '4-4-4', '0344444444', CURRENT_TIMESTAMP + INTERVAL '1 hour', 0, 4),
(5, 5000, CURRENT_TIMESTAMP, 'Eve', 'eve@example.com', '1000005', '神奈川県', '横浜市', '5-5-5', '0455555555', CURRENT_TIMESTAMP + INTERVAL '1 hour', 0, 5),
(6, 4000, CURRENT_TIMESTAMP, 'Frank', 'frank@example.com', '1000006', '神奈川県', '川崎市', '6-6-6', '0466666666', CURRENT_TIMESTAMP + INTERVAL '1 hour', 0, 6),
(7, 9000, CURRENT_TIMESTAMP, 'Grace', 'grace@example.com', '1000007', '千葉県', '千葉市', '7-7-7', '0477777777', CURRENT_TIMESTAMP + INTERVAL '1 hour', 0, 7),
(8, 10000, CURRENT_TIMESTAMP, 'Heidi', 'heidi@example.com', '1000008', '埼玉県', 'さいたま市', '8-8-8', '0488888888', CURRENT_TIMESTAMP + INTERVAL '1 hour', 0, 8),
(9, 11000, CURRENT_TIMESTAMP, 'Ivan', 'ivan@example.com', '1000009', '大阪府', '大阪市', '9-9-9', '0666666666', CURRENT_TIMESTAMP + INTERVAL '1 hour', 0, 9),
(10, 12000, CURRENT_TIMESTAMP, 'Judy', 'judy@example.com', '1000010', '愛知県', '名古屋市', '10-10-10', '0522222222', CURRENT_TIMESTAMP + INTERVAL '1 hour', 0, 10);
