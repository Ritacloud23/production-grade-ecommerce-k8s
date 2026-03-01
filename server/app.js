require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ecommerce API Running ");
});

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/products", async (req, res) => {
  const { name, price } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *",
      [name, Number(price)] // ensure numeric
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

// ✅ Proper startup sequence
const startServer = async () => {
  let retries = 5;

  while (retries) {
    try {
      await pool.query("SELECT 1");

      await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          price NUMERIC NOT NULL
        );
      `);

      console.log(" Database initialized successfully.");

      app.listen(PORT, () => {
        console.log(` Server running on port ${PORT}`);
      });

      break;

    } catch (err) {
      console.log(" Waiting for database...");
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  if (!retries) {
    console.error(" Could not connect to database.");
    process.exit(1);
  }
};

startServer();

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "OK", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "ERROR", database: "disconnected" });
  }
});

// Liveness: app process is alive
app.get("/live", (req, res) => {
  res.status(200).json({ status: "alive" });
});

// Readiness: app + DB connection
app.get("/ready", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ready", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "not ready", database: "disconnected" });
  }
});

app.get("/stress", (req, res) => {
  const end = Date.now() + 8000;
  while (Date.now() < end) {}
  res.send("CPU stressed");
});