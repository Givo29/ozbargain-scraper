const fetch = require("node-fetch");
const cheerio = require("cheerio");

const searchData = async (query, page, show_expired) => {
  let base_url = `https://www.ozbargain.com.au/search/node/${query}`;
  let url = parseInt(page) ? `${base_url}&page=${page}` : base_url;

  return await fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const $ = cheerio.load(html);
      const results = [];
      const next_page = $(".pager .pager-next").attr("href");
      const previous_page = $(".pager .pager-previous").attr("href");
      const next_page_num = next_page
        ? next_page.substring(next_page.lastIndexOf("=") + 1)
        : null;
      const previous_page_num = previous_page
        ? previous_page.substring(previous_page.lastIndexOf("=") + 1)
        : null;

      const resultMap = new Map();
      let group;
      $("dl.search-results")
        .children()
        .each((_, elem) => {
          switch (elem.tagName) {
            case "dt":
              resultMap.set(elem, (group = []));
              break;

            case "dd":
              group.push(elem);
              break;

            default:
              group = null;
          }
        });

      for (const [key, value] of resultMap.entries()) {
        const expired = $(key).find(".expired") ? true : false;
        if (expired == true && show_expired == false) break;
        const title = $(key).find("a").text();
        const url = `https://www.ozbargain.com${$(key).find("a").attr("href")}`;
        const upvotes = $(key).find(".votes .voteup").text();
        const downvotes = $(key).find(".votes .votwdown").text();

        // Calculating price
        const priceIndex = title.substring(title.indexOf("$"));
        const price = parseInt(
          priceIndex.substring(1, priceIndex.indexOf(" "))
        );

        const username = $(value).find(".search-info a").text();
        const user_link = `https://www.ozbargain.com${$(value)
          .find(".search-info a")
          .attr("href")}`;
        const links = $(value).find(".search-info .links").text();
        const date_posted = links
          .substring(links.lastIndexOf("deal"))
          .slice(13, 23);

        results.push({
          title: title,
          expired: expired,
          price: price,
          post_information: {
            date_posted: date_posted,
            upvotes: upvotes,
            downvotes: downvotes,
            post_link: url,
          },
          user_information: {
            username: username,
            user_link: user_link,
          },
        });
      }
      let data = {
        query: query,
        results: results,
      };

      if (previous_page_num) {
        data.previous_page_url = `/search/${query}?show_expired=${show_expired}&page=${previous_page_num}`;
      }
      if (next_page_num) {
        data.next_page_url = `/search/${query}?show_expired=${show_expired}&page=${next_page_num}`;
      }
      return JSON.stringify(data);
    })
    .catch((err) => err);
};

exports.default = searchData;