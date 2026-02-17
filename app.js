(function () {
  'use strict';

  const TOTAL_HOURS = 1548;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const progressCurrent = $('#progressCurrent');
  const sumTeaching = $('#sumTeaching');
  const sumMethodical = $('#sumMethodical');
  const sumScientific = $('#sumScientific');
  const sumOrganizational = $('#sumOrganizational');
  const sumTotal = $('#sumTotal');
  const sectionTotalTeaching = $('#sectionTotalTeaching');
  const sectionTotalMethodical = $('#sectionTotalMethodical');
  const sectionTotalScientific = $('#sectionTotalScientific');
  const sectionTotalOrganizational = $('#sectionTotalOrganizational');
  const teachingMeta = $('#teachingMeta');
  const methodicalMeta = $('#methodicalMeta');
  const scientificMeta = $('#scientificMeta');
  const organizationalMeta = $('#organizationalMeta');

  function parseNum(val) {
    const n = parseFloat(String(val).replace(',', '.'), 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }

  function pct(val) {
    return TOTAL_HOURS > 0 ? Math.round((val / TOTAL_HOURS) * 100) : 0;
  }

  function getTeachingTotal() {
    return $$('.input-hours[data-block="teaching"]').reduce((acc, el) => acc + parseNum(el.value), 0);
  }

  function getMethodicalTotal() {
    return $$('.methodical-hours').reduce((acc, el) => acc + parseNum(el.value), 0);
  }

  function getScientificTotal() {
    return $$('.scientific-hours').reduce((acc, el) => acc + parseNum(el.value), 0);
  }

  function getOrganizationalTotal() {
    return $$('.org-hours').reduce((acc, el) => acc + parseNum(el.value), 0);
  }

  function updateSummary() {
    const t = getTeachingTotal();
    const m = getMethodicalTotal();
    const s = getScientificTotal();
    const o = getOrganizationalTotal();
    const total = t + m + s + o;

    sumTeaching.textContent = Math.round(t);
    sumMethodical.textContent = Math.round(m);
    sumScientific.textContent = Math.round(s);
    sumOrganizational.textContent = Math.round(o);
    sumTotal.textContent = Math.round(total);

    if (progressCurrent) progressCurrent.textContent = Math.round(total);

    if (teachingMeta) teachingMeta.textContent = '(' + Math.round(t) + ' год / ' + pct(t) + '%)';
    if (methodicalMeta) methodicalMeta.textContent = '(' + Math.round(m) + ' год / ' + pct(m) + '%)';
    if (scientificMeta) scientificMeta.textContent = '(' + Math.round(s) + ' год / ' + pct(s) + '%)';
    if (organizationalMeta) organizationalMeta.textContent = '(' + Math.round(o) + ' год / ' + pct(o) + '%)';
    if (sectionTotalTeaching) sectionTotalTeaching.textContent = Math.round(t);
    if (sectionTotalMethodical) sectionTotalMethodical.textContent = Math.round(m);
    if (sectionTotalScientific) sectionTotalScientific.textContent = Math.round(s);
    if (sectionTotalOrganizational) sectionTotalOrganizational.textContent = Math.round(o);
  }

  function addRow(containerId, rowHtml, hoursSelector) {
    const list = $(containerId);
    if (!list) return;
    const div = document.createElement('div');
    div.innerHTML = rowHtml.trim();
    const rowEl = div.firstElementChild;
    list.appendChild(rowEl);
    const hoursInput = rowEl.querySelector(hoursSelector);
    const removeBtn = rowEl.querySelector('.btn-remove');
    if (hoursInput) {
      hoursInput.addEventListener('input', updateSummary);
      hoursInput.addEventListener('change', updateSummary);
    }
    if (removeBtn) {
      removeBtn.addEventListener('click', function () {
        rowEl.remove();
        updateSummary();
      });
    }
    updateSummary();
  }

  function initMethodical() {
    $('#addMethodicalRow').addEventListener('click', function () {
      addRow('#methodicalList', `
        <div class="methodical-row">
          <input type="text" class="input-text methodical-name" placeholder="Назва роботи" />
          <input type="number" class="input-hours methodical-hours" data-block="methodical" min="0" step="1" placeholder="год" />
          <button type="button" class="btn-icon btn-remove" aria-label="Видалити"><i class="fas fa-times"></i></button>
        </div>
      `, '.methodical-hours');
    });
    $$('#methodicalList .btn-remove').forEach(btn => {
      btn.addEventListener('click', function () {
        const row = this.closest('.methodical-row');
        if (row && $$('#methodicalList .methodical-row').length > 1) {
          row.remove();
          updateSummary();
        }
      });
    });
  }

  function initScientific() {
    $('#addScientificRow').addEventListener('click', function () {
      addRow('#scientificList', `
        <div class="scientific-row">
          <input type="text" class="input-text scientific-name" placeholder="Об'єкт наукової роботи" />
          <input type="number" class="input-hours scientific-hours" data-block="scientific" min="0" step="1" placeholder="год" />
          <button type="button" class="btn-icon btn-remove" aria-label="Видалити"><i class="fas fa-times"></i></button>
        </div>
      `, '.scientific-hours');
    });
    $$('#scientificList .btn-remove').forEach(btn => {
      btn.addEventListener('click', function () {
        const row = this.closest('.scientific-row');
        if (row && $$('#scientificList .scientific-row').length > 1) {
          row.remove();
          updateSummary();
        }
      });
    });
  }

  function initOrganizational() {
    $('#addOrganizationalRow').addEventListener('click', function () {
      addRow('#organizationalList', `
        <div class="organizational-row">
          <input type="text" class="input-text org-activity" placeholder="Активність" />
          <input type="number" class="input-hours org-hours" data-block="organizational" min="0" step="1" placeholder="год" />
          <button type="button" class="btn-icon btn-remove" aria-label="Видалити"><i class="fas fa-times"></i></button>
        </div>
      `, '.org-hours');
    });
    $$('#organizationalList .btn-remove').forEach(btn => {
      btn.addEventListener('click', function () {
        const row = this.closest('.organizational-row');
        if (row && $$('#organizationalList .organizational-row').length > 1) {
          row.remove();
          updateSummary();
        }
      });
    });
  }

  function initInputListeners() {
    $$('.input-hours[data-block="teaching"], .methodical-hours, .scientific-hours, .org-hours').forEach(el => {
      el.addEventListener('input', updateSummary);
      el.addEventListener('change', updateSummary);
    });
  }

  function initButtons() {
    $('#btnSaveDraft').addEventListener('click', function () {
      alert('Чернетку збережено (прототип).');
    });
    $('#btnSubmit').addEventListener('click', function () {
      alert('План відправлено на перевірку (прототип).');
    });
  }

  initInputListeners();
  initMethodical();
  initScientific();
  initOrganizational();
  initButtons();
  updateSummary();
})();
