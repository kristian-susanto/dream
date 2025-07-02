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
  const semuaTahun = inflasiData.map(d => {
    const angka = parseFloat(d.Inflation.replace(',', '.').replace('%', ''));
    return angka / 100;
  });

  const sum = semuaTahun.reduce((acc, val) => acc + val, 0);
  return sum / semuaTahun.length;
}

// Set nilai default input
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('tahunLahir').value = 2003;

  const currentYear = new Date().getFullYear();
  document.getElementById('tahunSekarang').value = currentYear;
});

document.getElementById('formSimulasi').addEventListener('submit', function(e) {
  e.preventDefault();

  const provinsi = document.getElementById('provinsi').value;
  const tahunLahir = parseInt(document.getElementById('tahunLahir').value);
  const tahunSekarang = parseInt(document.getElementById('tahunSekarang').value);
  const harapanUmur = parseInt(document.getElementById('harapanUmur').value);
  const umurSaatIni = tahunSekarang - tahunLahir;
  const sisaTahun = harapanUmur - umurSaatIni;

  const umpBulanan = umpData[provinsi];
  const umpTahunan = umpBulanan * 12;
  const inflasiRata2 = getAverageInflation(inflasiData); // Dalam bentuk desimal, misal 0.034
  const mobilCost = 383000000;

  // Hitung biaya pernikahan dengan inflasi
  let biayaPernikahan = 0;
  let rincianPernikahan = '';

  for (let i = 1; i <= 3; i++) {
    const tahunKe = sisaTahun + i;
    const biayaTahun = umpTahunan * Math.pow(1 + inflasiRata2, tahunKe);
    biayaPernikahan += biayaTahun;
    rincianPernikahan += `<li>Tahun ke-${tahunKe}: Rp ${biayaTahun.toLocaleString('id-ID')}</li>`;
  }

  const total = (3 * biayaPernikahan) + mobilCost;

  document.getElementById('hasil').innerHTML = `
    <p><strong>Provinsi:</strong> ${provinsi}</p>
    <p><strong>UMP Bulanan:</strong> Rp ${umpBulanan.toLocaleString('id-ID')}</p>
    <p><strong>UMP Tahunan:</strong> Rp ${umpTahunan.toLocaleString('id-ID')}</p>
    <p><strong>Rata-rata Inflasi:</strong> ${(inflasiRata2 * 100).toFixed(2)}%</p>
    <p><strong>Sisa Tahun Harapan Hidup:</strong> ${sisaTahun} tahun</p>
    <p><strong>Estimasi Biaya Pernikahan (3 tahun berturut-turut setelah umur harapan):</strong></p>
    <ul>${rincianPernikahan}</ul>
    <p><strong>Total Biaya Pernikahan:</strong> Rp ${biayaPernikahan.toLocaleString('id-ID')}</p>
    <p><strong>Biaya Mobil:</strong> Rp ${mobilCost.toLocaleString('id-ID')}</p>
    <p style="color:darkred;"><strong>Total Kebutuhan Dana:</strong> Rp ${total.toLocaleString('id-ID')}</p>
  `;
});

