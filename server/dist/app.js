import express from "express";
import actorsRouter from "./routers/actorsRoutes.js";
import productionRouter from "./routers/productionRouters.js";
import collaboratorsRouter from "./routers/collaborationRouters.js";
import cors from "cors";
const app = express();
const port = 3001;
app.use(cors());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/actors", actorsRouter);
app.use("/productions", productionRouter);
app.use("/collaborators", collaboratorsRouter);
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
