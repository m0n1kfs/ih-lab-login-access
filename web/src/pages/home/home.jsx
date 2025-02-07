import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profile, logout } from "../../services/api-service";

export default function Home() {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Intentamos obtener el perfil
    profile()
      .then((data) => setProfileData(data))
      // Si va bien, guardamos los datos del usuario
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate("/login");
          // Si la API devuelve un 401, redirigimos a /login
        } else {
          console.error(error);
        }
      });
  }, [navigate]);

  // Mientras no tenemos los datos del usuario, podemos mostrar un "Loading"
  if (!profileData) {
    return (
      <div className="container mt-5 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Desestructuramos sin chocar nombres
  const { message, user: userInfo } = profileData;

  // Manejo de logout
  const handleLogout = () => {
    console.log("Logout button clicked!");
    logout()
      .then(() => {
        // Una vez finaliza, redirigimos al login
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error on logout:", error);
      });
  };

  // Si user existe, lo pintamos en pantalla
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Home</h1>
      <div className="card mb-3">
        <div className="card-header">User Profile</div>
        <div className="card-body">
          <h5 className="card-title">{message}</h5>
          <div className="d-flex align-items-center mb-3">
            <img
              src={userInfo.avatar}
              alt="User Avatar"
              className="rounded-circle me-3"
              style={{ width: "64px", height: "64px", objectFit: "cover" }}
            />
            <div>
              <h4 className="mb-0">{userInfo.name}</h4>
              <small className="text-muted">{userInfo.email}</small>
            </div>
          </div>
          <p>
            <strong>Created at:</strong>{" "}
            {new Date(userInfo.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Last update:</strong>{" "}
            {new Date(userInfo.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Botón de Logout */}
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}