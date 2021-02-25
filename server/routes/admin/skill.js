const router = require("express").Router();
const sharp = require("sharp");
const cryptoRandomString = require("crypto-random-string");
const slug = require("slug");
const fs = require("fs");
const Skill = require("../../models/admin/skill");
const authNormal = require("../../middleware/authNormal");

router.get("/", (req, res) => {
  Skill.findAll({
    order: [["id", "DESC"]],
    attributes: [
      "id",
      "skillTitle",
      "skillDescription",
      "coverImageIcon",
      "skillUrlSlug",
    ],
  })
    .then((skillResponse) => {
      res.json(skillResponse);
    })
    .catch((error) => console.log(error));
});
router.get("/get_landing_page_learn_skills", (req, res) => {
  Skill.findAll({
    order: [["id", "DESC"]],
    attributes: [
      "id",
      "skillTitle",
      "skillDescription",
      "coverImageIcon",
      "skillUrlSlug",
    ],
  })
    .then((skillResponse) => {
      res.json(skillResponse);
    })
    .catch((error) => console.log(error));
});

router.post("/create_skill", (req, res) => {
  let { skillTitle, skillDescription, skillContent, imageBase64 } = req.body;

  let inputBuffer = Buffer.from(imageBase64, "base64");

  let imageUrl = cryptoRandomString({ length: 20, type: "alphanumeric" });

  let imagePath = "public/images/skill/";
  let coverImageName = `${imageUrl}.png`;

  Skill.create({
    skillTitle,
    skillDescription,
    skillContent,
    coverImageIcon: coverImageName,
    skillUrlSlug: slug(skillTitle),
  })
    .then((skillResponse) => {
      sharp(inputBuffer)
        .resize(512, 512)
        .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
        .toFile(`${imagePath}${coverImageName}`, (err, info) => {
          if (err) throw err;
          res.json({ success: true, skills: skillResponse });
        });
    })
    .catch((error) => res.json({ success: false, error }));
});

router.get("/single", (req, res) => {
  let { skillId } = req.query;

  Skill.findOne({
    attributes: [
      "id",
      "skillContent",
      "skillTitle",
      "skillDescription",
      "coverImageIcon",
    ],

    where: { id: skillId },
  })
    .then((skillResponse) => {
      res.json(skillResponse);
    })
    .catch((error) => console.log(error));
});

router.get("/single_View", (req, res) => {
  let { skillUrlSlug } = req.query;

  if (skillUrlSlug) {
    Skill.findOne({
      attributes: ["id", "skillContent", "skillTitle"],
      where: { skillUrlSlug },
    })
      .then((skillResponse) => {
        res.json(skillResponse);
      })
      .catch((error) => console.log(error));
  }
});

router.put("/update_skill", authNormal, (req, res) => {
  const { skillContent, id, skillTitle, imageBase64, skillImage } = req.body;

  if (imageBase64) {
    let inputBuffer = Buffer.from(imageBase64, "base64");

    let imageName = skillImage.replace(".png", "");
    let imagePath = "public/images/skill/";
    let coverImageName = `${imageName}.png`;

    Skill.update(
      {
        skillContent,
        skillTitle,
        coverImageIcon: coverImageName,
        skillUrlSlug: slug(skillTitle),
      },
      { where: { id: parseInt(id) } }
    )
      .then((newsUpdateRes) => {
        sharp(inputBuffer)
          .resize(512, 512)
          .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
          .toFile(`${imagePath}${coverImageName}`, (err, info) => {
            if (err) throw err;
            res.json({
              success: true,
              msg: "Succesfully updated skill!",
            });
          });
      })
      .catch((error) => res.json({ success: false, error }));
  } else {
    Skill.update(
      { skillContent, skillTitle, skillUrlSlug: slug(skillTitle) },
      { where: { id: parseInt(id) } }
    )
      .then((newsUpdateRes) => {
        res.json({
          success: true,
          msg: "Succesfully updated skill!",
        });
      })
      .catch((error) => res.json({ success: false, error }));
  }
});

router.delete("/delete_skill", authNormal, (req, res) => {
  let { id, skillImage } = req.query;

  Skill.destroy({ where: { id: parseInt(id) } })
    .then((deleted) => {
      if (deleted) {
        let imageCoverArray = [
          {
            coverImageName: skillImage,
          },
        ];

        try {
          imageCoverArray.forEach((imageName) => {
            fs.unlinkSync(
              `public/images/skill/${imageName.coverImageName}.png`
            );
          });

          res.json({ success: true, msg: "Succesfully deleted Skill." });
        } catch (err) {
          console.log(err);
        }
      } else {
        res.json({
          success: false,
          msg: "This skill is already deleted. Please refresh the page",
        });
      }
    })
    .catch((error) => console.log(error));
});

module.exports = router;
