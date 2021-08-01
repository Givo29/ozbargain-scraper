const fetch = require("node-fetch");
const cheerio = require("cheerio");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello World!");
});

const productData = async (node_id) => {
  return await fetch(`https://www.ozbargain.com.au/node/${node_id}`)
    .then((response) => response.text())
    .then((html) => {
      const $ = cheerio.load(html);
      // Getting general info
      let title = $("#title").text();
      let description = $(".node-ozbdeal .content > p").text();
      let expired = $(".node-ozbdeal.expired").text() ? true : false;

      // Getting post information
      let upvotes = $(".n-vote > .voteup").text();
      let downvotes = $(".n-vote > .votedown").text();
      let submitted = $(".node-ozbdeal .submitted").text();
      let date_posted = submitted.substring(
        submitted.lastIndexOf("on") + 3,
        submitted.indexOf(" - ")
      );
      let last_updated = submitted.substring(
        submitted.lastIndexOf("edited") + 7,
        submitted.lastIndexOf(" - ")
      );
      let tags = [];

      // Populate tags
      $(".nodefooter > .nodemeta > .taxonomy span a").map((_, elem) => {
        tags.push({
          tag_name: $(elem).text(),
          tag_link: `https://www.ozbargain.com.au${$(elem).attr("href")}`,
        });
      });

      // Getting product information
      let referrer = $("span.via > a").text();
      let product_link = `https://www.ozbargain.com.au${$("span.via > a").attr(
        "href"
      )}`;

      // Getting user information
      let username = $(".node-ozbdeal .submitted > strong > a").text();
      let user_link = `https://www.ozbargain.com.au${$(
        ".node-ozbdeal .submitted > strong > a"
      ).attr("href")}`;

      return JSON.stringify({
        name: title,
        description: description,
        expired: expired,
        post_information: {
          date_posted: date_posted,
          last_updated: last_updated,
          upvotes: upvotes,
          downvotes: downvotes,
          tags: tags,
        },
        product_information: {
          referrer: referrer,
          product_link: product_link,
        },
        user: {
          username: username,
          user_link: user_link,
        },
      });
    })
    .catch((err) => err);
};

// GET bargain details
app.get("/bargain/:id", async (req, res) => {
  const id = req.params.id;
  data = await productData(id);
  res.json(JSON.parse(data));
});

app.listen(PORT, (_) => {
  console.log(`Listening on port ${PORT}`);
});
