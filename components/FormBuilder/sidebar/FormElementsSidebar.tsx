import { FormElements } from "../FormElements"
import SidebarBtnElement from "./SidebarBtnElement"

function FormElementsSidebar() {
  return (
    <div>
      Elements
      <SidebarBtnElement formElement={FormElements.TextField}></SidebarBtnElement>
    </div>
  )
}

export default FormElementsSidebar
