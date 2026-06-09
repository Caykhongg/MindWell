/* ============================================================
   MindWell — Page Agent (Floating AI Assistant)
   Independent module. Does not modify existing business logic.
   ============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------
  var isOpen = false;
  var isProcessing = false;

  // ----------------------------------------------------------
  // Section map: Vietnamese command → section ID
  // ----------------------------------------------------------
  var sectionMap = {
    library:    { id: 'resources',    label: 'Thư viện Tâm lý' },
    thu vien:   { id: 'resources',    label: 'Thư viện Tâm lý' },
    mental:     { id: 'resources',    label: 'Thư viện Tâm lý' },
    test:       { id: 'test',         label: 'Kiểm tra Tâm lý' },
    kiem tra:   { id: 'test',         label: 'Kiểm tra Tâm lý' },
    forum:      { id: 'posts',        label: 'Diễn đàn Cộng đồng' },
    dien dan:   { id: 'posts',        label: 'Diễn đàn Cộng đồng' },
    cong dong:  { id: 'posts',        label: 'Diễn đàn Cộng đồng' },
    chat:       { id: 'chat',         label: 'Trò chuyện Tư vấn' },
    tro chuyen: { id: 'chat',         label: 'Trò chuyện Tư vấn' },
    counseling: { id: 'counseling',   label: 'Tư vấn Cá nhân' },
    group:      { id: 'group',        label: 'Trị liệu Nhóm' },
    mindfulness: { id: 'mindfulness', label: 'Chánh niệm & Thiền' },
    thien:      { id: 'mindfulness',  label: 'Chánh niệm & Thiền' },
    crisis:     { id: 'crisis',       label: 'Hỗ trợ Khẩn cấp' },
    khan cap:   { id: 'crisis',       label: 'Hỗ trợ Khẩn cấp' },
    appointments: { id: 'appointments', label: 'Lịch hẹn' },
    lich hen:   { id: 'appointments', label: 'Lịch hẹn' },
    services:   { id: 'services',     label: 'Dịch vụ' },
    dich vu:    { id: 'services',     label: 'Dịch vụ' }
  };

  // ----------------------------------------------------------
  // Command patterns (Vietnamese)
  // ----------------------------------------------------------
  var commands = [
    { match: ['mở', 'open', 'mo', 'đi đến', 'di den', 'tới', 'toi', 'vào', 'vao'], action: 'navigate' },
    { match: ['bắt đầu', 'bat dau', 'start', 'làm'], action: 'navigate' }
  ];

  // ----------------------------------------------------------
  // DOM refs
  // ----------------------------------------------------------
  var agentEl = document.getElementById('pageAgent');
  var fab = document.getElementById('agentFab');
  var panel = document.getElementById('agentPanel');
  var closeBtn = document.getElementById('agentClose');
  var agentBody = document.getElementById('agentBody');
  var agentInput = document.getElementById('agentInput');
  var sendBtn = document.getElementById('agentSendBtn');
  var quickBtns = document.querySelectorAll('.agent-quick-btn');

  // ----------------------------------------------------------
  // Smooth scroll utility
  // ----------------------------------------------------------
  function smoothScroll(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  // ----------------------------------------------------------
  // Append message to agent chat
  // ----------------------------------------------------------
  function addMessage(type, text) {
    var div = document.createElement('div');
    div.className = 'agent-message agent-' + type;
    var bubble = document.createElement('div');
    bubble.className = 'agent-bubble';
    bubble.innerHTML = text;
    div.appendChild(bubble);
    agentBody.appendChild(div);
    agentBody.scrollTop = agentBody.scrollHeight;
  }

  // ----------------------------------------------------------
  // Process user command
  // ----------------------------------------------------------
  function handleCommand(input) {
    if (isProcessing) return;
    isProcessing = true;

    var lower = input.toLowerCase().trim();
    addMessage('user', input);

    // Try to match a section
    var matchedSection = null;
    var matchedLabel = '';

    for (var key in sectionMap) {
      if (lower.indexOf(key) !== -1) {
        matchedSection = sectionMap[key].id;
        matchedLabel = sectionMap[key].label;
        break;
      }
    }

    if (matchedSection) {
      var replyText = 'Đang chuyển đến <strong>' + matchedLabel + '</strong>...';
      addMessage('bot', replyText);

      setTimeout(function () {
        smoothScroll(matchedSection);
        // Close the panel after navigating (on mobile) or keep open
        closePanel();
        isProcessing = false;
      }, 400);
    } else {
      // No match — show help
      var helpReply =
        'Mình chưa hiểu yêu cầu của bạn. Bạn có thể thử:<br><br>' +
        '📚 <strong>Mở Thư viện Tâm lý</strong><br>' +
        '📝 <strong>Bắt đầu Kiểm tra Tâm lý</strong><br>' +
        '💬 <strong>Đi đến Diễn đàn Cộng đồng</strong><br>' +
        '🤝 <strong>Mở Trò chuyện Tư vấn</strong><br><br>' +
        'Hoặc bấm vào các nút bên dưới nhé!';
      addMessage('bot', helpReply);
      isProcessing = false;
    }
  }

  // ----------------------------------------------------------
  // Toggle panel
  // ----------------------------------------------------------
  function openPanel() {
    agentEl.classList.remove('hidden');
    isOpen = true;
    agentInput.focus();
  }

  function closePanel() {
    agentEl.classList.add('hidden');
    isOpen = false;
  }

  // ----------------------------------------------------------
  // Event listeners
  // ----------------------------------------------------------
  fab.addEventListener('click', function () {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  });

  closeBtn.addEventListener('click', closePanel);

  sendBtn.addEventListener('click', function () {
    var text = agentInput.value.trim();
    if (text) {
      agentInput.value = '';
      handleCommand(text);
    }
  });

  agentInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var text = agentInput.value.trim();
      if (text) {
        agentInput.value = '';
        handleCommand(text);
      }
    }
  });

  // Quick action buttons
  quickBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cmd = btn.getAttribute('data-cmd');
      handleCommand(cmd);
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (isOpen && !agentEl.contains(e.target)) {
      closePanel();
    }
  });

})();
