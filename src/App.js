import React, { useState } from 'react'

import TopSellerPotato from './page/TopSellerPotato'
import FileDownloader from './page/FileDownloader'

const App = () => {
  const [cheapestSellers, setCheapestSellers] = useState([]);
  return (
    <div  className="container mt-5">
       
    <TopSellerPotato />
   
    </div>
  )
}

export default App