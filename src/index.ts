import "reflect-metadata";
import express from "express";
import session from "express-session";
import { createConnection, getConnectionOptions, getConnection } from "typeorm";
import cors from "cors";

import { Photo } from "./entity/Photo";
import { About } from "./entity/About";
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

  // await Theme.create({
  //   title: "Primary Theme",
  //   primaryColor: "#EFE9DC",
  //   secondaryColor: "#EFE9DC",
  //   tertiaryColor: "#EFE9DC",
  //   ascentColor: "#E6714A",
  //   backgroundColor: "#EFE9DC",
  //   textPrimaryColor: "rgba(0, 0, 0, 0.87)",
  //   textSecondaryColor: "#ff80ab",
  //   borderColor: "#DE663A",
  // }).save();

  await About.create({
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sit amet ex justo. Proin porta ullamcorper interdum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum leo nulla, porttitor quis fringilla in, suscipit at dui. Integer viverra non augue non semper. Fusce sed ornare risus. Cras convallis nec nibh eget dapibus. Cras sed tellus nulla. In ac tempus dolor. Donec eget lectus in odio sodales elementum. Nulla facilisi. Donec lacinia massa velit. Nullam interdum arcu ac mattis bibendum. Suspendisse tellus metus, blandit non metus ut, fermentum sollicitudin erat. Vivamus vitae justo nunc. Maecenas nec eros consequat, accumsan nulla vel, elementum diam. Morbi gravida cursus molestie. Praesent ullamcorper mi in dictum elementum. Ut metus lorem, auctor facilisis lectus non, pellentesque vulputate turpis. Vestibulum a fermentum eros. Phasellus laoreet ex sit amet nunc pretium, vitae lacinia velit gravida. Pellentesque fringilla magna sit amet leo rhoncus, et ornare odio interdum. Donec ut lacus faucibus leo tincidunt placerat sit amet vitae quam. Proin tempor turpis vel felis porttitor, in dignissim libero dictum. Nam vel velit nec urna tincidunt accumsan. Etiam et erat tempor, commodo mauris sed, auctor lorem. Integer vel nulla ultricies, viverra massa dapibus, luctus metus. Donec scelerisque condimentum ante, sed lacinia dolor ornare ac. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus euismod vehicula dolor ut interdum. Mauris vehicula purus sit amet augue eleifend, condimentum molestie libero vestibulum. Fusce ac feugiat purus. Integer eu mattis massa. Maecenas pretium leo vitae ultrices auctor. Praesent id sagittis libero. Curabitur blandit quam lectus, pharetra tincidunt arcu imperdiet quis. Praesent placerat suscipit sapien faucibus aliquam. Integer enim leo, pharetra eget sem in, tristique porttitor dui. Nulla tempor sodales pulvinar. Phasellus posuere consectetur elementum. Nullam et laoreet est. Donec rhoncus venenatis consectetur. Cras neque orci, ultricies quis nulla pharetra, consectetur hendrerit odio. Etiam fermentum justo ac fermentum viverra. Curabitur elementum, enim non imperdiet tincidunt, nisl nulla dignissim augue, ac interdum ex justo et mauris. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla blandit neque eget malesuada fringilla. Integer eu odio mi. Fusce at semper velit. Donec tempus ex ipsum, in hendrerit urna rutrum eget. Sed lectus ligula, condimentum dapibus elit a, auctor dignissim nisi. Vivamus sagittis non massa et rhoncus. Curabitur elit dui, lacinia nec odio dapibus, venenatis tristique orci. In sit amet elementum dui, ac gravida augue. Vestibulum varius diam eget fermentum egestas. Nulla risus tortor, semper interdum porttitor nec, dignissim volutpat tellus. Aliquam accumsan felis non ex condimentum vulputate. Vivamus placerat ultrices nulla a imperdiet. Sed enim orci, aliquam nec pellentesque at, cursus eget massa.",
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
        borderWidth: req.body.borderWidth,
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

  app.get("/about", async (_req, res) => {
    res.json(await About.find());
  });

  app.put("/about", async (req, res) => {
    await getConnection()
      .createQueryBuilder()
      .update(About)
      .set({ content: req.body.content })
      .where("id = :id", { id: req.body.id })
      .execute();
    res.json(await About.find());
  });

  app.listen(port, () => {
    console.log("App running on port 5000");
  });
})();
