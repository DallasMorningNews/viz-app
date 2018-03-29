import {app, Menu, shell} from 'electron'
import { openFolder, copyEmbedCode, deployProject, removeFromList, removeFromServer, deleteAll } from '../actions'

const PROJECT_CONTEXT_MENU_TEMPLATE = [
  {label: 'Open folder', click() { openFolder() }},
  {label: 'Copy embed code', click() { copyEmbedCode() }},
  {type: 'separator'},
  //{label: 'Edit', click() { console.log('edit clicked') }},
  {label: 'Deploy', click() { deployProject() }},
  {type: 'separator'},
  {label: 'Remove from list', click() { removeFromList() }},
  {label: 'Remove project from servers', click() { removeFromServer() }},
  {label: 'Delete permanently', click() { deleteAll() }},
]

export default function ProjectContextMenu () {
  return Menu.buildFromTemplate( PROJECT_CONTEXT_MENU_TEMPLATE )
}