const router = require("express").Router();
const AboutUs = require("../../models/admin/aboutUs");

const updateOrCreate = async (model, data) => {
  try {
    let aboutUsData = await model.findAll();
    let response = {};

    if (aboutUsData.length > 0) {
      await model.update({ ...data }, { where: { id: data.id } });
      response = {
        success: true,
        msg: "Succesfully updated About Us",
        aboutUsDataResponse: { ...data, id: data.id },
      };
    } else {
      let createdAboutUs = await model.create({ ...data });
      response = {
        success: true,
        msg: "Succesfully created About Us",
        aboutUsDataResponse: { ...createdAboutUs.dataValues },
      };
    }

    return response;
  } catch (error) {
    console.log(error);
  }
};

router.post("/create_or_update", async (req, res) => {
  try {
    let response = await updateOrCreate(AboutUs, req.body);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

router.get("/", (req, res) => {
  let { excludeThis } = req.query;
  let exclude = ["createdAt", "updatedAt", ...excludeThis];

  AboutUs.findAll({
    attributes: {
      exclude: exclude,
    },
  })
    .then((aboutUsRes) => {
      res.json(aboutUsRes);
    })
    .catch((error) => console.log(error));
});

module.exports = router;
