import { message } from "antd";
import Axios from "axios";

const HTTPRequest = () => {
  const fetchCategories = (setCategoriesData, setLoading) => {
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
        setCategoriesData(formattedData);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const deleteCategory = (setCategoriesData, record, categoriesData) => {
    message.loading({ content: "Deleting Category", key: "updatable" });
    Axios.delete("/api/v1/admin/news/delete_category", {
      params: { deleteId: record.categoryId },
    })
      .then((response) => {
        let { success, msg } = response.data;

        if (success) {
          let categoriesDataCopy = [...categoriesData];

          categoriesDataCopy = categoriesDataCopy.filter(
            (c) => c.categoryId !== record.categoryId
          );

          setCategoriesData(categoriesDataCopy);

          message.success({
            content: msg,
            key: "updatable",
            duration: 2,
          });
        } else {
          message.error({
            content: msg,
            key: "updatable",
            duration: 2,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  const updateCategory = (
    setCategoriesData,
    setVisible,
    setIsAddingCategory,
    values,
    editId,
    categoriesData
  ) => {
    Axios.put("/api/v1/admin/news/update_category", {
      ...values,
      id: editId,
    })
      .then((categoryUpdateResponse) => {
        let { isUpdated, msg } = categoryUpdateResponse.data;
        if (isUpdated) {
          let categoriesDataCopy = [...categoriesData];

          let updatedCategoriesData = categoriesDataCopy.map((category) => {
            if (category.categoryId === editId) {
              return { key: editId, categoryId: editId, ...values };
            } else {
              return { ...category };
            }
          });

          setCategoriesData(updatedCategoriesData);

          setVisible(false);

          message.success({
            content: msg,
            key: "updatable",
            duration: 2,
          });
        } else {
          message.error({ content: msg, key: "updatable", duration: 2 });
        }

        setIsAddingCategory(false);
      })
      .catch((error) => console.log(error));
  };

  const createCategory = (
    categoriesData,
    setCategoriesData,
    setVisible,
    setIsAddingCategory,
    form,
    values
  ) => {
    Axios.post("/api/v1/admin/news/create_category", {
      ...values,
    })
      .then((response) => {
        let { success, msg, newsCategory } = response.data;

        if (success) {
          let categoriesDataCopy = [...categoriesData];

          categoriesDataCopy = [
            ...categoriesDataCopy,
            {
              key: newsCategory.id,
              categoryId: newsCategory.id,
              categoryName: newsCategory.categoryName,
            },
          ];

          setCategoriesData(categoriesDataCopy);

          message.success({
            content: msg,
            key: "updatable",
            duration: 2,
          });

          form.setFieldsValue({
            newsCategory: "",
          });

          setVisible(false);
          setIsAddingCategory(false);
        } else {
          message.error({ content: msg, key: "updatable", duration: 2 });
          setIsAddingCategory(false);
        }
      })
      .catch((error) => console.log(error));
  };

  return { fetchCategories, deleteCategory, updateCategory, createCategory };
};

export default HTTPRequest();
