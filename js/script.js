const loadCategories = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/news/categories"
  );
  const data = await res.json();
  const categoriesArray = data.data.news_category;
  displayCategories(categoriesArray);
};

const formatDate = (dateGiven) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  const date = new Date(dateGiven);
  return date.toLocaleDateString("en-US", options);
};

const compareDates = (a, b) => {
  const dateA = new Date(a.author.published_date);
  const dateB = new Date(b.author.published_date);
  return dateA - dateB;
};

const displayCategories = (categories) => {
  const tabsContainer = document.getElementById("tabs-container");
  categories.forEach((category) => {
    const a = document.createElement("a");
    // console.log(a);
    a.innerHTML = `
    <a id=${category.category_id} onclick=tabHandler('${category.category_id}') class="tab">${category.category_name}</a>
    `;
    tabsContainer.appendChild(a);
  });
};

let newData = [];

const tabHandler = async (id) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/news/category/${id}`
  );
  const data = await res.json();
  newData = data.data;
  displayNews(newData);
  document
    .querySelectorAll(".active")
    ?.forEach((element) => element.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  //   console.log(document.getElementById(id));
};

const displayNews = (newsArray) => {
  const newsContainer = document.getElementById("news-container");
  newsContainer.textContent = "";
  newsArray.forEach((news) => {
    // console.log(news);
    const date = formatDate(news.author.published_date);
    const newDiv = document.createElement("div");
    newDiv.classList = `hero shadow-lg my-4`;
    newDiv.innerHTML = `
    <div class="hero-content flex-col lg:flex-row">
              <img
                src="${news?.image_url}"
                class="max-w-sm rounded-lg shadow-2xl" />
              <div>
                <h1 class="text-2xl font-bold">
                  ${news.title}
                </h1>
                <p class="py-2 text-[#949494]">
                 ${news.details.slice(0, 400)}...
                </p>
                <div
                  class="grid grid-cols-2 lg:grid-cols-4 gap-2 items-center mt-3">
                  <div class="flex items-center gap-5">
                    <img
                      class="w-[40px] rounded-full"
                      src="${news?.author?.img}"
                      alt="" />
                    <div>
                      <h2>${
                        news?.author?.name ? news.author.name : "Nadiatul Sakib"
                      }</h2>
                      <p class="text-[#718797]">${date}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <i class="fa-regular fa-eye"></i>
                    <p class="text-lg font-bold">${
                      news?.total_view ? news.total_view : "Not available"
                    }</p>
                  </div>
                  <div class="w-1/2 rounded-full bg-fuchsia-600 py-2">
                    <p class="text-center font-semibold text-white">
                      ${news.rating.badge}
                    </p>
                  </div>
                  <div class="flex justify-end">
                    <button><i class="fa-solid fa-arrow-right"></i></button>
                  </div>
                </div>
              </div>
            </div>
    `;
    newsContainer.appendChild(newDiv);
  });
};

const sortHandler = () => {
  const sorted = newData.sort(compareDates);
  displayNews(sorted);
};

const todayHandler = () => {
  const todays = newData.filter(
    (todayNews) => todayNews.others_info.is_todays_pick === true
  );
  if (todays.length === 0) {
    alert("No data found");
  }
  displayNews(todays);
};

const trendingHandler = () => {
  const trending = newData.filter(
    (trending) => trending.others_info.is_trending === true
  );
  displayNews(trending);
};

loadCategories();
tabHandler(`01`);
