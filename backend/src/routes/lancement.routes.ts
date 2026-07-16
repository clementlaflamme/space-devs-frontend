import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier, exigerRole } from "../middlewares/auth.js";
import axios from "axios";
import { spacedevs } from "../api/spaceDevs.js";

const router = Router();

// GET /lancements?statut=A_VENIR&page=1&limit=10
router.get("/", async (req: Request, res: Response) => {
  try {
    const { statut } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const where = statut ? { statut: statut as any } : {};
    const [lancements, total] = await Promise.all([
      prisma.lancement.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { dateLancement: "asc" },
      }),
      prisma.lancement.count({ where }),
    ]);
    res.json({ page, limit, total, lancements });
  } catch (error) {
    res.json(error);
  }
});

// POST /lancements/importer
router.post("/importer", async (req: Request, res: Response) => {
  const limite = Math.min(10, Number(req.body.limite));
  try {
    const { data } = await spacedevs.get("/launch/upcoming/", {
      params: { limit: limite },
    });
    let importe = 0;
    for (const l of data.results) {
      await prisma.lancement.upsert({
        // upsert === > si il existe on met a jour sinon on cree
        where: { ref: l.id },
        update: { statut: "A_VENIR" },
        create: {
          ref: l.id,
          nom: l.name,
          agence: l.launch_service_provider?.name ?? null,
          fusee: l.rocket?.configuration?.name ?? null,
          mission: l.mission?.name ?? null,
          lieu: l.pad?.location?.name ?? null,
          imageUrl: l.image ?? null,
          dateLancement: l.net ? new Date(l.net) : null,
          statut: "A_VENIR",
        },
      });
      importe++;
    }
    res.status(201).json({ message: `${importe} lancement(s) importe(s) ! ` });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return res.status(502).json({ error: "Serveur down de space dev !" });
    }
  }
});

export default router;
