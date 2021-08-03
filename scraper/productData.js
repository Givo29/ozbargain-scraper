const fetch = require("node-fetch");
const cheerio = require("cheerio");

const productData = async (node_id) => {
  return await fetch(`https://www.ozbargain.com.au/node/${node_id}`)
    .then((response) => response.text())
    .then((html) => {
      const $ = cheerio.load(html);
      // Getting general info
      const title = $("#title").text();
      const description = $(".node-ozbdeal .content > p").text();
      const price = parseInt(
        $("#title").find(".dollar").first().text().substring(1)
      );
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

exports.default = productData;