const fetch = require("node-fetch");
const cheerio = require("cheerio");

const categoryData = async (category_name, page, show_expired) => {
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
        const price = parseInt(
          $(elem).find(".dollar").first().text().substring(1)
        );
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

        if (
          show_expired === true ||
          (show_expired === false && expired === false)
        ) {
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
        }
      });

      let data = {
        category_name: category_name,
        bargains: bargains,
      };

      if (previous_page_num) {
        data.previous_page_url = `/category/${category_name}?show_expired=${show_expired}&page=${previous_page_num}`;
      }
      if (next_page_num) {
        data.next_page_url = `/category/${category_name}?show_expired=${show_expired}&page=${next_page_num}`;
      }

      return JSON.stringify(data);
    })
    .catch((err) => err);
};

exports.default = categoryData;
