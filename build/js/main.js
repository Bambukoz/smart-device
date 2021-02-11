'use strict';

(() => {
  const KeyButton = {
    ESCAPE: 'Escape'
  };

  const pageClass = {
    MODAL_FORM: 'js-form-modal',
    MODAL_OPEN: 'js-modal-open',
    MODAL_CLOSE: 'js-modal-close',
    MODAL_CLASS_ACTIVE: 'feedback--active',
    OVERLAY_ACTIVE: 'overlay--active',
    SUCCESS_ACTIVE: 'feedback__success--active',
    PAGE_LOCKED: 'page--locked',
    ACCORDION_ACTIVE: 'btn__accordion--active',
    NOJS_CLASS: 'js-nojs',
    ACTIVE_CLASS: 'js-active'
  };

  const page = document.querySelector('.js-page');
  const form = document.querySelector('.js-form');
  const modal = document.querySelector('.js-modal');
  const modalForm = document.querySelector('.js-form-modal');
  const overlay = document.querySelector('.js-overlay');
  const successModal = document.querySelector('.feedback__success');
  const accordionBtns = document.querySelectorAll('.btn__accordion');
  const nav = document.querySelector('.js-nav');
  const btnNav = document.querySelector('.js-nav-btn');
  const location = document.querySelector('.js-location');
  const btnLocation = document.querySelector('.js-location-btn');

  const toggleAccordion = (evt) => {
    if (evt.target === btnNav) {
      btnNav.classList.toggle(pageClass.ACCORDION_ACTIVE);
      btnLocation.classList.remove(pageClass.ACCORDION_ACTIVE);
    } else {
      btnLocation.classList.toggle(pageClass.ACCORDION_ACTIVE);
      btnNav.classList.remove(pageClass.ACCORDION_ACTIVE);
    }
  }

  for (let btn of accordionBtns) {
    btn.classList.remove(pageClass.NOJS_CLASS);
    btn.addEventListener('click', toggleAccordion);
  }
  nav.classList.remove(pageClass.NOJS_CLASS);
  location.classList.remove(pageClass.NOJS_CLASS);

  let isStorageSupport = true;
  let storageName = '';
  let storageTel = '';

  try {
    storageName = localStorage.getItem('userName');
  } catch (err) {
    isStorageSupport = false;
  }

  try {
    storageTel = localStorage.getItem('userTel');
  } catch (err) {
    isStorageSupport = false;
  }

  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  for (const smoothLink of smoothLinks) {
    smoothLink.addEventListener('click', (evt) => {
      evt.preventDefault();
      const id = smoothLink.getAttribute('href');
      if (id.length > 1) {
        document.querySelector(id).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }

  const closeModal = () => {
    modal.classList.remove(pageClass.MODAL_CLASS_ACTIVE);
    overlay.classList.remove(pageClass.OVERLAY_ACTIVE);
    successModal.classList.remove(pageClass.SUCCESS_ACTIVE);
    page.classList.remove(pageClass.PAGE_LOCKED);
    document.removeEventListener('keydown', onEscModalClose);
    document.addEventListener('click', openModalOnClick);
  };

  const openModal = () => {
    modal.classList.add(pageClass.MODAL_CLASS_ACTIVE);
    overlay.classList.add(pageClass.OVERLAY_ACTIVE);
    successModal.classList.add(pageClass.SUCCESS_ACTIVE);
    page.classList.add(pageClass.PAGE_LOCKED);
    document.addEventListener('keydown', onEscModalClose);
    document.addEventListener('click', closeModalOnClick);
  };

  const onEscModalClose = (evt) => {
    if (evt.key === KeyButton.ESCAPE) {
      evt.preventDefault();
      closeModal();
    }
  };

  const closeModalOnClick = (evt) => {
    if (evt.target.classList.contains(pageClass.MODAL_CLOSE) ||
            evt.target.classList.contains(pageClass.OVERLAY_ACTIVE)) {
      closeModal();
      document.removeEventListener('click', closeModalOnClick);
      document.addEventListener('submit', onFormSubmit);
    }
  };

  const openModalOnClick = (evt) => {
    if (evt.target.classList.contains(pageClass.MODAL_OPEN)) {
      evt.preventDefault();
      modal.classList.add(pageClass.MODAL_CLASS_ACTIVE);
      overlay.classList.add(pageClass.OVERLAY_ACTIVE);
      page.classList.add(pageClass.PAGE_LOCKED);
      if (storageName && !storageTel) {
        modalForm.modalName.value = storageName;
        modalForm.modalTel.focus();
      } else if (storageName && storageTel) {
        modalForm.modalName.value = storageName;
        modalForm.modalTel.value = storageTel;
      } else {
        modalForm.modalName.focus();
      }
      document.addEventListener('keydown', onEscModalClose);
      document.addEventListener('click', closeModalOnClick);
      document.removeEventListener('click', openModalOnClick);
    }
  };

  const onFormSubmit = (evt) => {
    evt.preventDefault();
    openModal();
    if (evt.target.classList.contains(pageClass.MODAL_FORM) && isStorageSupport) {
      localStorage.setItem('userName', evt.target.modalName.value);
      localStorage.setItem('userTel', evt.target.modalTel.value);
    } else {
      localStorage.setItem('userName', form.name.value);
      localStorage.setItem('userTel', form.tel.value);
    }
    evt.target.reset();
  };

  if (storageName && !storageTel) {
    form.name.value = storageName;
  } else if (storageName && storageTel) {
    form.name.value = storageName;
    form.tel.value = storageTel;
  }

  document.addEventListener('submit', onFormSubmit);
  document.addEventListener('click', openModalOnClick);
})();
