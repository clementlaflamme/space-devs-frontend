import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  type Lancement = {
    id: number;
    ref: string;
    nom: string;
    agence: string | null;
    fusee: string | null;
    mission: string | null;
    lieu: string | null;
    imageUrl: string | null;
    dateLancement: string | null;
    statut: string;
  };

  const back = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000,
  });
  const [listeLancements, setListeLancements] = useState<Lancement[]>([]);
  const [msgErreur, setMsgErreur] = useState("");

  async function recupererListeLancements() {
    let reponse = await back.post("/lancement/importer", {limite: 10});
    if (reponse.status !== 201) {
      setMsgErreur("Erreur lors de la récupération des lancements de l'API.");
      console.error(reponse.data.error);
      return;
    }

    reponse = await back.get("/lancement?statut=A_VENIR");
    if (reponse.data.lancements && reponse.data.lancements !== null) {
      const lancements: Lancement[] = reponse.data.lancements.map((l: any) => ({
        id: l.id,
        ref: l.ref,
        nom: l.nom,
        agence: l.agence,
        fusee: l.fusee,
        mission: l.mission,
        lieu: l.lieu,
        imageUrl: l.imageUrl,
        dateLancement: l.dateLancement,
        statut: l.statut,
      }));
      setListeLancements(lancements);
    } else {
      setMsgErreur(
        "Erreur lors de la récupération des lancements de la base de données.",
      );
      console.error(reponse.data.error);
    }
  }

  useEffect(() => {
      recupererListeLancements();
    }, []);

}

export default App;
