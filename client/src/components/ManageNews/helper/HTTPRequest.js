import { message } from "antd";
import Axios from "axios";
import metaphone from "metaphone";
import stemmer from "stemmer";

const HTTPRequest = () => {
  const fetchNews = (dispatch, setLoading) => {
    Axios.get("/api/v1/admin/news/")
      .then((response) => {
        let data = response.data;

        let formatData = data.map((news, index) => {
          let title = news.newsTitle.replace(/ /g, "-");
          let category = news.news_category.categoryName.replace(/ /g, "-");
          let whole = title + "-" + category;

          return {
            key: index,
            soundsLike: metaphone(stemmer(whole)),

            newsTitle: news.newsTitle,
            newsId: news.id,
            newsUrlSlug: news.newsUrlSlug,
            newsCategory: news.news_category.categoryName,
            status: [news.published ? "PUBLISHED" : "UNPUBLISHED"],
            newsImage: news.coverImageNameLg.replace("-lg.png", ""),
            createdAt: news.createdAt,
            updatedAt: news.updatedAt,
          };
        });
        setLoading(false);
        dispatch({ type: "SET_NEWS_TABLE_DATA", newsData: formatData });
      })
      .catch((error) => console.log(error));
  };

  const deleteNews = (record, dispatch, data) => {
    message.loading({ content: "Deleting news", key: "updatable" });
    Axios.delete("/api/v1/admin/news/delete_news", {
      params: { id: record.newsId, newsImage: record.newsImage },
    })
      .then((deleteNewsRes) => {
        let { success, msg } = deleteNewsRes.data;
        if (success) {
          let dataCopy = [...data];

          let id = record.newsId;

          dataCopy = dataCopy.filter((c) => c.newsId !== id);

          dispatch({ type: "DELETE_SINGLE_NEWS", news: dataCopy });
          message.success({ content: msg, key: "updatable", duration: 2 });
        } else {
          message.waring({ content: msg, key: "updatable", duration: 2 });
        }
      })
      .catch((error) => console.log(error));
  };

  const updateNews = (data, setIsUpdated, dispatch) => {
    message.loading({ content: "Updating news", key: "updatable" });
    Axios.put("/api/v1/admin/news/update_news", data)
      .then((res) => {
        let { success, msg, error } = res.data;

        if (success) {
          if (data.imageBase64) {
            dispatch({
              type: "SET_NEWS_COVER_IMAGE_NAME_AFTER_UPDATE",
              coverImage: data.imageBase64,
            });
          }
          setIsUpdated(true);
          message.success({ content: msg, key: "updatable", duration: 2 });
        } else {
          if (error.original.code === "ER_DUP_ENTRY") {
            message.error({
              content: "News title is already taken.",
              key: "updatable",
              duration: 2,
            });
          }
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchSingleNews = (newsId, dispatch, form) => {
    Axios.get("/api/v1/admin/news/single", { params: { newsId } })
      .then((response) => {
        console.log(response);

        let data = response.data;

        form.setFieldsValue({
          newsContent: data.newsContent,
          newsTitle: data.newsTitle,
          published: data.published,
          newsCategoryID: data.newsCategoryID,
          newsImage: data.coverImageNameMd,
        });
        dispatch({
          type: "SET_NEWS_COVER_IMAGE_NAME",
          coverImage: data.coverImageNameMd,
          coverImageName: data.coverImageNameMd,
        });
      })
      .catch((error) => console.log(error));
  };

  const fetchSingleNewsView = (newsUrlSlug, setViewData) => {
    Axios.get("/api/v1/admin/news/single_View", {
      params: { newsUrlSlug },
    })
      .then((response) => {
        let data = response.data;
        console.log(response);
        setViewData(data);
      })
      .catch((error) => console.log(error));
  };

  const fetchCategories = (setCategoryList) => {
    Axios.get("/api/v1/admin/news/categories")
      .then((response) => {
        let data = response.data;
        let formattedData = data.map((category, index) => {
          return {
            key: category.id,
            categoryId: category.id,
            categoryName: category.categoryName,
          };
        });
        setCategoryList(formattedData);
      })
      .catch((error) => console.log(error));
  };

  const createNews = (data, history) => {
    message.loading({ content: "Creating News", key: "updatable" });
    Axios.post("/api/v1/admin/news/create_news", data)
      .then((response) => {
        console.log(response);
        let { success, error } = response.data;

        if (success) {
          history.push("/manage-news");
          message.success({
            content: "News Created!",
            key: "updatable",
            duration: 2,
          });
        } else {
          if (error.original.code === "ER_DUP_ENTRY") {
            message.error({
              content: "News title is already taken.",
              key: "updatable",
              duration: 2,
            });
          }
        }
      })
      .catch((error) => console.log(error));
  };

  return {
    fetchNews,
    deleteNews,
    updateNews,
    createNews,
    fetchCategories,
    fetchSingleNews,
    fetchSingleNewsView,
  };
};

export default HTTPRequest();
