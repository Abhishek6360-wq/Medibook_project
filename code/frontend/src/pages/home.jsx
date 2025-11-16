import React from 'react'
import Header from '../components/header'
import Specialitymenu from '../components/specialitymenu'
import Topdoctors from '../components/topdoctors'
import ActionBanner from '../components/banner'

const Home = () => {
  return (
    <div>
      <Header/>
      <Specialitymenu/>
      <Topdoctors/>
      <ActionBanner/>
    </div>
  )
}

export default Home