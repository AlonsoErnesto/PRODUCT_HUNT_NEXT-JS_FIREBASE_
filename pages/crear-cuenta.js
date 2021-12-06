import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';

import Layout from '../Components/layout/Layout'
import {Formulario, Campo, InputSubmit, Error } from '../Components/UI/Formulario'

import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';

import firebase from '../firebase';

const STATE_INICIAL = {
    nombre:'',
    email:'',
    password:'',
}

const CrearCuenta = () => { 

    const [error, setError] = useState(false);

  const {
    valores, 
    errores, 
    submitForm,
    handleSubmit,
    handleChange,
    handleBlur
  } = useValidacion(STATE_INICIAL,validarCrearCuenta, crearCuenta);
  
  const { nombre, email, password } = valores;
  
  async function crearCuenta () {
    
    
      try {
          await firebase.registrar(nombre, email,password);
          Router.push('/')
          console.log('ok')
      } catch (error) {
          console.error('hubo un error al crear el usuario',error.message);
          setError(error.message);
      }
   
  }

  return ( 
  <div>
    <Layout>
        <>
          <h1 css={css`text-align:center;margin-top:5rem`}>Crear Cuenta</h1>
          <Formulario onSubmit={handleSubmit}>
            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input type="text" id="nomre" placeholder="Nombre" name="nombre" value={nombre} onChange={handleChange} onBlur={handleBlur}/>
            </Campo>
            {errores.nombre && <Error>{errores.nombre}</Error>}
            <Campo>
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" placeholder="E-mail" name="email" value={email} onChange={handleChange} onBlur={handleBlur}/>
            </Campo>
            {errores.email && <Error>{errores.email}</Error>}
            <Campo>
              <label htmlFor="password">password</label>
              <input type="password" id="password" placeholder="password" name="password" value={password} onChange={handleChange} onBlur={handleBlur}/>
            </Campo>
              {errores.password && <Error>{errores.password}</Error>}
              { error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="Crear Cuenta"/>
          </Formulario>
        </>
    </Layout>
  </div>
  )
}

export default CrearCuenta;