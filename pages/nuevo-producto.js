import React, { useState, useContext } from 'react';
import { css } from '@emotion/react';
import Router, { useRouter } from 'next/router';

import Layout from '../Components/layout/Layout'
import {Formulario, Campo, InputSubmit, Error } from '../Components/UI/Formulario'
import Error404 from '../Components/layout/Error404'

//validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

//Firebase
//1)// import firebase, { FirebaseContext } from '../firebase';
import firebase from '../firebase';
import FileUploader from 'react-firebase-file-uploader'
import useAutenticacion from '../hooks/useAutenticacion';

const STATE_INICIAL = {
  nombre:'',
  empresa:'',
  imagen:'',
  url:'',
  descripcion:'',
}


const NuevoProducto = () =>{
    
  const usuario = useAutenticacion();
    
    // State de imagenes
    const [nombreImagen, setNombreImagen] = useState('');
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [urlimagen, setUrlImagen] = useState('');
  
  
    const [error, setError] = useState(false);

    const {
      valores, 
      errores, 
      submitForm,
      handleSubmit,
      handleChange,
      handleBlur
    } = useValidacion(STATE_INICIAL,validarCrearProducto, crearProducto);
    
    const { nombre, empresa, imagen, url, descripcion} = valores;
    
    //Hook dde routing
    const router = useRouter();
    
    // operacion de firebase
   //2)  // const { usuario,firebase } = useContext(FirebaseContext);
    
    async function crearProducto () {
      if(!usuario){
        return router.push('/login')
      }
      
      // crear el objeto de nuevo producto
      const producto = {
        nombre,
        empresa, 
        url,
        urlimagen,
        descripcion,
        votos:0,
        comentarios:[],
        creado:Date.now(),
        creador:{
          id:usuario.uid,
          nombre: usuario.displayName,
        },
        haVotado:[]
      
      }
      
      //insertar en l abase de datos
      firebase.db.collection('productos').add(producto);
      
      return router.push('/');
    }
    
    //Function de FileUploader
    const handleUploadStart = () => {
        setProgreso(0);
        setSubiendo(true);
    }
    
    const handleProgress = progreso => setProgreso({progreso})
    
    const handleUploadError = error => {
        setSubiendo(error);
        console.error(error);
    }
    
    const handleUploadSuccess = nombre => {
        setProgreso(100);
        setSubiendo(false);
        setNombreImagen(nombre);
        firebase.storage
          .ref("productos")
          .child(nombre)
          .getDownloadURL()
          .then(url => {
              console.log(url);
              setUrlImagen(url)
          });
    }
    
    // 
    
    return ( 
    <div>
    <Layout>
      { !usuario ? <Error404/> : (
            
            <>
            <h1 css={css`text-align:center;margin-top:5rem`}>Nuevo Producto</h1>
            <Formulario onSubmit={handleSubmit}>
            
              <fieldset>
                  <legend>Información General</legend>
              
              {/* nombre  */}
              <Campo>
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" placeholder="Nombre" name="nombre" value={nombre} onChange={handleChange} onBlur={handleBlur}/>
              </Campo>
              {errores.nombre && <Error>{errores.nombre}</Error>}
              {/* empresa */}
              <Campo>
                <label htmlFor="empresa">Empresa</label>
                <input type="text" id="empresa" placeholder="Nombre de la Empresa o Compañia" name="empresa" value={empresa} onChange={handleChange} onBlur={handleBlur}/>
              </Campo>
              {errores.empresa && <Error>{errores.empresa}</Error>}
              {/* Imagen */}
              <Campo>
                <label htmlFor="imagen">Imagen</label>
                <FileUploader 
                  accept="image/*" 
                  id="imagen" 
                  name="imagen" 
                  randomizeFilename
                  storageRef = {firebase.storage.ref("productos")}
                  onUploadStart = {handleUploadStart}
                  onUploadError = {handleUploadError}
                  onUploadSuccess={handleUploadSuccess}
                  onProgress = {handleProgress}
                />
              </Campo>
              {errores.imagen && <Error>{errores.imagen}</Error>}
              {/* URL */}
              <Campo>
                <label htmlFor="url">URL</label>
                <input type="url" id="url" placeholder="URL de tu producto" name="url" value={url} onChange={handleChange} onBlur={handleBlur}/>
              </Campo>
              {errores.url && <Error>{errores.url}</Error>}
              </fieldset>
                
              <fieldset>
                  <legend>Sobre tu Producto</legend>
                  <Campo>
                      <label htmlFor="descripcion">Descripción</label>
                      <textarea id="descripcion" name="descripcion" value={descripcion} onChange={handleChange} onBlur={handleBlur}/>
                  </Campo>
                  {errores.descripcion && <Error>{errores.descripcion}</Error>}
              </fieldset>
              
              
              { error && <Error>{error}</Error>}
              <InputSubmit type="submit" value="Crear Producto"/>
            </Formulario>
          </>
            
      )}
    </Layout>
    </div>
    )
}

export default NuevoProducto;