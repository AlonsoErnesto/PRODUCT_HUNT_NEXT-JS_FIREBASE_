import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';

import Layout from '../Components/layout/Layout'
import {Formulario, Campo, InputSubmit, Error } from '../Components/UI/Formulario'

import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';

import firebase from '../firebase';

const STATE_INICIAL = {
  email:'',
  password:'',
}

const Login = () => { 

  const [error, setError] = useState(false);

const {
  valores, 
  errores, 
  submitForm,
  handleSubmit,
  handleChange,
  handleBlur
} = useValidacion(STATE_INICIAL,validarIniciarSesion, iniciarSesion);

const { email, password } = valores; 

async function iniciarSesion(){
console.log('1')
  try {
      await  firebase.login(email,password);
      Router.push('/');
      console.log('ok')
  } catch (error) {
      console.error('Hubo un error al iniciar sesion',error.message);
      setError(error.message);
  }
}

return ( 
<div>
  <Layout>
      <>
        <h1 css={css`text-align:center;margin-top:5rem`}>Iniciar Sesion</h1>
        <Formulario onSubmit={handleSubmit}>
          
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
          <InputSubmit type="submit" value="Iniciar Sesion"/>
        </Formulario>
      </>
  </Layout>
</div>
)
}

export default Login;