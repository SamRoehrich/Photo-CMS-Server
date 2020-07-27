import "reflect-metadata";
import express from "express";
import { createConnection, getConnectionOptions } from "typeorm";
import cors from "cors";
import { Photo } from "./entity/Photo";

(async () => {
  const app = express();
  const port = process.env.PORT || 5000;

  app.use(cors());

  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  process.env.NODE_ENV == "production"
    ? await createConnection({
        ...connectionOptions,
        url:
          "postgres://mpmaifdvxwghvj:bd6be047c85685388d47fc92e7c2df557e7c71e8b493c218ffd8e7530b301bef@ec2-50-16-198-4.compute-1.amazonaws.com:5432/da7bc573qoo1nj",
        name: "default",
      } as any)
    : await createConnection();

  console.log(process.env.NODE_ENV);

  //   Photo.create({
  //     title: "JorscheJ",
  //     isActive: true,
  //     tag: "portrait",
  //     link:
  //       "https://res.cloudinary.com/dchopcxko/image/upload/v1595821556/IMG_3799-min_bm92vy.jpg",
  //   }).save();

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

  app.get("/admin/upload", (_req, res) => {
    res.send("admin upload");
  });

  app.listen(port, () => {
    console.log("App running on port 5000");
  });
})();
