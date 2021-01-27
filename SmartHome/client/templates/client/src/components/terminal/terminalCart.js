import React, {useContext} from 'react'
import {TerminalContext} from './terminalContext'
import {Terminal} from './terminal'
import {ModalWindow} from '../modalWindow/modalWindow'

export const TerminalCart = ()=>{
  const {terminal, hide} = useContext(TerminalContext)

  if(!terminal.visible){
    return null;
  }

  return(
    <ModalWindow hide={hide} width={250} height={350} title="terminal">
      <Terminal/>
    </ModalWindow>
  )

}
