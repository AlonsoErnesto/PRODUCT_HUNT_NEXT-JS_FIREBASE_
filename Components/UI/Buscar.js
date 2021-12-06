import React, {useState} from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react'

import Router from 'next/router'

const InputText = styled.input`
   border: 1px solid var(--gris3);
   padding:1rem;
   min-width : 300px;
`;

const InputSubmit = styled.button`
   height: 3rem;
   width:3rem;
   display:block;
   background-size:3rem;
   background-image: url('/static/img/buscar.png');
   background-repeat: no-repeat;
   position: absolute;
   right:.5rem;
   top:0.5rem;
   background-color:white;
   border:none;
   text-indent: -9999px;
   
   &:hover {
      cursor: pointer;
   }
`;

const Buscar = () => {

   const [busqueda, setBusqueda] = useState('');

   const buscarProducto = e => {
         e.preventDefault();
         
         if(busqueda.trim() === '') return;
         
         //redireccionar a buscar
         Router.push({
            pathname: '/buscar',
            query: {q : busqueda}
         })
      
   
   }

   return (

      <form
         css={css`
            position:relative;
         `}
         onSubmit={buscarProducto}
      >
      
         <InputText type="text" placeholder="Buscar productos" onChange={e => setBusqueda(e.target.value)}/>
         <InputSubmit type="submit">Buscar</InputSubmit>
      </form>

   )

}
export default Buscar;