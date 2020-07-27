import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import cors from "cors";
import { Photo } from "./entity/Photo";

(async () => {
  const app = express();

  app.use(cors());

  await createConnection();

  //   Photo.create({
  //     title: "JorscheJ",
  //     isActive: true,
  //     tag: "portrait",
  //     link:
  //       "https://res.cloudinary.com/dchopcxko/image/upload/v1595821556/IMG_3799-min_bm92vy.jpg",
  //   }).save();

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

  app.get("/admin/upload", (_req, res) => {
    res.send("admin upload");
  });

  app.listen(5000, () => {
    console.log("App running on port 5000");
  });
})();
