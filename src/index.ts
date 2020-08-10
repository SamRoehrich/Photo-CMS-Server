import "reflect-metadata";
import express from "express";
import session from "express-session";
import { createConnection, getConnectionOptions, getConnection } from "typeorm";
import cors from "cors";

import { Photo } from "./entity/Photo";
import { toThumbnail } from "../utils/toThumbnail";
import { Theme } from "./entity/Theme";

(async () => {
  const app = express();
  const port = process.env.PORT || 5000;

  app.use(cors());
  app.use(express.json());
  app.use(
    session({
      secret: "mysessionsecret",
      name: "sid",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 2,
        secure: false,
      },
    })
  );

  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  process.env.NODE_ENV == "production"
    ? await createConnection({
        ...connectionOptions,
        url:
          "postgres://mpmaifdvxwghvj:bd6be047c85685388d47fc92e7c2df557e7c71e8b493c218ffd8e7530b301bef@ec2-50-16-198-4.compute-1.amazonaws.com:5432/da7bc573qoo1nj",
        name: "default",
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      } as any)
    : await createConnection();

  await Theme.create({
    title: "Primary Theme",
    primaryColor: "#EFE9DC",
    secondaryColor: "#EFE9DC",
    tertiaryColor: "#EFE9DC",
    ascentColor: "#E6714A",
    backgroundColor: "#EFE9DC",
    textPrimaryColor: "rgba(0, 0, 0, 0.87)",
    textSecondaryColor: "#ff80ab",
    borderColor: "#DE663A",
  }).save();

  app.get("/", (_req, res) => {
    res.send("KG Photo server");
  });

  app.get("/photos/", async (_req, res) => {
    res.json(await Photo.find({ where: { tag: "home" } }));
  });

  app.get("/photos/climbing", async (_req, res) => {
    res.json(await Photo.find({ where: { tag: "climbing" } }));
  });

  app.get("/photos/portraits", async (_req, res) => {
    res.json(await Photo.find({ where: { tag: "portrait" } }));
  });

  app.get("/photos/notclimbing", async (_req, res) => {
    res.json(await Photo.find({ where: { tag: "not climbing" } }));
  });

  app.get("/photos/all", async (_req, res) => {
    res.json(await Photo.find());
  });

  app.post("/admin/upload", (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const tag = req.body.tag;
    const link = req.body.cloudLink;
    const cloudLocation = req.body.cloudLocation;
    const borderWidth = req.body.borderWidth;

    const thumbnail = toThumbnail(req.body.thumbnailLink);

    Photo.create({
      title,
      tag,
      link,
      thumbnail,
      borderWidth,
      cloudLocation,
      isActive: true,
    }).save();

    res.send({
      title,
      description,
    });
  });

  app.put("/admin/update", async (req, res) => {
    // const link = addBorderWidth(req.body.link, req.body.borderWidth);
    await getConnection()
      .createQueryBuilder()
      .update(Photo)
      .set({
        link: req.body.link,
        isActive: req.body.isActive,
        title: req.body.title,
        tag: req.body.tag,
        tagIndex: req.body.order,
      })
      .where("id = :id", { id: req.body.id })
      .execute();
    res.json(await Photo.findOne(req.body.id));
  });

  app.put("/admin/toggleActive", async (req, res) => {
    const isActive = req.body.isActive;
    await getConnection()
      .createQueryBuilder()
      .update(Photo)
      .set({ isActive: isActive })
      .where("id = :id", { id: req.body.id })
      .execute();

    res.json(await Photo.findOne(req.body.id));
  });

  app.delete("/admin/deletePhoto", async (req, res) => {
    const pic = await Photo.findOne(req.body.id);
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Photo)
      .where("id = :id", { id: req.body.id })
      .execute();
    res.send(pic);
  });

  app.get("/theme", async (_req, res) => {
    res.json(await Theme.find());
  });

  app.put("/admin/edit-theme", async (req, res) => {
    await getConnection()
      .createQueryBuilder()
      .update(Theme)
      .set({
        primaryColor: req.body.theme.primaryColor,
        secondaryColor: req.body.theme.secondaryColor,
        tertiaryColor: req.body.theme.tertiaryColor,
        ascentColor: req.body.theme.primaryColor,
        backgroundColor: req.body.theme.backgroundColor,
        textPrimaryColor: req.body.theme.textPrimaryColor,
        textSecondaryColor: req.body.theme.textSecondaryColor,
        borderColor: req.body.theme.borderColor,
      })
      .where("id = :id", { id: req.body.theme.id })
      .execute();
    res.json(await Theme.findOne(req.body.theme.id));
  });

  app.listen(port, () => {
    console.log("App running on port 5000");
  });
})();
