'use strict';

(() => {
  const KeyButton = {
    ESCAPE: `Escape`
  };

  const modalClass = {
    MODAL_FORM: `js-form-modal`,
    MODAL_OPEN: `js-modal-open`,
    MODAL_CLOSE: `js-modal-close`,
    MODAL_CLASS_ACTIVE: `feedback--active`,
    OVERLAY_ACTIVE: `overlay--active`,
    SUCCESS_ACTIVE: `feedback__success--active`,
    PAGE_LOCKED: `page--locked`
  };

  const page = document.querySelector(`.js-page`);
  const form = document.querySelector(`.js-form`);
  const modal = document.querySelector(`.js-modal`);
  const modalForm = document.querySelector(`.js-form-modal`);
  const overlay = document.querySelector(`.js-overlay`);
  const successModal = document.querySelector(`.feedback__success`);

  let isStorageSupport = true;
  let storageName = ``;
  let storageTel = ``;

  try {
    storageName = localStorage.getItem(`userName`);
  } catch (err) {
    isStorageSupport = false;
  }

  try {
    storageTel = localStorage.getItem(`userTel`);
  } catch (err) {
    isStorageSupport = false;
  }

  const smoothLinks = document.querySelectorAll(`a[href^="#"]`);
  for (let smoothLink of smoothLinks) {
    smoothLink.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      let id = smoothLink.getAttribute(`href`);
      if (id.length > 1) {
        document.querySelector(id).scrollIntoView({
          behavior: `smooth`,
          block: `start`
        });
      }
    });
  }

  const closeModal = function () {
    modal.classList.remove(modalClass.MODAL_CLASS_ACTIVE);
    overlay.classList.remove(modalClass.OVERLAY_ACTIVE);
    successModal.classList.remove(modalClass.SUCCESS_ACTIVE);
    page.classList.remove(modalClass.PAGE_LOCKED);
    document.removeEventListener(`keydown`, onEscModalClose);
    document.addEventListener(`click`, openModalOnClick);
  };

  const openModal = function () {
    modal.classList.add(modalClass.MODAL_CLASS_ACTIVE);
    overlay.classList.add(modalClass.OVERLAY_ACTIVE);
    successModal.classList.add(modalClass.SUCCESS_ACTIVE);
    page.classList.add(modalClass.PAGE_LOCKED);
    document.addEventListener(`keydown`, onEscModalClose);
    document.addEventListener(`click`, closeModalOnClick);
  };

  const onEscModalClose = function (evt) {
    if (evt.key === KeyButton.ESCAPE) {
      evt.preventDefault();
      closeModal();
    }
  };

  const closeModalOnClick = function (evt) {
    if (evt.target.classList.contains(modalClass.MODAL_CLOSE) ||
        evt.target.classList.contains(modalClass.OVERLAY_ACTIVE)) {
      closeModal();
      document.removeEventListener(`click`, closeModalOnClick);
      document.addEventListener(`submit`, onFormSubmit);
    }
  };

  const openModalOnClick = function (evt) {
    if (evt.target.classList.contains(modalClass.MODAL_OPEN)) {
      evt.preventDefault();
      modal.classList.add(modalClass.MODAL_CLASS_ACTIVE);
      overlay.classList.add(modalClass.OVERLAY_ACTIVE);
      page.classList.add(modalClass.PAGE_LOCKED);
      if (storageName && !storageTel) {
        modalForm.modalName.value = storageName;
        modalForm.modalTel.focus();
      } else if (storageName && storageTel) {
        modalForm.modalName.value = storageName;
        modalForm.modalTel.value = storageTel;
      } else {
        modalForm.modalName.focus();
      }
      document.addEventListener(`keydown`, onEscModalClose);
      document.addEventListener(`click`, closeModalOnClick);
      document.removeEventListener(`click`, openModalOnClick);
    }
  };

  const onFormSubmit = function (evt) {
    evt.preventDefault();
    openModal();
    if (evt.target.classList.contains(modalClass.MODAL_FORM) && isStorageSupport) {
      localStorage.setItem(`userName`, evt.target.modalName.value);
      localStorage.setItem(`userTel`, evt.target.modalTel.value);
    } else {
      localStorage.setItem(`userName`, form.name.value);
      localStorage.setItem(`userTel`, form.tel.value);
    }
    evt.target.reset();
  };

  if (storageName && !storageTel) {
    form.name.value = storageName;
  } else if (storageName && storageTel) {
    form.name.value = storageName;
    form.tel.value = storageTel;
  }

  document.addEventListener(`submit`, onFormSubmit);
  document.addEventListener(`click`, openModalOnClick);
})();
