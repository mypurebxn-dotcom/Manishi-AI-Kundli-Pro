(function(APP){
  'use strict';

  function norm(s){
    return String(s || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[।|,]+/g, ',')
      .replace(/\s*,\s*/g, ', ');
  }

  var DB = {
    "bayana, rajasthan": ["26.9124","77.2890"],
    "bharatpur, rajasthan": ["27.2152","77.5030"],
    "jaipur, rajasthan": ["26.9124","75.7873"],
    "jodhpur, rajasthan": ["26.2389","73.0243"],
    "udaipur, rajasthan": ["24.5854","73.7125"],
    "kota, rajasthan": ["25.2138","75.8648"],
    "ajmer, rajasthan": ["26.4499","74.6399"],
    "bikaner, rajasthan": ["28.0229","73.3119"],
    "alwar, rajasthan": ["27.5529","76.6346"],
    "sikar, rajasthan": ["27.6094","75.1399"],
    "delhi": ["28.6139","77.2090"],
    "new delhi": ["28.6139","77.2090"],
    "mumbai, maharashtra": ["19.0760","72.8777"],
    "pune, maharashtra": ["18.5204","73.8567"],
    "nagpur, maharashtra": ["21.1458","79.0882"],
    "nashik, maharashtra": ["19.9975","73.7898"],
    "bangalore, karnataka": ["12.9716","77.5946"],
    "bengaluru, karnataka": ["12.9716","77.5946"],
    "mysuru, karnataka": ["12.2958","76.6394"],
    "chennai, tamil nadu": ["13.0827","80.2707"],
    "coimbatore, tamil nadu": ["11.0168","76.9558"],
    "madurai, tamil nadu": ["9.9252","78.1198"],
    "hyderabad, telangana": ["17.3850","78.4867"],
    "warangal, telangana": ["17.9689","79.5941"],
    "kolkata, west bengal": ["22.5726","88.3639"],
    "howrah, west bengal": ["22.5958","88.2636"],
    "lucknow, uttar pradesh": ["26.8467","80.9462"],
    "kanpur, uttar pradesh": ["26.4499","80.3319"],
    "varanasi, uttar pradesh": ["25.3176","82.9739"],
    "agra, uttar pradesh": ["27.1767","78.0081"],
    "mathura, uttar pradesh": ["27.4924","77.6737"],
    "vrindavan, uttar pradesh": ["27.5650","77.6593"],
    "meerut, uttar pradesh": ["28.9845","77.7064"],
    "prayagraj, uttar pradesh": ["25.4358","81.8463"],
    "allahabad, uttar pradesh": ["25.4358","81.8463"],
    "gorakhpur, uttar pradesh": ["26.7606","83.3732"],
    "patna, bihar": ["25.5941","85.1376"],
    "gaya, bihar": ["24.7914","85.0002"],
    "bhopal, madhya pradesh": ["23.2599","77.4126"],
    "indore, madhya pradesh": ["22.7196","75.8577"],
    "ujjain, madhya pradesh": ["23.1765","75.7885"],
    "gwalior, madhya pradesh": ["26.2183","78.1828"],
    "jabalpur, madhya pradesh": ["23.1815","79.9864"],
    "ahmedabad, gujarat": ["23.0225","72.5714"],
    "surat, gujarat": ["21.1702","72.8311"],
    "vadodara, gujarat": ["22.3072","73.1812"],
    "rajkot, gujarat": ["22.3039","70.8022"],
    "gandhinagar, gujarat": ["23.2156","72.6369"],
    "chandigarh": ["30.7333","76.7794"],
    "amritsar, punjab": ["31.6340","74.8723"],
    "ludhiana, punjab": ["30.9010","75.8573"],
    "jalandhar, punjab": ["31.3260","75.5762"],
    "dehradun, uttarakhand": ["30.3165","78.0322"],
    "haridwar, uttarakhand": ["29.9457","78.1642"],
    "rishikesh, uttarakhand": ["30.0869","78.2676"],
    "shimla, himachal pradesh": ["31.1048","77.1734"],
    "jammu, jammu and kashmir": ["32.7266","74.8570"],
    "srinagar, jammu and kashmir": ["34.0837","74.7973"],
    "guwahati, assam": ["26.1445","91.7362"],
    "bhubaneswar, odisha": ["20.2961","85.8245"],
    "puri, odisha": ["19.8135","85.8312"],
    "ranchi, jharkhand": ["23.3441","85.3096"],
    "jamshedpur, jharkhand": ["22.8046","86.2029"],
    "raipur, chhattisgarh": ["21.2514","81.6296"],
    "bilaspur, chhattisgarh": ["22.0797","82.1409"],
    "kochi, kerala": ["9.9312","76.2673"],
    "thiruvananthapuram, kerala": ["8.5241","76.9366"],
    "trivandrum, kerala": ["8.5241","76.9366"],
    "kozhikode, kerala": ["11.2588","75.7804"],
    "panaji, goa": ["15.4909","73.8278"],
    "visakhapatnam, andhra pradesh": ["17.6868","83.2185"],
    "vijayawada, andhra pradesh": ["16.5062","80.6480"],
    "tirupati, andhra pradesh": ["13.6288","79.4192"],
    "imphal, manipur": ["24.8170","93.9368"],
    "aizawl, mizoram": ["23.7271","92.7176"],
    "kohima, nagaland": ["25.6751","94.1086"],
    "agartala, tripura": ["23.8315","91.2868"],
    "shillong, meghalaya": ["25.5788","91.8933"],
    "gangtok, sikkim": ["27.3314","88.6138"],
    "itanagar, arunachal pradesh": ["27.0844","93.6053"],
    "port blair, andaman and nicobar": ["11.6234","92.7265"],
    "leh, ladakh": ["34.1526","77.5770"]
  };

  var ALIAS = {
    "bayana": "bayana, rajasthan",
    "bharatpur": "bharatpur, rajasthan",
    "jaipur": "jaipur, rajasthan",
    "delhi, india": "delhi",
    "new delhi, india": "new delhi",
    "bangalore": "bengaluru, karnataka",
    "bengaluru": "bengaluru, karnataka",
    "allahabad": "allahabad, uttar pradesh",
    "prayagraj": "prayagraj, uttar pradesh",
    "bombay": "mumbai, maharashtra",
    "mumbai": "mumbai, maharashtra",
    "trivandrum": "trivandrum, kerala",
    "varanasi": "varanasi, uttar pradesh",
    "mathura": "mathura, uttar pradesh",
    "vrindavan": "vrindavan, uttar pradesh"
  };

  function pack(key){
    var row = DB[key];
    if (!row) return null;
    return { lat: row[0], lon: row[1], key: key, source: 'offline-india-db' };
  }

  function resolve(place){
    var q = norm(place);
    if (!q) return null;
    if (DB[q]) return pack(q);
    if (ALIAS[q]) return pack(ALIAS[q]);

    var qNoIndia = q.replace(/,\s*india$/,'');
    if (DB[qNoIndia]) return pack(qNoIndia);
    if (ALIAS[qNoIndia]) return pack(ALIAS[qNoIndia]);

    return null;
  }

  function count(){
    return Object.keys(DB).length;
  }

  
  function search(query, limit){
    query = norm(query);
    limit = limit || 8;
    if (!query) return [];

    var cityPrefix = [];
    var cityContains = [];

    Object.keys(DB).forEach(function(k){
      var row = DB[k];
      var city = k.split(',')[0].trim();
      var item = { place: k, lat: row[0], lon: row[1] };

      if (city.indexOf(query) === 0) {
        cityPrefix.push(item);
      } else if (query.length >= 3 && city.indexOf(query) > 0) {
        cityContains.push(item);
      }
    });

    function byName(a,b){ return a.place.localeCompare(b.place); }

    return cityPrefix.sort(byName)
      .concat(cityContains.sort(byName))
      .slice(0, limit);
  }

APP.geocoder = { resolve: resolve,
    search: search, count: count, db: DB };

})(window.APP);
