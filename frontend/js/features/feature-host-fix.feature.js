(function (APP) {
  'use strict';

  // पहले से रजिस्टर्ड प्लगइन्स को ट्रैक करने के लिए एक लोकल मेमोरी कैश
  var registeredFeatures = {};

  // मूल रजिस्टर फ़ंक्शन को इंटरसेप्ट करना ताकि हम सभी प्लगइन्स का एक्सेस पा सकें
  var originalRegister = APP.features.register;
  APP.features.register = function (plugin) {
    if (plugin && plugin.id) {
      registeredFeatures[plugin.id] = plugin;
    }
    return originalRegister.apply(this, arguments);
  };

  APP.features.register({
    id: 'feature_host_fix',
    name: 'Feature Host Fixer',
    icon: '🔧',
    version: '27.5.5',
    loaded: true,
    
    init: function () {
      // पूरे पेज पर कहीं भी "Open Plugin" बटन क्लिक होने का इंतजार करना
      document.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('btn') && e.target.textContent.trim() === 'Open Plugin') {
          e.preventDefault();
          
          // 1. ढूंढना कि किस कार्ड के बटन को दबाया गया है
          var card = e.target.closest('.card');
          if (!card) return;
          
          // 2. कार्ड के हेडर से प्लगइन का नाम निकालना
          var header = card.querySelector('h3, h4, b, .title');
          var pluginName = header ? header.textContent.trim() : '';
          
          // 3. नाम के आधार पर उसकी सही ID मैप करना
          var pluginId = '';
          if (pluginName.indexOf('Kundli') !== -1) pluginId = 'kundli';
          else if (pluginName.indexOf('Panchang') !== -1) pluginId = 'panchang';
          else if (pluginName.indexOf('Dasha') !== -1) pluginId = 'dasha';
          else if (pluginName.indexOf('Dosha') !== -1) pluginId = 'dosha';
          else if (pluginName.indexOf('Report') !== -1) pluginId = 'report';
          else if (pluginName.indexOf('QA') !== -1) pluginId = 'qa';

          // 4. रजिस्टर्ड प्लगइन का पता लगाना
          var targetPlugin = registeredFeatures[pluginId] || APP.features[pluginId];

          // 5. स्क्रीन पर ऊपर बने "Feature Host" बॉक्स को ढूंढना
          var allCards = document.querySelectorAll('.card');
          var hostCard = null;
          for (var i = 0; i < allCards.length; i++) {
            if (allCards[i].textContent.indexOf('Feature Host') !== -1 || allCards[i].textContent.indexOf('Feature registered') !== -1) {
              hostCard = allCards[i];
              break;
            }
          }

          // 6. अगर होस्ट बॉक्स मिल गया, तो उसमें लाइव प्लगइन का UI रेंडर करना
          if (hostCard) {
            if (targetPlugin && typeof targetPlugin.render === 'function') {
              // पुराना टेक्स्ट हटाकर नया लाइव HTML इन्जेक्ट करना
              hostCard.innerHTML = '<h4 style="color:var(--gold);">📺 लाइव होस्ट: ' + APP.utils.escapeHTML(pluginName) + '</h4><br>' + targetPlugin.render();
              
              // यदि प्लगइन में बटन या इवेंट्स हैं, तो उन्हें एक्टिवेट करना
              if (typeof targetPlugin.afterRender === 'function') {
                targetPlugin.afterRender();
              }
            } else {
              hostCard.innerHTML = '<h4 style="color:var(--gold);">📺 लाइव होस्ट: ' + APP.utils.escapeHTML(pluginName) + '</h4><br><p class="card-muted">इस प्लगइन का डेटा अभी तैयार नहीं है। कृपया पहले Kundli Core में जाकर गणना पूरी करें।</p>';
            }
          }
        }
      });
      return true;
    }
  });

})(window.APP);
