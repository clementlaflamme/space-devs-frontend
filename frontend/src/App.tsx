import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'

const API = "http://localhost:3000"
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


  
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState("")

  const [lancements, setLancements] = useState<any []>([])

  useEffect(() => {
    axios.get(`${API}/lancements`)
    .then((res)=> setLancements(res.data.lancements))
    .catch(() => setErreur("Impossible de communiquer avec l'API"))
    .finally(() => setChargement(false))
  }, [])

  async function importer(limite: String){
    try{
      const {data} = await axios.post(`${API}/lancements/importer`, { limite: limite })
      alert(data.message)
      chargerImport()
    } catch(e) {
      alert("Lancements deja importés")
    }
  }

  function chargerImport() {
    axios.get(`${API}/lancements`)
    .then((res) => setLancements(res.data.lancements))
  }

  useEffect (() => {
    chargerImport()
  }, [])

  return (
    <div>
      <h1>Launchpad</h1>
      
      
      <h2>Lancements</h2>
      <h2>Liste de Lancements ({lancements.length})</h2>
      <ul>
        {lancements.map((l) =>(
          <li>
            <div style={{width: '18rem', background: 'linearGradient(15deg,rgba(42, 26, 122, 1) 0%, rgba(0, 0, 0, 1) 100%)', borderRadius: '12px', border: 'solid 3px rgb(193, 163, 211)', borderWidth: '4px', padding: '6px', display: 'flex', flexDirection: 'column', minHeight: '450px'}}>
                <img src={l.imageUrl} style={{borderRadius: '12px'}}/>
                <div>
                    <h3 style={{color: 'white'}}>{l.nom}</h3>
                    <h4 style={{color: 'white'}}>{l.launch_service_provider?.name} - {l.rocket?.configuration?.name}</h4>
                    <h5 style={{color: 'white'}}>{l.pad?.location?.name} le {l.net}</h5>
                    <div style={{display: 'flex', gap: '8px', marginTop: 'auto'}}>
                        <div style={{backgroundColor: 'rgb(85, 14, 133)', borderRadius: '8px', marginLeft: '15px', marginBottom: '15px', border: 'solid 3px rgb(193, 163, 211)', padding: '4px', maxWidth: '80px', textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
                          STATUT</div>
                        <div style={{backgroundColor: 'rgb(85, 14, 133)', borderRadius: '8px', marginRight: '15px', marginBottom: '15px', border: 'solid 3px rgb(193, 163, 211)', padding: '4px', textAlign: 'center', color: 'white', fontWeight: 'bold', flexGrow: '1'}}>
                          DECOMPTE</div>
                    </div>
                </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App;
