"use strict"
import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import fs from "fs";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Root middleware
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

app.post("/api/v1/upload", async function (req, res, next) {
  try {
    let imageLinks = "";
    if (req.files) {
      let images = [];
      if (req.files.images.length > 0) images = req.files.images;
      else images.push(req.files.images);

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(
          images[i].tempFilePath,
          {
            use_filename: true,
            folder: "employee",
            quality: 50,
            resource_type: "auto",
          }
        );
        imageLinks = result.secure_url;
        fs.unlinkSync(images[i].tempFilePath);
      }
      return res
        .status(200)
        .json({ message: "Image uploaded Successfully!", link: imageLinks });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});


(function fn() {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/dist")));
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
    );
  } else {
    app.get("/", (req, res) => {
      res.send("API is running....");
    });
  }
})();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running at port: ${port}`));
