const express = require("express");
const productData = require("./scraper/productData").default;
const categoryData = require("./scraper/categoryData").default;
const searchData = require("./scraper/searchData").default;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// GET bargain details
app.get("/bargain/:id", async (req, res) => {
  const id = req.params.id;
  const data = await productData(id);
  res.json(JSON.parse(data));
});

// GET bargains by category
app.get("/category/:category", async (req, res) => {
  const category = req.params.category;
  const page = req.query.page;
  const show_expired = req.query.show_expired === "false" ? false : true;
  const data = await categoryData(category, page, show_expired);
  res.json(JSON.parse(data));
});

// GET search results
app.get("/search/:query", async (req, res) => {
  const query = req.params.query;
  const page = req.query.page;
  const show_expired = req.query.show_expired === "false" ? false : true;
  const data = await searchData(query, page, show_expired);
  res.json(JSON.parse(data));
});

app.listen(PORT, (_) => {
  console.log(`Listening on port ${PORT}`);
});
