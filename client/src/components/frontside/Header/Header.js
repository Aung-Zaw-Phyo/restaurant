import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { TableInfo } from '../store/TableInfo'
import classes from './Header.module.css'
import logo from './../../../assets/logo.png'

const Header = (props) => {
  const {showTableInfo, setShowTableInfo} = useContext(TableInfo)
  const currentTable = props.currentTable
  return (
    <div>
      <div className={`shadow ${classes.header}`}>
        <div className="container d-flex justify-content-between align-items-center">
            <div>

            </div>
            <div>
              <img className={classes.logo} src={logo} alt="logo" />
            </div>
            <div>
              {
                currentTable ? 
                <div className={classes['selected-table']} onClick={() => showTableInfo ? setShowTableInfo(false) : setShowTableInfo(true)}>{currentTable}</div>
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