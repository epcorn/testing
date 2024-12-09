/* eslint-disable react/prop-types */

import { Modal } from "flowbite-react";

import Form from "./Form";

function NewEmployeeModal({ openModal, setOpenModal }) {
  return (
    <>
      <Modal
        show={openModal}
        size="lg"
        popup
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>

        </Modal.Header>
        <Modal.Body>
          <Form setOpenModal={setOpenModal} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NewEmployeeModal;
