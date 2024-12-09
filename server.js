import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.get("/", async (req, res) => {
  try {
    res.status(200).json({ message: "Server is working properly" });
  } catch (error) {
    console.log(error);
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
