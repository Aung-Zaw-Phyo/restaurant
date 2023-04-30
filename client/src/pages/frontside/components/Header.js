import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { TableInfo } from './TableInfo'

const Header = (props) => {
  const {showTableInfo, setShowTableInfo} = useContext(TableInfo)
  const currentTable = props.currentTable
  return (
    <div>
      <div className='shadow'>
        <div className="container d-flex justify-content-between align-items-center">
            <div>

            </div>
            <div>
              <img className="logo" src="./logo.svg" alt="logo" />
            </div>
            <div>
              {
                currentTable ? 
                <div className='selected-table' onClick={() => showTableInfo ? setShowTableInfo(false) : setShowTableInfo(true)}>{currentTable}</div>
                : null
              }
            </div>
        </div>
      </div>
      <Outlet/>
    </div>
  )
}

export default Header