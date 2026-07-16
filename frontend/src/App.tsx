import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

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
  const [limite, setLimite] = useState("");

  const [maintenant, setMaintenant] = useState(Date.now())
  useEffect(() => {
    const interval = setInterval(()=>{
      setMaintenant(Date.now())}, 1000)
  })

  function calculerDecompte(dateLancement: string) {
    const maintenant = new Date().getTime()
    const lancement = new Date(dateLancement).getTime()

    const diff = lancement - maintenant
    if (diff <= 0) return "Lancement effectué"

    const jours = Math.floor(diff / (1000 * 60 * 60 * 24))
    const heures = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const secondes = Math.floor((diff / 1000) % 60)

  return `${jours}j ${heures}h ${minutes}m ${secondes}s`
}



  async function recupererListeLancements(limiteLancements: string) {
    let reponse = await back.post("/lancement/importer", { limite: limiteLancements });
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
    recupererListeLancements("10");
  }, []);

  return (
    <div>
      <h1>Launchpad</h1>
      <div>
        <button onClick={() => recupererListeLancements(limite)}>Importer</button>
        <input id='inputLimite' placeholder="# lancements a importer" onChange={(e) => setLimite(e.target.value)}></input>
      </div>
      <h2>Lancements</h2>
      <h2>Liste de Lancements ({listeLancements.length})</h2>
      <p>{msgErreur}</p>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {listeLancements.map((l: any) => (
          
            <div
              style={{
                width: "18rem",
                background:
                  "linear-gradient(15deg,rgb(33, 20, 99) 0%, rgba(0, 0, 0, 1) 100%)",
                borderRadius: "12px",
                border: "solid 3px rgb(193, 163, 211)",
                borderWidth: "4px",
                padding: "6px",
                display: "flex",
                flexDirection: "column",
                minHeight: "450px",
                margin: "10px"
              }}
            >
              <img src={l.imageUrl} style={{ borderRadius: "12px" }} alt={l.nom} onError={(e) => {
    e.currentTarget.style.display = 'none';
    }}/>
              <div>
                <h3 style={{ color: "white" }}>{l.nom}</h3>
                <h4 style={{ color: "white" }}>
                  {l.agence} -{" "}
                  {l.fusee}
                </h4>
                <h5 style={{ color: "white" }}>
                  {l.lieu} le {l.dateLancement.replace("T", " | ").slice(0, 18) + " UTC"}
                </h5>
                <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                  <div
                    style={{
                      backgroundColor: "rgb(85, 14, 133)",
                      borderRadius: "8px",
                      marginLeft: "15px",
                      marginBottom: "15px",
                      border: "solid 3px rgb(193, 163, 211)",
                      padding: "4px",
                      maxWidth: "80px",
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {l.statut}
                  </div>
                  <div
                    style={{
                      backgroundColor: "rgb(85, 14, 133)",
                      borderRadius: "8px",
                      marginRight: "15px",
                      marginBottom: "15px",
                      border: "solid 3px rgb(193, 163, 211)",
                      padding: "4px",
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                      flexGrow: "1",
                    }}
                  >
                    {calculerDecompte(l.dateLancement)}
                  </div>
                </div>
              </div>
            </div>
          
        ))}
      </div>
    </div>
  );
}

export default App;
