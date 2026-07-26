/**
 * Crew Racewear — Redesign interactions
 * Homepage IRL/MXBikes tab switcher. Mobile menu + search drawer are handled
 * by the existing theme.js — this file only adds the new tab behavior so it
 * can be included independently (add `{{ 'theme-redesign.js' | asset_url | script_tag }}`
 * to layout/theme.liquid, after theme.js).
 */
document.addEventListener('DOMContentLoaded', function () {
  var tabButtons = document.querySelectorAll('[data-crw-tab-btn]');
  if (!tabButtons.length) return;

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-crw-tab-btn');

      tabButtons.forEach(function (b) { b.classList.remove('crw-active'); });
      btn.classList.add('crw-active');

      document.querySelectorAll('[data-crw-tab-panel]').forEach(function (panel) {
        panel.classList.toggle('crw-active', panel.getAttribute('data-crw-tab-panel') === target);
      });

      // Persist choice for the session so a returning visitor lands back on
      // the tab they were looking at (e.g. after adding to cart and back-navigating).
      try { sessionStorage.setItem('crwActiveShopTab', target); } catch (e) { /* storage unavailable, ignore */ }
    });
  });

  // Restore last-selected tab within this session, defaulting to whatever
  // the section schema marked as the default (already rendered server-side).
  try {
    var saved = sessionStorage.getItem('crwActiveShopTab');
    if (saved) {
      var savedBtn = document.querySelector('[data-crw-tab-btn="' + saved + '"]');
      if (savedBtn) savedBtn.click();
    }
  } catch (e) { /* storage unavailable, ignore */ }
});
