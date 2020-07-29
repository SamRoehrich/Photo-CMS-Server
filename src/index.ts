import "reflect-metadata";
import express from "express";
import { createConnection, getConnectionOptions } from "typeorm";
import cors from "cors";

import { Photo } from "./entity/Photo";
import { toThumbnail } from "../utils/toThumbnail";

(async () => {
  const app = express();
  const port = process.env.PORT || 5000;

  app.use(cors());
  app.use(express.json());

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

  app.post("/admin/upload", (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const tag = req.body.tag;
    const link = req.body.link;

    const thumbnail = toThumbnail(link);

    Photo.create({
      title,
      tag,
      link,
      thumbnail,
      isActive: true,
    }).save();

    res.send({
      title,
      description,
    });
  });

  app.listen(port, () => {
    console.log("App running on port 5000");
  });
})();
