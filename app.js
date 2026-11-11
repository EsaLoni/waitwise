/* ===================================================================
   WAITWISE - OFFICIAL WEB PLATFORM SCRIPTS
   Interactive Simulator, Dynamic Calculator, Live Campaign Studio,
   CPM Weighted Auction Calculator, Accordions, and Modal Controller
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  try { initSimulator(); } catch (e) { console.warn('WaitWise: initSimulator skipped', e); }
  try { initCalculator(); } catch (e) { console.warn('WaitWise: initCalculator skipped', e); }
  try { initCampaignBuilder(); } catch (e) { console.warn('WaitWise: initCampaignBuilder skipped', e); }
  try { initDailyBudgetCalculator(); } catch (e) { console.warn('WaitWise: initDailyBudgetCalculator skipped', e); }
  try { initAdvCheckoutForm(); } catch (e) { console.warn('WaitWise: initAdvCheckoutForm skipped', e); }
  try { initLiveImpressionsCounter(); } catch (e) { console.warn('WaitWise: initLiveImpressionsCounter skipped', e); }
  try { initFAQ(); } catch (e) { console.warn('WaitWise: initFAQ skipped', e); }
  try { initModals(); } catch (e) { console.warn('WaitWise: initModals skipped', e); }
});

// ===================================================================
// 1. CHATGPT SIMULATOR (index.html)
// ===================================================================

const SIM_PRESETS = [
  {
    prompt: "Explain distributed consensus in Raft",
    response: `In Raft, consensus is decomposed into three independent subproblems:

1. **Leader Election:** When a follower times out waiting for heartbeats, it transitions to candidate state and requests votes.
2. **Log Replication:** The leader receives client commands, appends them to its log, and replicates them to follower nodes.
3. **Safety:** If any server has applied a particular log entry to its state machine, no other server will ever apply a different entry for that same index.`
  },
  {
    prompt: "Write a quicksort function in Rust with comments",
    response: `Here is an idiomatic in-place quicksort in Rust:

\`\`\`rust
pub fn quicksort<T: Ord>(slice: &mut [T]) {
    if slice.len() <= 1 {
        return;
    }
    let pivot_idx = partition(slice);
    quicksort(&mut slice[0..pivot_idx]);
    quicksort(&mut slice[pivot_idx + 1..]);
}
\`\`\`
This achieves O(n log n) average time complexity with zero heap allocations.`
  }
];

let simBalance = 0.00;
let isSimulating = false;
let dwellTimer = null;

function initSimulator() {
  const promptInput = document.getElementById('sim-custom-prompt');
  const submitBtn = document.getElementById('sim-submit-btn');
  const chatThread = document.getElementById('chat-thread');
  const dwellPill = document.getElementById('live-dwell-pill');
  const balanceDisplay = document.getElementById('sim-balance');

  if (!promptInput || !submitBtn || !chatThread) return;

  submitBtn.addEventListener('click', handleSimSubmit);
  promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSimSubmit();
    }
  });

  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = btn.getAttribute('data-prompt');
      if (p && promptInput && !isSimulating) {
        promptInput.value = p;
        handleSimSubmit();
      }
    });
  });

  function handleSimSubmit() {
    const text = promptInput.value.trim();
    if (!text || isSimulating) return;

    isSimulating = true;
    submitBtn.disabled = true;

    // 1. User Prompt Turn
    const userTurn = document.createElement('div');
    userTurn.className = 'chat-turn user-turn';
    userTurn.innerHTML = `<div class="user-bubble">${escapeHtml(text)}</div>`;
    chatThread.appendChild(userTurn);

    // 2. IMMEDIATELY Render WaitWise Sponsored Line (BEFORE AI responds!)
    const adSlot = document.createElement('div');
    adSlot.className = 'ad-insertion-slot';
    adSlot.innerHTML = `
      <div class="sim-sponsored-card">
        <div class="ad-badge-group">
          <span class="ad-logo-pill">W</span>
          <span class="ad-label">SPONSORED</span>
        </div>
        <a href="https://supabase.com" target="_blank" rel="noopener" class="ad-text-link">
          Supabase Vector — Fast HNSW indexing & hybrid search with SQL simplicity.
        </a>
        <button class="ad-close-btn" title="Dismiss advertisement">×</button>
      </div>
    `;
    chatThread.appendChild(adSlot);

    // Wire dismiss button
    const closeBtn = adSlot.querySelector('.ad-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        adSlot.style.opacity = '0';
        setTimeout(() => adSlot.remove(), 250);
      });
    }

    // 3. AI Assistant Turn with streaming cursor
    const preset = SIM_PRESETS[Math.floor(Math.random() * SIM_PRESETS.length)];
    const assistantTurn = document.createElement('div');
    assistantTurn.className = 'chat-turn assistant-turn';
    const contentBox = document.createElement('div');
    contentBox.className = 'assistant-content';
    contentBox.innerHTML = '<span class="pulse-dot"></span> <em>Thinking...</em>';
    assistantTurn.appendChild(contentBox);
    chatThread.appendChild(assistantTurn);

    // Smooth scroll down
    chatThread.scrollTop = chatThread.scrollHeight;

    // 4. Run 5.0s Dwell Timer
    let elapsed = 0.0;
    if (dwellTimer) clearInterval(dwellTimer);

    dwellTimer = setInterval(() => {
      elapsed += 0.1;
      if (dwellPill) {
        dwellPill.textContent = `Dwell: ${elapsed.toFixed(1)}s / 5.0s`;
        if (elapsed >= 5.0) {
          dwellPill.style.color = '#34d399';
          dwellPill.textContent = 'Dwell: 5.0s (Qualified ✓)';
        }
      }

      if (elapsed >= 5.0) {
        clearInterval(dwellTimer);
        dwellTimer = null;

        // Credit 50% revenue share ($0.018)
        simBalance += 0.018;
        if (balanceDisplay) {
          balanceDisplay.textContent = `$${simBalance.toFixed(3)}`;
          balanceDisplay.style.color = '#34d399';
          setTimeout(() => { balanceDisplay.style.color = ''; }, 1200);
        }
      }
    }, 100);

    // 5. Stream AI Response after 600ms
    setTimeout(() => {
      contentBox.innerHTML = '';
      let charIdx = 0;
      const formatted = preset.response.replace(/\n\n/g, '<br><br>');

      const streamInterval = setInterval(() => {
        charIdx += 6;
        if (charIdx >= formatted.length) {
          clearInterval(streamInterval);
          contentBox.innerHTML = formatted;
          isSimulating = false;
          submitBtn.disabled = false;
          promptInput.value = '';
        } else {
          contentBox.innerHTML = formatted.substring(0, charIdx) + '<span class="typing-cursor">█</span>';
        }
        chatThread.scrollTop = chatThread.scrollHeight;
      }, 20);
    }, 600);
  }
}

// ===================================================================
// 2. EARNINGS CALCULATOR (index.html)
// ===================================================================

function initCalculator() {
  const promptRange = document.getElementById('prompt-range');
  const daysRange = document.getElementById('days-range');
  const cpmRange = document.getElementById('cpm-range');

  const promptDisplay = document.getElementById('prompt-display');
  const daysDisplay = document.getElementById('days-display');
  const cpmDisplay = document.getElementById('cpm-display');

  const monthlyOut = document.getElementById('calc-monthly-out');
  const annualOut = document.getElementById('calc-annual-out');
  const impressionsOut = document.getElementById('calc-impressions-out');

  if (!promptRange || !daysRange || !cpmRange) return;

  function update() {
    const prompts = parseInt(promptRange.value, 10);
    const days = parseInt(daysRange.value, 10);
    const cpm = parseFloat(cpmRange.value);

    if (promptDisplay) promptDisplay.textContent = `${prompts} prompts/day`;
    if (daysDisplay) daysDisplay.textContent = `${days} days/mo`;
    if (cpmDisplay) cpmDisplay.textContent = `$${cpm.toFixed(2)} CPM`;

    const totalImpressions = prompts * days;
    // 50% publisher revenue share
    const monthlyTotal = (totalImpressions * (cpm / 1000)) * 0.50;
    const annualTotal = monthlyTotal * 12;

    if (monthlyOut) monthlyOut.textContent = `$${monthlyTotal.toFixed(2)}`;
    if (annualOut) annualOut.textContent = `$${annualTotal.toFixed(2)}`;
    if (impressionsOut) impressionsOut.textContent = totalImpressions.toLocaleString();
  }

  promptRange.addEventListener('input', update);
  daysRange.addEventListener('input', update);
  cpmRange.addEventListener('input', update);

  update();
}

// ===================================================================
// 3. ADVERTISER CAMPAIGN STUDIO & LIVE PREVIEW (advertise.html)
// ===================================================================

function initCampaignBuilder() {
  const brandInput = document.getElementById('builder-brand-input');
  const iconInput = document.getElementById('builder-icon-input');
  const headlineInput = document.getElementById('builder-headline-input');
  const urlInput = document.getElementById('builder-url-input');

  const charCounter = document.getElementById('ad-char-count');
  const previewIcon = document.getElementById('preview-icon-pill');
  const previewHeadline = document.getElementById('preview-headline-link');
  const previewUrl = document.getElementById('preview-url-display');

  if (!headlineInput) return;

  function updatePreview() {
    const brand = (brandInput && brandInput.value.trim()) || 'WaitWise';
    let icon = (iconInput && iconInput.value.trim()) || brand.charAt(0).toUpperCase() || 'W';
    if (icon.length > 2) icon = icon.substring(0, 2);

    const headline = headlineInput.value.trim() || 'Reach high-intent AI developers in the waiting moment.';
    const url = (urlInput && urlInput.value.trim()) || 'https://waitwise.ai';

    // Character counter
    const len = headlineInput.value.length;
    if (charCounter) {
      charCounter.textContent = `${len} / 64`;
      if (len >= 58) {
        charCounter.classList.add('limit-close');
      } else {
        charCounter.classList.remove('limit-close');
      }
    }

    if (previewIcon) previewIcon.textContent = icon;
    if (previewHeadline) {
      previewHeadline.textContent = headline;
      previewHeadline.href = url.startsWith('http') ? url : `https://${url}`;
    }
    if (previewUrl) previewUrl.textContent = url;

    // Sync modal defaults
    const modalCompany = document.getElementById('modal-book-company');
    const modalCopy = document.getElementById('modal-book-copy');
    const modalUrl = document.getElementById('modal-book-url');
    if (modalCompany && !modalCompany.value) modalCompany.value = brand;
    if (modalCopy) modalCopy.value = headline;
    if (modalUrl) modalUrl.value = url;
  }

  if (brandInput) brandInput.addEventListener('input', updatePreview);
  if (iconInput) iconInput.addEventListener('input', updatePreview);
  headlineInput.addEventListener('input', updatePreview);
  if (urlInput) urlInput.addEventListener('input', updatePreview);

  updatePreview();
}

// ===================================================================
// 4. DAILY BUDGET & CPM PROJECTION CALCULATOR (advertise.html)
// ===================================================================

function initDailyBudgetCalculator() {
  const cpmCards = document.querySelectorAll('.cpm-option-card');
  const presetBtns = document.querySelectorAll('.daily-preset-btn');
  const dailyInput = document.getElementById('daily-spend-input');
  const durationPills = document.querySelectorAll('.duration-pill');

  const projDailyAmount = document.getElementById('proj-daily-amount');
  const projCpmRate = document.getElementById('proj-cpm-rate');
  const projDailyImpressions = document.getElementById('proj-daily-impressions');
  const projDailyClicks = document.getElementById('proj-daily-clicks');
  const projCpcCost = document.getElementById('proj-cpc-cost');
  const projTotalImpressions = document.getElementById('proj-total-impressions');
  const projDurationLabel = document.getElementById('proj-duration-label');
  const projTotalCost = document.getElementById('proj-total-cost');
  const projBreakdownSubtext = document.getElementById('proj-breakdown-subtext');

  const modalSummaryImpressions = document.getElementById('modal-summary-impressions');
  const modalSummaryCost = document.getElementById('modal-summary-cost');
  const modalDailyBudget = document.getElementById('modal-daily-budget');
  const modalDuration = document.getElementById('modal-duration');

  if (!dailyInput && presetBtns.length === 0 && cpmCards.length === 0) return;

  let selectedCpm = 3.50;
  let dailyBudget = 75;
  let flightDurationDays = 30;

  function recalculate() {
    // Delivery calculations:
    // Daily Impressions = (Daily Spend / CPM) * 1,000
    // Daily Clicks = Daily Impressions * 0.042 (4.2% CTR benchmark)
    // Effective CPC = Daily Spend / Daily Clicks
    // Total Flight Impressions = Daily Impressions * flightDurationDays
    // Total Campaign Cost = Daily Spend * flightDurationDays
    const dailyImps = Math.round((dailyBudget / selectedCpm) * 1000);
    const dailyClicks = Math.round(dailyImps * 0.042);
    const effectiveCpc = dailyClicks > 0 ? (dailyBudget / dailyClicks) : (selectedCpm / 42);
    const totalImps = dailyImps * flightDurationDays;
    const totalCost = dailyBudget * flightDurationDays;

    // 1. Update live projection card display
    if (projDailyAmount) projDailyAmount.textContent = `$${dailyBudget.toFixed(2)}`;
    if (projCpmRate) projCpmRate.textContent = `$${selectedCpm.toFixed(2)}`;
    if (projDailyImpressions) projDailyImpressions.textContent = dailyImps.toLocaleString();
    if (projDailyClicks) projDailyClicks.textContent = `~${dailyClicks.toLocaleString()}`;
    if (projCpcCost) projCpcCost.textContent = `$${effectiveCpc.toFixed(3)}`;
    if (projTotalImpressions) projTotalImpressions.textContent = totalImps.toLocaleString();
    if (projDurationLabel) projDurationLabel.textContent = `${flightDurationDays} days`;
    if (projTotalCost) {
      projTotalCost.textContent = `$${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (projBreakdownSubtext) {
      projBreakdownSubtext.textContent = `$${dailyBudget}/day × ${flightDurationDays} days`;
    }

    // 2. Update booking modal summary fields
    if (modalDailyBudget) modalDailyBudget.textContent = `$${dailyBudget.toFixed(2)} / day`;
    if (modalDuration) modalDuration.textContent = `${flightDurationDays} Days`;
    if (modalSummaryImpressions) {
      modalSummaryImpressions.textContent = `${totalImps.toLocaleString()} Impressions (${dailyImps.toLocaleString()}/day)`;
    }
    if (modalSummaryCost) {
      modalSummaryCost.textContent = `$${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // 3. Sync CPM Card selection styles
    cpmCards.forEach(card => {
      const rate = parseFloat(card.getAttribute('data-cpm'));
      if (Math.abs(rate - selectedCpm) < 0.01) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });

    // 4. Sync Preset Button selection styles
    presetBtns.forEach(btn => {
      const val = parseFloat(btn.getAttribute('data-daily'));
      if (Math.abs(val - dailyBudget) < 0.01) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });

    // 5. Sync Duration Pill selection styles
    durationPills.forEach(pill => {
      const days = parseInt(pill.getAttribute('data-days'), 10);
      if (days === flightDurationDays) {
        pill.classList.add('selected');
      } else {
        pill.classList.remove('selected');
      }
    });

    // 6. Sync daily input if out of sync
    if (dailyInput && parseFloat(dailyInput.value) !== dailyBudget) {
      dailyInput.value = dailyBudget;
    }
  }

  // Event Listeners: CPM Tier Cards
  cpmCards.forEach(card => {
    card.addEventListener('click', () => {
      const rate = parseFloat(card.getAttribute('data-cpm'));
      if (!isNaN(rate) && rate > 0) {
        selectedCpm = rate;
        recalculate();
      }
    });
  });

  // Event Listeners: Daily Budget Preset Buttons
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.getAttribute('data-daily'));
      if (!isNaN(val) && val > 0) {
        dailyBudget = val;
        recalculate();
      }
    });
  });

  // Event Listener: Custom Daily Budget Input Field
  if (dailyInput) {
    dailyInput.addEventListener('input', () => {
      let val = parseFloat(dailyInput.value);
      if (!isNaN(val) && val > 0) {
        dailyBudget = Math.max(5, Math.min(10000, val));
        recalculate();
      }
    });
  }

  // Event Listeners: Flight Duration Pills
  durationPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const days = parseInt(pill.getAttribute('data-days'), 10);
      if (!isNaN(days) && days > 0) {
        flightDurationDays = days;
        recalculate();
      }
    });
  });

  recalculate();
}

// ===================================================================
// 4B. CHATWAIT-STYLE ADVERTISER CHECKOUT STUDIO (Matching Image 5)
// ===================================================================

function initAdvCheckoutForm() {
  const form = document.getElementById('adv-checkout-form');
  if (!form) return;

  const emailInput = document.getElementById('adv-email');
  const nameInput = document.getElementById('adv-name');
  const fileInput = document.getElementById('adv-icon-file');
  const letterInput = document.getElementById('adv-icon-letter');
  const copyInput = document.getElementById('adv-copy');
  const charCount = document.getElementById('adv-char-count');
  const previewIcon = document.getElementById('adv-preview-icon');
  const previewText = document.getElementById('adv-preview-text');
  const bidGroup = document.getElementById('adv-bid-group');
  const customCpmInput = document.getElementById('adv-custom-cpm-input');
  const blocksInput = document.getElementById('adv-blocks');
  const blockLabel = document.getElementById('adv-block-label');
  const totalPrice = document.getElementById('adv-total-price');

  let currentCpm = 5.00;

  function recalculateTotal() {
    let blocks = parseInt(blocksInput ? blocksInput.value : '1', 10);
    if (isNaN(blocks) || blocks < 1) blocks = 1;
    const impressions = blocks * 1000;
    if (blockLabel) {
      blockLabel.textContent = `= ${impressions.toLocaleString()} impressions`;
    }
    const cost = (blocks * currentCpm).toFixed(2);
    if (totalPrice) {
      totalPrice.textContent = `$${cost}`;
    }
  }

  // Live copy typing
  if (copyInput) {
    copyInput.addEventListener('input', () => {
      const len = copyInput.value.length;
      if (charCount) {
        charCount.textContent = `${len}/64 characters (min 3)`;
        charCount.style.color = len >= 3 ? 'var(--emerald-400)' : '#f87171';
      }
      if (previewText) {
        previewText.textContent = copyInput.value || 'Your ad copy appears here';
      }
    });
  }

  // Live icon text or file
  if (letterInput) {
    letterInput.addEventListener('input', () => {
      if (previewIcon) {
        previewIcon.textContent = letterInput.value.toUpperCase() || 'W';
        previewIcon.style.backgroundImage = 'none';
        previewIcon.style.color = '#fff';
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (file && previewIcon) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewIcon.style.backgroundImage = `url(${e.target.result})`;
          previewIcon.style.backgroundSize = 'cover';
          previewIcon.style.backgroundPosition = 'center';
          previewIcon.style.color = 'transparent';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Bid selection pills
  if (bidGroup) {
    const bidBtns = bidGroup.querySelectorAll('.adv-bid-btn');
    bidBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        bidBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const cpmVal = btn.getAttribute('data-cpm');
        if (cpmVal === 'custom') {
          if (customCpmInput) {
            customCpmInput.style.display = 'inline-block';
            customCpmInput.focus();
            const customVal = parseFloat(customCpmInput.value) || 5.00;
            currentCpm = customVal;
          }
        } else {
          if (customCpmInput) customCpmInput.style.display = 'none';
          currentCpm = parseFloat(cpmVal) || 5.00;
        }
        recalculateTotal();
      });
    });
  }

  if (customCpmInput) {
    customCpmInput.addEventListener('input', () => {
      const val = parseFloat(customCpmInput.value);
      if (!isNaN(val) && val > 0) {
        currentCpm = val;
        recalculateTotal();
      }
    });
  }

  if (blocksInput) {
    blocksInput.addEventListener('input', recalculateTotal);
    blocksInput.addEventListener('change', recalculateTotal);
  }

  // Submit checkout
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const successModal = document.getElementById('modal-checkout-success');
    if (successModal) {
      const revEmail = document.getElementById('modal-rev-email');
      const revName = document.getElementById('modal-rev-name');
      const revImpr = document.getElementById('modal-rev-impr');
      const revTotal = document.getElementById('modal-rev-total');

      if (revEmail) revEmail.textContent = emailInput.value;
      if (revName) revName.textContent = nameInput.value;
      const blocks = parseInt(blocksInput.value, 10) || 1;
      if (revImpr) revImpr.textContent = `${(blocks * 1000).toLocaleString()} impressions (${blocks} block${blocks > 1 ? 's' : ''})`;
      if (revTotal) revTotal.textContent = `$${(blocks * currentCpm).toFixed(2)}`;

      successModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      alert(`Proceeding to checkout for ${nameInput.value}: $${(parseInt(blocksInput.value, 10) * currentCpm).toFixed(2)}`);
    }
  });

  recalculateTotal();
}

// ===================================================================
// 4C. LIVE AD IMPRESSIONS COUNTER TICKER (Matching Image 6)
// ===================================================================

function initLiveImpressionsCounter() {
  const counterEl = document.getElementById('live-counter-val');
  if (!counterEl) return;
  let currentVal = 5505472;
  window.setInterval(() => {
    const increment = Math.floor(Math.random() * 3) + 1;
    currentVal += increment;
    counterEl.textContent = currentVal.toLocaleString();
  }, 2400);
}

// ===================================================================
// 5. FAQ ACCORDION (Shared)
// ===================================================================

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// ===================================================================
// 6. MODALS CONTROLLER (Shared)
// ===================================================================

function initModals() {
  const installModal = document.getElementById('modal-install');
  const advertiserModal = document.getElementById('modal-advertiser');
  const advertiserBookModal = document.getElementById('modal-advertiser-book');
  const privacyModal = document.getElementById('modal-privacy');

  document.querySelectorAll('[data-open-modal="install"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(installModal);
    });
  });

  document.querySelectorAll('[data-open-modal="advertiser"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(advertiserModal);
    });
  });

  document.querySelectorAll('[data-open-modal="advertiser-book"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(advertiserBookModal || advertiserModal);
    });
  });

  document.querySelectorAll('[data-open-modal="privacy"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(privacyModal);
    });
  });

  document.querySelectorAll('.modal-close-btn, .modal-backdrop').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('modal-close-btn')) {
        closeAllModals();
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
  }

  // Handle forms
  const bookForm = document.getElementById('campaign-booking-form');
  if (bookForm) {
    bookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = '✓ Campaign Request Received!';
        submitBtn.style.background = '#10b981';
        setTimeout(() => {
          closeAllModals();
          submitBtn.textContent = 'Submit & Launch Campaign';
          submitBtn.style.background = '';
          bookForm.reset();
        }, 2200);
      }
    });
  }

  const quoteForm = document.getElementById('advertiser-quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = '✓ Inquiry Sent (Response in 24h)';
        submitBtn.style.background = '#10b981';
        setTimeout(() => {
          closeAllModals();
          submitBtn.textContent = 'Submit Advertiser Request';
          submitBtn.style.background = '';
          quoteForm.reset();
        }, 2200);
      }
    });
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
