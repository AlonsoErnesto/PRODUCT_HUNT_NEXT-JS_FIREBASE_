import React from 'react';
import Layout from '../Components/layout/Layout';
// import { FirebaseContext } from '../firebase';

import DetallesProducto from '../Components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

const Home = () =>{

    const { productos } = useProductos('creado');

//   const [productos, setProductos] = useState([]);
  
//   const {firebase } = useContext(FirebaseContext);
  
//   useEffect(() => {
//       const obtenerProductos = () => {
//           firebase.db.collection('productos').orderBy('creado','desc').onSnapshot(manejarSnapshot)
//       }
//       obtenerProductos();
//   }, [])
  
//   function manejarSnapshot(snapshot){
//       const productos = snapshot.docs.map(doc => {
//           return {
//               id:doc.id,
//               ...doc.data() //todo el registro completo
//           }
//       })
//       setProductos(productos);
//   }

  return (
    <div>
      <Layout>
          <div className="listado-productos">
              <div className="contenedor">
                  <ul className="bg-white">
                      {productos.map(producto => (
                        
                        <DetallesProducto key={producto.id} producto={producto}/>
                      ))}
                  </ul>
              </div>
          </div>
      </Layout>
    </div>
  )
}
export default Home;