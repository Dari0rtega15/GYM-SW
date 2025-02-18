import { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"; 
import "./machines.css";

const Maquinas = ({ gymId }) => {
  const [maquinas, setMaquinas] = useState([]);
  const [gymName, setGymName] = useState("");
  const [visibleInfo, setVisibleInfo] = useState(null);

  useEffect(() => {
    const fetchGymName = async () => {
      if (!gymId) return;

      try {
        console.log(`🔍 Buscando información del gimnasio con ID: ${gymId}`);

        const gymDoc = await getDoc(doc(db, "Gimnasio", gymId));

        if (gymDoc.exists()) {
          setGymName(gymDoc.data().Nombre);
        } else {
          console.warn(`⚠️ No se encontró el gimnasio con ID: ${gymId}`);
          setGymName("Nombre no disponible");
        }
      } catch (error) {
        console.error("❌ Error obteniendo datos del gimnasio:", error);
        setGymName("Error al obtener el gimnasio");
      }
    };

    const fetchMaquinas = async () => {
      if (!gymId) return;

      try {
        console.log(`🔍 Buscando máquinas para el gimnasio con ID: ${gymId}`);

        const gymMaquinaRef = collection(db, "GymMaquina");
        const q = query(gymMaquinaRef, where("idGym", "==", gymId));
        const gymMaquinaSnapshot = await getDocs(q);

        if (gymMaquinaSnapshot.empty) {
          console.warn("⚠️ No hay máquinas registradas para este gimnasio.");
          setMaquinas([]);
          return;
        }

        const maquinaIds = gymMaquinaSnapshot.docs.map((doc) => {
          const idMaquina = doc.data().idMaquina;
          const estado = doc.data().Estado;

          console.log(`🔍 Máquina asociada: ID=${idMaquina}, Estado=${estado}`);

          return { id: idMaquina, estado };
        });

        console.log("🔄 Máquinas asociadas encontradas:", maquinaIds);

        const maquinasPromises = maquinaIds.map(async (item) => {
          const maquinaDoc = await getDoc(doc(db, "Maquina", item.id));

          if (!maquinaDoc.exists()) {
            console.warn(`⚠️ No se encontró la máquina con ID: ${item.id}`);
            return null;
          }

          const maquinaData = maquinaDoc.data();

          console.log(`✅ Máquina obtenida de Firestore:`, maquinaData);

          return { ...maquinaData, estado: item.estado };
        });

        const maquinasData = await Promise.all(maquinasPromises);
        const filteredMaquinas = maquinasData.filter(maquina => maquina !== null);

        console.log("Datos finales de máquinas con estado corregido:", filteredMaquinas);
        setMaquinas(filteredMaquinas);
      } catch (error) {
        console.error("Error obteniendo datos de máquinas:", error);
      }
    };

    fetchGymName();
    fetchMaquinas();
  }, [gymId]);

  const toggleInfo = (id) => {
    setVisibleInfo(visibleInfo === id ? null : id);
  };

  return (
    <div className="machines-container">
      <h2>Máquinas del Gimnasio: <span className="gym-name">{gymName}</span></h2>

      {maquinas.length === 0 ? (
        <p>No hay máquinas disponibles para este gimnasio.</p>
      ) : (
        <div className="machine-grid">
          {maquinas.map((maquina, index) => (
            <div key={index} className="machine-card">
              {console.log("Mostrando máquina en la interfaz:", maquina)}

              <img src={maquina.Imagen} alt={maquina.Nombre || "Imagen no disponible"} />
              <h3>{maquina.Nombre || "Nombre no disponible"}</h3>
              <p className="machine-category">{maquina.Categoria || "Categoría no disponible"}</p>

              <div className="machine-buttons">
                <span className={`machine-status ${maquina.estado === "Disponible" ? "status-ok" : "status-broken"}`}>
                  {maquina.estado === "Disponible" ? "Disponible" : "Ocupado"}
                </span>

                <button className="toggle-info-btn" onClick={() => toggleInfo(index)}>
                  ℹ️ Más Información
                </button>
              </div>

              <div className={`machine-info ${visibleInfo === index ? "show" : ""}`}>
                <p><strong>Descripción:</strong> {maquina.Descripcion || "No disponible"}</p>
                <p><strong>Uso:</strong> {maquina.Uso || "No disponible"}</p>
                <a className="view-video" href={maquina.Video || "#"} target="_blank" rel="noopener noreferrer">📺 Ver Video</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Maquinas;
