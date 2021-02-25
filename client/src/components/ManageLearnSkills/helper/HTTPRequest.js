import { message } from "antd";
import Axios from "axios";
import metaphone from "metaphone";
import stemmer from "stemmer";

const HTTPRequest = () => {
  const fetchSkills = (dispatch, setLoading) => {
    Axios.get("/api/v1/admin/skill")
      .then((response) => {
        let data = response.data;

        let formatData = data.map((skill, index) => {
          let title = skill.skillTitle.replace(/ /g, "-");

          return {
            key: index,
            soundsLike: metaphone(stemmer(title)),
            skillTitle: skill.skillTitle,
            skillDescription: skill.skillDescription,
            skillUrlSlug: skill.skillUrlSlug,
            skillId: skill.id,
            skillImage: skill.coverImageIcon.replace(".png", ""),
          };
        });
        setLoading(false);

        dispatch({ type: "SET_SKILLS_TABLE_DATA", skillsData: formatData });
      })
      .catch((error) => console.log(error));
  };

  const deleteSkill = (record, dispatch, data) => {
    message.loading({ content: "Deleting skill", key: "updatable" });
    Axios.delete("/api/v1/admin/skill/delete_skill", {
      params: { id: record.skillId, skillImage: record.skillImage },
    })
      .then((deleteSkillRes) => {
        let { success, msg } = deleteSkillRes.data;
        if (success) {
          let dataCopy = [...data];

          let id = record.skillId;

          dataCopy = dataCopy.filter((c) => c.skillId !== id);

          dispatch({ type: "DELETE_SINGLE_SKILL", skills: dataCopy });
          message.success({ content: msg, key: "updatable", duration: 2 });
        } else {
          message.waring({ content: msg, key: "updatable", duration: 2 });
        }
      })
      .catch((error) => console.log(error));
  };

  const updateSkill = (data, setIsUpdated, dispatch) => {
    message.loading({ content: "Updating skill", key: "updatable" });
    Axios.put("/api/v1/admin/skill/update_skill", data)
      .then((res) => {
        let { success, msg, error } = res.data;

        if (success) {
          if (data.imageBase64) {
            dispatch({
              type: "SET_SKILL_COVER_IMAGE_NAME_AFTER_UPDATE",
              coverImageIcon: data.imageBase64,
            });
          }
          setIsUpdated(true);
          message.success({ content: msg, key: "updatable", duration: 2 });
        } else {
          if (error.original.code === "ER_DUP_ENTRY") {
            message.error({
              content: "Skill title is already taken.",
              key: "updatable",
              duration: 2,
            });
          }
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchSingleSkill = (skillId, form, dispatch) => {
    Axios.get("/api/v1/admin/skill/single", { params: { skillId } })
      .then((response) => {
        console.log(response.data);
        let data = response.data;

        form.setFieldsValue({
          skillContent: data.skillContent,
          skillTitle: data.skillTitle,
          skillDescription: data.skillDescription,
          skillImage: data.coverImageIcon,
        });

        dispatch({
          type: "SET_SKILL_COVER_IMAGE_NAME",
          coverImage: data.coverImageIcon,
          coverImageName: data.coverImageIcon,
        });
      })
      .catch((error) => console.log(error));
  };

  const fetchSingleSkillView = (skillUrlSlug, setViewData, setIsLoading) => {
    Axios.get("/api/v1/admin/skill/single_View", {
      params: { skillUrlSlug },
    })
      .then((response) => {
        let data = response.data;
        console.log(data);
        setViewData(data);
        setIsLoading(false);
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

  const createSkill = (data, history) => {
    message.loading({ content: "Creating Skill", key: "updatable" });
    Axios.post("/api/v1/admin/skill/create_skill", data)
      .then((response) => {
        let { success, error } = response.data;

        console.log(error);

        if (success) {
          history.push("/manage-learn-skills");
          message.success({
            content: "Skill Created!",
            key: "updatable",
            duration: 2,
          });
        } else {
          if (error.original.code === "ER_DUP_ENTRY") {
            message.error({
              content: "Skill title is already taken.",
              key: "updatable",
              duration: 2,
            });
          }
        }
      })
      .catch((error) => console.log(error));
  };

  return {
    fetchSkills,
    deleteSkill,
    updateSkill,
    createSkill,
    fetchCategories,
    fetchSingleSkill,
    fetchSingleSkillView,
  };
};

export default HTTPRequest();
