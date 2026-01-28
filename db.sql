-- Create stock table
CREATE TABLE stock (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    balance INT NOT NULL
);

-- Insert initial stock (e.g., 100 pairs of shoes)
INSERT INTO stock (item_name, balance) VALUES ('Shoes', 100);
