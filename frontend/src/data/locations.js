// Static location data for India
export const indianStates = [
  { id: 1, name: 'Andhra Pradesh' },
  { id: 2, name: 'Bihar' },
  { id: 3, name: 'Gujarat' },
  { id: 4, name: 'Haryana' },
  { id: 5, name: 'Karnataka' },
  { id: 6, name: 'Madhya Pradesh' },
  { id: 7, name: 'Maharashtra' },
  { id: 8, name: 'Punjab' },
  { id: 9, name: 'Rajasthan' },
  { id: 10, name: 'Tamil Nadu' },
  { id: 11, name: 'Uttar Pradesh' },
  { id: 12, name: 'West Bengal' },
];

export const citiesByState = {
  1: [ // Andhra Pradesh
    { id: 101, name: 'Vijayawada' },
    { id: 102, name: 'Visakhapatnam' },
    { id: 103, name: 'Guntur' },
    { id: 104, name: 'Tirupati' },
  ],
  2: [ // Bihar
    { id: 201, name: 'Patna' },
    { id: 202, name: 'Gaya' },
    { id: 203, name: 'Bhagalpur' },
    { id: 204, name: 'Muzaffarpur' },
  ],
  3: [ // Gujarat
    { id: 301, name: 'Ahmedabad' },
    { id: 302, name: 'Surat' },
    { id: 303, name: 'Vadodara' },
    { id: 304, name: 'Rajkot' },
  ],
  4: [ // Haryana
    { id: 401, name: 'Gurgaon' },
    { id: 402, name: 'Faridabad' },
    { id: 403, name: 'Panipat' },
    { id: 404, name: 'Ambala' },
  ],
  5: [ // Karnataka
    { id: 501, name: 'Bangalore' },
    { id: 502, name: 'Mysore' },
    { id: 503, name: 'Mangalore' },
    { id: 504, name: 'Hubli' },
  ],
  6: [ // Madhya Pradesh
    { id: 601, name: 'Bhopal' },
    { id: 602, name: 'Indore' },
    { id: 603, name: 'Jabalpur' },
    { id: 604, name: 'Gwalior' },
  ],
  7: [ // Maharashtra
    { id: 701, name: 'Mumbai' },
    { id: 702, name: 'Pune' },
    { id: 703, name: 'Nagpur' },
    { id: 704, name: 'Nashik' },
  ],
  8: [ // Punjab
    { id: 801, name: 'Ludhiana' },
    { id: 802, name: 'Amritsar' },
    { id: 803, name: 'Jalandhar' },
    { id: 804, name: 'Patiala' },
  ],
  9: [ // Rajasthan
    { id: 901, name: 'Jaipur' },
    { id: 902, name: 'Jodhpur' },
    { id: 903, name: 'Udaipur' },
    { id: 904, name: 'Ajmer' },
  ],
  10: [ // Tamil Nadu
    { id: 1001, name: 'Chennai' },
    { id: 1002, name: 'Coimbatore' },
    { id: 1003, name: 'Madurai' },
    { id: 1004, name: 'Salem' },
  ],
  11: [ // Uttar Pradesh
    { id: 1101, name: 'Lucknow' },
    { id: 1102, name: 'Kanpur' },
    { id: 1103, name: 'Agra' },
    { id: 1104, name: 'Varanasi' },
  ],
  12: [ // West Bengal
    { id: 1201, name: 'Kolkata' },
    { id: 1202, name: 'Siliguri' },
    { id: 1203, name: 'Durgapur' },
    { id: 1204, name: 'Asansol' },
  ],
};

export const villagesByCity = {
  // Andhra Pradesh
  101: [{ id: 10101, name: 'Gannavaram' }, { id: 10102, name: 'Mylavaram' }, { id: 10103, name: 'Pamarru' }],
  102: [{ id: 10201, name: 'Anakapalle' }, { id: 10202, name: 'Bheemunipatnam' }, { id: 10203, name: 'Pendurthi' }],
  103: [{ id: 10301, name: 'Tenali' }, { id: 10302, name: 'Ponnur' }, { id: 10303, name: 'Bapatla' }],
  104: [{ id: 10401, name: 'Srikalahasti' }, { id: 10402, name: 'Puttur' }, { id: 10403, name: 'Chandragiri' }],
  
  // Bihar
  201: [{ id: 20101, name: 'Danapur' }, { id: 20102, name: 'Barh' }, { id: 20103, name: 'Mokama' }],
  202: [{ id: 20201, name: 'Tekari' }, { id: 20202, name: 'Sherghati' }, { id: 20203, name: 'Bodh Gaya' }],
  203: [{ id: 20301, name: 'Kahalgaon' }, { id: 20302, name: 'Naugachhia' }, { id: 20303, name: 'Sultanganj' }],
  204: [{ id: 20401, name: 'Sitamarhi' }, { id: 20402, name: 'Saharsa' }, { id: 20403, name: 'Hajipur' }],
  
  // Gujarat
  301: [{ id: 30101, name: 'Sanand' }, { id: 30102, name: 'Dholka' }, { id: 30103, name: 'Bavla' }],
  302: [{ id: 30201, name: 'Bardoli' }, { id: 30202, name: 'Navsari' }, { id: 30203, name: 'Valsad' }],
  303: [{ id: 30301, name: 'Padra' }, { id: 30302, name: 'Karjan' }, { id: 30303, name: 'Dabhoi' }],
  304: [{ id: 30401, name: 'Gondal' }, { id: 30402, name: 'Jetpur' }, { id: 30403, name: 'Morbi' }],
  
  // Haryana
  401: [{ id: 40101, name: 'Sohna' }, { id: 40102, name: 'Manesar' }, { id: 40103, name: 'Pataudi' }],
  402: [{ id: 40201, name: 'Ballabgarh' }, { id: 40202, name: 'Palwal' }, { id: 40203, name: 'Hodal' }],
  403: [{ id: 40301, name: 'Samalkha' }, { id: 40302, name: 'Karnal' }, { id: 40303, name: 'Assandh' }],
  404: [{ id: 40401, name: 'Naraingarh' }, { id: 40402, name: 'Shahabad' }, { id: 40403, name: 'Sadhaura' }],
  
  // Karnataka
  501: [{ id: 50101, name: 'Anekal' }, { id: 50102, name: 'Devanahalli' }, { id: 50103, name: 'Ramanagara' }],
  502: [{ id: 50201, name: 'Nanjangud' }, { id: 50202, name: 'Mandya' }, { id: 50203, name: 'Srirangapatna' }],
  503: [{ id: 50301, name: 'Moodabidri' }, { id: 50302, name: 'Udupi' }, { id: 50303, name: 'Karkala' }],
  504: [{ id: 50401, name: 'Dharwad' }, { id: 50402, name: 'Belgaum' }, { id: 50403, name: 'Gadag' }],
  
  // Madhya Pradesh
  601: [{ id: 60101, name: 'Sehore' }, { id: 60102, name: 'Vidisha' }, { id: 60103, name: 'Raisen' }],
  602: [{ id: 60201, name: 'Dewas' }, { id: 60202, name: 'Ujjain' }, { id: 60203, name: 'Dhar' }],
  603: [{ id: 60301, name: 'Katni' }, { id: 60302, name: 'Mandla' }, { id: 60303, name: 'Seoni' }],
  604: [{ id: 60401, name: 'Morena' }, { id: 60402, name: 'Shivpuri' }, { id: 60403, name: 'Datia' }],
  
  // Maharashtra
  701: [{ id: 70101, name: 'Thane' }, { id: 70102, name: 'Navi Mumbai' }, { id: 70103, name: 'Kalyan' }],
  702: [{ id: 70201, name: 'Pimpri' }, { id: 70202, name: 'Talegaon' }, { id: 70203, name: 'Lonavala' }],
  703: [{ id: 70301, name: 'Wardha' }, { id: 70302, name: 'Bhandara' }, { id: 70303, name: 'Gondia' }],
  704: [{ id: 70401, name: 'Sinnar' }, { id: 70402, name: 'Malegaon' }, { id: 70403, name: 'Satana' }],
  
  // Punjab
  801: [{ id: 80101, name: 'Khanna' }, { id: 80102, name: 'Samrala' }, { id: 80103, name: 'Raikot' }],
  802: [{ id: 80201, name: 'Tarn Taran' }, { id: 80202, name: 'Ajnala' }, { id: 80203, name: 'Batala' }],
  803: [{ id: 80301, name: 'Nakodar' }, { id: 80302, name: 'Phillaur' }, { id: 80303, name: 'Kartarpur' }],
  804: [{ id: 80401, name: 'Rajpura' }, { id: 80402, name: 'Nabha' }, { id: 80403, name: 'Samana' }],
  
  // Rajasthan
  901: [{ id: 90101, name: 'Chomu' }, { id: 90102, name: 'Sanganer' }, { id: 90103, name: 'Amer' }],
  902: [{ id: 90201, name: 'Phalodi' }, { id: 90202, name: 'Osian' }, { id: 90203, name: 'Bilara' }],
  903: [{ id: 90301, name: 'Nathdwara' }, { id: 90302, name: 'Rajsamand' }, { id: 90303, name: 'Kankroli' }],
  904: [{ id: 90401, name: 'Pushkar' }, { id: 90402, name: 'Kishangarh' }, { id: 90403, name: 'Beawar' }],
  
  // Tamil Nadu
  1001: [{ id: 100101, name: 'Tambaram' }, { id: 100102, name: 'Avadi' }, { id: 100103, name: 'Ambattur' }],
  1002: [{ id: 100201, name: 'Pollachi' }, { id: 100202, name: 'Mettupalayam' }, { id: 100203, name: 'Tirupur' }],
  1003: [{ id: 100301, name: 'Dindigul' }, { id: 100302, name: 'Theni' }, { id: 100303, name: 'Virudhunagar' }],
  1004: [{ id: 100401, name: 'Namakkal' }, { id: 100402, name: 'Dharmapuri' }, { id: 100403, name: 'Erode' }],
  
  // Uttar Pradesh
  1101: [{ id: 110101, name: 'Mohanlalganj' }, { id: 110102, name: 'Malihabad' }, { id: 110103, name: 'Bakshi Ka Talab' }],
  1102: [{ id: 110201, name: 'Unnao' }, { id: 110202, name: 'Farrukhabad' }, { id: 110203, name: 'Kannauj' }],
  1103: [{ id: 110301, name: 'Fatehabad' }, { id: 110302, name: 'Firozabad' }, { id: 110303, name: 'Mathura' }],
  1104: [{ id: 110401, name: 'Chandauli' }, { id: 110402, name: 'Ghazipur' }, { id: 110403, name: 'Jaunpur' }],
  
  // West Bengal
  1201: [{ id: 120101, name: 'Howrah' }, { id: 120102, name: 'Barrackpore' }, { id: 120103, name: 'Barasat' }],
  1202: [{ id: 120201, name: 'Jalpaiguri' }, { id: 120202, name: 'Malda' }, { id: 120203, name: 'Cooch Behar' }],
  1203: [{ id: 120301, name: 'Burdwan' }, { id: 120302, name: 'Bankura' }, { id: 120303, name: 'Purulia' }],
  1204: [{ id: 120401, name: 'Raniganj' }, { id: 120402, name: 'Kulti' }, { id: 120403, name: 'Burnpur' }],
};
