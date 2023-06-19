import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import '../../css/frontside.css'
import Header from './Header/Header'
import NotFound from '../../NotFound'
import Home from './Home'
import { TableInfo } from './store/TableInfo'

const Frontside = () => {
    const [showTableInfo, setShowTableInfo] = useState(null)
    const [currentTable, setCurrentTable] = useState(null)

    return (
        <div>
                
            <TableInfo.Provider value={{ showTableInfo, setShowTableInfo }}>
                <Routes>
                    <Route path="/" element={<Header currentTable={currentTable} />}>
                        <Route index element={<Home currentTable={currentTable} setCurrentTable={setCurrentTable} />}/>
                    </Route>
                    <Route path='*' element={<NotFound/>}/>
                </Routes>
            </TableInfo.Provider>
        </div>
    )
}

export default Frontside