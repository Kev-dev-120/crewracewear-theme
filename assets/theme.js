document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('[data-header]');

  if (header) {
    var menuToggle = header.querySelector('[data-menu-toggle]');
    var nav = header.querySelector('.site-nav');
    if (menuToggle && nav) {
      menuToggle.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    var searchToggle = header.querySelector('[data-search-toggle]');
    var searchDrawer = header.querySelector('[data-search-drawer]');
    if (searchToggle && searchDrawer) {
      searchToggle.addEventListener('click', function () {
        searchDrawer.classList.toggle('is-open');
        var input = searchDrawer.querySelector('input[type="search"]');
        if (searchDrawer.classList.contains('is-open') && input) {
          input.focus();
        }
      });
    }
  }

  /* ---------------- Product gallery: thumbnails + prev/next arrows ---------------- */
  document.querySelectorAll('.product__media').forEach(function (media) {
    var mainImg = media.querySelector('[data-product-gallery-main]');
    var thumbs = Array.prototype.slice.call(media.querySelectorAll('[data-thumb]'));
    var prevBtn = media.querySelector('[data-gallery-prev]');
    var nextBtn = media.querySelector('[data-gallery-next]');
    if (!mainImg || !thumbs.length) return;

    var activeIndex = 0;

    function setActiveIndex(index) {
      activeIndex = (index + thumbs.length) % thumbs.length;
      thumbs.forEach(function (t) { t.classList.remove('is-active'); });
      thumbs[activeIndex].classList.add('is-active');
      mainImg.style.opacity = '0';
      mainImg.src = thumbs[activeIndex].dataset.full;
      mainImg.onload = function () { mainImg.style.opacity = '1'; };
    }

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener('click', function () { setActiveIndex(index); });
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { setActiveIndex(activeIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { setActiveIndex(activeIndex + 1); });
  });

  /* ---------------- Cart drawer ---------------- */
  var cartDrawer = document.querySelector('[data-cart-drawer]');
  var cartToggles = document.querySelectorAll('[data-cart-drawer-toggle]');
  var cartItemsEl = cartDrawer && cartDrawer.querySelector('[data-cart-drawer-items]');
  var cartSubtotalEl = cartDrawer && cartDrawer.querySelector('[data-cart-drawer-subtotal]');
  var cartCountEls = document.querySelectorAll('[data-cart-count]');

  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function cdnResize(url, size) {
    if (!url) return url;
    return url.replace(/(\.[a-zA-Z0-9]+)(\?.*)?$/, '_' + size + 'x' + size + '$1$2');
  }

  function openCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-drawer-open');
  }

  function closeCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-drawer-open');
  }

  function renderCart(cart) {
    cartCountEls.forEach(function (el) {
      el.textContent = cart.item_count;
      el.style.display = cart.item_count > 0 ? '' : 'none';
    });

    if (!cartItemsEl) return;

    if (cart.item_count === 0) {
      cartItemsEl.innerHTML = '<p class="cart-drawer__empty">Your cart is empty.</p>';
    } else {
      cartItemsEl.innerHTML = cart.items.map(function (item, index) {
        var line = index + 1;
        return (
          '<div class="cart-drawer__item" data-line="' + line + '">' +
            (item.image ? '<img src="' + cdnResize(item.image, 160) + '" alt="' + escapeHtml(item.product_title) + '" class="cart-drawer__item-image" width="70" height="70" loading="lazy">' : '<div class="cart-drawer__item-image cart-drawer__item-image--placeholder"></div>') +
            '<div class="cart-drawer__item-info">' +
              '<a href="' + item.url + '" class="cart-drawer__item-title">' + escapeHtml(item.product_title) + '</a>' +
              (item.variant_title ? '<p class="cart-drawer__item-variant">' + escapeHtml(item.variant_title) + '</p>' : '') +
              '<div class="cart-drawer__item-row">' +
                '<div class="cart-drawer__qty">' +
                  '<button type="button" class="cart-drawer__qty-btn" data-cart-qty-decrease aria-label="Decrease quantity">&minus;</button>' +
                  '<span>' + item.quantity + '</span>' +
                  '<button type="button" class="cart-drawer__qty-btn" data-cart-qty-increase aria-label="Increase quantity">+</button>' +
                '</div>' +
                '<span class="cart-drawer__item-price">' + formatMoney(item.final_line_price) + '</span>' +
              '</div>' +
            '</div>' +
            '<button type="button" class="cart-drawer__item-remove" data-cart-remove aria-label="Remove item">&times;</button>' +
          '</div>'
        );
      }).join('');
    }

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatMoney(cart.total_price);
  }

  function fetchCart() {
    return fetch('/cart.js')
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        renderCart(cart);
        return cart;
      });
  }

  function changeLine(line, quantity) {
    return fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: line, quantity: quantity })
    })
      .then(function (res) { return res.json(); })
      .then(function (cart) { renderCart(cart); });
  }

  function updateCartNote(note) {
    return fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: note })
    });
  }

  var cartNoteEl = cartDrawer && cartDrawer.querySelector('[data-cart-drawer-note]');
  var cartNoteSynced = true;
  if (cartNoteEl) {
    cartNoteEl.addEventListener('input', function () { cartNoteSynced = false; });
    cartNoteEl.addEventListener('blur', function () {
      if (cartNoteSynced) return;
      updateCartNote(cartNoteEl.value).then(function () { cartNoteSynced = true; });
    });
  }

  var cartCheckoutLink = cartDrawer && cartDrawer.querySelector('[data-cart-drawer-checkout]');
  if (cartCheckoutLink && cartNoteEl) {
    cartCheckoutLink.addEventListener('click', function (e) {
      if (cartNoteSynced) return;
      e.preventDefault();
      updateCartNote(cartNoteEl.value).then(function () {
        cartNoteSynced = true;
        window.location.href = cartCheckoutLink.href;
      });
    });
  }

  cartToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      openCartDrawer();
    });
  });

  if (cartDrawer) {
    cartDrawer.querySelectorAll('[data-cart-drawer-close]').forEach(function (btn) {
      btn.addEventListener('click', closeCartDrawer);
    });
  }

  if (cartItemsEl) {
    cartItemsEl.addEventListener('click', function (e) {
      var itemEl = e.target.closest('[data-line]');
      if (!itemEl) return;
      var line = parseInt(itemEl.dataset.line, 10);
      var qtyEl = itemEl.querySelector('.cart-drawer__qty span');

      if (e.target.closest('[data-cart-remove]')) {
        changeLine(line, 0);
      } else if (e.target.closest('[data-cart-qty-increase]')) {
        changeLine(line, parseInt(qtyEl.textContent, 10) + 1);
      } else if (e.target.closest('[data-cart-qty-decrease]')) {
        changeLine(line, Math.max(parseInt(qtyEl.textContent, 10) - 1, 0));
      }
    });
  }

  /* ---------------- AJAX add-to-cart (product page + quick add) ---------------- */
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('#product-form, .product-card__quick-add');
    if (!form) return;
    e.preventDefault();

    var idInput = form.querySelector('[name="id"]');
    if (!idInput || !idInput.value) return;

    var submitBtn = form.querySelector('[type="submit"]');
    var label = form.querySelector('[data-add-to-cart-label]');
    var originalLabel = label ? label.textContent : null;
    if (submitBtn) submitBtn.disabled = true;
    if (label) label.textContent = 'ADDING…';

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: idInput.value, quantity: 1 }] })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Could not add to cart');
        return res.json();
      })
      .then(function () { return fetchCart(); })
      .then(function () { openCartDrawer(); })
      .catch(function () {
        form.submit();
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
        if (label && originalLabel) label.textContent = originalLabel;
      });
  });

  fetchCart();

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      nav && nav.classList.remove('is-open');
      searchDrawer && searchDrawer.classList.remove('is-open');
      closeCartDrawer();
    }
  });
});
