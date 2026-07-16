import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import lancementRoutes from "./routes/lancement.routes.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "LaunchPad - Mission Control " });
});

app.use(cors());
// localhost:3000/auth/....
app.use("/auth", authRoutes);

app.use("/lancement", lancementRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));
