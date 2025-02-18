import { useState } from "react";
import Gimnasios from "./Gimnasios";
import Maquinas from "./Maquinas";
import "./styles.css"; 

const App = () => {
  const [selectedGym, setSelectedGym] = useState(null);

  return (
    <div className="container">
      <h1>🏋️ Gimnasios y Máquinas 🏋️</h1>
      {!selectedGym ? (
        <Gimnasios onSelectGym={setSelectedGym} />
      ) : (
        <>
          <button onClick={() => setSelectedGym(null)}>⬅ Volver a Gimnasios</button>
          <Maquinas gymId={selectedGym} />
        </>
      )}
    </div>
  );
};

export default App;
