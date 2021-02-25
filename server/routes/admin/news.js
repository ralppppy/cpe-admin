const router = require("express").Router()
const NewsCategories = require("../../models/admin/newsCategories")
const News = require("../../models/admin/news")
const sharp = require("sharp")
const cryptoRandomString = require("crypto-random-string")
const slug = require("slug")
const fs = require("fs")
const sequelize = require("sequelize")
const Op = require("sequelize").Op
const { QueryTypes } = require("sequelize")
const db = require("../../config/database")
const authNormal = require("../../middleware/authNormal")

/**
 * News
 */

router.get("/", (req, res) => {
  NewsCategories.hasOne(News, { foreignKey: "newsCategoryID" })
  News.belongsTo(NewsCategories, { foreignKey: "newsCategoryID" })

  News.findAll({
    order: [["id", "DESC"]],
    attributes: [
      "id",
      "newsTitle",
      "published",
      "newsUrlSlug",
      "coverImageNameLg",
      "createdAt",
      "updatedAt",
    ],
    include: [{ model: NewsCategories, attributes: ["id", "categoryName"] }],
  })
    .then((newsResponse) => {
      res.json(newsResponse)
    })
    .catch((error) => console.log(error))
})

const buildWhere = (month, year, search) => {
  let whereOject = {}
  let whereArray = []
  let buildSearch = {}

  if (month) {
    whereArray.push(
      sequelize.where(
        sequelize.fn("MONTH", sequelize.col("news.createdAt")),
        "=",
        month
      )
    )
  }

  if (year) {
    whereArray.push(
      sequelize.where(
        sequelize.fn("YEAR", sequelize.col("news.createdAt")),
        "=",
        year
      )
    )
  }

  if (search) {
    whereArray.push(
      sequelize.literal(
        `MATCH (newsTitle,newsContent) AGAINST('${search}' IN NATURAL LANGUAGE MODE)`
      )
    )
  }

  whereArray.push(sequelize.where(sequelize.col("news.published"), "=", 1))

  whereOject = { where: whereArray }

  return whereOject
}

const buildLimit = (limit) => {
  let limitObject = limit ? { limit: parseInt(limit) } : {}

  return limitObject
}

const buildOffset = (page, limit) => {
  let offsetObject = page
    ? { offset: (parseInt(page) - 1) * parseInt(limit) }
    : { offset: 0 }
  return offsetObject
}

const buildCategoryWhere = (category) => {
  let whereOject = {}
  if (category) {
    let categoryArray = category.split(",")
    whereOject = { where: { id: categoryArray } }
    return whereOject
  } else {
    whereOject = {}
    return whereOject
  }
}

router.get("/get_landing_page_news", (req, res) => {
  let { limit, month, year, category, page, search } = req.query

  let limitObject = buildLimit(limit, page)
  let whereOject = buildWhere(month, year, search)
  let offsetObject = buildOffset(page, limit)
  let categoryWhereObject = buildCategoryWhere(category)

  NewsCategories.hasOne(News, { foreignKey: "newsCategoryID" })
  News.belongsTo(NewsCategories, { foreignKey: "newsCategoryID" })

  //console.log(whereOject);

  News.findAll({
    ...whereOject,
    ...limitObject,
    ...offsetObject,
    order: [["createdAt", "DESC"]],
    attributes: [
      "id",
      "newsTitle",
      "published",
      "newsUrlSlug",
      "coverImageNameMd",
      "coverImageNameLg",
      "newsContent",
      sequelize.literal("SUBSTRING(newsContent, 1, 200) as newsContent"),
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: NewsCategories,
        ...categoryWhereObject,
        attributes: ["id", "categoryName"],
      },
    ],
  })
    .then((newsResponse) => {
      res.json(newsResponse)
    })
    .catch((error) => console.log(error))
})

router.get("/get_category_list", (req, res) => {
  NewsCategories.findAll({ attributes: ["id", "categoryName"] })
    .then((newsCategoriesResponse) => {
      res.json(newsCategoriesResponse)
    })
    .catch((error) => console.log(error))
})

router.get("/single", (req, res) => {
  let { newsId } = req.query

  News.findOne({
    attributes: [
      "id",
      "newsContent",
      "newsTitle",
      "published",
      "newsCategoryID",
      "coverImageNameMd",
      "coverImageNameLg",
    ],
    where: { id: newsId },
  })
    .then((newsResponse) => {
      res.json(newsResponse)
    })
    .catch((error) => console.log(error))
})
router.get("/single_View", (req, res) => {
  let { newsUrlSlug } = req.query

  if (newsUrlSlug) {
    News.findOne({
      attributes: [
        "id",
        "newsContent",
        "newsTitle",
        "published",
        "newsCategoryID",
        "coverImageNameLg",
        "createdAt",
        "updatedAt",
      ],
      where: { newsUrlSlug },
    })
      .then((newsResponse) => {
        res.json(newsResponse)
      })
      .catch((error) => console.log(error))
  }
})

router.post("/create_news", authNormal, (req, res) => {
  const {
    newsContent,
    newsTitle,
    newsCategoryID,
    published,
    imageBase64,
  } = req.body

  let inputBuffer = Buffer.from(imageBase64, "base64")

  let imageUrl = cryptoRandomString({ length: 20, type: "alphanumeric" })

  let imagePath = "public/images/news/"
  let coverImageNameLg = `${imageUrl}-lg.png`
  let coverImageNameMd = `${imageUrl}-md.png`
  let coverImageNameSm = `${imageUrl}-sm.png`

  News.create({
    newsContent,
    newsTitle,
    newsCategoryID,
    published,
    newsUrlSlug: slug(newsTitle),
    coverImageNameLg,
    coverImageNameMd,
    coverImageNameSm,
  })
    .then((news) => {
      sharp(inputBuffer)
        .resize(1200, 445)
        .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
        .toFile(`${imagePath}${coverImageNameLg}`, (err, info) => {
          if (err) throw err

          sharp(inputBuffer)
            .resize(300, 300)
            .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
            .toFile(`${imagePath}${coverImageNameMd}`, (err, info) => {
              if (err) throw err
              sharp(inputBuffer)
                .resize(100, 100)
                .png({
                  compressionLevel: 9,
                  adaptiveFiltering: true,
                  force: true,
                })
                .toFile(`${imagePath}${coverImageNameSm}`, (err, info) => {
                  if (err) throw err
                  res.json({ success: true, news })
                })
            })
        })
    })
    .catch((error) => res.json({ success: false, error }))
})
router.put("/update_news", authNormal, (req, res) => {
  const {
    newsContent,
    id,
    newsTitle,
    newsCategoryID,
    published,
    imageBase64,
    newsImage,
  } = req.body

  if (imageBase64) {
    let inputBuffer = Buffer.from(imageBase64, "base64")

    let imageName = newsImage.replace("-md.png", "")
    let imagePath = "public/images/news/"
    let coverImageNameLg = `${imageName}-lg.png`
    let coverImageNameMd = `${imageName}-md.png`
    let coverImageNameSm = `${imageName}-sm.png`

    News.update(
      {
        newsContent,
        newsTitle,
        newsCategoryID,
        published,
        newsUrlSlug: slug(newsTitle),
        coverImageNameLg,
        coverImageNameMd,
        coverImageNameSm,
      },
      { where: { id: parseInt(id) } }
    )
      .then((news) => {
        sharp(inputBuffer)
          .resize(1200, 445)
          .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
          .toFile(`${imagePath}${coverImageNameLg}`, (err, info) => {
            if (err) throw err

            sharp(inputBuffer)
              .resize(300, 300)
              .png({
                compressionLevel: 9,
                adaptiveFiltering: true,
                force: true,
              })
              .toFile(`${imagePath}${coverImageNameMd}`, (err, info) => {
                if (err) throw err
                sharp(inputBuffer)
                  .resize(100, 100)
                  .png({
                    compressionLevel: 9,
                    adaptiveFiltering: true,
                    force: true,
                  })
                  .toFile(`${imagePath}${coverImageNameSm}`, (err, info) => {
                    if (err) throw err

                    res.json({
                      success: true,
                      msg: "Succesfully updated news!",
                    })
                  })
              })
          })
      })
      .catch((error) => res.json({ success: false, error }))
  } else {
    News.update(
      {
        newsContent,
        newsTitle,
        newsCategoryID,
        published,
        newsUrlSlug: slug(newsTitle),
      },
      { where: { id: parseInt(id) } }
    )
      .then((news) => {
        res.json({ success: true, msg: "Succesfully updated news!" })
      })
      .catch((error) => res.json({ success: false, error }))
  }
})

router.delete("/delete_news", authNormal, (req, res) => {
  let { id, newsImage } = req.query

  News.destroy({ where: { id: parseInt(id) } })
    .then((deleted) => {
      if (deleted) {
        let imageCoverArray = [
          {
            coverImageName: newsImage,
            coverImageType: "lg",
          },
          {
            coverImageName: newsImage,
            coverImageType: "md",
          },
          {
            coverImageName: newsImage,
            coverImageType: "sm",
          },
        ]

        try {
          imageCoverArray.forEach((imageName) => {
            fs.unlinkSync(
              `public/images/news/${imageName.coverImageName}-${imageName.coverImageType}.png`
            )
          })

          res.json({ success: true, msg: "Succesfully deleted News." })
        } catch (err) {
          console.log(err)
        }
      } else {
        res.json({
          success: false,
          msg: "This news is already deleted. Please refresh the page",
        })
      }
    })
    .catch((error) => console.log(error))
})

/**
 * News End
 */

/**
 * Categories
 */
router.get("/categories", (req, res) => {
  NewsCategories.findAll({ attributes: ["id", "categoryName"] })
    .then((newsCategories) => {
      res.json(newsCategories)
    })
    .catch((error) => console.log(error))
})

router.post("/create_category", authNormal, (req, res) => {
  let { categoryName } = req.body
  NewsCategories.create({ categoryName })
    .then((newsCategory) => {
      res.json({
        success: true,
        msg: "Succesfully added Category",
        newsCategory,
      })
    })
    .catch((error) => {
      console.log(error)
      res.json({ success: false, msg: "Category name must be unique" })
    })
})

router.delete("/delete_category", authNormal, (req, res) => {
  let { deleteId } = req.query

  NewsCategories.destroy({ where: { id: deleteId } })
    .then((deleted) => {
      if (deleted) {
        res.json({ success: true, msg: "Succesfully Delete Category!" })
      } else {
        res.json({ success: false, msg: "These category is already deleted!" })
      }
    })
    .catch((error) => console.log(error))
})

router.put("/update_category", authNormal, (req, res) => {
  let { categoryName, id } = req.body

  NewsCategories.update({ categoryName }, { where: { id } })
    .then((updateResponse) => {
      if (updateResponse[0]) {
        res.json({
          isUpdated: true,
          msg: "Succesfully Updated News Category Name",
        })
      } else {
        res.json({
          isUpdated: false,
          msg: "Will not update a similar category name",
        })
      }
    })
    .catch((error) => console.log(error))
})
/**
 * Categories END
 */

/**
 * News Archives
 */

const buildArchiveWhere = (search) => {
  let builWhere = {}
  if (search) {
    builWhere.newsContent = sequelize.literal(
      `MATCH (newsTitle,newsContent) AGAINST('${search}' IN NATURAL LANGUAGE MODE)`
    )
  }

  return builWhere
}

router.get("/archives", (req, res) => {
  let { category, search } = req.query

  NewsCategories.hasOne(News, { foreignKey: "newsCategoryID" })
  News.belongsTo(NewsCategories, { foreignKey: "newsCategoryID" })

  let categoryWhereObject = buildCategoryWhere(category)
  let searchWhereObject = buildArchiveWhere(search)

  News.findAll({
    include: [
      {
        requred: true,
        model: NewsCategories,
        ...categoryWhereObject,
        attributes: ["id", "categoryName"],
      },
    ],

    where: {
      published: 1,
      // newsTitle: { [Op.substring]: search },
      ...searchWhereObject,
    },
    attributes: [
      [
        sequelize.fn(
          "DISTINCT",
          sequelize.fn("YEAR", sequelize.col("news.createdAt"))
        ),
        "year",
      ],
      [sequelize.fn("COUNT", sequelize.col("news.id")), "newsCount"],
    ],
    order: [[sequelize.fn("YEAR", sequelize.col("news.createdAt")), "DESC"]],
    group: [[sequelize.fn("YEAR", sequelize.col("news.createdAt"))]],
  })
    .then((years) => {
      News.findAll({
        include: [
          {
            requred: true,
            model: NewsCategories,
            ...categoryWhereObject,
            attributes: ["id", "categoryName"],
          },
        ],
        where: {
          published: 1,
          //  newsTitle: { [Op.substring]: search },
          ...searchWhereObject,
        },
        attributes: [
          [
            sequelize.fn(
              "DISTINCT",
              sequelize.fn("MONTHNAME", sequelize.col("news.createdAt"))
            ),
            "month",
          ],

          [sequelize.fn("YEAR", sequelize.col("news.createdAt")), "year"],
          [sequelize.fn("MONTH", sequelize.col("news.createdAt")), "monthNum"],
          [sequelize.fn("COUNT", sequelize.col("news.id")), "newsCountMonth"],
        ],
        order: [
          [sequelize.fn("MONTH", sequelize.col("news.createdAt")), "DESC"],
        ],
        group: [
          [sequelize.fn("MONTH", sequelize.col("news.createdAt"))],
          [sequelize.fn("YEAR", sequelize.col("news.createdAt"))],
        ],
      })
        .then((month) => {
          let yearsData = JSON.parse(JSON.stringify(years))
          let monthData = JSON.parse(JSON.stringify(month))

          let f = yearsData.map((year, index) => {
            let format = []
            monthData.forEach((mData, i) => {
              if (year.year === mData.year) {
                format.push({
                  title: mData.month + ` (${mData.newsCountMonth})`,
                  key: `${year.year}-${mData.monthNum}`,
                  isLeaf: true,
                  newsCount: mData.newsCountMonth,
                })
              }
            })

            return {
              key: `${year.year}`,
              title: year.year + ` (${year.newsCount})`,

              children: format,
            }
          })

          let totalNewsCount = 0

          years.forEach((news) => {
            totalNewsCount += news.dataValues.newsCount
          })

          res.json({ archive: f, totalNewsCount })
        })
        .catch((error) => console.log(error))
    })
    .catch((error) => console.log(error))
})

module.exports = router
