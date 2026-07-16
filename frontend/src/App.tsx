import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'

const API = "http://localhost:3000"

function App() {

  
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState("")
  const [limite, setLimite] = useState("");

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
      <div>
        <button onClick={() => importer(limite)}>Importer</button>
        <input id='inputLimite' placeholder="# lancements a importer" onChange={(e) => setLimite(e.target.value)}></input>
      </div>
      <h2>Lancements</h2>
      <h2>Liste de Lancements ({lancements.length})</h2>
      <ul>
        {lancements.map((l) =>(
          <li>
            {/* Cards ici */}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
