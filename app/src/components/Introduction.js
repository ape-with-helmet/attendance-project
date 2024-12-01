import React from 'react'
import '../StyleSheets/main.css'
import logo from '../resources/logo.png'

const Introduction = () => {
  return (
    <div className='intro_container'>
        <img src={logo}/>
        <h1>Official Placements</h1>
        <p>
            This is a portal built to streamline the process of applying and tracking placements activities. Sign up now and become a part of this new venture to make Digital Sahyadri
        </p>
    </div>
  )
}

export default Introduction