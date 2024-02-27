import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({children, onClose}){
    const dialog = useRef()
    useEffect(() => {
        //open <dialog> via built-in API whenever <Modal> renders
        const modal = dialog.current
        modal.showModal();
        return () => modal.close()
    }, [])
    return createPortal(<dialog className="modal" ref={dialog} onClose={onClose}>
        {children}
    </dialog>, document.getElementById('modal'))
}