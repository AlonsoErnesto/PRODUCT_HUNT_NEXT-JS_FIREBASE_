import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { FirebaseContext } from '../../firebase';
import Error404 from '../../Components/layout/Error404';
import Layout from '../../Components/layout/Layout';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';

import { Campo, InputSubmit } from '../../Components/UI/Formulario';
import Boton from '../../Components/ui/Boton';

const ContenedorProducto = styled.div`
   @media(min-width:768px){
      display:grid;
      grid-template-columns: 2fr 1fr;
      column-gap: 2rem;
   }
`;

const CreadorProducto = styled.p`
   padding: .5rem 2rem;
   background-color: #DA552F;
   color: #fff;
   text-transform:uppercase;
   font-weight:bold;
   display:inline-block;
   text-align:center
   
`;


const Producto = () => {

   const [producto, setProducto] = useState({});
   const [error, setError] = useState(false);
   const [comentario, setComentario] = useState({});
   const [consultarDB, setConsultarDB] = useState(true);

   const router = useRouter();
   const { query: {id} } = router;
   
   const { firebase, usuario } = useContext(FirebaseContext);
   
   //id undefined
   useEffect(() => {
      
      if(id && consultarDB){
         const obtenerProducto = async () => {
            const productoQuery = await firebase.db.collection('productos').doc(id);
            const producto = await productoQuery.get();
            if(producto.exists){
               setProducto(producto.data());
               setConsultarDB(false);
            }else {
               setError(true);
               setConsultarDB(false);
            }
         }
         
         obtenerProducto()
      }
      
   }, [id])

   if(Object.keys(producto).length === 0 && !error) return 'Cargando...';
   
   const { comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, haVotado } = producto;
   
   const votarProducto = () => {
      if(!usuario)
      {
         return router.push('/login');
      }
      
      //obtener y sumar un nuevo votos
      const nuevoTotal = votos + 1;
      
      //Verificar si el usuario actual ha votado o aun no al producto
      if(haVotado.includes(usuario.uid)) return;
      
      //guardar el ID del usuario que ha votarProducto
      const nuevoHanVotado = [...haVotado, usuario.uid];
      
      //Actualizar en la DB
      firebase.db.collection('productos').doc(id).update({votos:nuevoTotal, haVotado:nuevoHanVotado});
      
      
      //Actualizar el State
      setProducto({ 
         ...producto,
         votos:nuevoTotal
      })
      
      setConsultarDB(true);
   }
   
   const puedeBorrar = () => {
         if(!usuario) return false;
         
         if(creador.id === usuario.uid) return true;
   }
   
   
   //Crear comentarios
   const comentarioChange = e => {
      
      setComentario({
         ...comentario,
         [e.target.name] : e.target.value
      });
   }
   
   // Identifica si el comentario es del creador del producto
   const esCreador = id => {
      if(creador.id === id) {
         return true;
      }
   }
   
   
   const agregarComentario = e => {
         e.preventDefault();
         
         if(!usuario){
            return router.push('/login');
         }
      
      // informacion extra al comentar
         comentario.usuarioId = usuario.uid;
         comentario.usuarioNomre = usuario.displayName;
         
      // Tomar copia de comentarios 
      const nuevosComentarios = [...comentarios, comentario];
      
      //Actualizar BD
      firebase.db.collection('productos').doc(id).update({
         comentarios:nuevosComentarios
      })
      
      // Actualizar state
      setProducto({
         ...producto,
         comentarios:nuevosComentarios
      })
      
   }
   
   
   //eliminar post
   const eliminarProducto = async () => {
         
      if(!usuario){
         return router.push('/login');
      }
      if(creador.id !== usuario.uid){
         return router.push('/');
      }
      
         try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/')
         } catch (error) {
            console.error(error);
         }
   }
   
   
   return ( 
      <Layout>
         <>
         { error ? <Error404/> : (
             <div className="contenedor">
             <h1 css={css`
                text-align:center;
                margin:top: 5rem;
             `}>{nombre}</h1>
             <ContenedorProducto>
                <div>
                   <p>Publicado hace: {formatDistanceToNow(new Date(creado), {locale:es})}</p>
                   <p>Por: {creador.nombre} de {empresa}</p>
                   <img src={urlimagen}/>
                   <p>{descripcion}</p>
                  {usuario && (
                   <>
                      <h2>Agrega tu comentario</h2>
                      <form onSubmit={agregarComentario}>
                         <Campo>
                            <input 
                               type="text"
                               name="mensaje"
                               onChange={comentarioChange}
                            />
                         </Campo>
                         <InputSubmit type="submit" value="Agregar Comentario"/>
                      </form>
                   </>
                  )}
                   <h2 css={css`margin: 2rem 0;`}>Comentarios</h2>
                   {comentarios.length === 0 ? "Aun no hay comentarios" : (
                         <ul>
                         {comentarios.map((comentario, i) => (
                            <li 
                               key={`${comentario.usuarioId}-${i}`} 
                               css={css`
                                     border: 1px solid #e1e1e1;
                                     padding: 2rem;
                               `}>
                               <p>{comentario.mensaje}</p>
                               <p>Escrito por:
                                  <span css={css`font-weight:bold;`}> {comentario.usuarioNomre}</span>
                               </p>
                               {esCreador(comentario.usuarioId) &&
                                  <CreadorProducto>Creador</CreadorProducto>
                               }
                            </li>
                         ))}
                         </ul>   
                   )}
                   
                </div>
                <aside>
                   <Boton target="_blank" bgColor="true" href={url} >Visitar URL</Boton>
                   
                   <div css={css`margin-top:5rem;`}>
                      <p css={css`text-align: center;`}>{votos} Votos</p>
                      {usuario && (<Boton onClick={votarProducto}>Votar</Boton>)}
                   </div>
                </aside>
             </ContenedorProducto>
             {puedeBorrar() && 
               <Boton onClick={eliminarProducto}  >Eliminar Producto</Boton>
             }
          </div>
         )}
        
         </>
      </Layout>
   );
}
 
export default Producto;

