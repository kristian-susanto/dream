let umpData = {};
let inflasiData = [];

// Load kedua file JSON
Promise.all([
  fetch('ump.json').then(res => res.json()),
  fetch('inflasi.json').then(res => res.json())
]).then(([umpJson, inflasiJson]) => {
  umpJson.forEach(item => {
    // Ubah string UMP ke angka: "3.685.616,00" => 3685616.00
    const umpString = item["Upah Minimum (Rp)"]
      .replace(/\./g, '') // hilangkan titik ribuan
      .replace(',', '.'); // ganti koma menjadi titik desimal

    umpData[item.Provinsi] = parseFloat(umpString);
  });
  inflasiData = inflasiJson;

  // Populate provinsi
  const provinsiSelect = document.getElementById('provinsi');
  Object.keys(umpData).forEach(prov => {
    const option = document.createElement('option');
    option.value = prov;
    option.textContent = prov;
    provinsiSelect.appendChild(option);
  });
});

function getAverageInflation(inflasiData) {
  const recent = inflasiData
    .filter(d => parseInt(d.Year) >= 2018)
    .map(d => {
      const angka = parseFloat(d.Inflation.replace(',', '.').replace('%', ''));
      return angka / 100;
    });

  const sum = recent.reduce((acc, val) => acc + val, 0);
  return sum / recent.length;
}

document.getElementById('formSimulasi').addEventListener('submit', function(e) {
  e.preventDefault();

  const provinsi = document.getElementById('provinsi').value;
  const tahunLahir = parseInt(document.getElementById('tahunLahir').value);
  const tahunSekarang = parseInt(document.getElementById('tahunSekarang').value);
  const harapanUmur = parseInt(document.getElementById('harapanUmur').value);
  const umurSaatIni = tahunSekarang - tahunLahir;
  const sisaTahun = harapanUmur - umurSaatIni;

  const umpTahunan = umpData[provinsi] * 12;
  const inflasiRata2 = getAverageInflation(inflasiData);
  const mobilCost = 383000000;

  let biayaPernikahan = 0;
  for (let i = 1; i <= 3; i++) {
    biayaPernikahan += umpTahunan * Math.pow(1 + inflasiRata2, sisaTahun + i);
  }

  const total = (3 * biayaPernikahan) + mobilCost;

  document.getElementById('hasil').textContent = `Total kebutuhan: Rp ${total.toLocaleString('id-ID')}`;
});
