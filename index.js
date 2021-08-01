const fetch = require("node-fetch");
const cheerio = require("cheerio");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const categoryList = async (_) => {
  return await fetch("https://www.ozbargain.com.au")
    .then((response) => response.text())
    .then((html) => {
      const $ = cheerio.load(html);
      let categories = [];
      $("#header2nd div ul li").each((_, elem) => {
        let category = $(elem).find("a").attr('href');
        categories.push(category.substring(category.lastIndexOf("/") + 1));
      });
      return categories;
    });
};

const productData = async (node_id) => {
  return await fetch(`https://www.ozbargain.com.au/node/${node_id}`)
    .then((response) => response.text())
    .then((html) => {
      const $ = cheerio.load(html);
      // Getting general info
      const title = $("#title").text();
      const description = $(".node-ozbdeal .content > p").text();
      const price = $(elem).find(".dollar").first().text();
      const expired = $(".node-ozbdeal.expired").text() ? true : false;

      // Getting post information
      const upvotes = $(".n-vote > .voteup").text();
      const downvotes = $(".n-vote > .votedown").text();
      const submitted = $(".node-ozbdeal .submitted").text();
      const date_posted = submitted.substring(
        submitted.lastIndexOf("on") + 3,
        submitted.indexOf(" - ")
      );
      const last_updated = submitted.substring(
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
      const referrer = $("span.via > a").text();
      const product_link = `https://www.ozbargain.com.au${$(
        "span.via > a"
      ).attr("href")}`;

      // Getting user information
      const username = $(".node-ozbdeal .submitted > strong > a").text();
      const user_link = `https://www.ozbargain.com.au${$(
        ".node-ozbdeal .submitted > strong > a"
      ).attr("href")}`;

      return JSON.stringify({
        name: title,
        description: description,
        price: price,
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
        user_information: {
          username: username,
          user_link: user_link,
        },
      });
    })
    .catch((err) => err);
};

const categoryData = async (category_name, page) => {
  const base_url = `https://www.ozbargain.com.au/cat/${category_name}`;
  let url = parseInt(page) ? `${base_url}?page=${page}` : base_url;

  return await fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const $ = cheerio.load(html);
      const bargains = [];
      const next_page = $(".main .pager .pager-next").attr("href");
      const previous_page = $(".main .pager .pager-previous").attr("href");
      const next_page_num = next_page
        ? next_page.substring(next_page.lastIndexOf("=") + 1)
        : null;
      const previous_page_num = previous_page
        ? previous_page.substring(previous_page.lastIndexOf("=") + 1)
        : null;

      $(".node-ozbdeal").each((_, elem) => {
        const title = $(elem).find(".title").text();
        const description = $(elem).find(".content > p").text();
        const expired = $(elem).find(".expired").text() ? true : false;
        const price = $(elem).find(".dollar").first().text();
        const submitted = $(elem).find(".submitted").text();
        const upvotes = $(elem).find(".n-vote > .voteup").text();
        const downvotes = $(elem).find(".n-vote > .votedown").text();
        const post_link = `https://www.ozbargain.com.au${$(elem)
          .find(".title > a")
          .attr("href")}`;
        const item_code = post_link.substring(post_link.lastIndexOf("/") + 1);
        const date_posted = submitted.substring(
          submitted.indexOf("on") + 3,
          submitted.indexOf(" - ")
        );
        const referrer = $(elem).find(".via > a").text();
        const product_link = `https://www.ozbargain.com.au${$(elem)
          .find(".via a")
          .attr("href")}`;
        const username = $(elem).find(".submitted > strong > a").text();
        const user_link = `https://www.ozbargain.com.au${$(elem)
          .find(".submitted > strong > a")
          .attr("href")}`;

        bargains.push({
          title: title,
          description: description,
          price: price,
          item_code: item_code,
          expired: expired,
          post_information: {
            date_posted: date_posted,
            upvotes: upvotes,
            downvotes: downvotes,
            post_link: post_link,
          },
          product_information: {
            referrer: referrer,
            product_link: product_link,
          },
          user_information: {
            username: username,
            user_link: user_link,
          },
        });
      });

      let data = {
        category_name: category_name,
        bargains: bargains,
      };

      if (previous_page_num) {
        data.previous_page_url = `/category/${category_name}?page=${previous_page_num}`;
      }
      if (next_page_num) {
        data.next_page_url = `/category/${category_name}?page=${next_page_num}`;
      }

      return JSON.stringify(data);
    })
    .catch((err) => err);
};

app.get("/", async (_, res) => {
  let categories = await categoryList();
  res.json({
    endpoints: {
      bargain: {
        method: "GET",
        url: "/bargain"
      },
      category: {
        method: "GET",
        url: "/category",
        categories: categories,
      },
    }
  });
});

// GET bargain details
app.get("/bargain/:id", async (req, res) => {
  const id = req.params.id;
  data = await productData(id);
  res.json(JSON.parse(data));
});

// GET bargains by category
app.get("/category/:category", async (req, res) => {
  const category = req.params.category;
  const page = req.query.page;
  data = await categoryData(category, page);
  res.json(JSON.parse(data));
});

app.listen(PORT, (_) => {
  console.log(`Listening on port ${PORT}`);
});
