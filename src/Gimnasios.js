import { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Gimnasios = ({ onSelectGym }) => {
  const [gimnasios, setGimnasios] = useState([]);
  const [visibleLocation, setVisibleLocation] = useState(null);

  useEffect(() => {
    const fetchGimnasios = async () => {
      const querySnapshot = await getDocs(collection(db, "Gimnasio"));
      const gymList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGimnasios(gymList);
    };

    fetchGimnasios();
  }, []);

  const toggleLocation = (id) => {
    setVisibleLocation(visibleLocation === id ? null : id);
  };

  return (
    <div>
      <h2>Lista de Gimnasios</h2>
      <div className="gym-list">
        {gimnasios.map((gym) => (
          <div key={gym.id} className="gym-card">
            <h3>{gym.Nombre}</h3>
            <button className="location-btn" onClick={() => toggleLocation(gym.id)}>
              Ver Ubicación
            </button>
            
            
            <div className={`gym-location ${visibleLocation === gym.id ? "show" : ""}`}>
              <p>{gym.Ubicacion}</p>
            </div>

            <button onClick={() => onSelectGym(gym.id)}>Ver Máquinas</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gimnasios;
